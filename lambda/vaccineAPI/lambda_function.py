import json
import collections
from pyqldb.driver.qldb_driver import QldbDriver

print("Initializing the driver")
qldb_driver = QldbDriver("usama-qldb")


############### CRUD Functions on QLDB ####################### 
def insert_documents(transaction_executor, arg_1):
    print("Inserting a document")
    transaction_executor.execute_statement("INSERT INTO Vaccine ?", arg_1)


def read_documents(transaction_executor, Vac_ID):
    print("Reading a document")
    cursor = transaction_executor.execute_statement("SELECT * FROM Vaccine WHERE Vac_ID = ?", Vac_ID)
    
    response = {}
    for doc in cursor:
        response["Vac_ID"] = doc["Vac_ID"]
        response["vaccineType"] = doc["vaccineType"]
        response["vaccineName"] = doc["vaccineName"]
        response["isVaccineSafe"] = doc["isVaccineSafe"]
    return response
    
    

def update_documents(transaction_executor, vaccineID, isVaccineSafe):
    print("Updating a document")
    transaction_executor.execute_statement("UPDATE Vaccine SET isVaccineSafe = ? WHERE Vac_ID = ?", isVaccineSafe, vaccineID)
    
def delete_documents(transaction_executor, vaccineID):
    print("Deleting a document")
    transaction_executor.execute_statement("DELETE FROM Vaccine WHERE Vac_ID = ?", vaccineID)

def read_allDocuments(transaction_executor):
    print("Reading a document")
    cursor = transaction_executor.execute_statement("SELECT * FROM Vaccine")
    
    response = {}
    responseFinal = []
    for doc in cursor:
        response = collections.OrderedDict()
        response["Vac_ID"] = doc["Vac_ID"]
        response["vaccineType"] = doc["vaccineType"]
        response["vaccineName"] = doc["vaccineName"]
        response["isVaccineSafe"] = doc["isVaccineSafe"]
        responseFinal.append(response)
    return responseFinal

############### REST API Functions ###################################
def createVaccine(event):
    #testResponse = event['body']
    #array = '{"fruits": ["apple", "banana", "orange"]}'
    #data  = json.loads(testResponse)
    #data['Vac_ID']
    
    vaccineID = event['Vac_ID']
    vaccineType = event['vaccineType']
    vaccineName = event['vaccineName']
    isVaccineSafe = event['isVaccineSafe']
  
    # Insert a vaccine
    vaccineDetails = { 'Vac_ID': vaccineID,
        'vaccineType': vaccineType,
        'vaccineName': vaccineName,
        'isVaccineSafe': isVaccineSafe
        }
        
    try:
        qldb_driver.execute_lambda(lambda x: insert_documents(x, vaccineDetails))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Vaccine successfully created')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error saving the vaccine")
        }
        
def getVaccine(event):
    #1. Parse out query string params
    vaccineID = int(event['Vac_ID'])
    try:
       
        # Query the table
        tableResponse = qldb_driver.execute_lambda(lambda x: read_documents(x, vaccineID))
    
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
            'body': json.dumps("Error getting the vaccine")
        }
        
def updateVaccine(event):
    
    #testResponse = event['body']
    #array = '{"fruits": ["apple", "banana", "orange"]}'
    #data  = json.loads(testResponse)
    #data['Vac_ID']
    
    vaccineID = event['Vac_ID']
    isVaccineSafe = event['isVaccineSafe']
    try:
        
        qldb_driver.execute_lambda(lambda x: update_documents(x, vaccineID, isVaccineSafe))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Vaccine updated successfully')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error updating the vaccine")
        }
        
def deleteVaccine(event):
    vaccineID = int(event['Vac_ID'])
    try:
        
        qldb_driver.execute_lambda(lambda x: delete_documents(x, vaccineID))
        # TODO implement
        return {
            'statusCode': 200,
            'body': json.dumps('Vaccine deleted successfully')
            }
    except:
        return{
            'statusCode': 400,
            'body': json.dumps("Error deleting the vaccine")
        }
        
def getAllVaccine():
    
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
            'body': json.dumps("Error getting the vaccine")
        }
############# Lambda Handler function ##########################
def lambda_handler(event, context):
    if(event['Operation'] == 'POST'):
        return createVaccine(event)
    
    elif(event['Operation'] == 'GET'):
        #vaccineID = event['Vac_ID']
        #vaccineID = int(event['queryStringParameters']['Vac_ID'])
        return getVaccine(event)
    
    elif(event['Operation'] == 'PUT'):
        return updateVaccine(event)
    
    elif(event['Operation'] == 'DELETE'):
        return deleteVaccine(event) 
        
    elif(event['Operation'] == 'GET_VACCINE'):
        #vaccineID = event['Vac_ID']
        #vaccineID = int(event['queryStringParameters']['Vac_ID'])
        return getAllVaccine()    
    else:
        return{
            'statusCode': 400,
            'body': json.dumps('Vaccine creation failed')
        }
    
    
