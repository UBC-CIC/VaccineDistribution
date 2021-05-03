from logging import basicConfig, getLogger, INFO
import datetime
from connect_to_ledger import create_qldb_driver
from sampledata.sample_data import convert_object_to_ion, get_value_from_documentid,document_exist,update_document,get_document_ids
from constants import Constants
from create_product_batches import product_exists
import json
from pyion2json import ion_cursor_to_json
from insert_document import insert_documents
from register_person import get_scentityid_from_personid,get_index_number

from create_purchase_order_to_manufacturer import fetch_invoice,get_sub_details,fetch_purchase_order

logger = getLogger(__name__)
basicConfig(level=INFO)


def order_already_accepted(transaction_executor,purchase_order_id):
    statement= 'SELECT t.Acceptor.isOrderAccepted FROM PurchaseOrders as t BY d_id WHERE d_id = ?' 
    cursor = transaction_executor.execute_statement(statement,purchase_order_id)
    value = list(map(lambda x: x.get('isOrderAccepted'), cursor))
    if value == [1]:
        return True
    else:
        return False

def inventory_table_already_exist(transaction_executor,scentity_id):
    inventory_table_name = "INVENTORY"+scentity_id
    statement = "SELECT * FROM information_schema.user_tables WHERE name = '{}'".format(inventory_table_name) 
    cursor = transaction_executor.execute_statement(statement)
    
    try:
        logger.info("Inventory table exist!")
        ret_val = list(map(lambda x: x.get('name'), cursor))    
        print(ret_val)     
        return ret_val
    except StopIteration:
        logger.info("Table does bot exist")
        return False

def create_purchase_order_input(transaction_executor,purchase_order_id,actual_sc_entity_id):
    product_id = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"ProductId")
    # number of container if order type is 1 and number of dosage if order type is 2
    order_quantity = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"OrderQuantity")

    order_type = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"OrderType")
    products_per_container = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id[0],"ProductsPerContainer")

    if order_type[0] == "1":
        product_price = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id[0],"ProductPrice")
    elif order_type[0] == "2":
        inventory_table = inventory_table_already_exist(transaction_executor,actual_sc_entity_id)
        product_id = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"ProductId")
        inventory_id =  next(get_document_ids(transaction_executor,inventory_table[0],"ProductId",product_id[0]))
        product_price = get_value_from_documentid(transaction_executor,inventory_table[0],inventory_id,"ProductPrice")


    purchase_order_input = {
        "ProductId": product_id[0],
        "OrderQuantity": order_quantity[0],
        "OrderValue": order_quantity[0]*product_price[0]*products_per_container[0]
    }
    # logger.info(purchase_order_input)
    return purchase_order_input

def create_invoice(transaction_executor, purchase_order_input):
    invoice_number = get_index_number(transaction_executor,Constants.INVOICE_TABLE_NAME,"InvoiceNumber")
    invoice =  {
        "InvoiceNumber":"{}".format(invoice_number),
        "ProductId": purchase_order_input["ProductId"],
        "OrderQuantity": purchase_order_input["OrderQuantity"],
        "OrderValue": purchase_order_input["OrderValue"],
        "Approval":{
            "ApproverId":"",
            "isInvoiceApprovedForPayment":False
        },
        "isInvoicePayed":False,
        "TimeOfInvoiceGeneration":datetime.datetime.now().timestamp()
    }

    invoice_id = insert_documents(transaction_executor,Constants.INVOICE_TABLE_NAME,convert_object_to_ion(invoice))
    logger.info("Invoice was created with invoice id {}".format(invoice_id[0]))
    return invoice, invoice_id[0]

def update_approving_person_id(transaction_executor,person_id, purchase_order_id):
    statement = "UPDATE PurchaseOrders AS j BY id SET j.Acceptor.ApprovingPersonId = '{}' WHERE id = '{}'".format(person_id,purchase_order_id)
    cursor  = transaction_executor.execute_statement(statement)
    try:
        next(cursor)
        logger.info("Updated!")
    except StopIteration:
        logger.info("Problem in updating")



def accept_order(transaction_executor,purchase_order_id,person_id):
    if document_exist(transaction_executor, Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id):
        
        if order_already_accepted(transaction_executor,purchase_order_id):
            msg = "Order Already Accepted!"
            
            invoice = fetch_invoice(transaction_executor,person_id,purchase_order_id)
            invoice = invoice["body"]

            purchase_order = fetch_purchase_order(transaction_executor,person_id, purchase_order_id) 
            purchase_order = purchase_order["body"]
            approver = purchase_order["Acceptor"]["ApprovingPersonId"]
            
            return{
                'statusCode': 400,
                'body': {"Message" : msg,
                        "Invoice" : invoice,
                        "ApprovingPersonId": approver
                }
            }
        
        else:

            required_scentity_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor",purchase_order_id,"AcceptorScEntityId")
            actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
            
            if required_scentity_id[0] == actual_scentity_id:
                print("Matched!")
                purchase_order_input = create_purchase_order_input(transaction_executor,purchase_order_id,actual_scentity_id)
                invoice, invoice_id = create_invoice(transaction_executor,purchase_order_input)

                update_statement = "UPDATE {} AS po BY id SET po.InvoiceId = '{}' WHERE id = ?".format(Constants.PURCHASE_ORDER_TABLE_NAME,invoice_id)
                cursor = transaction_executor.execute_statement(update_statement,purchase_order_id)

                update_document(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor.isOrderAccepted",purchase_order_id,True)
                update_document(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor.ApprovingPersonId",purchase_order_id,person_id)
                
                try:
                    next(cursor)
                    logger.info(" ================================== O R D E R =========== A C C E P T E D ===============================")
                    print("Order Accepted and Invoice updated!")
                    return{
                        'statusCode': 200,
                        'body': {
                            "Invoice": invoice,
                            "PurchaseOrderId": purchase_order_id,
                            "ApprovingPersonId":person_id
                        }
                    }
                except StopIteration:
                    return_statement = "Problem updating invoice"
                    return{
                        'statusCode': 400,
                        'body': return_statement}
                    
            else:
                return_statement = "You are not authorized to accept this order."
                return{
                    'statusCode': 400,
                    'body': return_statement}
    else:
        return_statement = "Trouble finding Purchase Order!"
        return{
                'statusCode': 400,
                'body': return_statement}


###########################################################################################################################

def accept_this_purchase_order(event):
    try:
        with create_qldb_driver() as driver:
            
            purchaseorderid = event["PurchaseOrderId"]        
            personid = event["PersonId"]
            return driver.execute_lambda(lambda executor: accept_order(executor, purchaseorderid, personid))
    except Exception:
        return_statement = 'Error accepting the order.'
        return{
                'statusCode': 400,
                'body': return_statement}
        