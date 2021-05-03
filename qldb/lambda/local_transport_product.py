from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads

logger = getLogger(__name__)
basicConfig(level=INFO)

from constants import Constants
from accept_purchase_order import get_sub_details
from register_person import get_scentityid_from_personid,get_scentity_contact
from export_transport_product import create_lorry_reciept
from sampledata.sample_data import get_value_from_documentid,document_exist,update_document
from check_container_safety import isContainerSafe


def deliver_product_to_final_entity(transaction_executor, pick_up_request_id, truck_carrier_person_id):
    if document_exist(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,pick_up_request_id):
        update_document(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,"isAccepted",pick_up_request_id,True)
        purchase_order_id = get_value_from_documentid(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE, pick_up_request_id, "PurchaseOrderId")
        purchase_order_id = purchase_order_id[0]

        if document_exist(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id):
            container_ids = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"HighestPackagingLevelIds")
            
            carrier_company_id = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_ids[0][0],"CarrierCompanyId")

            actual_sc_entity_id = get_scentityid_from_personid(transaction_executor,truck_carrier_person_id)

            if carrier_company_id[0]== actual_sc_entity_id:
                for container_id in container_ids[0]:
                    isPicked = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"isPicked")
                    if isPicked[0] == 0:
                        update_document(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"isOrderShipped",purchase_order_id,True)
                        update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME,"isPicked",container_id,True)

                        consignee_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Orderer",purchase_order_id,"OrdererScEntityId")
                        pick_up_location = get_scentity_contact(transaction_executor,consignee_id[0],"Address")
                        consignee_name = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,consignee_id[0],"ScEntityName")
                        acceptor_id = get_sub_details(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,"Acceptor",purchase_order_id,"AcceptorScEntityId")
                        delivery_location = get_scentity_contact(transaction_executor,acceptor_id[0],"Address")

                        #change consignee id to person who made pick-up request
                        lorry_reciept_id = create_lorry_reciept(transaction_executor, actual_sc_entity_id,truck_carrier_person_id,pick_up_location[0],delivery_location[0], consignee_id[0],consignee_name[0], True)

                        message = " =========== L O C A L ====== T R A N S P O R T ======== I N I T I A T E D ============= "
                        return{
                                'statusCode': 400,
                                'body': {
                                    "Message":message,
                                    "LorryReciept": lorry_reciept_id
                                }
                            }
                    else:
                        return_statement ="Order Already Picked"
                        return{
                                'statusCode': 400,
                                'body': return_statement}
            else:
                return_statement = "Not Authorized! "
                return{
                        'statusCode': 400,
                        'body': return_statement}
        else:
            return_statement = 'Error in Pick Up'
            return{
                    'statusCode': 400,
                    'body': return_statement}
    else: 

        return_statement = "Check Request Id"
        return{
                'statusCode': 400,
                'body': return_statement}


def local_transport(event):
    try:
        with create_qldb_driver() as driver:
            
            pickuprequestid = event["PickUpRequestId"]        
            truckcarrierpersonid = event["PersonId"]
            return driver.execute_lambda(lambda executor: deliver_product_to_final_entity(executor, pickuprequestid,truckcarrierpersonid))
    except Exception:
        return_statement = 'Error in Pick Up'
        return{
                'statusCode': 400,
                'body': return_statement}