import json
import collections
from pyqldb.driver.qldb_driver import QldbDriver

print("Initializing the driver")
qldb_driver = QldbDriver("usama-qldb")


############### CRUD Functions on QLDB ####################### 
def insert_documents(transaction_executor, arg_1):
    print("Inserting a document")
    transaction_executor.execute_statement("INSERT INTO Company ?", arg_1)


def read_documents(transaction_executor, Comp_ID):
    print("Reading a document")
    cursor = transaction_executor.execute_statement("SELECT * FROM Company WHERE Comp_ID = ?", Comp_ID)
    
    response = {}
    for doc in cursor:
        response["Comp_ID"] = doc["Comp_ID"]
        response["companyType"] = doc["companyType"]
        response["companyName"] = doc["companyName"]
        response["companyIC"] = doc["companyIC"]
        response["isCompanyRegistered"] = doc["isCompanyRegistered"]
    return response
    
    

def update_documents(transaction_executor, companyID, isCompanyRegistered):
    print("Updating a document")
    transaction_executor.execute_statement("UPDATE Company SET isCompanyRegistered = ? WHERE Comp_ID = ?", isCompanyRegistered, companyID)
    
def delete_documents(transaction_executor, companyID):
    print("Deleting a document")
    transaction_executor.execute_statement("DELETE FROM Company WHERE Comp_ID = ?", companyID)


def read_allDocuments(transaction_executor):
    print("Reading a document")
    cursor = transaction_executor.execute_statement("SELECT * FROM Company")
    
    response = {}
    responseFinal = []
    for doc in cursor:
        response = collections.OrderedDict()
        response["Comp_ID"] = doc["Comp_ID"]
        response["companyType"] = doc["companyType"]
        response["companyName"] = doc["companyName"]
        response["companyIC"] = doc["companyIC"]
        response["isCompanyRegistered"] = doc["isCompanyRegistered"]
        responseFinal.append(response)
    return responseFinal

############### REST API Functions ###################################
def createCompany(event):
    #testResponse = event['body']
    #array = '{"fruits": ["apple", "banana", "orange"]}'
    #data  = json.loads(testResponse)
    #data['Vac_ID']
    
    companyID = event['Comp_ID']
    companyType = event['companyType']
    companyName = event['companyName']
    companyIC = event['companyIC']
    isCompanyRegistered = event['isCompanyRegistered']
  
    # Insert a vaccine
    companyDetails = { 'Comp_ID': companyID,
        'companyType': companyType,
        'companyName': companyName,
        'companyIC': companyIC,
        'isCompanyRegistered': isCompanyRegistered
        }
        
    try:
        qldb_driver.execute_lambda(lambda x: insert_documents(x, companyDetails))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Company successfully created')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error saving the Company")
        }
        
def getCompany(event):
    #1. Parse out query string params
    companyID = int(event['Comp_ID'])
    try:
       
        # Query the table
        tableResponse = qldb_driver.execute_lambda(lambda x: read_documents(x, companyID))
    
        #tableResponse = {}
        #for table in qldb_driver.list_tables():
            #tableResponse["TableName"] = table
            #print(table)
        return{
            'statusCode': 200,
            'body': tableResponse
            }

    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error getting the Company")
        }
        
def updateCompany(event):
    
    #testResponse = event['body']
    #array = '{"fruits": ["apple", "banana", "orange"]}'
    #data  = json.loads(testResponse)
    #data['Vac_ID']
    
    companyID = event['Comp_ID']
    isCompanyRegistered = event['isCompanyRegistered']
    try:
        
        qldb_driver.execute_lambda(lambda x: update_documents(x, companyID, isCompanyRegistered))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Company updated successfully')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error updating the Company")
        }
        
def deleteCompany(event):
    companyID = int(event['Comp_ID'])
    try:
        
        qldb_driver.execute_lambda(lambda x: delete_documents(x, companyID))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Company deleted successfully')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error deleting the company")
        }
        
def getAllCompany():
    
    try:
       
        # Query the table
        
        tableResponse = qldb_driver.execute_lambda(lambda x: read_allDocuments(x))
    
        #tableResponse = {}
        #for table in qldb_driver.list_tables():
            #tableResponse["TableName"] = table
            #print(table)
        return{
            'statusCode': 200,
            'body': tableResponse
            }

    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error getting the Company")
        }
        

############# Lambda Handler function ##########################
def lambda_handler(event, context):
    if(event['Operation'] == 'POST'):
        return createCompany(event)
    
    elif(event['Operation'] == 'GET'):
        #vaccineID = event['Vac_ID']
        #vaccineID = int(event['queryStringParameters']['Vac_ID'])
        return getCompany(event)
    
    elif(event['Operation'] == 'PUT'):
        return updateCompany(event)
    
    elif(event['Operation'] == 'DELETE'):
        return deleteCompany(event) 
    
    elif(event['Operation'] == 'GET_COMPANY'):
        #vaccineID = event['Vac_ID']
        #vaccineID = int(event['queryStringParameters']['Vac_ID'])
        return getAllCompany()
        
    else:
        return{
            'statusCode': 400,
            'body': json.dumps('Company creation failed')
        }
    
    
