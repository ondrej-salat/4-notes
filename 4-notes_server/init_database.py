import sqlite3

con = sqlite3.connect('database.db')
cur = con.cursor()

cur.execute(
    '''CREATE TABLE user (user_name TEXT NOT NULL UNIQUE PRIMARY KEY ,password TEXT NOT NULL,email TEXT NOT NULL UNIQUE, created TEXT NOT NULL);''')

cur.execute('''CREATE TABLE notes (user_name TEXT NOT NULL ,file_name TEXT NOT NULL);''')

con.commit()
