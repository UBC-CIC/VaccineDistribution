from logging import basicConfig, getLogger, INFO
from datetime import datetime
import json


from pyion2json import ion_cursor_to_json
from amazon.ion.simpleion import dumps, loads
from sampledata.sample_data import convert_object_to_ion, get_document_ids, get_document_ids_from_dml_results, get_document, print_result,get_entire_table
from constants import Constants
from insert_document import insert_documents
from connect_to_ledger import create_qldb_driver

logger = getLogger(__name__)
basicConfig(level=INFO)

def person_already_exists(transaction_executor, employee_id):
    
    ## employee id can also be replaced by a government id or we can even use both
    query = 'SELECT * FROM Persons AS p WHERE p.EmployeeId = ?'
    cursor = transaction_executor.execute_statement(query, convert_object_to_ion(employee_id))
    try:
        next(cursor)
        return True
    except StopIteration:
        logger.info("Person not found.")
        return False

def get_person_ids(transaction_executor):
    
    statement = 'SELECT PersonIds FROM SCEntities'
    cursor2 = transaction_executor.execute_statement(statement)
    person_ids = list(map(lambda x: x.get('PersonIds'), cursor2))
    return person_ids

def get_scentity_ids(transaction_executor):
    
    statement = 'SELECT id FROM SCEntities by id'
    cursor2 = transaction_executor.execute_statement(statement)
    scentity_ids = list(map(lambda x: x.get('id'), cursor2))

    return scentity_ids


def get_scentityid_from_personid(transaction_executor, person_id):

    val = get_person_ids(transaction_executor)
    k = get_scentity_ids(transaction_executor)
    id_dict = dict(zip(k,val))
    
    for key, values in id_dict.items():

        if person_id in values:
            # print("person belongs to : {}".format(key))
            return key
        else:
            logger.info("Searching..")
            continue


def register_new_Person(transaction_executor, person):

    employee_id = person['EmployeeId']
    if person_already_exists(transaction_executor, employee_id):
        result = next(get_document_ids(transaction_executor, Constants.PERSON_TABLE_NAME, 'EmployeeId', employee_id))
        logger.info('Person with  employee_Id {} already exists with PersonId: {} .'.format(employee_id, result))
    else:
        person.update({"isSuperAdmin":False}) #<<-----------uncomment after onboarding admin
        person.update({"isAdmin":False}) #<<----------- un comment after onboarding admin
        result = insert_documents(transaction_executor, Constants.PERSON_TABLE_NAME, [person])
        result = result[0]
        logger.info("New Person registered with person id : {}".format(result))
    return result
        

def lookup_scentity(transaction_executor, new_sc_entity):
    scentity_id = new_sc_entity['ScEntityIdentificationCode']
    query = 'SELECT * FROM SCEntities AS d WHERE d.ScEntityIdentificationCode = ?'
    cursor = transaction_executor.execute_statement(query, scentity_id)
    try:
        next(cursor)
        logger.info("Entity already exists")
        return True
    except StopIteration:
        logger.info("Entity not found. Registering new Entity")
        return False
    
def create_req_to_join_scentity(transaction_executor, sc_entity, employee_id, person_id):
    request_number = get_index_number(transaction_executor,Constants.JOINING_REQUEST_TABLE_NAME,Constants.JOINING_REQUESTID_INDEX_NAME)
    sc_entity_identification_code = sc_entity['ScEntityIdentificationCode']
    sc_entity_id = next(get_document_ids(transaction_executor,Constants.SCENTITY_TABLE_NAME,"ScEntityIdentificationCode",sc_entity_identification_code))
    request = {
        "JoiningRequestNumber":request_number,
        "SenderEmployeeId": employee_id,
        "SenderPersonId" : person_id,
        "ScEntityId": sc_entity_id,
        "isAccepted":False
    }
    print(request)
    
    result = insert_documents( transaction_executor, Constants.JOINING_REQUEST_TABLE_NAME, [request])
    return result[0]
    
    
