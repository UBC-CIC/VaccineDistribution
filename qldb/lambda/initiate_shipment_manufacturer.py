from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads
import datetime
from sampledata.sample_data import convert_object_to_ion, get_value_from_documentid,document_exist,update_document, get_document, get_document_list
from constants import Constants
from insert_document import insert_documents
from register_person import get_scentityid_from_personid,get_index_number,get_document_superadmin_approval_status,get_scentity_contact
from create_product_batches import get_tableName_from_tableId,batch_table_exist
from create_purchase_order_to_manufacturer import get_sub_details
from accept_purchase_order import order_already_accepted
import ast
import json
from pyion2json import ion_cursor_to_json
from functools import reduce
import itertools


logger = getLogger(__name__)
basicConfig(level=INFO)


def create_case(transaction_executor, product_code, purchase_order_id,product_instances,products_per_case):
    s_no = get_index_number(transaction_executor,Constants.CASES_TABLE_NAME,"CaseNumber")
    case_number = "1"+str(product_code)+ str(s_no) #<<-----------level 1 denotes case level of product
    print(case_number)
    case = {
        "CaseNumber":case_number,
        "PalleteId" : "",
        "PurchaseOrderId" : purchase_order_id,
        "ProductInstances":product_instances, # this value should come from scanning the GTIN barcode of the products
        "ProductsPerCase":products_per_case
    }
    case_id = insert_documents(transaction_executor,Constants.CASES_TABLE_NAME,[case])
    return case_id

def insert_caseIds (transaction_executor,batch_table_name,batch_id,case_id_values):
    statement = "FROM {} AS s by id WHERE id = '{}' INSERT INTO s.CaseIds VALUE ?".format(batch_table_name,batch_id)
    cursor = transaction_executor.execute_statement(statement, case_id_values)
    try:
        next(cursor)
        print("Cases added!")
    except StopIteration:
        print("Problem inserting case Ids")

def oneDArray(x):
    return list(itertools.chain(*x))

def assign_products_into_case(transaction_executor,product_id,batch_table_name,product_units_ordered,products_per_case,purchase_order_id,product_code):

    statement = 'SELECT * FROM {} as b By id where b.UnitsRemaining > 0'.format(batch_table_name) 
    cursor = transaction_executor.execute_statement(statement)
    total_number_of_cases_required = int(product_units_ordered/products_per_case)
    current_number_of_cases_required = int(product_units_ordered/products_per_case)
    cases = []
    for batch in cursor:
        if current_number_of_cases_required > 0:
            current_batch = dumps(batch,binary=False)
            current_batch = current_batch[9:]
            current_batch = current_batch.replace('"','').replace('{','{"').replace('}','"}').replace(':','":"').replace(',','","').replace('[','["').replace(']','"]').replace('"[','[').replace(']"',']')

            print(current_batch[0:400])
            current_batch_dict = ast.literal_eval(current_batch)

            batch_inventory_left= current_batch_dict['UnitsRemaining']
            batch_inventory_left = int(batch_inventory_left)
            
            print("current batch_inventory: {} ".format(batch_inventory_left))
            print("{} cases will be filled for this order!".format(current_number_of_cases_required))

            product_instances = current_batch_dict['ProductInstances'] # change with 'ProductInstances'
            batch_id = current_batch_dict['id']
            print("Filling a case from batch {}".format(batch_id))
            units_produced = int(current_batch_dict['UnitsProduced'])
            starting_case_number = len(cases)
            ending_case_number = len(cases)
            for case in range(len(cases)+1,int(total_number_of_cases_required)+1):
                if batch_inventory_left > 0:
                    case_product_instances = product_instances[(units_produced - batch_inventory_left) : (units_produced +int(products_per_case) - batch_inventory_left)]
                    print(case_product_instances)
                    case_id = create_case(transaction_executor,product_code[0],purchase_order_id,case_product_instances,products_per_case)
                    print("--------------------------------Case {} added----------------------------------".format(case))
                    cases.append(case_id[0])
                    batch_inventory_left = batch_inventory_left - products_per_case
                    current_number_of_cases_required = current_number_of_cases_required - 1
                    ending_case_number = ending_case_number + 1
                    if current_number_of_cases_required == 0:
                        update_document(transaction_executor,batch_table_name,"UnitsRemaining",batch_id,int(batch_inventory_left))
                        insert_caseIds(transaction_executor,batch_table_name,batch_id,cases[starting_case_number:ending_case_number])
                        # update_document(transaction_executor,batch_table_name,"CaseIds",batch_id,cases[starting_case_number:ending_case_number])
                else:
                    update_document(transaction_executor,batch_table_name,"UnitsRemaining",batch_id,int(batch_inventory_left))
                    insert_caseIds(transaction_executor,batch_table_name,batch_id,cases[starting_case_number:ending_case_number])                    
                    #update_document(transaction_executor,batch_table_name,"CaseIds",batch_id,cases[starting_case_number:ending_case_number])
                    print("No inventory left! Moving to next batch to fill {} more cases".format(current_number_of_cases_required))
                    break
        else:     
            break

    print("All the cases packed :{}".format(cases))
    return cases


