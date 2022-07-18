from flask import Blueprint, render_template, redirect

edit_blueprint = Blueprint('edit_blueprint', __name__)


@edit_blueprint.route('/')
def edit():
    return redirect('/')


@edit_blueprint.route('/<file_name>')
def edit_file(file_name):
    return render_template("edit.html", file_name=file_name)
