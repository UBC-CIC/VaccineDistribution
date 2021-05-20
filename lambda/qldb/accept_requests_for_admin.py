from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
import collections
import json
from pyion2json import ion_cursor_to_json
from sampledata.sample_data import get_value_from_documentid, delete_document, print_result
from constants import Constants
from register_person import get_scentityid_from_personid


logger = getLogger(__name__)
basicConfig(level=INFO)

def person_is_superadmin(transaction_executor,person_id):
    is_superadmin = get_value_from_documentid(transaction_executor,Constants.PERSON_TABLE_NAME,person_id,"isSuperAdmin")
    if is_superadmin == [1]:
        logger.info("Authorized!")
        return True
    else:
        logger.info('Not Authorized!')
        return False

def mcg_request_exist(transaction_executor, request_id):

    query = 'SELECT * FROM {} as m by RequestId WHERE RequestId = ? '.format(Constants.SUPERADMIN_REQUEST_TABLE_NAME)
    cursor = transaction_executor.execute_statement(query, request_id)

    try:
        return_body = ion_cursor_to_json(cursor)
        if len(return_body) > 0:
            return return_body[0]
        else:
            raise Exception("AAAAAAA")
    except StopIteration:
        logger.info('Request not Found')
        return False
        

def mcg_request_already_approved(transaction_executor, request_id):
    query  = 'SELECT m.isAccepted from {} as m by id where id = ?'.format(Constants.SUPERADMIN_REQUEST_TABLE_NAME)
    cursor = transaction_executor.execute_statement(query,request_id)
    approval_status = list(map(lambda x: x.get('isAccepted'), cursor))
    
    logger.info("approval status : {}".format(approval_status))

    if approval_status == [0]:
        logger.info(" not approved")
        return False
    else:
        logger.info("approved")
        return True

def get_every_request(transaction_executor, person_id):
    
    if person_is_superadmin(transaction_executor, person_id):
        query = 'SELECT * FROM {} BY RequestId'.format(Constants.SUPERADMIN_REQUEST_TABLE_NAME)
        
        try:
            cursor = transaction_executor.execute_statement(query)
            requests = ion_cursor_to_json(cursor)
            
            return{
                'statusCode': 200,
                'body': requests
            }
            
        except StopIteration:
            return{
                'statusCode': 400,
                'body': " No request found"
            }
    else:
         return{
                'statusCode': 400,
                'body': "Only SuperAdmin can View all Requets"
            }
        

def get_self_mcg_request(transaction_executor,event):
        
    try:
        request_id = event["RequestId"]
        person_id = event["PersonId"]   
        
        sender_person_id = get_value_from_documentid(transaction_executor,Constants.SUPERADMIN_REQUEST_TABLE_NAME,request_id,"SenderPersonId")
        sender_scentity_id = get_scentityid_from_personid(transaction_executor, sender_person_id[0])
        
                    
        actual_scentity_id = get_scentityid_from_personid(transaction_executor, person_id)
        

        if actual_scentity_id == sender_scentity_id:
            
            return mcg_request_exist(transaction_executor,request_id)
        else:
            return_statement = "Access denied. Check RequestId or PersonId"
            return{
                'statusCode': 400,
                'body': return_statement
            }
            
    except Exception:
        return_statement = 'Error fetching your request'
        return{
            'statusCode': 400,
            'body': return_statement
        }

