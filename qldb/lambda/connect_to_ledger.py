from logging import basicConfig, getLogger, INFO
import json
from botocore.exceptions import ClientError

from pyqldb.driver.qldb_driver import QldbDriver
from constants import Constants

logger = getLogger(__name__)
basicConfig(level=INFO)

# qldb_driver = QldbDriver(Constants.LEDGER_NAME, region_name=None, endpoint_url=None, boto3_session=None)

def create_qldb_driver(ledger_name=Constants.LEDGER_NAME, region_name=None, endpoint_url=None, boto3_session=None):
    """
    Create a QLDB driver for executing transactions.
    :type ledger_name: str
    :param ledger_name: The QLDB ledger name.
    :type region_name: str
    :param region_name: See [1].
    :type endpoint_url: str
    :param endpoint_url: See [1].
    :type boto3_session: :py:class:`boto3.session.Session`
    :param boto3_session: The boto3 session to create the client with (see [1]).
    :rtype: :py:class:`pyqldb.driver.qldb_driver.QldbDriver`
    :return: A QLDB driver object.
    [1]: `Boto3 Session.client Reference <https://boto3.amazonaws.com/v1/documentation/api/latest/reference/core/session.html#boto3.session.Session.client>`.
    """
    qldb_driver = QldbDriver(ledger_name=ledger_name, region_name=region_name, endpoint_url=endpoint_url,
                             boto3_session=boto3_session)
    return qldb_driver


def get_table_list(transaction_executor):
    """
    Connect to a given ledger using default settings.
    """
    statement = "SELECT name FROM information_schema.user_tables"
    cursor = transaction_executor.execute_statement(statement)
    
    try:
        table_list = {}
        i = 0
        for row in cursor:
            table_list[i] = row["name"]
            i = i+1
            
        return{
            'statusCode': 200,
            'body': json.dumps(table_list)}
        
    except ClientError:
        return{
            'statusCode': 400,
            'body': json.dumps("Error getting the table names")
        }


def get_tables():
    with create_qldb_driver() as driver:
        return_statement = driver.execute_lambda(lambda x: get_table_list(x))
        return return_statement
    
##########################


