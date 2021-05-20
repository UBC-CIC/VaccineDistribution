from logging import basicConfig, getLogger, INFO

from constants import Constants
from create_ledger import create_mcg_ledger
from connect_to_ledger import create_qldb_driver

logger = getLogger(__name__)
basicConfig(level=INFO)


def create_table(transaction_executor, table_name):
    """
    Create a table with the specified name using an Executor object.
    :type transaction_executor: :py:class:`pyqldb.execution.executor.Executor`
    :param transaction_executor: An Executor object allowing for execution of statements within a transaction.
    :type table_name: str
    :param table_name: Name of the table to create.
    :rtype: int
    :return: The number of changes to the database.
    """
    logger.info("Creating the '{}' table...".format(table_name))
    statement = 'CREATE TABLE {}'.format(table_name)
    cursor = transaction_executor.execute_statement(statement)
    logger.info('{} table created successfully.'.format(table_name))
    return len(list(cursor))


def create_ledger_and_table():
    """
    Create registrations, vehicles, owners, and licenses tables in a single transaction.
    """
    create_mcg_ledger()
    try:
        with create_qldb_driver() as qldb_driver:
            qldb_driver.execute_lambda(lambda x: create_table(x, Constants.SCENTITY_TABLE_NAME) and
                                   create_table(x, Constants.PERSON_TABLE_NAME) and
                                   create_table(x, Constants.JOINING_REQUEST_TABLE_NAME) and
                                   create_table(x,Constants.SUPERADMIN_REQUEST_TABLE_NAME) and
                                   create_table(x,Constants.PURCHASE_ORDER_TABLE_NAME) and
                                   create_table(x,Constants.INVOICE_TABLE_NAME) and
                                   create_table(x,Constants.CONTAINER_TABLE_NAME) and
                                   create_table(x,Constants.IOT_TABLE_NAME) and
                                   create_table(x,Constants.CERTIFICATE_OF_ORIGIN_TABLE_NAME) and
                                   create_table(x,Constants.LORRY_RECEIPT_TABLE_NAME) and
                                   create_table(x,Constants.AIRWAY_BILL_TABLE_NAME) and
                                   create_table(x,Constants.BILL_OF_LADING_TABLE_NAME) and
                                   create_table(x,Constants.PALLETE_TABLE_NAME) and
                                   create_table(x,Constants.CASES_TABLE_NAME) and
                                   create_table(x,Constants.PACKING_LIST_TABLE_NAME)and
                                   create_table(x,Constants.PICK_UP_REQUESTS_TABLE) and 
                                   create_table(x,Constants.PRODUCT_TABLE_NAME),
                                   lambda retry_attempt: print('Retrying due to OCC conflict...'))
            print('============== T A B L E S ========= C R E A T E D ==================')
    except Exception:
        print('Errors creating tables.')