def assign_cases_into_pallete(transaction_executor,case_ids,product_code):
    number_of_palletes_required = int(len(case_ids)/Constants.CASES_PER_PALLETE)
    starting_case_number = 0
    ending_case_number = int(Constants.CASES_PER_PALLETE)
    palletes = []
    for pallete in range(1,number_of_palletes_required+1):
        s_no = get_index_number(transaction_executor,Constants.PALLETE_TABLE_NAME,"PalleteNumber")
        pallete_number = "2"+str(product_code)+ str(s_no) #<<-----------level 2 denotes pallete level of product
        current_case_ids = case_ids[starting_case_number:ending_case_number]
        pallete = {
            "PalleteNumber":pallete_number,
            "CaseIds": current_case_ids,
            "ContainerId":""
        }
        pallete_id = insert_documents(transaction_executor,Constants.PALLETE_TABLE_NAME,convert_object_to_ion(pallete))
        palletes.append(pallete_id[0])
        starting_case_number = starting_case_number+Constants.CASES_PER_PALLETE
        ending_case_number = starting_case_number+ Constants.CASES_PER_PALLETE
        update_pallete_ids_in_cases(transaction_executor,current_case_ids,pallete_id)
    
    return palletes



def update_pallete_ids_in_cases(transaction_executor,case_ids,pallete_id):
    for case_id in case_ids:
        update_document(transaction_executor,Constants.CASES_TABLE_NAME,"PalleteId",case_id,pallete_id)

    print("Successfully updated pallete ids in cases")




def create_certificate_of_origin(transaction_executor,product_id):
    product_name = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"ProductName")
    product_hs_tarriff = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"ProductHSTarriffNumber")
    manufacturer_id = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"ManufacturerId")
    manufacturer_name = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,manufacturer_id[0],"ScEntityName")


    certificate_of_origin = {
        'CertificateOfOriginNumber':get_index_number(transaction_executor,Constants.CERTIFICATE_OF_ORIGIN_TABLE_NAME,"CertificateOfOriginNumber"),
        'ProductName':product_name[0],
        'Productid':product_id,
        'ProductHSTarriffNumber':product_hs_tarriff[0],
        'ManufacturerId':manufacturer_id[0],
        'ManufacturerName':manufacturer_name[0],
        'ManufacturerLocation':get_scentity_contact(transaction_executor,manufacturer_id[0],"Address")[0],
        'ExportApproval':{
            "ApproverId":"",
            "isApprovedByCustoms":False},
        'ImportApproval':{
            "ApproverId":"",
            "isApprovedByCustoms":False
        }}
    
    certificate_of_origin_id = insert_documents(transaction_executor,Constants.CERTIFICATE_OF_ORIGIN_TABLE_NAME,convert_object_to_ion(certificate_of_origin))
    print("Certificate of Origin Created successfully!")
    return certificate_of_origin_id


def create_packing_list(transaction_executor, products_per_container,product_code,palleteIds):
        container_case_ids = []
        # print("pallete ids are : {}".format(palleteIds))
        for palleteId in palleteIds:
            pallete_case_ids = get_value_from_documentid(transaction_executor,Constants.PALLETE_TABLE_NAME,palleteId,"CaseIds")
            container_case_ids.append(pallete_case_ids[0])
            
        packing_list = {
            "PackingListNumber":get_index_number(transaction_executor,Constants.PACKING_LIST_TABLE_NAME,"PackingListNumber"),
            "NumberOfPalletes":Constants.PALLETS_PER_CONTAINER,
            "PalleteIds":palleteIds,
            "NumberofCases":Constants.PALLETS_PER_CONTAINER*Constants.CASES_PER_PALLETE,
            "CasesIds": container_case_ids,
            "ProductCode": product_code[0],
            "ProductQuantity" : products_per_container,
            "ExportApproval":{
                        "ApproverId":"",
                        "isApprovedByCustoms":False},
            'ImportApproval':{
                        "ApproverId":"",
                        "isApprovedByCustoms":False

        }}

        packing_list_id = insert_documents(transaction_executor,Constants.PACKING_LIST_TABLE_NAME,packing_list)
        return packing_list_id[0]

