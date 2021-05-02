from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads
logger = getLogger(__name__)
basicConfig(level=INFO)

from constants import Constants
from register_person import get_scentityid_from_personid,get_scentity_contact
from sampledata.sample_data import get_value_from_documentid,document_exist,update_document
from check_container_safety import isContainerSafe
from create_purchase_order_to_manufacturer import get_sub_details
from export_transport_product import create_lorry_reciept, update_document_in_container
from export_customs_approval import document_already_approved_by_customs
import copy

def deliver_product_to_distributor(transaction_executor,pick_up_request_id,pick_up_person_id):
    if document_exist(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,pick_up_request_id):
        update_document(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,"isAccepted",pick_up_request_id,True)
        purchase_order_id = get_value_from_documentid(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE, pick_up_request_id, "PurchaseOrderId")
        purchase_order_id = purchase_order_id[0]
        container_ids = get_value_from_documentid(transaction_executor,Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id,"HighestPackagingLevelIds")
        for container_id in container_ids[0]:    
            total_containers_ordered = len(container_ids[0])
            
            if document_exist(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id):
            #check if container_exist
                certificate_of_origin_id = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"CertificateOfOriginId")
                packing_list_id = get_value_from_documentid(transaction_executor, Constants.CONTAINER_TABLE_NAME,container_id,"PackingListId")
                import_custom_approved = (document_already_approved_by_customs(transaction_executor,"ImportApproval",Constants.CERTIFICATE_OF_ORIGIN_TABLE_NAME,certificate_of_origin_id[0]) and
                document_already_approved_by_customs(transaction_executor,"ImportApproval", Constants.PACKING_LIST_TABLE_NAME,packing_list_id[0]))

                if  import_custom_approved:
                    logger.info("Approved by Import!")
                    total_safe_containers = copy.copy(total_containers_ordered)
                    if isContainerSafe(transaction_executor,container_id):
                        actual_sc_entity_id = get_scentityid_from_personid(transaction_executor,pick_up_person_id)
                        transport_type = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"TransportType")
                        
                        
                        #check if container is safe
                        if transport_type[0] == 1:
                            table = Constants.AIRWAY_BILL_TABLE_NAME
                            airway_bills = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"AirwayBillIds")
                            
                            
                        elif transport_type[0] == 2:
                            table = Constants.BILL_OF_LADING_TABLE_NAME
                            bill_of_lading = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"BillOfLadingIds")
                            
                        print(transport_type) 
                        
                        pick_up_scentity_id = get_value_from_documentid(transaction_executor,Constants.PICK_UP_REQUESTS_TABLE,pick_up_request_id, "CarrierCompanyId")
                        if actual_sc_entity_id == pick_up_scentity_id[0]:
                            logger.info("Authorized!")
                                        
                            if transport_type[0] == 1:

                                is_picked_up = get_sub_details(transaction_executor,table,"RecieverApproval",airway_bills[0][-1],"isApproved")

                                if is_picked_up[0] == 0:
                                    update_document(transaction_executor,Constants.AIRWAY_BILL_TABLE_NAME,"RecieverApproval.isApproved",airway_bills[0][-1],True)
                                    update_document(transaction_executor,Constants.AIRWAY_BILL_TABLE_NAME,"RecieverApproval.ApproverId",airway_bills[0][-1], pick_up_person_id)
                                    pick_up_location = get_value_from_documentid(transaction_executor,Constants.AIRWAY_BILL_TABLE_NAME,airway_bills[0][-1],"ImportAirportName")
                                    consignee_id = get_value_from_documentid(transaction_executor,Constants.AIRWAY_BILL_TABLE_NAME,airway_bills[0][-1],"SenderScEntityId")
                                else:
                                    return_statement = "container already picked up"
                                    return{
                                        'statusCode': 400,
                                        'body': return_statement
                                        }

                            elif transport_type[0] == 2:
                                is_picked_up = get_sub_details(transaction_executor,table,"RecieverApproval",bill_of_lading[0][-1],"isApproved")
                                if is_picked_up[0] == 0:
                                    update_document(transaction_executor,Constants.BILL_OF_LADING_TABLE_NAME,"RecieverApproval.isApproved",bill_of_lading[0][-1],True)
                                    update_document(transaction_executor,Constants.BILL_OF_LADING_TABLE_NAME,"RecieverApproval.ApproverId",bill_of_lading[0][-1], pick_up_person_id)
                                    pick_up_location = get_value_from_documentid(transaction_executor,Constants.BILL_OF_LADING_TABLE_NAME,bill_of_lading[0][-1],"ImportPortName")
                                    consignee_id = get_value_from_documentid(transaction_executor,Constants.BILL_OF_LADING_TABLE_NAME,bill_of_lading[0][-1],"SenderScEntityId")
                                else:
                                    return_statement = "Containers Already picked up"
                                    return{
                                        'statusCode': 400,
                                        'body': return_statement
                                        }
                            
                            
                     
                            consignee_name = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,consignee_id[0],"ScEntityName")
                            delivery_location = get_scentity_contact(transaction_executor,actual_sc_entity_id[0],"Address")
                            lorry_reciepts = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"LorryRecieptIds")
                            carrier_id = get_value_from_documentid(transaction_executor,Constants.LORRY_RECEIPT_TABLE_NAME,lorry_reciepts[0][-1],"CarrierId")
                            if carrier_id[0] == pick_up_scentity_id[0]:
                                return_statement = "No request was made by buyer to pickup. Creating a new L/R to initiate import delivery."
                                lorry_reciept_id = create_lorry_reciept(transaction_executor,actual_sc_entity_id,pick_up_person_id,pick_up_location[0],delivery_location,consignee_id,consignee_name,True)
                                update_document_in_container(transaction_executor,container_id,"LorryRecieptIds",lorry_reciept_id[0])
                                return{
                                    'statusCode': 200,
                                    'body': {
                                        "Message":return_statement,
                                        "LorryRecieptId":lorry_reciept_id[0]
                                        
                                        }
                                    }
                                
                            else:
                                message = "Pick up request was made by new carrier assigned by buyer."
                                update_document(transaction_executor,Constants.LORRY_RECEIPT_TABLE_NAME,"isPickedUp",lorry_reciepts[0][-1],True)
                                return{
                                    'statusCode': 200,
                                    'body': {
                                        "Message":return_statement,
                                        "LorryRecieptId":lorry_reciepts[0][-1]
                                        
                                    }
                                    }
                        else:
                            return_statement = "Not Authorized!"
                            return{
                                'statusCode': 400,
                                'body': return_statement
                                }
                    else:
                        # raise Exception("Container Not Safe!")
                        total_safe_containers = total_safe_containers - 1
                        if total_safe_containers > 0:
                            continue
                        else:
                            return_statement = "Not Container was safe. Pick up can't be made for any container"
                            return{
                                'statusCode': 400,
                                'body': return_statement
                                }
                elif not isContainerSafe(transaction_executor,container_id):
                    continue
                else:
                    return_statement = "Illegal=====Container was safe but not approved by customs"
                    return{
                        'statusCode': 400,
                        'body': return_statement
                        }
            else:
                return_statement = ("Not Authorized!")
                return{
                    'statusCode': 400,
                    'body': return_statement
                    }
    else:
        
        return_statement = "Check Request Id"
        return{
            'statusCode': 400,
            'body': return_statement
            }


def pick_up_for_import(event):
    try:
        with create_qldb_driver() as driver:

            pickuprequestid = event["PickUpRequestId"] #96EioNwSjcq8HKLBRjcvPp
            pickuppersonid = event["PersonId"]
            return driver.execute_lambda(lambda executor: deliver_product_to_distributor(executor, pickuprequestid, pickuppersonid))
    except Exception:
        return_statement = 'Error in import pick up'
        return{
            'statusCode': 400,
            'body': return_statement
            }