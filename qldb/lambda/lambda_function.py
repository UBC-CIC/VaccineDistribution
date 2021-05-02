import json
from create_table import create_ledger_and_table
from connect_to_ledger import get_tables
from insert_document import insert_inital_documents
from register_person import register_new_user_and_scentity, get_person_details, get_your_scentity_details, get_all_scentity_details
from accept_requests_for_admin import get_all_mcg_requests, get_your_mcg_request, accept_mcg_request
from delete_requests_for_admin import delete_mcg_request
from accept_joining_request import get_joining_requests, get_your_joining_request,accept_joining_request
from create_product_batches import get_all_product_batches, create_batch
from register_product import register_new_product,get_all_products,get_your_products
from create_purchase_order_to_manufacturer import create_manufacturer_purchase_order, get_purchase_order, get_invoice,get_purchase_order_ids
from accept_purchase_order import accept_this_purchase_order
from initiate_shipment_manufacturer import initiate_shipment_for_manufacturer, get_container,get_details_from_container,get_pick_up_request
from create_iot import create_iot,get_iot,assign_iot_to_container
from export_transport_product import pick_up_for_export
from check_container_safety import check_container_safety
from export_customs_approval import approve_export
from approve_airwaybill_bol import approve_bill
from import_customs_approval import approve_import
from request_import_pickup import request_import_pickup
from import_transport_product import pick_up_for_import
from approve_delivery import approve_delivery, get_inventory_table
from update_minimum_selling_amount import set_price_and_min_selling_amount
from create_purchase_order_to_distributor import create_distributor_purchase_order
from initiate_shipment_distributor import initiate_shipment_for_distributor
from local_transport_product import local_transport



def lambda_handler(event, context):
    # TODO implement
    
    if event["Operation"] == "GET_TABLES":
        return(get_tables())
    
    ## make initial_document operation as secret KEY
    ## operation INSERT_INITIAL_DOCUMENTS must only be called by admin
    ## or we can insert intial documents through command line and remove this event all together
    elif event["Operation"] == "CREATE_LEDGER_AND_TABLES":
        return create_ledger_and_table()
    
    elif event["Operation"] == "INSERT_INITIAL_DOCUMENTS":
        return(insert_inital_documents())

################################################################################################
    
    elif event["Operation"] == "REGISTER_NEW_USER_AND_SCENTITY":
        return register_new_user_and_scentity(event)
        
    elif event["Operation"] == "GET_PERSON":
        return get_person_details(event)
        
    elif event["Operation"] == "GET_YOUR_SCENTITY":
        return get_your_scentity_details(event)
    
    elif event["Operation"] == "GET_ALL_SCENTITIES":
        return get_all_scentity_details()
        
################################################################################################    

    elif event["Operation"] == "GET_ALL_MCG_REQUESTS":
        return get_all_mcg_requests(event)
    
    elif event["Operation"] == "GET_YOUR_MCG_REQUEST":
        return get_your_mcg_request(event)
        
    elif event["Operation"] == "ACCEPT_MCG_REQUEST":
        return accept_mcg_request(event)
    
    elif event["Operation"] == "DELETE_MCG_REQUEST":
        return delete_mcg_request(event)

################################################################################################

    elif event["Operation"] == "GET_JOINING_REQUESTS":
        return get_joining_requests(event)
    
    elif event["Operation"] == "GET_YOUR_JOINING_REQUEST":
        return get_your_joining_request(event)

    elif event["Operation"] == "ACCEPT_JOINING_REQUEST":
        return accept_joining_request(event)

################################################################################################
    
    elif event["Operation"] == "REGISTER_NEW_PRODUCT":
        return register_new_product(event)
    
    elif event["Operation"] == "GET_ALL_PRODUCTS":
        return get_all_products()
    
    elif event["Operation"] == "GET_YOUR_PRODUCTS":
        return get_your_products(event)
################################################################################################

    elif event["Operation"] == "GET_ALL_PRODUCT_BATCHES":
        return get_all_product_batches(event)
    

    elif event["Operation"] == "CREATE_BATCH":
        return create_batch(event)

################################################################################################

    elif event["Operation"] == "CREATE_MANUFACTURER_PURCHASE_ORDER":
        return create_manufacturer_purchase_order(event)
    
    elif event["Operation"] == "GET_PURCHASE_ORDER_IDS":
        return get_purchase_order_ids(event)

    elif event["Operation"] == "GET_PURCHASE_ORDER":
        return get_purchase_order(event)

################################################################################################
    
    elif event["Operation"] == "ACCEPT_PURCHASE_ORDER":
        return accept_this_purchase_order(event)
        
    elif event["Operation"] == "GET_INVOICE":
        return get_invoice(event)

################################################################################################

    elif event["Operation"] == "INITIATE_SHIPMENT_FOR_MANUFACTURER":
        return initiate_shipment_for_manufacturer(event)
    
    elif event["Operation"] == "GET_CONTAINER":
        return get_container(event)
    
    elif event["Operation"] == "GET_CONTAINER_DETAILS":
        return get_details_from_container(event)
    
    elif event["Operation"] == "GET_PICK_UP_REQUEST":
        return get_pick_up_request(event)
################################################################################################

    elif event["Operation"] == "CREATE_IOT":
        return create_iot(event)

    elif event["Operation"] == "GET_IOT":
        return get_iot(event)
    
    elif event["Operation"] == "ASSIGN_IOT":
        return assign_iot_to_container(event)

################################################################################################
    
    elif event["Operation"] == "EXPORT_PICKUP":
        return pick_up_for_export(event)
        

################################################################################################
 
    elif event["Operation"] == "CHECK_CONTAINER_SAFETY":        
        return check_container_safety(event)
        
################################################################################################
 
    elif event["Operation"] == "APPROVE_EXPORT":        
        return approve_export(event)

################################################################################################

    elif event["Operation"] == "APPROVE_LADING_BILL":        
        return approve_bill(event)

################################################################################################

    elif event["Operation"] == "APPROVE_IMPORT":        
        return approve_import(event)

################################################################################################
    
    # '''
    # change import pickup can be called by the orderer to change the entity who will be picking up the order. It is mainly governed by negotiations of INCO TERMS
    # For the use case we will keep the import pickup unchanged - i.e. same carrier company will be tranporting the container from import airport to orderer's facility
    # '''
    
    elif event["Operation"] == "REQUEST_IMPORT_PICKUP":        
        return request_import_pickup(event)
    
    elif event["Operation"] == "IMPORT_PICKUP":        
        return pick_up_for_import(event)
    
################################################################################################
    
    elif event["Operation"] == "APPROVE_DELIVERY":        
        return approve_delivery(event)
    

    elif event["Operation"] == "GET_INVENTORY_TABLE": 
        return get_inventory_table(event)

    elif event["Operation"] == "SET_PRICE_AND_SELLING_AMOUNT":
        return set_price_and_min_selling_amount(event)

################################################################################################
    
    elif event["Operation"] == "CREATE_DISTRIBUTOR_PURCHASE_ORDER": 
        return create_distributor_purchase_order(event)

################################################################################################
    
    elif event["Operation"] == "INITIATE_SHIPMENT_FOR_DISTRIBUTOR": 
        return initiate_shipment_for_distributor(event)
    
################################################################################################
    elif event["Operation"] =="LOCAL_TRANSPORT":
        return local_transport(event)

    else:
         return{
            "statusCode": 400,
            "body": "Event Operation Unidentified!"
        }