def update_approval_status(transaction_executor,request_id,status):
    request_type = get_value_from_documentid(transaction_executor,Constants.SUPERADMIN_REQUEST_TABLE_NAME,request_id,"RequestType")
    request_type = request_type[0]
    document_id = get_value_from_documentid(transaction_executor,Constants.SUPERADMIN_REQUEST_TABLE_NAME,request_id,"DocumentId")
    logger.info(request_type)
    logger.info(document_id)

    if request_type == 1:
        table_name = Constants.SCENTITY_TABLE_NAME

    else:
        table_name = Constants.PRODUCT_TABLE_NAME

    if status == "false":
       
        # delete this if statement if you want to keep person even if SCEntitiy is deleted
        if request_type == 1:
            person_ids = get_value_from_documentid(transaction_executor, table_name,document_id[0],'PersonIds')
            logger.info(person_ids)
            person_ids = person_ids[0]
            logger.info('person_ids are :{}'.format(person_ids))
            delete_document(transaction_executor, Constants.PERSON_TABLE_NAME,person_ids)  
            return_statement_1 = 'Following person ids were deleted : person id:{}'.format(person_ids)
    

        # id must be in list so request_id was converted to ['request_id']
        delete_document(transaction_executor,table_name,document_id)
        delete_document(transaction_executor,Constants.SUPERADMIN_REQUEST_TABLE_NAME, [request_id]) 
        
        return_statement_2 = 'and following documents were deleted :  product or scentity id: {} and request id:{}'.format(document_id,request_id)
        
        return{
                    'statusCode': 200,
                    'body': return_statement1+return_statement_2
                }
        
    else:
        update_statement = " UPDATE {} AS j BY id SET j.isApprovedBySuperAdmin = true WHERE id = ?".format(table_name)

        document_id = document_id[0]
        cursor = transaction_executor.execute_statement(update_statement, document_id)
        try:
            next(cursor)
            print("Approval Status Updated!")
        except StopIteration:
            print("Status was not updated!")

def accept_request_to_approve_company_or_product(transaction_executor, event):
    request_id = event["RequestId"]
    person_id = event["PersonId"] 
    request =  mcg_request_exist(transaction_executor, request_id)
    print(request)
    if request:
        if person_is_superadmin(transaction_executor,person_id):
            if mcg_request_already_approved(transaction_executor, request_id):
                return_statement = "Request already approved : {}".format(request_id)
                return{
                    'statusCode': 400,
                    'body': return_statement
                }
            else:
                update_approval_status(transaction_executor,request_id,True)
                
                #Update Request status in MCG table
                update_statement = " UPDATE {} AS j BY id SET j.isAccepted = true WHERE id = ?".format(Constants.SUPERADMIN_REQUEST_TABLE_NAME)
                try:
                    cursor = transaction_executor.execute_statement(update_statement, request_id)
                    result_body = ion_cursor_to_json(cursor)
                    request.update({"isAccepted":True})
                    return{
                        'statusCode': 200,
                        'body': request
                    }
                    
                except StopIteration:
                    return_statement = "Request couldn't be accepted!"
                    return{
                        'statusCode': 400,
                        'body': return_statement
                    }
        else:
            return_statement = ("Access denied -- only MCG")
            return{
            'statusCode': 400,
            'body': return_statement}
    else:
        return_statement = "Any request with request id : {} doesn't exist.".format(request_id)
        return{
            'statusCode': 400,
            'body': return_statement
        }

###################################################################################################################################################################################################

def get_all_mcg_requests(event):
    try:
        with create_qldb_driver() as driver:
            person_id = event["PersonId"]   
  
            return(driver.execute_lambda(lambda executor: get_every_request(executor,person_id)))
    except Exception:
        return_statement = 'Error fetching all the requests'
        
        return{
            'statusCode': 400,
            'body': return_statement
        }
        
        

def accept_mcg_request(event):
    try:
        with create_qldb_driver() as driver:

            return driver.execute_lambda (lambda executor: accept_request_to_approve_company_or_product(executor,event))
    except Exception:
        return_statement = "Error accepting the request."
        return{
            'statusCode': 400,
            'body': return_statement
        }

def get_your_mcg_request(event):
    try:
        with create_qldb_driver() as driver:
  
            return(driver.execute_lambda(lambda executor: get_self_mcg_request(executor,event)))
    except Exception:
        return_statement = "Error finding Request."
        return{
            'statusCode': 400,
            'body': return_statement
        }



    