def get_index_number(transaction_executor, table_name,request_index_name):
    statement = "SELECT COUNT(t.{}) as ret_val FROM {} as t".format(request_index_name,table_name)
    print("Table: {} and Index: {}".format(table_name,request_index_name))
    cursor = transaction_executor.execute_statement(statement)

    ret_val = list(map(lambda x: x.get('ret_val'), cursor))
    # print(str(type(ret_val[0])))
    # logger.info("ret_val is {}".format(type(ret_val[0])))
    if str(type(ret_val[0])) == "<class 'amazon.ion.simple_types.IonPyNull'>":
        ret_val = 1
        logger.info("ret_val is Null")
    else:
        ret_val = int(dumps(ret_val[0],binary=False, indent='  ', omit_version_marker=True))
        ret_val = ret_val+1

    return ret_val
    
def send_request_to_company(transaction_executor, request_Id, sc_entity):
    
    
    sc_entity_id_code = sc_entity['ScEntityIdentificationCode']
    
    logger.info('Sending request to the company Admin.')
    
    statement = 'FROM SCEntities AS s WHERE s.ScEntityIdentificationCode = ? INSERT INTO s.JoiningRequests VALUE ?'
    cursor_two = transaction_executor.execute_statement(statement, sc_entity_id_code, request_Id)
    
    try:
        next(cursor_two)
        # list_of_document_ids = get_document_ids_from_dml_results(cursor_two)
        logger.info('Joining Request sent with id {}'.format(request_Id))
    except:
        logger.exception("Couldn't send the request.")

def req_already_sent(transaction_executor, person_id):
    
    # statement = "SELECT * FROM {} as j where j.SenderPersonId = ?".format(Constants.JOINING_REQUEST_TABLE_NAME)
    # cursor_four = transaction_executor.execute_statement(statement, person_id)
    # print_result(cursor_four)
    
    results = get_document_ids(transaction_executor, Constants.JOINING_REQUEST_TABLE_NAME, 'SenderPersonId',person_id)    
    try: 
        request_id = next(results)
        logger.info("Request already sent with id : {}".format(request_id))
        return request_id
    except StopIteration:
        logger.info(" Request not found")
        return False

def update_person_to_admin(transaction_executor,person_id):
    
    update_statement = " UPDATE Persons AS p BY id SET p.isAdmin = true WHERE id = ?"
    cursor = transaction_executor.execute_statement(update_statement, person_id)
    try:
        next(cursor)
        logger.info("Person with person id :{} was made an admin.".format(person_id))
    except:
        logger.info("Problem arised while making person with person id :{} as admin.".format(person_id))


def mcg_request_already_sent(transaction_executor, person_id,document_id):
    query = 'SELECT * FROM {} as m By id WHERE m.DocumentId = ? '.format(Constants.SUPERADMIN_REQUEST_TABLE_NAME)
    cursor = transaction_executor.execute_statement(query, document_id)

    try:
        return_body = ion_cursor_to_json(cursor)
        if len(return_body)>0:
            return{
                'statusCode': 200,
                'body':{ "Message": "Request already sent",
                    "McgRequest": return_body}
                
            }
        else:
            print("creating a new request")
            return False
    except StopIteration:
            print( "Problem in MCG Requests")

def create_mcg_request(transaction_executor,document_id,person_id, request_type):
    request_number = get_index_number(transaction_executor,Constants.SUPERADMIN_REQUEST_TABLE_NAME,Constants.SUPERADMIN_REQUEST_INDEX_NAME)
    request = {
        "McgRequestNumber": request_number,
        "DocumentId": document_id,
        "RequestType": request_type,
        "SenderPersonId" : person_id,
        "isAccepted":False
    }

    # request type is 1 for company 2 for product 3 for joining Request
    
    return_body = mcg_request_already_sent(transaction_executor, person_id,document_id)
    if return_body:
        return_statement = "Request already sent for document id : {}".format(document_id)
        return{
            'statusCode': 200,
            'body': return_statement}
        
    else:
        result = insert_documents(transaction_executor, Constants.SUPERADMIN_REQUEST_TABLE_NAME, [request])
        request_id = result[0]
        return request_id