def assign_palletes_into_container(transaction_executor,pallete_ids,product_code,purchase_order_id,carrier_company_id,certificate_of_origin_id,products_per_container,transport_type):
    number_of_containers_required = int(len(pallete_ids)/Constants.PALLETS_PER_CONTAINER)
    starting_pallete_number = 0
    ending_pallete_number = int(Constants.PALLETS_PER_CONTAINER) 
    '''
    here we are creating containers
    in actual scneario container will already be created with iot mapped on them by the SUPERADMIN
    '''

    containers = []
    for container in range(1,number_of_containers_required+1):
        s_no = get_index_number(transaction_executor,Constants.CONTAINER_TABLE_NAME,"ContainerNumber")
        container_number = "3"+str(product_code)+ str(s_no) #<<-----------level 3 denotes container level of product
        current_pallete_ids = pallete_ids[starting_pallete_number:ending_pallete_number]
        packing_list_id = create_packing_list(transaction_executor,products_per_container,product_code,current_pallete_ids)

        '''
        Here we are marking container safe when it is generated. In production we will need another file "mark_contaier_safe"
        Manufacturer person will fire this function --> it will fire check_container_safe to check from data of every iot if container is safe.
        '''

        container = {
            "ContainerNumber":container_number,
            "PurchaseOrderIds" : purchase_order_id,
            "PalleteIds": current_pallete_ids,
            "ContainerSafety" : {"isContainerSafeForDelivery" : True,
                                 "LastCheckedAt": datetime.datetime.now().timestamp()},
            "CarrierCompanyId":carrier_company_id, ## this carrier is the company which takes in charge of complete frieght of the container that manufacturer chooses
            "TransportType":transport_type, #<<-------- 1 denotes air and 2 denotes ocean
            "PackingListId" : packing_list_id,
            "LorryRecieptIds" : [],
            "IotIds" : [],
            "AirwayBillIds": [],
            "BillOfLadingIds" : [],
            "CertificateOfOriginId":certificate_of_origin_id,
            "isPicked":False,
            "isDelivered":False
        }
        container_id = insert_documents(transaction_executor,Constants.CONTAINER_TABLE_NAME,convert_object_to_ion(container))
        containers.append(container_id[0])
        starting_pallete_number = starting_pallete_number+Constants.PALLETS_PER_CONTAINER
        ending_pallete_number = starting_pallete_number+ Constants.PALLETS_PER_CONTAINER
        update_container_ids_in_palletes(transaction_executor,current_pallete_ids,container_id)
    
    return containers

def update_container_ids_in_palletes(transaction_executor,pallete_ids,container_id):
    for pallete_id in pallete_ids:
        update_document(transaction_executor,Constants.PALLETE_TABLE_NAME,"ContainerId",pallete_id,container_id)

    print("Successfully updated container ids in pallete")


def update_container_ids_in_purchase_order(transaction_executor,container_ids,purchase_order_id):
    update_document(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"HighestPackagingLevelIds",purchase_order_id,container_ids)
    print("Successfully updated conatiner ids in purchase order")

def enough_inventory_registered_for_order(transaction_executor, products_per_case,purchase_order_id, batch_table_name):
    container_order_quantity = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"OrderQuantity")
    container_order_quantity = int(container_order_quantity[0])
    product_units_ordered = container_order_quantity*Constants.PALLETS_PER_CONTAINER*Constants.CASES_PER_PALLETE*int(products_per_case)

    statement = 'SELECT SUM(b.UnitsRemaining) as invrem FROM {} as b WHERE b.UnitsRemaining > 0'.format(batch_table_name)

    cursor = transaction_executor.execute_statement(statement)
    inventory_remaining = list(map(lambda x: x.get('invrem'), cursor))
    inventory_remaining = int(dumps(inventory_remaining[0],binary=False, indent='  ', omit_version_marker=True))
    print('Inventory remaining - ', inventory_remaining)
    print('Products Units order  - ', product_units_ordered)
    

    if inventory_remaining >= product_units_ordered:
        print(" Enough inventory to pack the order: {}!".format(inventory_remaining))
        return product_units_ordered
    else:
        print("Not enough inventory!")
        return False

