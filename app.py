from flask import Flask, render_template, session, redirect, request, abort
from edit_blueprint import edit_blueprint
from home_blueprint import login_blueprint
import os
import pathlib
import requests
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
from pip._vendor import cachecontrol
import google.auth.transport.requests
import sqlite3
import secrets

app = Flask(__name__)
app.register_blueprint(login_blueprint, url_prefix="/")
app.register_blueprint(edit_blueprint, url_prefix="/edit")

app.secret_key = secrets.token_hex(16)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

with open("client_id.txt", "r") as file:
    data = file.read()

GOOGLE_CLIENT_ID = data
client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

flow = Flow.from_client_secrets_file(
    client_secrets_file=client_secrets_file,
    scopes=["openid", "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile"],
    redirect_uri="http://127.0.0.1:5000/callback")


def is_logged_in():
    if len(session) == 0:
        return True
    return False


@app.route("/login")
def login():
    authorization_url, state = flow.authorization_url()
    session["state"] = state
    return redirect(authorization_url)


@app.route("/callback")
def callback():
    flow.fetch_token(authorization_response=request.url)
    if not session["state"] == request.args["state"]:
        abort(500)
    credentials = flow.credentials
    request_session = requests.session()
    cached_session = cachecontrol.CacheControl(request_session)
    token_request = google.auth.transport.requests.Request(session=cached_session)
    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=GOOGLE_CLIENT_ID
    )

    session["google_id"] = id_info.get("sub")
    session["name"] = id_info.get("name")
    session["email"] = id_info.get("email")
    return redirect("/home")


@app.route("/logout")
def logout():
    session.clear()
    return redirect("/")


if __name__ == '__main__':
    app.run()
