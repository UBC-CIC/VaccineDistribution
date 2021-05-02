from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads
logger = getLogger(__name__)
basicConfig(level=INFO)

from sampledata.sample_data import document_exist,get_value_from_documentid,get_document_ids,convert_object_to_ion
from insert_document import insert_documents
from constants import Constants
from register_person import get_scentityid_from_personid, get_index_number
from accept_purchase_order import inventory_table_already_exist
from approve_delivery import product_exist_in_inventory

## minimum selling amount is set by distributor in inventory table in the multiple of Cases for example 10 cases
## can only be ordered in multiple of cases ex 11
## create purchase order for hospital 


def create_purchase_order_to_distributor(transaction_executor,purchase_order_details,distributor_id,hospital_person_id):
 
    product_id = purchase_order_details["ProductId"]
    number_of_containers_ordered = purchase_order_details["OrderQuantity"]

    if document_exist(transaction_executor,Constants.SCENTITY_TABLE_NAME,distributor_id):
        # check person belong to ScEntity
        actual_sc_entity_id = get_scentityid_from_personid(transaction_executor, hospital_person_id)
        if actual_sc_entity_id:
            manufacturer_id = get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME,product_id,"ManufacturerId")
            # print(manufacturer_id)
            if manufacturer_id[0] != distributor_id:
                # scentity_type_code = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,distributor_id,"ScEntityTypeCode")
                logger.info("Distributor confirmed")            
                inventory_table = inventory_table_already_exist(transaction_executor,distributor_id)
                if inventory_table:
                    #check product exist with distributor
                    if product_exist_in_inventory(transaction_executor,inventory_table[0],product_id):
                        # check number of dosage are in muliple of cases and more than minumum amount
                        inventory_id = next(get_document_ids(transaction_executor,inventory_table[0],"ProductId",product_id))
                        minimum_containers_order = get_value_from_documentid(transaction_executor,inventory_table[0],inventory_id,"MinimumSellingAmount")
                        print(minimum_containers_order)
                        
                        if number_of_containers_ordered >= minimum_containers_order[0] and isinstance(number_of_containers_ordered,int):
                            
                            purchase_order_number = get_index_number(transaction_executor, Constants.PURCHASE_ORDER_TABLE_NAME,"PurchaseOrderNumber")
                            purchase_order_details.update({"OrderType": "2"})
                            purchase_order_details['Orderer'].update({'isOrderShipped': False})
                            purchase_order_details.update({"PurchaseOrderNumber": purchase_order_number})
                            purchase_order_details['Orderer'].update({'OrdererScEntityId': actual_sc_entity_id})
                            purchase_order_details['Orderer'].update({'OrdererPersonId': hospital_person_id})
                            purchase_order = {**purchase_order_details,"Acceptor":{"isOrderAccepted":False,"AcceptorScEntityId":distributor_id,"ApprovingPersonId":""},"InvoiceId":"","HighestPackagingLevelIds":[],"HighestPackagingLevelType": "Containers"}
                            purchase_order_id = insert_documents(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,convert_object_to_ion(purchase_order))
                            message ="Order was placed sucessfully with id: {}".format(purchase_order_id)
                            purchase_order["PurchaseOrderId"] = purchase_order_id[0]
                            logger.info(" ================================== O R D E R =========== P L A C E D ===============================")
                            return{
                            'statusCode': 200,
                            'body': {
                                "Message":message,
                                "PurchaseOrder":purchase_order}
                                
                            }
                    
                        else:
                            return_statement = "Number of dosage must be an integer and greater than {} ".format(minimum_containers_order)
                            return{
                                'statusCode': 400,
                                'body': return_statement}
                    else:
                        return_statement = "Distributor doesn't have this product."
                        return{
                            'statusCode': 400,
                            'body': return_statement}
                else:
                    return_statement = "Distributor does not have any inventory"
                    return{
                        'statusCode': 400,
                        'body': return_statement}
            else:
                return_statement = "Order is being placed to wrong entity. Check Distributor_id"
                return{
                'statusCode': 400,
                'body': return_statement}
        else:
            return_statement = "Check the person id!"
            return{
                'statusCode': 400,
                'body': return_statement}
    else:
        return_statement = " Check Distributor id!"
        return{
                'statusCode': 400,
                'body': return_statement}



def create_distributor_purchase_order(event):
    try:
        with create_qldb_driver() as driver:
            purchaseorderdetails = event["PurchaseOrder"]
            # must be passed down as a prop from the react state
            distributorid = event["DistributorId"]
            hospitalpersonid = event["PersonId"]             #change this <<<<---------------------------
            return driver.execute_lambda(lambda executor: create_purchase_order_to_distributor(executor,purchaseorderdetails,distributorid,hospitalpersonid))
    except Exception:
        return_statement = 'Error creating order.'
        return{
                'statusCode': 400,
                'body': return_statement}