def shipment_already_started(transaction_executor,purchase_order_id):
    container_ids = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"HighestPackagingLevelIds")

    if len(container_ids[0])>0:
        print("Shipment already began. Following container ids were : {}".format(container_ids))
        return True
    else:
        return False

def send_pick_up_request(transaction_executor, request_Id, carrier_company_id):
    
    statement = 'FROM SCEntities AS s BY id WHERE id = ? INSERT INTO s.PickUpRequests VALUE ?'
    cursor_two = transaction_executor.execute_statement(statement, carrier_company_id, request_Id)
    
    try:
        next(cursor_two)
        # list_of_document_ids = get_document_ids_from_dml_results(cursor_two)
        return_statement = 'PickUpRequest sent with id {}'.format(request_Id)
        return{
                'statusCode': 200,
                'body': return_statement}
    except:
        return_statement = "Couldn't send the request."
        return{
                'statusCode': 400,
                'body': return_statement}

def create_pick_up_request(transaction_executor, requestor_sc_entity_id, carrier_company_id, purchase_order_id,transport_type):
    request_number = get_index_number(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,Constants.PICK_UP_REQUESTS_INDEX_NAME)
    pick_up_location = get_scentity_contact(transaction_executor,requestor_sc_entity_id,"Address")
    pick_up_request = {
        "PickUpRequestNumber": request_number,
        "PickUpLocation":pick_up_location[0],
        "RequestorScEntityId": requestor_sc_entity_id,
        "CarrierCompanyId": carrier_company_id,
        "PurchaseOrderId": purchase_order_id,
        "isAccepted":False,
        "TransportType": transport_type
    }
    pick_up_request_id = insert_documents(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,pick_up_request)
    
    ## creates record of pickuprequest in Sender's row
    send_pick_up_request(transaction_executor,pick_up_request_id,requestor_sc_entity_id)
    return pick_up_request_id

def initiate_shipment(transaction_executor, carrier_company_id, transport_type,purchase_order_id,person_id):
    if document_exist(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id):
        print("Purchase Order Found!")
        if get_document_superadmin_approval_status(transaction_executor,Constants.SCENTITY_TABLE_NAME,carrier_company_id):
            product_id = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"ProductId")
            product_id = product_id[0]
            required_scentity_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor",purchase_order_id,"AcceptorScEntityId")
            actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
            
            if required_scentity_id[0] == actual_scentity_id:
                print("Authorized!")
                batch_table_id = batch_table_exist(transaction_executor,product_id)
                if order_already_accepted(transaction_executor,purchase_order_id):
                    if shipment_already_started(transaction_executor,purchase_order_id):                    
                        return_statement = 'Shipment already started.'
                        return{
                                'statusCode': 400,
                                'body': return_statement}
                    else:
                        print('Initiating a new one.')
                        if batch_table_id:
                            batch_table_name = get_tableName_from_tableId(transaction_executor,batch_table_id)
                            
                            products_per_container = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"ProductsPerContainer")
                            # min_selling_amount = int(min_selling_amount_containers[0])*int(products_per_container[0])
                            products_per_case = round((products_per_container[0]/(Constants.CASES_PER_PALLETE*Constants.PALLETS_PER_CONTAINER)))
                            print("products_per_case is : {}".format(products_per_case))
                            product_units_ordered = enough_inventory_registered_for_order(transaction_executor,products_per_case,purchase_order_id,batch_table_name)
                            if product_units_ordered:
                                print("Units Ordered are: {}".format(product_units_ordered))
                                update_document(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"isOrderShipped",purchase_order_id,True)
                                product_code = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"ProductCode")
                                
                                case_ids = assign_products_into_case(transaction_executor,product_id,batch_table_name,product_units_ordered,products_per_case,purchase_order_id,product_code)
                                print(case_ids)
                                pallete_ids = assign_cases_into_pallete(transaction_executor,case_ids,product_code)
                                certificate_of_origin_id = create_certificate_of_origin(transaction_executor,product_id)
                                print("Finallyyy")
                                # product_quantity = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"MinimumSellingAmount")
                                container_ids = assign_palletes_into_container(transaction_executor,pallete_ids,product_code,purchase_order_id,carrier_company_id,certificate_of_origin_id[0],products_per_container,transport_type)
                                update_container_ids_in_purchase_order(transaction_executor,container_ids,purchase_order_id)
                                
                                pick_up_request_id = create_pick_up_request(transaction_executor,actual_scentity_id,carrier_company_id, purchase_order_id, transport_type)
                                send_pick_up_request(transaction_executor,pick_up_request_id,carrier_company_id)

                                print("===================== S H I P M E N T ======= I N I T I A T E D =======================")
                                return{
                                'statusCode': 200,
                                'body': {
                                        "PurchaseOrderId":purchase_order_id,
                                        "CaseIds":case_ids,
                                        "PalleteIds":pallete_ids,
                                        "ContainerIds":container_ids,
                                        "PickUpRequestId": pick_up_request_id
                                    }
                                }
                            else:
                                return_statement = " First produce and register the vaccines into the sytem before shipping them"
                                return{
                                'statusCode': 400,
                                'body': return_statement}
                        else: 
                            return_statement = 'Register the Batch table first by inputting inventory!'
                            return{
                                'statusCode': 400,
                                'body': return_statement}
                else:
                    return_statement ="Accept the order first!"
                    return{
                        'statusCode': 400,
                        'body': return_statement}
            else:
                return_statement ="Not authorized!"
                return{
                'statusCode': 400,
                'body': return_statement}
        else:
            return_statement ="Carrier company is not approved by MCG."
            return{
                'statusCode': 400,
                'body': return_statement}
    else:
        return_statement = "order doesn't exist"
        return{
                'statusCode': 400,
                'body': return_statement}
    

