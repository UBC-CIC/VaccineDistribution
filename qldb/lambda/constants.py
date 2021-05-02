class Constants:
    """
    Constant values used throughout this tutorial.
    """
    LEDGER_NAME = "MCG-TEST"
    PERSON_TABLE_NAME = "Persons"
    SCENTITY_TABLE_NAME = " SCEntities"
    JOINING_REQUEST_TABLE_NAME = "JoiningRequest"
    SUPERADMIN_REQUEST_TABLE_NAME = "McgRequests" 
    PRODUCT_TABLE_NAME = "Products"
    PURCHASE_ORDER_TABLE_NAME = "PurchaseOrders"
    
    INVOICE_TABLE_NAME = "Invoices"
    CERTIFICATE_OF_ORIGIN_TABLE_NAME = "CertificateOfOrigins"
    PICK_UP_REQUESTS_TABLE = "PickUpRequests"
    LORRY_RECEIPT_TABLE_NAME = "LorryReciepts"
    PACKING_LIST_TABLE_NAME = "PackingLists"
    AIRWAY_BILL_TABLE_NAME = "AirwayBills"
    BILL_OF_LADING_TABLE_NAME = "BillOfLadings"
    CONTAINER_TABLE_NAME = "Containers"
    IOT_TABLE_NAME = 'IoTs'
    CASES_TABLE_NAME = 'Cases'
    PALLETE_TABLE_NAME = 'Palletes'

       
    PERSON_ID_INDEX_NAME ="EmployeeId"
    SCENTITY_ID_INDEX_NAME = "ScentityIdentificationCode"
    JOINING_REQUESTID_INDEX_NAME = "JoiningRequestNumber" #create these indexes in the code
    SUPERADMIN_REQUEST_INDEX_NAME = "McgRequestNumber"  #create theses indexes in the code
    PRODUCT_ID_INDEX_NAME = "ProductNumber"  
    PURCHASE_ORDER_ID_INDEX_NAME = 'PurchaseOrderNumber'
    INVOICE_ID_INDEX_NAME = "InvoiceNumber"
    CERTIFICATE_OF_ORIGIN_INDEX_NAME = "CertificateOfOriginNumber"
    LORRY_RECEIPT_INDEX_NAME = "LorryRecieptNumber"
    AIRWAY_BILL_INDEX_NAME = "AirwayBillNumber"
    BILL_OF_LADING_INDEX_NAME = "BillOfLadingNumber"
    CONATINER_INDEX_NAME = "ContainerNumber"
    IOT_INDEX_NAME = "IoTNumber"
    CASES_INDEX_NAME = "CaseNumber"
    PALLETE_INDEX_NAME = "PalleteNumber"
    PACKING_LIST_INDEX_NAME = "PackingListNumber"
    PICK_UP_REQUESTS_INDEX_NAME = "PickUpRequestNumber"

    PALLETS_PER_CONTAINER = 2
    CASES_PER_PALLETE = 5
    # JOURNAL_EXPORT_S3_BUCKET_NAME_PREFIX = "qldb-tutorial-journal-export"
    # USER_TABLES = "information_schema.user_tables"
    # S3_BUCKET_ARN_TEMPLATE = "arn:aws:s3:::"
    # LEDGER_NAME_WITH_TAGS = "tags"

    RETRY_LIMIT = 4