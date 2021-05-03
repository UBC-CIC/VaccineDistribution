from logging import basicConfig, getLogger, INFO
from datetime import datetime
from connect_to_ledger import create_qldb_driver
# from sampledata.sample_data import get_document_ids, print_result
from constants import Constants

import json
from pyion2json import ion_cursor_to_json
from sampledata.sample_data import convert_object_to_ion, get_value_from_documentid
from create_index import create_index
from insert_document import insert_documents
from register_person import get_scentityid_from_personid, get_document_superadmin_approval_status, get_index_number


logger = getLogger(__name__)
basicConfig(level=INFO)


#create_vaccine_batch(product_id,batch --> batchSno.no.,qty, expiry date, 
#product_new_batch

def get_list_of_productids(transaction_executor,ManufacturerId):
    query = 'SELECT * FROM Products as p by id WHERE p.ManufacturerId = ?'
    cursor = transaction_executor.execute_statement(query,ManufacturerId)
    try:
        next(cursor)
        product_ids = list(map(lambda x: x.get('id'), cursor))
        print("product ids sold by {} are : {}".format(ManufacturerId,product_ids))
        return product_ids
    except StopIteration:
        print("No product ids formed!")
        return False

def product_exists(transaction_executor, product_id):
    query = 'SELECT * FROM Products as p by id WHERE id = ?'
    cursor = transaction_executor.execute_statement(query,product_id)
    try:
        next(cursor)
        print("Product exists!")
        return True
    except StopIteration:
        print("Product not found! Please check the id!!")
        return False

def person_authorized_to_create_product(transaction_executor,product_id,person_id):
    actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
    ManufacturerId = get_value_from_documentid(transaction_executor, Constants.PRODUCT_TABLE_NAME,product_id,"ManufacturerId")
    print("actual_id: {} and manufactuter id : {}".format(actual_scentity_id,ManufacturerId))

    if actual_scentity_id == ManufacturerId[0]:
        print("Authorized!!")
        return True
    else:
        print("Ids not matched!")
        return False


def create_batch_table(transaction_executor,product_id):
    table_name = "Batches" + product_id
    print("table_name for {} batches is {}".format(product_id,table_name))
    statement = 'CREATE TABLE {}'.format(table_name)
    print(statement)
    cursor = transaction_executor.execute_statement(statement)
    ret_val = list(map(lambda x: x.get('tableId'), cursor))
    ret_val = ret_val[0]
    print('Tabled Id is {}'.format(ret_val))
    create_index(transaction_executor,table_name,"BatchNo") #<<----------- this could be the problem
    return ret_val
    
def update_BatchTableId(transaction_executor,product_id,batch_table_id):
    update_statement = " UPDATE Products AS p BY id SET p.BatchTableId =? WHERE id = ?"
    cursor = transaction_executor.execute_statement(update_statement, batch_table_id, product_id)
    try:
        next(cursor)
    except:
        print(" Batch id couldn't be updated")


def batch_table_exist(transaction_executor, product_id):
    query = 'SELECT p.BatchTableId FROM Products as p by id WHERE id = ?'
    cursor = transaction_executor.execute_statement(query,product_id)
    ret_val = list(map(lambda x: x.get('BatchTableId'), cursor))
    ret_val = ret_val[0]
    print(ret_val)
    if len(ret_val) > 0:
        return ret_val
    else:
        return False


def get_tableName_from_tableId(transaction_executor, table_id):
    statement = 'SELECT name FROM information_schema.user_tables WHERE  tableId = ?' 
    cursor = transaction_executor.execute_statement(statement, table_id)
    ret_val = list(map(lambda x: x.get('name'), cursor))
    ret_val = ret_val[0]
    return ret_val



