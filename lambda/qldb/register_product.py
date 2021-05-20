from logging import basicConfig, getLogger, INFO
from datetime import datetime
from connect_to_ledger import create_qldb_driver
from sampledata.sample_data import get_document_ids, print_result
from constants import Constants
import json
from pyion2json  import ion_cursor_to_json
from sampledata.sample_data import convert_object_to_ion,print_result,get_document_ids,get_document
from insert_document import insert_documents
from register_person import get_scentityid_from_personid, create_mcg_request, get_document_superadmin_approval_status

logger = getLogger(__name__)
basicConfig(level=INFO)


    # logger.info('Entity with id : {} is not approved by')
    ## in case of vaccine it is GTIN Containing NDC_Code

def product_exist(transaction_executor, ProductCode):


    query = 'SELECT * FROM Products as pr WHERE pr.ProductCode = ?'
    cursor1 = transaction_executor.execute_statement(query,convert_object_to_ion(ProductCode))
    try:
        next(cursor1)
        logger.info("Product with produce_code : {} has already been registered or in process of registeration".format(ProductCode))
        return True
    except:
        return False

def check_products_per_container_and_selling_amount(transaction_executor, Product):
    products_per_container = Product["ProductsPerContainer"]
    cases_per_container = Constants.PALLETS_PER_CONTAINER * Constants.CASES_PER_PALLETE
    minimum_selling_amount = Product["MinimumSellingAmount"]
    if products_per_container%cases_per_container == 0 and minimum_selling_amount > 0:
        return True
    else:
        logger.info("Invalind ProductsPerContainer! Make it multple of : {}".format(cases_per_container))
        return False

def register_product(transaction_executor, product,person_id):
    ## check if the vaccine with GTIN already exist 
    # scentity_id = get_scentityid_from_personid(transaction_executor,person_id)

    logger.info("Person_id: {}".format(person_id))
    actual_scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
    if actual_scentity_id:
        product.update({'ManufacturerId':actual_scentity_id})
        if get_document_superadmin_approval_status(transaction_executor,Constants.SCENTITY_TABLE_NAME,actual_scentity_id):
            logger.info("Entity is Approved to register product!")

            ProductCode = product["ProductCode"]
            if product_exist(transaction_executor, ProductCode):
                return_statement = " Product already exists."
                return{
                'statusCode': 400,
                'body': return_statement}
                
            elif check_products_per_container_and_selling_amount(transaction_executor,product):
                    result = insert_documents(transaction_executor, Constants.PRODUCT_TABLE_NAME, [product])
                    product_id = result[0]
                    product_request_id = create_mcg_request(transaction_executor,product_id, person_id,2)
                    logger.info("Request was created for product Id : {} with product request id {}".format(product_id, product_request_id))
                    logger.info(" ================================== P R O D U C T =========== R E G I S T R A T I O N ========== B E G A N=====================")
                    product["ProductId"] = product_id
                    
                    return{
                            'statusCode': 200,
                            'body': {
                                "Product": product,
                                "McgRequestId":product_request_id
                            }}
            else:
                return_statement = "It should be in multiple of {}".format(Constants.PALLETS_PER_CONTAINER * Constants.CASES_PER_PALLETE)
                return{
                        'statusCode': 400,
                        'body': return_statement}            
        else:
            return_statement = "Entity not approved yet. Cannot register the product"
            return{
                'statusCode': 400,
                'body': return_statement}

    else:
        return_statement = ("Person doesn't belong to any entity. First Register person with an Entity")
        return{
                    'statusCode': 400,
                    'body': return_statement}
                    

def fetch_all_products(transaction_executor):
    statement = 'SELECT * FROM {} by ProductId'.format(Constants.PRODUCT_TABLE_NAME)
    cursor = transaction_executor.execute_statement(statement)

    # print(products)
    # print_result(cursor)
    try:

        products = ion_cursor_to_json(cursor)
        if (len(products)) > 0:
            return{
                'statusCode': 200,
                'body': products}
        else:
            raise Exception("")
    except:
        return_statement = "No Products Registered into the system yet."
        return{
                    'statusCode': 400,
                    'body': return_statement}

def fetch_your_product(transaction_executor,person_id):
    scentity_id = get_scentityid_from_personid(transaction_executor,person_id)
    product_ids = get_document_ids(transaction_executor,Constants.PRODUCT_TABLE_NAME,"ManufacturerId",scentity_id)
    
    statement = 'SELECT * FROM {} as P by ProductId where ProductId IN ?'.format(Constants.PRODUCT_TABLE_NAME)
    try:
        if (len(product_ids)) > 0:
            cursor = transaction_executor.execute_statement(statement,product_ids)
            products = ion_cursor_to_json(cursor)
            return{
                'statusCode': 200,
                'body': products}
        else:
            raise Exception("")
    except:
        return_statement = "No products registerd"
        return{
                    'statusCode': 400,
                    'body': return_statement}
        
    
    
        


######################################################################################


def register_new_product(event):

    try:
        with create_qldb_driver() as driver:
            new_product = event["Product"]
            person_id = event["PersonId"]
            
            return driver.execute_lambda(lambda executor: register_product(executor, new_product, person_id))
    except Exception:
        return_statement = ('Error registering product.')
        return{
                'statusCode': 400,
                'body': return_statement}

def get_all_products():

    try:
        with create_qldb_driver() as driver:
            return driver.execute_lambda(lambda executor: fetch_all_products(executor))
    except Exception:
        return_statement = 'Error fetching products.'
        return{
                'statusCode': 400,
                'body': return_statement}

def get_your_products(event):
    person_id = event["PersonId"]
    try:
        with create_qldb_driver() as driver:
            return driver.execute_lambda(lambda executor: fetch_your_product(executor,person_id))
    except Exception:
        return_statement = 'Error fetching products.'
        return{
                'statusCode': 400,
                'body': return_statement}