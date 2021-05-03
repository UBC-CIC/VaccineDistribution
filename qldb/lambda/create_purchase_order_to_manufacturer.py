from logging import basicConfig, getLogger, INFO
from datetime import datetime
from connect_to_ledger import create_qldb_driver
from sampledata.sample_data import convert_object_to_ion, get_value_from_documentid,get_document,document_exist,get_document_ids
from constants import Constants
from create_product_batches import product_exists
import json
from pyion2json import ion_cursor_to_json
from insert_document import insert_documents
from register_person import get_scentityid_from_personid,get_document_superadmin_approval_status,get_index_number

logger = getLogger(__name__)
basicConfig(level=INFO)





#createPurchaseOrder(transaction_executor,person_id,PurchaseOrderDetails) <<--------- insert Accepted,invoiceId,ContainerId from outside as variables
def create_purchase_order_to_manufacturer (transaction_executor, person_id, purchase_order_details):
    

    product_id = purchase_order_details["ProductId"]
    #check if the product exist and approved
    if product_exists(transaction_executor,product_id):
        # logger.info("Product Found!")
        order_quantity = purchase_order_details["OrderQuantity"]
        ##check if the product is approved
        if get_document_superadmin_approval_status(transaction_executor,Constants.PRODUCT_TABLE_NAME, product_id):
            #check if the orderQuantity is less than greater than
            if (isinstance(order_quantity,int)): #<<--------------- have to convery orderquantity to float  
                min_selling_amount_containers = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"MinimumSellingAmount")
                if order_quantity >= min_selling_amount_containers[0]:
                    scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
                    if scentity_id: 
                        #check if the orderer company is approved
                        if get_document_superadmin_approval_status(transaction_executor,Constants.SCENTITY_TABLE_NAME,scentity_id):
                            print("UYYYYYYYYYYYYYYYYYYYYYY")
                            purchase_order_number = get_index_number(transaction_executor, Constants.PURCHASE_ORDER_TABLE_NAME,"PurchaseOrderNumber")
                            purchase_order_details.update({"PurchaseOrderNumber": purchase_order_number})
                            purchase_order_details.update({"OrderType": "1"}) ## order type 1 is by distributor to manufacturer
                                                                                ## order type 2 is to distributor by downstream entities
                            purchase_order_details['Orderer'].update({'OrdererScEntityId': scentity_id})
                            purchase_order_details['Orderer'].update({'OrdererPersonId': person_id})
                            purchase_order_details['Orderer'].update({'isOrderShipped': False})
                            sc_entity_type_code = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,scentity_id,"ScEntityTypeCode")
                            if sc_entity_type_code[0] == "2" :## normal company
                                highest_packaging_level = "Container"
                            product_id = purchase_order_details["ProductId"]
                            manufacturer_id = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"ManufacturerId")
        
                            ## highest packagin level Id in this case is container since that is the minimum amount that distributor has to order

                            purchase_order = {**purchase_order_details,"Acceptor":{"isOrderAccepted":False,"AcceptorScEntityId":manufacturer_id[0],"ApprovingPersonId":""},"InvoiceId":"","HighestPackagingLevelIds":[],"HighestPackagingLevelType": highest_packaging_level}
                            purchase_order_id = insert_documents(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,convert_object_to_ion(purchase_order))
                            purchase_order["PurchaseOrderId"] = purchase_order_id[0]
                            message = "Order was placed sucessfully with id: {}".format(purchase_order_id)
                            logger.info(" ================================== O R D E R =========== P L A C E D ===============================")
                            return{
                            'statusCode': 200,
                            'body': {
                                "Message":message,
                                "PurchaseOrder":purchase_order}}
                                    
                        else:
                            return_statement ="OrdererComany is not approved by the Admin."
                            return{
                            'statusCode': 400,
                            'body': return_statement}
                    else:
                        return_statement = "check if person id is associated with an entity."
                        return{
                            'statusCode': 400,
                            'body': return_statement}
                else:
                    return_statement ="Order quantity cannot be less than minimum quantity."
                    return{
                        'statusCode': 400,
                        'body': return_statement}
                    
            else:
                return_statement = "Order Quantity can only be in the form of integers."
                return{
                'statusCode': 400,
                'body': return_statement}
        else:
            return_statement ="Product is not approved yet. Wait for the product to get approved first."
            return{
                'statusCode': 400,
                'body': return_statement}
    else:
        return_statement = " Product Id is wrong!"
        return{
                'statusCode': 400,
                'body': return_statement}
        

def get_sub_details(transaction_executor,table, sub, document_id,field):
    if document_exist(transaction_executor, table,document_id):
        statement = "SELECT t.{} FROM {} as t BY d_id WHERE d_id = ?".format(sub+ "."+field,table)
        cursor = transaction_executor.execute_statement(statement,document_id)   
        value = list(map(lambda x: x.get('{}'.format(field)), cursor))
        return value
    else:
        return_statement = 'Document not found!'
        return{
                'statusCode': 400,
                'body': return_statement}
    

