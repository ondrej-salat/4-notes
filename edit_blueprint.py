from flask import Blueprint, render_template, redirect, request, session, flash
import sqlite3
from datetime import datetime

edit_blueprint = Blueprint('edit_blueprint', __name__)


def create_file(subject, filename):
    f = open(f'files/{filename}.txt', 'x')
    f.close()
    con = sqlite3.connect('data.db')
    cur = con.cursor()
    cur.execute(f'INSERT INTO notes (USER_ID, USER, FILE_NAME, CREATED, SUBJECT) VALUES (?, ?, ?, ?, ?)',
                (convert_to_id(session['email']), session['name'], filename, datetime.now(), subject))
    con.commit()
    con.close()


def read_txt(filename):
    with open(f'files/{filename}') as f:
        text = f.readlines()
    return text


def write_txt(filename, text):
    f = open(f"files/{filename}", "w")
    f.write(text)
    f.close()


def convert_to_id(email):
    values = 0
    salt = ord(email[2])
    for i in range(0, len(email)):
        values += ord(email[i]) + salt
    return values


def is_in_db(item):
    con = sqlite3.connect('data.db')
    cur = con.cursor()
    query = 'select exists(select 1 from notes where FILE_NAME=?) limit 1'
    check = cur.execute(query, (item,))
    if check.fetchone()[0] == 0:
        con.close()
        return False
    con.close()
    return True


@edit_blueprint.route('/')
def edit():
    return redirect('/')


@edit_blueprint.route('/<file_name>', methods=['POST', 'GET'])
def edit_file(file_name):
    if len(session) == 0:
        flash('not logged in')
        print('not logged in')
        return redirect('/')
    if not is_in_db(file_name):
        flash('file doesnt exist')
        print('file doesnt exist')
        return redirect('/')
    file_name += '.txt'
    if request.method == 'POST':
        text = request.form.get('text')
        write_txt(file_name, text)
    return render_template("edit.html", file_name=file_name, text=read_txt(file_name))


@edit_blueprint.route('/new/', methods=['POST', 'GET'])
def new_file():
    if len(session) == 0:
        flash('not logged in')
        print('not logged in')
        return redirect('/')
    args = request.args
    subject = args.get('subject')
    file_name = args.get('filename')
    if is_in_db(file_name):
        flash('file name already exists')
        print('file name already exists')
        return redirect('/')
    create_file(subject, file_name)
    return redirect(f'/edit/{file_name}')
