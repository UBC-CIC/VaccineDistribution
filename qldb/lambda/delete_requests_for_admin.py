from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from sampledata.sample_data import get_value_from_documentid, delete_document
from constants import Constants
from accept_requests_for_admin import mcg_request_exist,update_approval_status, mcg_request_already_approved,person_is_superadmin


logger = getLogger(__name__)
basicConfig(level=INFO)


def decline_request_to_approve_company_or_product(transaction_executor, person_id,request_id):
    ## check if request exists
    ## check if request was approved
    if isSuperAdmin(transaction_executor,person_id):
        if mcg_request_exist(transaction_executor, request_id):
            if mcg_request_already_approved(transaction_executor, request_id):
                logger.info("Request was already approved! Continuting to decline it now")
                update_statement = "UPDATE {} AS j BY id SET j.isAccepted = false WHERE id = ?".format(Constants.SUPERADMIN_REQUEST_TABLE_NAME)
                cursor = transaction_executor.execute_statement(update_statement, request_id)
                update_approval_status(transaction_executor,request_id,"false")
                try:
                    next(cursor)
                    print("Request successfully Declined and deleted!")
                    return_statement = " ================================== R E Q U E S T =========== D E L E T E D ==============================="
                    return{
                    'statusCode': 200,
                    'body': return_statement
                    }
                except StopIteration:
                    return_statement = "Request couldn't be accepted!"
                    return{
                    'statusCode': 400,
                    'body': return_statement
                }
            else: 
                print("Declining and deleting requests!")
                update_approval_status(transaction_executor,request_id,"false")
        else:
            return_statement = "Any request with request id : {} doesn't exist.".format(request_id)
            return{
                    'statusCode': 400,
                    'body': return_statement
                }
    else:
        return_statement = "Not authorized"
        return{
                    'statusCode': 400,
                    'body': return_statement
                }

def delete_mcg_request(event):
    try:
        with create_qldb_driver() as driver:
            person_id = event["PersonId"]
            request_id = event["RequestId"]        
  
            return driver.execute_lambda(lambda executor: decline_request_to_approve_company_or_product(executor,request_id))
    except Exception:
        return_statement = 'Error accepting the request.'
        return{
                    'statusCode': 400,
                    'body': return_statement
                }