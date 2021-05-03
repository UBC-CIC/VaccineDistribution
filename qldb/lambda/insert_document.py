from logging import basicConfig, getLogger, INFO
import json
from threading import Timer
from constants import Constants
from sampledata.sample_data import convert_object_to_ion, SampleData, get_document_ids_from_dml_results
from create_ledger import create_mcg_ledger
from connect_to_ledger import create_qldb_driver
from create_index import create_mcg_indexes, create_index

logger = getLogger(__name__)
basicConfig(level=INFO)





def update_person_id(document_id):
    """
    Update the PersonId value for DriversLicense records and the PrimaryOwner value for VehicleRegistration records.
    :type document_ids: list
    :param document_ids: List of document IDs.
    :rtype: list
    :return: Lists of updated DriversLicense records and updated VehicleRegistration records.
    """
    new_sc_entity = SampleData.SCENTITY.copy()
   
    new_sc_entity[0]["PersonIds"].append(document_id)
    # logger.info(new_sc_entity)
    return new_sc_entity

def insert_documents(transaction_executor, table_name, documents):
    """
    Insert the given list of documents into a table in a single transaction.
    :type transaction_executor: :py:class:`pyqldb.execution.executor.Executor`
    :param transaction_executor: An Executor object allowing for execution of statements within a transaction.
    :type table_name: str
    :param table_name: Name of the table to insert documents into.
    :type documents: list
    :param documents: List of documents to insert.
    :rtype: list
    :return: List of documents IDs for the newly inserted documents.
    """
    # logger.info('Inserting some documents in the {} table...'.format(table_name))
    statement = 'INSERT INTO {} ?'.format(table_name)
    cursor = transaction_executor.execute_statement(statement, convert_object_to_ion(documents))
    list_of_document_ids = get_document_ids_from_dml_results(cursor)
    
    return list_of_document_ids


def update_and_insert_documents(transaction_executor):
    """
    Handle the insertion of documents and updating PersonIds all in a single transaction.
    :type transaction_executor: :py:class:`pyqldb.execution.executor.Executor`
    :param transaction_executor: An Executor object allowing for execution of statements within a transaction.
    """
    admin_id = insert_documents(transaction_executor, Constants.PERSON_TABLE_NAME, SampleData.PERSON)

    logger.info("Updating PersonIds for 'SCENTITY' ...")
    new_sc_entity = update_person_id(admin_id[0])

    mcg_id = insert_documents(transaction_executor, Constants.SCENTITY_TABLE_NAME, new_sc_entity)

    return{
    'statusCode': 200,
    'body': {
        "AdminPersonId" : admin_id,
        "McgScEntityId": mcg_id
        }
    }


def insert_inital_documents():
    """
    Insert documents into a table in a QLDB ledger.
    """
    
    
    try:
        # create the mcg ledger
        # create the indexes
        create_mcg_indexes()
        
        with create_qldb_driver() as driver:
            # An INSERT statement creates the initial revision of a document with a version number of zero.
            # QLDB also assigns a unique document identifier in GUID format as part of the metadata.
            return_statement = driver.execute_lambda(lambda executor: update_and_insert_documents(executor),
                                  lambda retry_attempt: logger.info('Retrying due to OCC conflict...'))
            logger.info('Documents inserted successfully!')
            return return_statement
    except Exception:
        return{
        'statusCode': 400,
        'body': "Error inserting initial documents"
        }