def get_document_superadmin_approval_status(transaction_executor, table_name, document_id):
    
    statement = 'SELECT s.isApprovedBySuperAdmin FROM {} as s by id where id = ?'.format(table_name)
    cursor = transaction_executor.execute_statement(statement, document_id)
    approval_status = list(map(lambda x: x.get('isApprovedBySuperAdmin'), cursor))
    
    logger.info("approval status : {}".format(approval_status))

    if approval_status == [1]:
        logger.info(" MCG approved")
        return True
    else:
        logger.info("Not approved")
        return False

def get_scentity_contact(transaction_executor,scentity_id,contact_field):
    statement = "SELECT t.{} FROM {} as t BY d_id WHERE d_id = ?".format("ScEntityContact."+contact_field,Constants.SCENTITY_TABLE_NAME)
    cursor = transaction_executor.execute_statement(statement,scentity_id)   
    value = list(map(lambda x: x.get('{}'.format(contact_field)), cursor))

    return value

## check if request is sent to super admin for approval of product code for that GTIN
## send request for vaccineApproval


def register_new_user_with_scentity(transaction_executor, event):
    
    person = event["Person"] 
    new_sc_entity = event["ScEntity"]
    
    
    person_id = register_new_Person(transaction_executor, person)
    current_sc_entity_id = get_scentityid_from_personid(transaction_executor, person_id)
    

    if current_sc_entity_id:
        approval_status = get_document_superadmin_approval_status(transaction_executor, Constants.SCENTITY_TABLE_NAME,current_sc_entity_id)
        if approval_status:
            logger.info("Person with personId '{}' already belongs to a SC Entity".format(person_id))
            return_body = {
                "PersonId": person_id,
                "ScEntityId": current_sc_entity_id,
                "McgRequestId": None,
                "RequestType":None
                }
            
            return{
                'statusCode': 200,
                'body': return_body}
        else:
            logger.info("Request Already sent. Wait for MCG APPROVAL")
            return(mcg_request_already_sent(transaction_executor, person_id,current_sc_entity_id))
    else:
        logger.info("Registering new Person's entity...")
        if lookup_scentity(transaction_executor, new_sc_entity):
            # send request to join a new entity
            logger.info(' Entity already exist. Sending request to join it.')
            employee_id = person['EmployeeId']
            scentity_id_code = new_sc_entity['ScEntityIdentificationCode']
            scentity_id = next(get_document_ids(transaction_executor,Constants.SCENTITY_TABLE_NAME,'ScEntityIdentificationCode',scentity_id_code))

            if get_document_superadmin_approval_status(transaction_executor,Constants.SCENTITY_TABLE_NAME, scentity_id):
                joining_request_id = req_already_sent(transaction_executor, person_id)
                if joining_request_id:
                    logger.info("Please wait for your company admin to approve the request.")
                    return_body = {
                        "PersonId": person_id,
                        "ScEntityId": scentity_id,
                        "JoiningRequestId": joining_request_id,
                        "RequestType":"3"
                    }
                    return{
                        'statusCode': 200,
                        'body': return_body}
                else:
                    request_Id = create_req_to_join_scentity(transaction_executor,new_sc_entity,employee_id,person_id)
                    send_request_to_company(transaction_executor,request_Id, new_sc_entity)
                    return_body = {
                        "PersonId": person_id,
                        "ScEntityId": scentity_id,
                        "JoiningRequestId": request_Id,
                        "RequestType":"3"
                    }
                    return{
                        'statusCode': 200,
                        'body': return_body}
            else:
                return_statement = "Wait for MCG to approve this entity"
                return{
                'statusCode': 400,
                'body': return_statement
                }                
        else:
            #create a new entity
            joining_request_id = req_already_sent(transaction_executor, person_id)
            if joining_request_id:
                logger.info("Please wait for your company admin to approve the request.")
                return_body = {
                        "PersonId": person_id,
                        "ScEntityId": scentity_id,
                        "JoiningRequestId": request_Id,
                        "RequestType":"3"
                    }
                    
                return{
                    'statusCode': 200,
                    'body': return_body}
                
            else:
                
                update_person_to_admin(transaction_executor,person_id)
                new_sc_entity.update({'PersonIds': [str(person_id)]})
                new_sc_entity.update({'isApprovedBySuperAdmin': False})
                try:
                    result = insert_documents( transaction_executor, Constants.SCENTITY_TABLE_NAME, [new_sc_entity])
                    sc_entity_id = result[0]
                    mcg_request_id = create_mcg_request(transaction_executor,sc_entity_id,person_id, 1)
                   
                    print(mcg_request_id)
                    print(" ================================== P E R S O N =========== R E G I S T R A T I O N ============== I N I T I A T E D=================")
                    
                    return_body = {
                        "PersonId": person_id,
                        "ScEntityId": sc_entity_id,
                        "McgRequestId": mcg_request_id,
                        "RequestType":"1"
                    }
                    return{
                        'statusCode': 200,
                        'body': return_body}
                except StopIteration:
                    return_statement = 'Problem occurred while inserting Scentity, please review the results.'
                    return{
                    'statusCode': 400,
                    'body': return_statement
                    }
                    

