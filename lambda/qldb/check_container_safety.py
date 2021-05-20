from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads
logger = getLogger(__name__)
basicConfig(level=INFO)

import datetime
from constants import Constants
from register_person import get_index_number
from insert_document import insert_documents
from sampledata.sample_data import convert_object_to_ion, get_value_from_documentid,document_exist,update_document,print_result



def get_storage_data(transaction_executor,product_id,data_type):
    statement = "SELECT t.{} FROM {} as t BY d_id WHERE d_id = ?".format("ProductStorage" +"."+data_type,Constants.PRODUCT_TABLE_NAME)
    cursor = transaction_executor.execute_statement(statement,product_id)   
    value = list(map(lambda x: x.get('{}'.format(data_type)), cursor))

    return value[0]

def threshhold_crossed(transaction_executor, iot_id, iot_data):
    container_id = get_value_from_documentid(transaction_executor,Constants.IOT_TABLE_NAME,iot_id,"ContainerId")
    purchase_order_id = get_value_from_documentid(transaction_executor, Constants.CONTAINER_TABLE_NAME,container_id[0],"PurchaseOrderIds") 
    product_id = get_value_from_documentid(transaction_executor, Constants.PURCHASE_ORDER_TABLE_NAME,purchase_order_id[0][-1],"ProductId")
    print(product_id)
    iot_type = get_value_from_documentid(transaction_executor,Constants.IOT_TABLE_NAME,iot_id,"IoTType")
    if iot_type == [1]:
        temp_data = iot_data["Temperature"]
        low_thresh_temp = get_storage_data(transaction_executor,product_id[0],'LowThreshTemp')
        high_thresh_temp = get_storage_data(transaction_executor,product_id[0],'HighThreshTemp')

        if high_thresh_temp <= temp_data or temp_data <= low_thresh_temp:
            logger.info("Temp threshold crossed!!")
            return True
        else:
            logger.info("Temperature is good")
            return False
    elif iot_type == [2]:
        humidity_data = iot_data["Humidity"]
        high_thresh_humdity = get_storage_data(transaction_executor,product_id[0],"HighThreshHumidity")
        if humidity_data >= high_thresh_humdity:
            logger.info("Humidity Threshold crossed!")
            return True
        else:
            logger.info("Humdity ok")
            return False
    else:
        raise Exception("This is a location sensor. Check the sensor Id")

def isContainerSafe(transaction_executor,container_id):
    statement = "SELECT t.{} FROM {} as t BY d_id WHERE d_id = ?".format("ContainerSafety.isContainerSafeForDelivery",Constants.CONTAINER_TABLE_NAME)
    cursor = transaction_executor.execute_statement(statement,container_id)   
    value = list(map(lambda x: x.get('isContainerSafeForDelivery'), cursor))
    # print(statement+container_id[0])
    print("Safe: {}".format(value))
    return value[0]


def check_container_safe(transaction_executor, iot_id, iot_data):
    if document_exist(transaction_executor,Constants.IOT_TABLE_NAME,iot_id):
        logger.info("document_exist!")
        container_id = get_value_from_documentid(transaction_executor,Constants.IOT_TABLE_NAME,iot_id,"ContainerId")

        if threshhold_crossed(transaction_executor,iot_id,iot_data):
            update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME, "ContainerSafety.isContainerSafeForDelivery",container_id[0],False)
            update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME, "ContainerSafety.LastCheckedAt",container_id[0],iot_data["TimeStamp"])
            return_statement = ("++++++++++ ===== C O N T A I N E R ===== U N S A F E ======= +++++++++")
            return{
                    'statusCode': 200,
                    'body': {
                        "IoTId":iot_id,
                        "IoTData" :iot_data,
                        "ContainerId":container_id[0],
                        "Message":return_statement
                    }
                    
                }
            
            ## mark container unsafe
        else:
            if isContainerSafe(transaction_executor,container_id[0]):
                logger.info("No problem detected!")
                update_document(transaction_executor,Constants.CONTAINER_TABLE_NAME, "ContainerSafety.LastCheckedAt",container_id[0],iot_data["TimeStamp"])
                return_statement = "No Problem detected"
                return{
                    'statusCode': 200,
                    'body': {
                        "IoTId":iot_id,
                        "IoTData" :iot_data,
                        "Message":return_statement
                    }
                    
                }
            else:
                logger.info("ALARM!!! CONTAINER WAS ALREADY MARKED UNSAFE!!")
                return{
                'statusCode': 400,
                'body': return_statement}
            ## check if the container is safe 
            # mark container safe
            # change the updated time
    else:
        return_statement = "IoT with id : {} doesn't exist.".format(iot_id)
        return{
                'statusCode': 400,
                'body': return_statement}


##########################################################################################

def check_container_safety(event):
    try:
        with create_qldb_driver() as driver:
            
            iotid = event["IoTId"]
            iotdata = event["IoTData"]
            return driver.execute_lambda(lambda executor: check_container_safe(executor, iotid,iotdata))
    except Exception:
        return_statement = 'Error'
        return{
                'statusCode': 400,
                'body': return_statement}