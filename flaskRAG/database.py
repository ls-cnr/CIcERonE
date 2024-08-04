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