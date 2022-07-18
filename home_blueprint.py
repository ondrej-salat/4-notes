import random
import sqlite3

from flask import Blueprint, session, redirect, request, render_template

login_blueprint = Blueprint('login_blueprint', __name__)


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


@login_blueprint.route('/')
@login_blueprint.route('/home')
def home():
    if len(session) == 0:
        return render_template("home_not_logged.html")
    user_id = convert_to_id(session["email"])
    if not is_in_db(user_id):
        con = sqlite3.connect('data.db')
        cur = con.cursor()
        cur.execute(f'INSERT INTO users (ID, EMAIL) VALUES (?, ?)', (user_id, session["email"]))
        con.commit()
        con.close()

    return render_template("home_logged.html", email=session["email"], name=session["name"])
