from datetime import datetime
import sqlite3


def user_exists(user_name):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    query = 'select exists(select 1 from user where user_name=?) limit 1'
    check = cur.execute(query, (user_name,))
    if check.fetchone()[0] == 0:
        con.close()
        return False
    con.close()
    return True


def create_user(user, password, email):
    if user_exists(user):
        return False
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    cur.execute(f'INSERT INTO user (user_name, password, email, created) VALUES (?, ?, ?, ?)',
                (user, password, email, datetime.now().strftime('%d.%m.%Y %H:%M:%S')))
    con.commit()
    con.close()
    return True


def get_password(user_name):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute('SELECT * from user where user_name = ? ;', (user_name,))
    password = cur.fetchall()[0][1]
    con.close()
    return password


def get_email(user_name):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute('SELECT * from user where user_name = ? ;', (user_name,))
    email = cur.fetchall()[0][2]
    con.close()
    return email


def note_exists(file_name):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    query = 'select exists(select 1 from notes where file_name=?) limit 1'
    check = cur.execute(query, (file_name,))
    if check.fetchone()[0] == 0:
        con.close()
        return False
    con.close()
    return True


def has_ownership(user_name, file_name):
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    query = 'select exists(select 1 from notes where user_name=? and file_name=?) limit 1'
    check = cur.execute(query, (user_name, file_name,))
    if check.fetchone()[0] == 0:
        con.close()
        return False
    con.close()
    return True


def get_users_notes(user_name):
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute('SELECT * from notes where user_name = ? ;', (user_name,))
    list = []
    data = cur.fetchall()
    for i in range(len(data)):
        list.append(data[i][1])
    con.close()
    return list