def get_person(transaction_executor, event):
    person_id = event["PersonId"]
    
    cursor = get_document(transaction_executor, Constants.PERSON_TABLE_NAME, person_id)
    
    if cursor:
        
        person = ion_cursor_to_json(cursor)
        print(person)

        return {
        "statusCode": 200,
        "body": person}
    else:
        return_statement = "Person not found"
        return{
        'statusCode': 400,
        'body': return_statement
        }

def get_scentity(transaction_executor, event):
    person_id = event["PersonId"]
    
    sc_entity_id = get_scentityid_from_personid(transaction_executor,person_id)
    
    cursor = get_document(transaction_executor, Constants.SCENTITY_TABLE_NAME, sc_entity_id)
    
    if cursor:
        result_scentity = ion_cursor_to_json(cursor)
        
   
        return {
            "statusCode": 200,
            "body": result_scentity}
    else:
        return_statement = "Entity not found"
        return{
        'statusCode': 400,
        'body': return_statement
        }
        
def get_all_scentities(transaction_executor):
    
    cursor = get_entire_table(transaction_executor, Constants.SCENTITY_TABLE_NAME)
    
    if cursor:
        result_scentities = ion_cursor_to_json(cursor)
        

        return {
            "statusCode": 200,
            "body": result_scentities}
    else:
        return_statement = "Entities not found"
        return{
        'statusCode': 400,
        'body': return_statement
        }


    
##########################################################################################################################################################################

def register_new_user_and_scentity(event):
    try:
        with create_qldb_driver() as driver:
            return_statement = driver.execute_lambda(lambda executor: register_new_user_with_scentity(executor, event))
            return return_statement
    except Exception:
        return{
        'statusCode': 400,
        'body': "Error registering person and entity"
        }


def get_person_details(event):
    
    try:
        with create_qldb_driver() as driver:
            return_statement = driver.execute_lambda(lambda executor: get_person(executor, event))
            return return_statement
    except Exception:
        return{
        'statusCode': 400,
        'body': json.dumps("Error fetching the details")
        }

def get_your_scentity_details(event):
    
    try:
        with create_qldb_driver() as driver:
            return_statement = driver.execute_lambda(lambda executor: get_scentity(executor, event))
            return return_statement
    except Exception:
        return{
        'statusCode': 400,
        'body': json.dumps("Error fetching the details")
        }

def get_all_scentity_details():
    try:
        with create_qldb_driver() as driver:
            return_statement = driver.execute_lambda(lambda executor: get_all_scentities(executor))
            return return_statement
    except Exception:
        return{
        'statusCode': 400,
        'body': "Error fetching the details"
        }    


