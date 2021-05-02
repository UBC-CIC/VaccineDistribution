from logging import basicConfig, getLogger, INFO

from constants import Constants
from connect_to_ledger import create_qldb_driver

logger = getLogger(__name__)
basicConfig(level=INFO)


def create_index(transaction_executor, table_name, index_attribute):
    """
    Create an index for a particular table.
    :type transaction_executor: :py:class:`pyqldb.execution.executor.Executor`
    :param transaction_executor: An Executor object allowing for execution of statements within a transaction.
    :type table_name: str
    :param table_name: Name of the table to add indexes for.
    :type index_attribute: str
    :param index_attribute: Index to create on a single attribute.
    :rtype: int
    :return: The number of changes to the database.
    """
    print("Creating index on '{}'...".format(index_attribute))
    statement = 'CREATE INDEX on {} ({})'.format(table_name, index_attribute)
    # print(statement)
    cursor = transaction_executor.execute_statement(statement)
    return len(list(cursor))

def create_mcg_indexes():
    """
    Create indexes on tables in a particular ledger.
    """
    print('Creating indexes on all tables in a single transaction...')
    try:
        with create_qldb_driver() as qldb_driver:
            qldb_driver.execute_lambda(lambda x: create_index(x, Constants.PERSON_TABLE_NAME,
                                                          Constants.PERSON_ID_INDEX_NAME)
                                        and create_index(x, Constants.SCENTITY_TABLE_NAME,
                                                    Constants.SCENTITY_ID_INDEX_NAME)
                                        and create_index(x,Constants.JOINING_REQUEST_TABLE_NAME,
                                                    Constants.JOINING_REQUESTID_INDEX_NAME)
                                        and create_index(x, Constants.SUPERADMIN_REQUEST_TABLE_NAME,
                                                    Constants.SUPERADMIN_REQUEST_INDEX_NAME)
                                        and create_index(x, Constants.PRODUCT_TABLE_NAME,
                                                    Constants.PRODUCT_ID_INDEX_NAME)
                                        and create_index(x, Constants.PURCHASE_ORDER_TABLE_NAME, 
                                                    Constants.PURCHASE_ORDER_ID_INDEX_NAME)
                                        and create_index(x, Constants.CONTAINER_TABLE_NAME,
                                                    Constants.CONATINER_INDEX_NAME)
                                        and create_index(x, Constants.PALLETE_TABLE_NAME,
                                                    Constants.PALLETE_INDEX_NAME)
                                        and create_index(x, Constants.CASES_TABLE_NAME,
                                                    Constants.CASES_INDEX_NAME)
                                        and create_index(x, Constants.IOT_TABLE_NAME,
                                                    Constants.IOT_INDEX_NAME)
                                        and create_index(x, Constants.AIRWAY_BILL_TABLE_NAME,
                                                    Constants.AIRWAY_BILL_INDEX_NAME)
                                        and create_index(x,Constants.BILL_OF_LADING_TABLE_NAME,
                                                    Constants.BILL_OF_LADING_INDEX_NAME)
                                        and create_index(x, Constants.LORRY_RECEIPT_TABLE_NAME,
                                                    Constants.LORRY_RECEIPT_INDEX_NAME)
                                        and create_index(x, Constants.PACKING_LIST_TABLE_NAME,
                                                    Constants.PACKING_LIST_INDEX_NAME)
                                        and create_index(x,Constants.CERTIFICATE_OF_ORIGIN_TABLE_NAME,
                                                    Constants.CERTIFICATE_OF_ORIGIN_INDEX_NAME)
                                        and create_index(x,Constants.PICK_UP_REQUESTS_TABLE,
                                                    Constants.PICK_UP_REQUESTS_INDEX_NAME)
                                        and create_index(x, Constants.INVOICE_TABLE_NAME,
                                                    Constants.INVOICE_ID_INDEX_NAME), 
                                        lambda retry_attempt: print('Retrying due to OCC conflict...'))
            print(" ================================== I N D E X E S  =========== C R E A T E D ===============================")
    except Exception:
        raise Exception('Unable to create indexes.')