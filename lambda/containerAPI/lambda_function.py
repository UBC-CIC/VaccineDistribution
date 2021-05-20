import json
import collections
from pyqldb.driver.qldb_driver import QldbDriver

print("Initializing the driver")
qldb_driver = QldbDriver("usama-qldb")


############### CRUD Functions on QLDB ####################### 
def insert_documents(transaction_executor, arg_1):
    print("Inserting a document")
    transaction_executor.execute_statement("INSERT INTO Container ?", arg_1)


def read_documents(transaction_executor, Cont_ID):
    print("Reading a document")
    cursor = transaction_executor.execute_statement("SELECT * FROM Container WHERE Cont_ID = ?", Cont_ID)
    
    response = {}
    for doc in cursor:
        response["Cont_ID"] = doc["Cont_ID"]
        response["containerType"] = doc["containerType"]
        response["containerName"] = doc["containerName"]
        response["isContainerSafe"] = doc["isContainerSafe"]
    return response
    
    

def update_documents(transaction_executor, containerID, isContainerSafe):
    print("Updating a document")
    transaction_executor.execute_statement("UPDATE Container SET isContainerSafe = ? WHERE Cont_ID = ?", isContainerSafe, containerID)
    
def delete_documents(transaction_executor, containerID):
    print("Deleting a document")
    transaction_executor.execute_statement("DELETE FROM Container WHERE Cont_ID = ?", containerID)

def read_allDocuments(transaction_executor):
    print("Reading a document")
    cursor = transaction_executor.execute_statement("SELECT * FROM Container")
    
    response = {}
    responseFinal = []
    for doc in cursor:
        response = collections.OrderedDict()
        response["Cont_ID"] = doc["Cont_ID"]
        response["containerType"] = doc["containerType"]
        response["containerName"] = doc["containerName"]
        response["isContainerSafe"] = doc["isContainerSafe"]
        responseFinal.append(response)
    return responseFinal
    
############### REST API Functions ###################################
def createContainer(event):
    #testResponse = event['body']
    #array = '{"fruits": ["apple", "banana", "orange"]}'
    #data  = json.loads(testResponse)
    #data['Vac_ID']
    
    containerID = event['Cont_ID']
    containerType = event['containerType']
    containerName = event['containerName']
    isContainerSafe = event['isContainerSafe']
  
    # Insert a vaccine
    containerDetails = { 'Cont_ID': containerID,
        'containerType': containerType,
        'containerName': containerName,
        'isContainerSafe': isContainerSafe
        }
        
    try:
        qldb_driver.execute_lambda(lambda x: insert_documents(x, containerDetails))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Container successfully created')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error saving the Container")
        }
        
def getContainer(event):
    #1. Parse out query string params
    containerID = int(event['Cont_ID'])
    try:
       
        # Query the table
        tableResponse = qldb_driver.execute_lambda(lambda x: read_documents(x, containerID))
    
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
            'body': json.dumps("Error getting the container")
        }
        
def updateContainer(event):
    
    #testResponse = event['body']
    #array = '{"fruits": ["apple", "banana", "orange"]}'
    #data  = json.loads(testResponse)
    #data['Vac_ID']
    
    containerID = event['Cont_ID']
    isContainerSafe = event['isContainerSafe']
    try:
        
        qldb_driver.execute_lambda(lambda x: update_documents(x, containerID, isContainerSafe))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Container updated successfully')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error updating the container")
        }
        
def deleteContainer(event):
    containerID = int(event['Cont_ID'])
    try:
        
        qldb_driver.execute_lambda(lambda x: delete_documents(x, containerID))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Container deleted successfully')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error deleting the container")
        }
        

def getAllContainer():
    
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
            'body': json.dumps("Error getting the container")
        }
############# Lambda Handler function ##########################
def lambda_handler(event, context):
    if(event['Operation'] == 'POST'):
        return createContainer(event)
    
    elif(event['Operation'] == 'GET'):
        #vaccineID = event['Vac_ID']
        #vaccineID = int(event['queryStringParameters']['Vac_ID'])
        return getContainer(event)
    
    elif(event['Operation'] == 'PUT'):
        return updateContainer(event)
    
    elif(event['Operation'] == 'DELETE'):
        return deleteContainer(event) 
        
    elif(event['Operation'] == 'GET_CONTAINER'):
        #vaccineID = event['Vac_ID']
        #vaccineID = int(event['queryStringParameters']['Vac_ID'])
        return getAllContainer()
        
    else:
        return{
            'statusCode': 400,
            'body': json.dumps('Conatiner creation failed')
        }
    
    
