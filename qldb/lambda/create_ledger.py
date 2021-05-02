from logging import basicConfig, getLogger, INFO
from time import sleep

from boto3 import client

from constants import Constants

logger = getLogger(__name__)
basicConfig(level=INFO)
qldb_client = client('qldb')

LEDGER_CREATION_POLL_PERIOD_SEC = 10
ACTIVE_STATE = "ACTIVE"


def create_ledger(name):
    """
    Create a new ledger with the specified name.
    :type name: str
    :param name: Name for the ledger to be created.
    :rtype: dict
    :return: Result from the request.
    """
    logger.info("Let's create the ledger named: {}...".format(name))
    result = qldb_client.create_ledger(Name=name, PermissionsMode='ALLOW_ALL')
    logger.info('Success. Ledger state: {}.'.format(result.get('State')))
    return result


def wait_for_active(name):
    """
    Wait for the newly created ledger to become active.
    :type name: str
    :param name: The ledger to check on.
    :rtype: dict
    :return: Result from the request.
    """
    logger.info('Waiting for ledger to become active...')
    while True:
        result = qldb_client.describe_ledger(Name=name)
        if result.get('State') == ACTIVE_STATE:
            logger.info('=============== L E D G E R ======== A C T I V E =================')
            return result
        logger.info('The ledger is still creating. Please wait...')
        sleep(LEDGER_CREATION_POLL_PERIOD_SEC)


def create_mcg_ledger():
    """
    Create a ledger and wait for it to be active.
    """
    try:
        create_ledger(Constants.LEDGER_NAME)
        wait_for_active(Constants.LEDGER_NAME)
    except Exception as e:
        print('Unable to create the ledger!')
        raise e