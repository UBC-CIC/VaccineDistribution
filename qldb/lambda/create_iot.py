## In real-life scenarios IoT's will already be mapped to the containers
## And in Initiating shipment -- instead of creating a container by inputting data in the containers table
## Similar logic to putting batches in cases will be followed --> out of all the containers a container will be found which is empty and free and will be assigned


from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads
logger = getLogger(__name__)
basicConfig(level=INFO)

from pyion2json import ion_cursor_to_json
from constants import Constants
from register_person import get_index_number
from insert_document import insert_documents
from register_person import get_scentityid_from_personid
from sampledata.sample_data import convert_object_to_ion, get_value_from_documentid,document_exist,update_document,get_document
from accept_requests_for_admin import person_is_superadmin



def register_iot(transaction_executor,person_id, iot):
    if person_is_superadmin(transaction_executor,person_id):
        iot_number = get_index_number(transaction_executor,Constants.IOT_TABLE_NAME,"IoTNumber")
        iot.update({"IoTNumber": iot_number})
        iot_type = iot['IoTType']
        if iot_type ==1:
            iot_name = "Temperature Sensor"
        elif iot_type == 2:
            iot_name = "Humidity Sensor"
        elif iot_type == 3:
            iot_name = "Location Sensor"
        else:
            iot_name = "UnkownSensor"
        
        iot.update({"IoTName":iot_name})
        logger.info("iot_number is :{}".format(iot_number))
        iot_id = insert_documents(transaction_executor,Constants.IOT_TABLE_NAME, [iot])
        iot.update({"IoTId":iot_id})
        print(iot_id)
        return{
                'statusCode': 200,
                'body': {
                    "IoT":iot
                }
            }
    else:
        return_statement= "You are not a Super admin"
        return{
                'statusCode': 400,
                'body': return_statement}

# create iot in iot table
## update iot ids in containers
def assign_iot(transaction_executor, iot_id,container_id,person_id):
    # person_id must be super admin
    actual_sc_entity_id = get_scentityid_from_personid(transaction_executor,person_id)
    carrier_id = get_value_from_documentid(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id,"CarrierCompanyId")
    if actual_sc_entity_id == carrier_id[0]:
       
        if document_exist(transaction_executor,Constants.CONTAINER_TABLE_NAME,container_id):
            update_document(transaction_executor,Constants.IOT_TABLE_NAME,"ContainerId",iot_id,container_id)
            statement = "FROM {} AS s by id WHERE id = '{}' INSERT INTO s.IotIds VALUE ?".format(Constants.CONTAINER_TABLE_NAME,container_id)
            cursor = transaction_executor.execute_statement(statement,iot_id) 
            iot = fetch_iot(transaction_executor,iot_id)
            iot = iot["body"]
            try:
                next(cursor)
                message = " ========== I o T ========= C R E A T E D ========== A N D ====== A D D E D =========T O === {}".format(container_id)
                return{
                'statusCode': 200,
                'body': {
                    "IoT":iot,
                    "Message":message
                }}
            except:
                return_statement = "Problem in Iot assignment"
                return{
                'statusCode': 400,
                'body': return_statement}
        else:
            return_statement = "Container not found"
            return{
                'statusCode': 400,
                'body': return_statement}
    else:
        return_statement = "Not authorized!"
        return{
                'statusCode': 400,
                'body': return_statement}
    


def fetch_iot(transaction_executor,iot_id):
    try:
        
        iot_cursor = get_document(transaction_executor,Constants.IOT_TABLE_NAME,iot_id)
        iot_document = ion_cursor_to_json(iot_cursor)
        return {
                'statusCode': 200,
                'body': {
                    "IoT":iot_document[0]
                    
                    }
                }
    except:
        return_statement = "Check IoT Id"
        return{
                'statusCode': 400,
                'body': return_statement}


######################################################################################


def create_iot(event):
    try:
        with create_qldb_driver() as driver:
            
            iot = event["IoT"]
            personid = event["PersonId"]
            return driver.execute_lambda(lambda executor: register_iot(executor,personid,iot))
    except Exception:
        return_statement = 'Error registering IoT.'
        return{
                'statusCode': 400,
                'body': return_statement}
                
                
def get_iot(event):
    try:
        with create_qldb_driver() as driver:
            
           iot_id = event["IoTId"]
           return driver.execute_lambda(lambda executor: fetch_iot(executor,iot_id))
    except Exception:
        return_statement = 'Error getting IoT.'
        return{
                'statusCode': 400,
                'body': return_statement}
                
def assign_iot_to_container(event):
    try:
        with create_qldb_driver() as driver:
            container_id = event["ContainerId"]
            person_id = event["PersonId"]
            iot_id = event["IoTId"]
            return driver.execute_lambda(lambda executor : assign_iot(executor, iot_id,container_id,person_id))
    except Exception:
        return_statement = 'Error assigning IoT.'
        return{
                'statusCode': 400,
                'body': return_statement}

                
    