from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads
logger = getLogger(__name__)
basicConfig(level=INFO)
from sampledata.sample_data import convert_object_to_ion, get_value_from_documentid,document_exist,get_document_ids,update_document
from constants import Constants
from register_person import get_scentityid_from_personid, get_document_superadmin_approval_status
from create_purchase_order_to_manufacturer import get_sub_details
from accept_purchase_order import order_already_accepted
from accept_purchase_order import inventory_table_already_exist
from initiate_shipment_manufacturer import create_pick_up_request,oneDArray,shipment_already_started,send_pick_up_request

def initiate_distributor_shipment(transaction_executor, purchase_order_id, distributor_person_id,carrier_company_id,tranport_type):
    # check if po exist
    if document_exist(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id):        
        # check if po is accepted
        if get_document_superadmin_approval_status(transaction_executor, Constants.SCENTITY_TABLE_NAME, carrier_company_id):
            if order_already_accepted(transaction_executor,purchase_order_id):
                if shipment_already_started(transaction_executor,purchase_order_id):                    
                    return_statement = 'Shipment already started.'
                    return{
                            'statusCode': 400,
                            'body': return_statement}
                else:
                    #check for authorization
                    required_scentity_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor",purchase_order_id,"AcceptorScEntityId")
                    actual_scentity_id = get_scentityid_from_personid(transaction_executor,distributor_person_id)
                   
                    if required_scentity_id[0] == actual_scentity_id:
                        # check if enough enventory for the order
                        
                        inventory_table = inventory_table_already_exist(transaction_executor,actual_scentity_id)
                        product_id = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"ProductId")
                        containers_ordered = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"OrderQuantity")
                        containers_ordered = containers_ordered[0]
                        inventory_id =  next(get_document_ids(transaction_executor,inventory_table[0],"ProductId",product_id[0]))
    
                        available_unit_inventory = get_value_from_documentid(transaction_executor,inventory_table[0],inventory_id,"CurrentInventory")
                        available_unit_inventory = int(available_unit_inventory[0])
                        products_per_container = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id[0],"ProductsPerContainer")
                        product_units_ordered = int(containers_ordered) * int(products_per_container[0])
                        
                        if available_unit_inventory >= product_units_ordered:
                           
                            containers_in_inventory = get_value_from_documentid(transaction_executor,inventory_table[0],inventory_id,"ContainerIds")
                            # containers_in_inventory = containers_in_inventory[0]
                            # lis = [containers_in_inventory,[1,2]]
                            containers_in_inventory = oneDArray(containers_in_inventory)
                            total_containers = len(containers_in_inventory)
    
                           
                            
                            available_containers = int(available_unit_inventory/products_per_container[0])
                            starting_container = total_containers - (available_containers)
                            ending_container = starting_container + int(containers_ordered)
                            # for containers in range((1,containers_ordered+1)):
                            # assign the first containers to the new purchase order
                            assigned_container_ids = containers_in_inventory[starting_container:ending_container]
    
                            print("Assigned ids are :{}".format(assigned_container_ids))
                            # add purchase order to the new container
                            for container_id in assigned_container_ids:
                                update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME,"PurchaseOrderId",container_id, purchase_order_id)
                                update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME,"CarrierId",container_id, carrier_company_id)
                                update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME,"isDelivered",container_id, False)
                                update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME,"TransportType",container_id, tranport_type)
                                update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME,"isPicked",container_id,False)
                            
                            update_document(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"HighestPackagingLevelIds",purchase_order_id,assigned_container_ids)
                            available_unit_inventory = available_unit_inventory - product_units_ordered
                            update_document(transaction_executor,inventory_table[0],"CurrentInventory",inventory_id,available_unit_inventory)
    
                            pick_up_request_id = create_pick_up_request(transaction_executor,actual_scentity_id,carrier_company_id, purchase_order_id, tranport_type)
                        
                            send_pick_up_request(transaction_executor,pick_up_request_id,carrier_company_id)
                            message = "===================== S H I P M E N T ======= I N I T I A T E D ======================="
                            print(message)
                            
                            '''
                            We assume that container is intact and the products,cases and palletes that were before the shipment to distributor are unchanged. In future they will be scanned and mapped individually
                            '''
                            return{
                                'statusCode': 200,
                                'body': {
                                        "Message":message,
                                        "PurchaseOrderId":purchase_order_id,
                                        "ContainerIds":assigned_container_ids,
                                        "PickUpRequestId": pick_up_request_id       
                                    }
                                
                            }
                        
                        else:
                            return_statement = "Not enough dosage in inventory to initiate shipment."
                            return{
                                'statusCode': 400,
                                'body': return_statement}
                    else:
                        return_statement ="Person not Authorized!"
                        return{
                            'statusCode': 400,
                            'body': return_statement}
            else:
                return_statement = "Accept the Order First!"
                return{
                'statusCode': 400,
                'body': return_statement}
        else:
            return_statement = " Carrier Company is not Approved"
            return{
                'statusCode': 400,
                'body': return_statement}
    else:
        return_statement = "Cannot Locate Purchase Order."
        return{
                'statusCode': 400,
                'body': return_statement}


def initiate_shipment_for_distributor(event): 
    try:
        with create_qldb_driver() as driver:
            
            purchaseorderid = event["PurchaseOrderId"]        
            distributorpersonid = event["PersonId"]
            carriercompanyid= event["CarrierCompanyId"]
            transporttype = 3
            #1 for air 2 for ocean 3 for road/local
            
            return driver.execute_lambda(lambda executor: initiate_distributor_shipment(executor, purchaseorderid, distributorpersonid,carriercompanyid, transporttype))
    except Exception:
        return_statement = 'Error initiating the shipment.'
        return{
                'statusCode': 400,
                'body': return_statement}
        