def get_orderer_id(transaction_executor, purchase_order_id):
    query = "SELECT t.Orderer.OrdererScEntityId FROM PurchaseOrders as t BY d_id WHERE d_id = ?"
    cursor_three = transaction_executor.execute_statement(query, purchase_order_id)
    
    value = list(map(lambda x: x.get("OrdererScEntityId"), cursor_three))
    logger.info("Orderer's Id is {}".format(value))
    return value[0]

def fetch_purchase_order(transaction_executor,person_id, purchase_order_id):
    actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
    orderer_Id = get_orderer_id(transaction_executor,purchase_order_id)
    acceptor_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor",purchase_order_id,"AcceptorScEntityId")
 
    if actual_scentity_id == orderer_Id or actual_scentity_id == acceptor_id[0]:
        statement = 'SELECT * FROM {} by PurchaseOrderId WHERE PurchaseOrderId = ?'.format(Constants.PURCHASE_ORDER_TABLE_NAME)
        cursor = transaction_executor.execute_statement(statement,purchase_order_id)
        purchase_order = ion_cursor_to_json(cursor)
        return{
                'statusCode': 200,
                'body': purchase_order[0]}
    else:
        return_statement = "Not Authorized!"
        return{
                'statusCode': 400,
                'body': return_statement}

def fetch_invoice(transaction_executor,person_id, purchase_order_id):
    
    actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
    orderer_Id = get_orderer_id(transaction_executor,purchase_order_id)
    acceptor_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor",purchase_order_id,"AcceptorScEntityId")
    scentity_type_code = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,actual_scentity_id,"ScEntityTypeCode")
    
    
    if actual_scentity_id == orderer_Id or actual_scentity_id == acceptor_id[0] or scentity_type_code[0]=="3" or ScEntityTypeCode[0] =="4" :
      
        invoice_id = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"InvoiceId")
        invoice_cursor = get_document(transaction_executor,Constants.INVOICE_TABLE_NAME, invoice_id[0])
        invoice = ion_cursor_to_json(invoice_cursor)
        return{
                'statusCode': 200,
                'body': invoice}
    else:
        return_statement = "Not Authorized!"
        return{
                'statusCode': 400,
                'body': return_statement}

def fetch_purchase_order_ids(transaction_executor,person_id,fetch_type):
    
    actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
    if fetch_type == "Created":
        purchase_order_ids = list(get_document_ids(transaction_executor, Constants.PURCHASE_ORDER_TABLE_NAME, "Orderer.OrdererScEntityId",actual_scentity_id))
    
    elif fetch_type == "Recieved":
        
        purchase_order_ids = list(get_document_ids(transaction_executor, Constants.PURCHASE_ORDER_TABLE_NAME, "Acceptor.AcceptorScEntityId",actual_scentity_id))
    if len(purchase_order_ids) > 0:
        return{
            'statusCode': 200,
            'body': {
                'PurchaseOrderIds': purchase_order_ids}}
    else:
        return{
                'statusCode': 400,
                'body': "No Order Placed"}
#########################################################################################################################################################

def create_manufacturer_purchase_order(event):
    try:
        with create_qldb_driver() as driver:
            
            person_id = event['PersonId']
            purchaseorderdetails = event['PurchaseOrder']
            return driver.execute_lambda(lambda executor: create_purchase_order_to_manufacturer(executor, person_id,purchaseorderdetails))
    except Exception:
        return_statement = 'Error creating order.'
        return{
                'statusCode': 400,
                'body': return_statement}
                
def get_purchase_order(event):
    try:
        with create_qldb_driver() as driver:
            
            person_id = event['PersonId']
            purchase_order_id = event['PurchaseOrderId']
            return driver.execute_lambda(lambda executor: fetch_purchase_order(executor, person_id,purchase_order_id))
    except Exception:
        return_statement = 'Error fetching order.'
        return{
                'statusCode': 400,
                'body': return_statement}
                
def get_purchase_order_ids(event):
    try:
        with create_qldb_driver() as driver:
            person_id = event['PersonId']
            fetch_type = event["FetchType"]
            return driver.execute_lambda(lambda executor: fetch_purchase_order_ids(executor, person_id, fetch_type))
            
    except Exception:
        return_statement = 'Error fetching Purchase Order Ids.'
        return{
                'statusCode': 400,
                'body': return_statement}
                
def get_invoice(event):
    try:
        with create_qldb_driver() as driver:
            
            person_id = event['PersonId']
            purchase_order_id = event['PurchaseOrderId']
            return driver.execute_lambda(lambda executor: fetch_invoice(executor, person_id,purchase_order_id))
    except Exception:
        return_statement = 'Error fetching order.'
        return{
                'statusCode': 400,
                'body': return_statement}
