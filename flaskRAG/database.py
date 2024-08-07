import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

load_dotenv()

def get_db_connection():
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD')
        )
        return connection
    except Error as e:
        print(f"Errore di connessione al database MySQL: {e}")
        return None

def get_mental_space_lattice(project_id):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = "SELECT mental_space_lattice FROM projects WHERE id = %s"
            cursor.execute(query, (project_id,))
            result = cursor.fetchone()
            if result:
                return result[0]
            else:
                return "empty mental space lattice"
        except Error as e:
            print(f"Errore nel recupero del mental space lattice: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    return "empty mental space lattice"

def update_mental_space_lattice(project_id, new_lattice):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = "UPDATE projects SET mental_space_lattice = %s WHERE id = %s"
            cursor.execute(query, (new_lattice, project_id))
            connection.commit()
            return True
        except Error as e:
            print(f"Errore nell'aggiornamento del mental space lattice: {e}")
            return False
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    return False

# Nuova funzione per ottenere l'analisi di un progetto
def get_project_analysis(project_id):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = "SELECT analysis FROM projects WHERE id = %s"
            cursor.execute(query, (project_id,))
            result = cursor.fetchone()
            if result:
                return result[0]
            else:
                return "Analysis not yet available"
        except Error as e:
            print(f"Errore nel recupero dell'analisi del progetto: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    return "Analysis not yet available"

# Nuova funzione per aggiornare l'analisi di un progetto
def update_project_analysis(project_id, new_analysis):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = "UPDATE projects SET analysis = %s WHERE id = %s"
            cursor.execute(query, (new_analysis, project_id))
            connection.commit()
            return True
        except Error as e:
            print(f"Errore nell'aggiornamento dell'analisi del progetto: {e}")
            return False
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    return False

# Nuova funzione per ottenere lo stato di generate_analysis
def get_generate_analysis_status(project_id):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = "SELECT generate_analysis FROM projects WHERE id = %s"
            cursor.execute(query, (project_id,))
            result = cursor.fetchone()
            if result is not None:
                return result[0]
            else:
                return False
        except Error as e:
            print(f"Errore nel recupero dello stato generate_analysis: {e}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    return False

# Nuova funzione per aggiornare lo stato di generate_analysis
def update_generate_analysis_status(project_id, status):
    connection = get_db_connection()
    if connection:
        try:
            cursor = connection.cursor()
            query = "UPDATE projects SET generate_analysis = %s WHERE id = %s"
            cursor.execute(query, (status, project_id))
            connection.commit()
            return True
        except Error as e:
            print(f"Errore nell'aggiornamento dello stato generate_analysis: {e}")
            return False
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()
    return False