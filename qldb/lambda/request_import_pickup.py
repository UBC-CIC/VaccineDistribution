from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads
logger = getLogger(__name__)
basicConfig(level=INFO)

import datetime
from constants import Constants
from create_purchase_order_to_manufacturer import get_orderer_id
from register_person import get_scentityid_from_personid,get_scentity_contact
from sampledata.sample_data import get_value_from_documentid,document_exist,update_document
from export_transport_product import create_lorry_reciept, update_document_in_container
from initiate_shipment_manufacturer import create_pick_up_request, send_pick_up_request
## make a request_to_change_pickup function for buyer to change reciever to itself or a different truck company



def request_to_change_pickup(transaction_executor, purchase_order_id,buyer_person_id, new_truck_carrier_id):
    if document_exist(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id):
        orderer_id = get_orderer_id(transaction_executor,purchase_order_id)
        actual_sc_entity_id = get_scentityid_from_personid (transaction_executor,buyer_person_id)
        
        if actual_sc_entity_id == orderer_id:
            container_ids = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"HighestPackagingLevelIds")
            
            for container_id in container_ids[0]: 
                transport_type = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"TransportType")
                print(transport_type)
                if transport_type[0] == 1:
                    airway_bills = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"AirwayBillIds")
                    update_document(transaction_executor,Constants.AIRWAY_BILL_TABLE_NAME,"RecieverScEntityId",airway_bills[0][-1],new_truck_carrier_id)
                    pick_up_location = get_value_from_documentid(transaction_executor,Constants.AIRWAY_BILL_TABLE_NAME,airway_bills[0][-1],"ImportAirportName") 
                elif transport_type[0] == 2:
                    bill_of_lading = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"BillOfLadingIds")
                    update_document(transaction_executor,Constants.BILL_OF_LADING_TABLE_NAME,"RecieverScEntityId",bill_of_lading[0][-1],new_truck_carrier_id)
                    pick_up_location = get_value_from_documentid(transaction_executor,Constants.BILL_OF_LADING_TABLE_NAME,bill_of_lading[0][-1],"ImportPortName")
                delivery_location = get_scentity_contact(transaction_executor,actual_sc_entity_id,"Address")
                consignee_name = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,actual_sc_entity_id,"ScEntityName")
                lorry_reciept_id = create_lorry_reciept(transaction_executor,new_truck_carrier_id,"",pick_up_location, delivery_location,actual_sc_entity_id,consignee_name,False)
                update_document_in_container(transaction_executor,container_id,"LorryRecieptIds",lorry_reciept_id[0])
                pick_up_request_id = create_pick_up_request(transaction_executor,actual_sc_entity_id,new_truck_carrier_id, purchase_order_id, "3")
                send_pick_up_request(transaction_executor,pick_up_request_id,new_truck_carrier_id)

                return_statement = "New Request was made!"
                return{
                    'statusCode': 200,
                    'body': {
                        "PickUpRequestId": pick_up_request_id,
                        "Message":return_statement
                        }
                    }

        else:
            return_statement = "Not Authorized!!"
            return{
                'statusCode': 400,
                'body': return_statement
                }
    else:
        return_statement = "Document does not exist!"
        return{
            'statusCode': 400,
            'body': return_statement
            }

def request_import_pickup(event):
    try:
        with create_qldb_driver() as driver:
            purchaseorderid = event['PurchaseOrderId']
            buyerpersonsid = event["PersonId"]
            new_truck_carrier_id = event["NewCarrierId"]
            return driver.execute_lambda(lambda executor: request_to_change_pickup(executor, purchaseorderid,buyerpersonsid,new_truck_carrier_id))
    except Exception:
        return_statement = 'Error in changing the pickup'
        return{
            'statusCode': 400,
            'body': return_statement
            }