import sqlite3

from flask import Blueprint, session, redirect, request, render_template

login_blueprint = Blueprint('login_blueprint', __name__)


def insert_user(user_id, email, name):
    con = sqlite3.connect('data.db')
    cur = con.cursor()
    cur.execute(f'INSERT INTO users (ID, EMAIL, NAME) VALUES (?, ?, ?)',
                (user_id, email, name))
    con.commit()
    con.close()


def user_notes(user_id):
    user_files = []
    con = sqlite3.connect('data.db')
    cur = con.cursor()
    cur.execute(f'SELECT FILE_NAME, CREATED, SUBJECT FROM notes where USER_ID=?', (user_id,))
    f = cur.fetchall()
    for i in range(0, len(f)):
        user_files.append(f[i])
    return user_files


def convert_to_id(email):
    values = 0
    salt = ord(email[2])
    for i in range(0, len(email)):
        values += ord(email[i]) + salt
    return values


def is_in_db(item):
    con = sqlite3.connect('data.db')
    cur = con.cursor()
    query = 'select exists(select 1 from users where ID=?) limit 1'
    check = cur.execute(query, (item,))
    if check.fetchone()[0] == 0:
        con.close()
        return False
    con.close()
    return True


@login_blueprint.route('/', methods=['POST', 'GET'])
@login_blueprint.route('/home', methods=['POST', 'GET'])
def home():
    if request.method == 'POST' and len(session) != 0:
        print(request.form.get("text"))
    if len(session) == 0:
        return render_template("home_not_logged.html")
    user_id = convert_to_id(session["email"])
    if not is_in_db(user_id):
        insert_user(user_id, session['email'], session['name'])

    return render_template("home_logged.html", email=session["email"], name=session["name"], notes=user_notes(user_id))
