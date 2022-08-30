import os
from datetime import datetime
import sqlite3
import json


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


def create_user(user_name, password, email):
    if user_exists(user_name):
        return False
    if len(user_name) >= 20:
        return False
    if len(password) >= 200:
        return False
    if len(email) >= 50:
        return False
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    cur.execute(f'INSERT INTO user (user_name, password, email, created) VALUES (?, ?, ?, ?)',
                (user_name, password, email, datetime.now().strftime('%d.%m.%Y %H:%M:%S')))
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


def create_new_note(file_name, user_name, subject):
    if note_exists(user_name):
        return False
    con = sqlite3.connect('database.db')
    cur = con.cursor()
    cur.execute(f'INSERT INTO notes (user_name, file_name) VALUES (?, ?)',
                (user_name, file_name,))
    file = {
        "filename": f"{file_name}",
        "user": f"{user_name}",
        "subject": f"{subject}",
        "data": "",
        "date": f"{datetime.now().strftime('%d.%m.%Y %H:%M:%S')}"
    }
    json_object = json.dumps(file, indent=4)
    with open(f"files/{file_name}.json", "w") as outfile:
        outfile.write(json_object)
    con.commit()
    con.close()
    return True


def check_subject(subject):
    list = ['m', 'cj', 'aj', 'bi', 'z', 'd', 'zsv', 'fy', 'other']
    if subject in list:
        return True
    return False


def remove_note(file_name):
    if not note_exists(file_name):
        return False
    con = sqlite3.connect("database.db")
    cur = con.cursor()
    cur.execute('DELETE from notes where file_name = ? ;', (file_name,))
    con.commit()
    con.close()
    os.remove(f"files/{file_name}.json")
    return True


def update_note_data(file_name, text):
    with open(f"files/{file_name}.json") as f:
        data = json.load(f)
        data["data"] = text
        json.dump(data, open(f"files/{file_name}.json", "w"), indent=2)