def generate_inventory( transaction_executor,product_id,batch):
    if batch_table_exist(transaction_executor,product_id):
        BatchTableId =batch_table_exist(transaction_executor,product_id)
        print("Batch Table Found : {}!".format(BatchTableId)) 
    else:
        
        BatchTableId = create_batch_table(transaction_executor,product_id)
        
        print("Batch Table was created with the id: {}".format(BatchTableId))
        update_BatchTableId(transaction_executor,product_id,BatchTableId)

    # get table name from table_id 
    batch_table_name = get_tableName_from_tableId(transaction_executor,BatchTableId)
    batch_num = get_index_number(transaction_executor,batch_table_name,"BatchNo")
    
    batch['BatchNo'] = batch_num
    batch['UnitsProduced'] = len(batch["ProductInstances"])
    print("BBBBBBBBBB")
    batch['UnitsRemaining'] = int(batch['UnitsProduced'])
    
    statement = 'INSERT INTO {} ?'.format(batch_table_name)
    cursor =  transaction_executor.execute_statement(statement,convert_object_to_ion(batch))
    
    try:
        next(cursor)
        print(" Vaccine Inventory was added.")
        return batch
    except StopIteration:
        print("Problem in generating Inventory.")


def create_product_batch(transaction_executor, person_id,product_id,batch):
    
    ##check if the ProductCode exists
    if product_exists(transaction_executor,product_id):
        
        ##check if the product is approved by superadmin
        if get_value_from_documentid(transaction_executor,Constants.PRODUCT_TABLE_NAME, product_id,"isApprovedBySuperAdmin"):
            ##check if the person_id is authorized to create the product
            if person_authorized_to_create_product(transaction_executor,product_id,person_id):
                print("AAAAAAAAAAAAA")
                newbatch = generate_inventory(transaction_executor,product_id,batch)
                print(" ================================== B A T C H =========== R E G I S T E R E D  ===============================")
                
                return{
                    'statusCode': 200,
                    'body': {
                        "ProductId":product_id,
                        "Batch":newbatch
                        }
                    }
            else:
                return_statement = "You don't have authority for this product!"
                return{
                    'statusCode': 400,
                    'body': return_statement
                    }
        else:
            return_statement = "Wait for product to be approved by SuperAdmin."
            return{
                    'statusCode': 400,
                    'body': return_statement
                    }
    else:
        return_statement = "Trouble finding product."
        return{
                    'statusCode': 400,
                    'body': return_statement
                    }
    

def get_batch_info(transaction_executor,person_id,product_id):
    
    if person_authorized_to_create_product(transaction_executor,product_id,person_id):
        batch_table_id = batch_table_exist(transaction_executor,product_id)
        if batch_table_id:
            batch_table_name = get_tableName_from_tableId(transaction_executor,batch_table_id)
            
            statement = "SELECT * FROM {}".format(batch_table_name)
            cursor = transaction_executor.execute_statement(statement)
            
            batches = ion_cursor_to_json(cursor)
            
            return{
            'statusCode': 200,
            'body': batches
            }
            
        else:
            return_statement = "No batch Table Found"
            return{
            'statusCode': 400,
            'body': return_statement
            }
    else:
        return_statement = "Not Authorized"
        return{
            'statusCode': 400,
            'body': return_statement
        }


   
#####################################################################################################################


def create_batch(event):
    try:
        with create_qldb_driver() as driver:
            
            batch = event["Batch"]

            person_id = event["PersonId"]
            product_id = event["ProductId"]
            return driver.execute_lambda(lambda executor: create_product_batch(executor, person_id,product_id, batch))
    except Exception:
        return_statement = 'Error creating inventories!'
        return{
        'statusCode': 400,
        'body': return_statement
        }

def get_all_product_batches(event):
    try:
        with create_qldb_driver() as driver:
            person_id = event["PersonId"]
            product_id = event["ProductId"]

            return driver.execute_lambda(lambda executor: get_batch_info(executor, person_id,product_id))
    except Exception:
        return_statement = 'Error fetching batches!'
        return{
        'statusCode': 400,
        'body': return_statement
        }
    
        
