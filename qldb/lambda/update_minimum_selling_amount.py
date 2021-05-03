from logging import basicConfig, getLogger, INFO
from connect_to_ledger import create_qldb_driver
from amazon.ion.simpleion import dumps, loads
logger = getLogger(__name__)
basicConfig(level=INFO)

from constants import Constants
from register_person import get_scentityid_from_personid
from accept_purchase_order import inventory_table_already_exist
from approve_delivery import product_exist_in_inventory, fetch_inventory_table
from sampledata.sample_data import update_document,get_document_ids

def update_price_and_minimum_selling_amount(transaction_executor, product_id, minimum_selling_amount,new_product_price,distributor_person_id):
    # check if person has scentity
    actual_sc_entity_id = get_scentityid_from_personid(transaction_executor, distributor_person_id)
    if actual_sc_entity_id:
        # check if sc entity has inventory table and product_id
        inventory_table = inventory_table_already_exist(transaction_executor,actual_sc_entity_id)
        if inventory_table:
            #check product exist with distributor
            if product_exist_in_inventory(transaction_executor,inventory_table[0],product_id):    
                ## minimum selling amount is in number of cases
                inventory_id =  next(get_document_ids(transaction_executor,inventory_table[0],"ProductId",product_id))
                update_document(transaction_executor,inventory_table[0],"ProductPrice",inventory_id, new_product_price)
                update_document(transaction_executor,inventory_table[0],"MinimumSellingAmount",inventory_id, minimum_selling_amount)
                total_inventory_table = fetch_inventory_table(transaction_executor,distributor_person_id)
                total_inventory_table = total_inventory_table["body"]["InventoryTable"]
                print(total_inventory_table)
                product_inventory = {}
                for inventory in  total_inventory_table:
                    if inventory["ProductId"] == product_id:
                        product_inventory = inventory
                        break
                    else:
                        continue
                message = "=================== P R I C E === A N D ==== S E L L I N G ++++ A M O U N T ======= U P D A T E D ========"
                return{
                    'statusCode': 200,
                    'body': {
                        "Message":message,
                        "Inventory": product_inventory
                        
                    }
                    
                }
            
            else:
                return_statement = "Product does not exist in inventory!"
                return{
                    'statusCode': 400,
                    'body': return_statement}
        else:
            return_statement = "No inventory table exist"
            return{
                'statusCode': 400,
                'body': return_statement}
    else:
        return_statement = "No SCentity for the person"
        return{
                'statusCode': 400,
                'body': return_statement}

#################################################################################

def set_price_and_min_selling_amount(event):
    try:
        with create_qldb_driver() as driver:
            
            productid = event["ProductId"]
            minimumsellingamount = event["MinimumSellingAmount"]       # in number of containers
            newproductprice = event["ProductPrice"]
            distributorpersonid = event["PersonId"]
            return driver.execute_lambda(lambda executor: update_price_and_minimum_selling_amount(executor,productid, minimumsellingamount,newproductprice,distributorpersonid))
    except Exception:
        return_statement = 'Error updating price and selling amount.'
        return{
                'statusCode': 400,
                'body': return_statement}