def fetch_container(transaction_executor,person_id, conatiner_id):
    
    if document_exist(transaction_executor,Constants.CONTAINER_TABLE_NAME, conatiner_id):
        actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
        purchase_order_id = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,conatiner_id,"PurchaseOrderIds")
        orderer_Id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Orderer",purchase_order_id[0],"OrdererScEntityId")
        acceptor_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor",purchase_order_id[0],"AcceptorScEntityId")
        scentity_type_code = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,actual_scentity_id,"ScEntityTypeCode")
        
        if actual_scentity_id == orderer_Id[0] or actual_scentity_id == acceptor_id[0] or scentity_type_code[0]=="3" or ScEntityTypeCode[0] =="4" :
            container_cursor = get_document(transaction_executor,Constants.CONTAINER_TABLE_NAME, conatiner_id)
            container = ion_cursor_to_json(container_cursor)
            return{
                    'statusCode': 200,
                    'body': container}
        else:
            return_statement = "Not Authorized!"
            return{
                    'statusCode': 400,
                    'body': return_statement}
    else:
        return_statement = "Check Container Id"
        return{
                'statusCode': 400,
                'body': return_statement}

def fetch_details_from_container(transaction_executor,person_id, conatiner_id,detail_type):
    if document_exist(transaction_executor,Constants.CONTAINER_TABLE_NAME, conatiner_id):
        actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
        purchase_order_id = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,conatiner_id,"PurchaseOrderIds")
        orderer_Id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Orderer",purchase_order_id[0],"OrdererScEntityId")
        acceptor_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor",purchase_order_id[0],"AcceptorScEntityId")
        scentity_type_code = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,actual_scentity_id,"ScEntityTypeCode")
        
        if actual_scentity_id == orderer_Id[0] or actual_scentity_id == acceptor_id[0] or scentity_type_code[0]=="3" or ScEntityTypeCode[0] =="4" :
           
            if  detail_type == "LorryReciept":
                document_type = "LorryRecieptIds"
                table_name = Constants.LORRY_RECEIPT_TABLE_NAME
                document_ids = document_ids[0]
                document_ids = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,conatiner_id, document_type)  
            
            elif  detail_type == "CertificateOfOrigin":
                document_type = "CertificateOfOriginId"
                table_name = Constants.CERTIFICATE_OF_ORIGIN_TABLE_NAME
                document_ids = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,conatiner_id, document_type)  
            
            elif  detail_type == "PackingList":
                document_type = "PackingListId"
                table_name = Constants.PACKING_LIST_TABLE_NAME
                document_ids = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,conatiner_id, document_type)  
        
            elif  detail_type == "AirwayBill":
                document_type = "AirwayBillIds"
                table_name = Constants.AIRWAY_BILL_TABLE_NAME
                document_ids = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,conatiner_id, document_type)
                document_ids = document_ids[0]
                
            elif  detail_type == "BillOfLading":
                document_type = "BillOfLadingIds"
                table_name = Constants.BILL_OF_LADING_TABLE_NAME
                document_ids = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,conatiner_id, document_type)
                document_ids = document_ids[0]
                
            elif  detail_type == "IoT":
                document_type = "IotIds"
                table_name = Constants.IOT_TABLE_NAME
                document_ids = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,conatiner_id, document_type)
                document_ids = document_ids[0]
                
            elif  detail_type == "AllProducts":
                document_type = "CasesIds"
                packing_list_id = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME, conatiner_id, "PackingListId")
                document_ids = get_value_from_documentid(transaction_executor,Constants.PACKING_LIST_TABLE_NAME, packing_list_id[0], document_type)
                document_ids = oneDArray(document_ids[0])
                table_name = Constants.CASES_TABLE_NAME
            
           
            print(document_ids)
            document_cursor = get_document_list(transaction_executor,table_name, document_ids)
            documents = ion_cursor_to_json(document_cursor)
            return{
                    'statusCode': 200,
                    'body':{
                        "DocumentType": document_type,
                        "Documents":documents
                    }
                }
        else:
            return_statement = "Not Authorized!"
            return{
                    'statusCode': 400,
                    'body': return_statement}
    else:
        return_statement = "Check Container Id"
        return{
                'statusCode': 400,
                'body': return_statement}
    

