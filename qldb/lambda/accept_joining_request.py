from logging import basicConfig, getLogger, INFO
from datetime import datetime
from connect_to_ledger import create_qldb_driver
from sampledata.sample_data import get_document_ids, print_result, get_value_from_documentid, delete_document
from amazon.ion.simpleion import dumps, loads
from constants import Constants
import json
from pyion2json import ion_cursor_to_json

from register_person import get_scentityid_from_personid
from accept_requests_for_admin import person_is_superadmin

logger = getLogger(__name__)
basicConfig(level=INFO)



def approve_joining_request(transaction_executor, person_id,request_id):
    
    # check if request agrees with the id
    if request_exists(transaction_executor, request_id):
        # approve the request'
        logger.info(" Request exists.")
        sc_entity_id = get_value_from_documentid(transaction_executor,Constants.JOINING_REQUEST_TABLE_NAME,request_id,"ScEntityId")
        actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
        isAdmin = get_value_from_documentid(transaction_executor,Constants.PERSON_TABLE_NAME,person_id,"isAdmin")
        if sc_entity_id[0] == actual_scentity_id and isAdmin[0]:
            logger.info("Authorized!")
            if get_value_from_documentid(transaction_executor, Constants.JOINING_REQUEST_TABLE_NAME, request_id, 'isAccepted') == [1]: 
                return_statement = "Request Already accepted"
                return{
                'statusCode': 400,
                'body': return_statement}
            else:   
                update_statement = "UPDATE JoiningRequest AS j BY id SET j.isAccepted = true WHERE id = ?"
                transaction_executor.execute_statement(update_statement, request_id)
                
                sender_person_id = get_value_from_documentid(transaction_executor, Constants.JOINING_REQUEST_TABLE_NAME, request_id, 'SenderPersonId')
                sender_person_id = sender_person_id[0]
                scentity_id = get_value_from_documentid(transaction_executor, Constants.JOINING_REQUEST_TABLE_NAME, request_id, 'ScEntityId')
                join_person_to_company(transaction_executor, scentity_id[0], sender_person_id)
                print(" ================================== P E R S O N =========== A D D E D ===============================")

                return request_exists(transaction_executor, request_id)
        else:
            return_statement = ("Person not authorized")
            return{
                'statusCode': 400,
                'body': return_statement}
            
    else:
        return_statement = ("Request doesn't exist.")
        return{
                'statusCode': 400,
                'body': return_statement}
            
   
    
     
def join_person_to_company(transaction_executor, scentity_id, person_id):
        
    statement = 'FROM SCEntities AS s By id WHERE id = ? INSERT INTO s.PersonIds VALUE ?'
    cursor_two = transaction_executor.execute_statement(statement, scentity_id, person_id)
    
    try:
        next(cursor_two)
        logger.info("Person Joined to the SCentity")
        
    except StopIteration:
        return_statement = ("Person can't join.")
        return{
                'statusCode': 400,
                'body': return_statement}
        
    
def request_exists(transaction_executor, request_id):
    
    statement = " SELECT * FROM JoiningRequest as j BY JoiningRequestId WHERE JoiningRequestId = ?"
    try:
        cursor_one = transaction_executor.execute_statement(statement, request_id)
        request = ion_cursor_to_json(cursor_one)
        return{
        'statusCode': 200,
        'body': request}            
    except:
        return_statement = " Request with request id: {} does not exist.".format(request_id)
        return{
                    'statusCode': 400,
                    'body': return_statement}


def fetch_joining_requests(transaction_executor, person_id, sc_entity_id):
    
    actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
    isAdmin = get_value_from_documentid(transaction_executor,Constants.PERSON_TABLE_NAME,person_id,"isAdmin")
    if (actual_scentity_id == sc_entity_id and isAdmin[0])  or person_is_superadmin(transaction_executor,person_id):
        joining_requests = get_value_from_documentid(transaction_executor,Constants.SCENTITY_TABLE_NAME,sc_entity_id,"JoiningRequests")
        statement = 'SELECT * FROM {} as J By JoiningRequestId WHERE JoiningRequestId IN ?'.format(Constants.JOINING_REQUEST_TABLE_NAME)
        
        try:
            cursor = transaction_executor.execute_statement(statement, joining_requests[0])
            request = ion_cursor_to_json(cursor)
            return{
            'statusCode': 200,
            'body': request}        
            
        except:
            return_statement = ("Cannot find the requests!")
            return{
                    'statusCode': 400,
                    'body': return_statement}
    else:
        return_statement = ("Person not authorized.")
        return{
                'statusCode': 400,
                'body': return_statement}

def fetch_your_joining_request(transaction_executor, person_id):

    request_id = next(get_document_ids(transaction_executor,Constants.JOINING_REQUEST_TABLE_NAME,"SenderPersonId", person_id))
    
    if len(request_id)>0:
        return request_exists(transaction_executor,request_id)
    else:
        return_statement = "No Joining Request Found"
        return{
                'statusCode': 400,
                'body': return_statement}


##############################################################################################

def get_joining_requests(event):
    try:
        with create_qldb_driver() as driver:
            
            scentityid =event["ScEntityId"] 
            personid = event["PersonId"]      
  
            return driver.execute_lambda(lambda executor: fetch_joining_requests(executor,personid,scentityid))
    except Exception:
        return_statement = 'Error fetching the request!'
        return{
                'statusCode': 400,
                'body': return_statement}

def get_your_joining_request(event):
    try:
        with create_qldb_driver() as driver:
            
            personid = event["PersonId"]      
            return driver.execute_lambda(lambda executor: fetch_your_joining_request(executor,personid))
    except Exception:
        return_statement = 'Error fetching your request!'
        return{
                'statusCode': 400,
                'body': return_statement}


def accept_joining_request(event):
    try:
        with create_qldb_driver() as driver:
            
            requestid =event["JoiningRequestId"] 
            personid = event["PersonId"]      
  
            return driver.execute_lambda(lambda executor: approve_joining_request(executor,personid,requestid))
    except Exception:
        return_statement = 'Error accepting the request!'
        return{
                'statusCode': 400,
                'body': return_statement}