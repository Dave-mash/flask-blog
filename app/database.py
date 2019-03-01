import psycopg2
import os

class InitializeDb:
    """ This class sets up database connection and creates tables """

    def __init__(self, url):
        try:
            self.connection = psycopg2.connect(url)
            self.cursor = self.connection.cursor()
            print(f'A connection to {url} database was established!')
        except:
            print('A problem occured while connecting to the database')


    def create_tables(self):
        """ This method creates tables """

        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id serial PRIMARY KEY NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                image VARCHAR [],
                date_registered TIMESTAMP DEFAULT current_timestamp
            );
            CREATE TABLE IF NOT EXISTS posts(
                id serial PRIMARY KEY NOT NULL,
                author_id INT REFERENCES users(id)\
                ON UPDATE CASCADE ON DELETE CASCADE,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                created_on TIMESTAMP DEFAULT current_timestamp
            );
            CREATE TABLE IF NOT EXISTS comments(
                id serial PRIMARY KEY NOT NULL,
                user_id INT REFERENCES users(id)\
                ON UPDATE CASCADE ON DELETE CASCADE,
                post_id INT REFERENCES posts(id)\
                ON UPDATE CASCADE ON DELETE CASCADE,
                comment TEXT NOT NULL,
                created_on TIMESTAMP DEFAULT current_timestamp
            );
            """
        )

        self.connection.commit()

    
    def execute(self, query):
        """ This method saves values into the db """
        
        print(query)
        self.cursor.execute(query)
        self.connection.commit()
    
    
    def fetch_all(self, query):
        """ This method fetches all items """
        
        self.cursor.execute(query)
        return self.cursor.fetchall()
    
    
    def fetch_one(self, query):
        """ This method fetches a single item """
        
        self.cursor.execute(query)
        return self.cursor.fetchone()
    
    
    def update(self, query):
        """ This method executes update queries """
        print(query)
        self.cursor.execute(query)
        self.connection.commit()


    def drop_tables(self):
        """ This method drops all tables """
        
        self.cursor.execute("DROP TABLE IF EXISTS users, posts, comments CASCADE;")
        self.connection.commit()


# TIME
# from datetime import datetime

    # normal time --> timestamp
     # time = datetime.now()
     # datetime.timestamp(time)

    # timestamp --> normal time
     # timestamp = 34103718234.89098
     # time = datetime.fromtimestamp(timestamp)
 