def fetch_pick_up_request(transaction_executor, person_id,pick_up_request_id):
    if document_exist(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE, pick_up_request_id):
        actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
        requestor_sc_entity_id = get_value_from_documentid(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,pick_up_request_id,"RequestorScEntityId")
        carrier_company_id = get_value_from_documentid(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,pick_up_request_id,"CarrierCompanyId")
        if actual_scentity_id == requestor_sc_entity_id[0] or actual_scentity_id == carrier_company_id[0]:
            request_cursor = get_document(transaction_executor, Constants.PICK_UP_REQUESTS_TABLE, pick_up_request_id)
            document = ion_cursor_to_json(request_cursor)
            return{
                    'statusCode': 200,
                    'body':{
                        "PickUpRequest": document
                    }
                }
        else:
            return_statement = "Not Authorized!"
            return{
                    'statusCode': 400,
                    'body': return_statement}
    else:
        return_statement = "Check request Id"
        return{
                'statusCode': 400,
                'body': return_statement}


    
################################################################################


def initiate_shipment_for_manufacturer(event):
    try:
        with create_qldb_driver() as driver:
                
            purchaseorderid = event["PurchaseOrderId"]        
            
            personid = event["PersonId"]
            
            carriercompanyid = event["CarrierCompanyId"]
    
            transporttype = event["TransportType"]
    
            return driver.execute_lambda(lambda executor: initiate_shipment(executor, carriercompanyid,transporttype,purchaseorderid, personid))
    except Exception:
        return_statement ="Error initiating shipment."
        return{
                'statusCode': 400,
                'body': return_statement}


def get_container(event):
    try:
        with create_qldb_driver() as driver:
                
            containerid = event["ContainerId"]        
            
            personid = event["PersonId"]
            
            return driver.execute_lambda(lambda executor: fetch_container(executor,  personid,containerid))
    except Exception:
        return_statement = 'Error getting container'
        return{
                'statusCode': 400,
                'body': return_statement}
                

def get_details_from_container(event):
    try:
        with create_qldb_driver() as driver:
                
            containerid = event["ContainerId"]        
            
            personid = event["PersonId"]
            
            detailtype = event["DetailType"]
            
            return driver.execute_lambda(lambda executor: fetch_details_from_container(executor,  personid,containerid,detailtype))
    except Exception:
        return_statement = 'Error getting container details.'
        return{
                'statusCode': 400,
                'body': return_statement}

def get_pick_up_request(event):
    try:
        with create_qldb_driver() as driver:
                
            requestid = event["PickUpRequestId"]        
            
            personid = event["PersonId"]
            
            return driver.execute_lambda(lambda executor: fetch_pick_up_request(executor,  personid,requestid))
    except Exception:
        return_statement = 'Error getting pick up request details.'
        return{
                'statusCode': 400,
                'body': return_statement}