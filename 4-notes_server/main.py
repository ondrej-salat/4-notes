from fastapi import FastAPI, Request, HTTPException
import jwt
import hashlib
import secrets

from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from manage_data import *
from models import *

SECRET_KEY = "YOUR_FAST_API_SECRET_KEY"
ALGORITHM = "HS256"
PEPER = "SOME_PEPER"

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


def get_salt():
    return secrets.token_hex(8)


def hash_password(plain_text_password):
    salt = get_salt()
    password = (plain_text_password + salt + PEPER).encode('utf-8')
    hashed_password = hashlib.sha512(password).hexdigest()
    return f'{salt}${hashed_password}'


def verify_password(plain_text_password, hashed_password):
    salt = hashed_password.split("$")[0]
    password = (plain_text_password + salt + PEPER).encode('utf-8')
    new_hash = hashlib.sha512(password).hexdigest()
    return f'{salt}${new_hash}' == hashed_password


def get_token(req):
    try:
        token = req.headers["Authorization"].split()[1]
        return token
    except KeyError:
        return None


def authorize_token(token):
    data = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    if user_exists(data['username']):
        return True
    return False


@app.get('/note/{file_name}')
async def notes(req: Request, file_name: str):
    token = get_token(req)
    if token is None:
        return HTTPException(status_code=401, detail='no token found')
    if authorize_token(token):
        user_name = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)['username']
        if has_ownership(user_name, file_name):
            return json.load(open(f'files/{file_name}.json'))
    return HTTPException(status_code=401, detail='user is not authorized')


@app.get('/all_notes')
async def all_notes(req: Request):
    token = get_token(req)
    if token is None:
        return HTTPException(status_code=401, detail='no token found')
    if authorize_token(token):
        user_name = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)['username']
        user_files = get_users_notes(user_name)
        list = [{"len": len(user_files)}]
        for i in range(len(user_files)):
            list.append(json.load(open(f'files/{user_files[i]}.json')))
        return json.dumps(list, indent=4)
    return HTTPException(status_code=401, detail='user is not authorized')


@app.post('/login')
async def user_login(login_item: LoginItem):
    data = jsonable_encoder(login_item)
    if user_exists(data['username']):
        if verify_password(data['password'], get_password(data['username'])):
            payload = {'username': data['username'], 'email': get_email(data['username'])}
            encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
            return {"token": encoded_jwt}
    else:
        return {"message": "login failed"}


@app.post('/signup')
async def user_signup(signup_item: SignupItem):
    data = jsonable_encoder(signup_item)
    if create_user(data['username'], hash_password(data['password']), data['email']):
        payload = {'username': data['username'], 'email': data['email']}
        encoded_jwt = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        return {"token": encoded_jwt}
    return {"message": "Signup failed"}


@app.post('/update/{file_name}')
async def update_note(req: Request, update_item: UpdateItem, file_name):
    token = get_token(req)
    data = jsonable_encoder(update_item)['data']
    if token is None:
        return HTTPException(status_code=401, detail='no token found')
    if not note_exists(file_name):
        return HTTPException(status_code=406, detail='file does not exist')
    if not authorize_token(token):
        return HTTPException(status_code=401, detail='user is not authorized')
    user_name = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)['username']
    if not has_ownership(user_name, file_name):
        return HTTPException(status_code=401, detail='user is not authorized')
    update_note_data(file_name, data)
    return {"message": "update was successful"}


@app.post('/new/{file_name}')
async def new_note(req: Request, file_name, new_item: NewItem):
    token = get_token(req)
    if token is None:
        return HTTPException(status_code=401, detail='no token found')
    subject = jsonable_encoder(new_item)['subject']
    if not check_subject(subject):
        subject = 'other'
    if len(file_name) >= 30:
        return HTTPException(status_code=406, detail='filename is longer than 30 chars')
    if authorize_token(token):
        user_name = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)['username']
        create_new_note(file_name, user_name, subject)
        return {"filename": f"{file_name}"}
    return HTTPException(status_code=401, detail='user is not authorized')


@app.post('/rename/{file_name}')
async def rename_note(req: Request, file_name, new_name: NewName):
    token = get_token(req)
    if token is None:
        return HTTPException(status_code=401, detail='no token found')
    if not authorize_token(token):
        return HTTPException(status_code=401, detail='user is not authorized')
    new_name = jsonable_encoder(new_name)
    user_name = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)['username']
    if not has_ownership(user_name, file_name):
        return HTTPException(status_code=401, detail='user does not own this file')
    if rename_file(file_name, new_name['filename'], new_name['subject']):
        return {"new_name": f"{new_name['filename']}"}
    return HTTPException(status_code=401, detail='rename failed')


@app.delete('/delete/{file_name}')
async def delete_note(req: Request, file_name):
    token = get_token(req)
    if token is None:
        return HTTPException(status_code=401, detail='no token found')
    if authorize_token(token):
        user_name = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)['username']
        if has_ownership(user_name, file_name):
            remove_note(file_name)
            return {"message": 'ok'}
        return HTTPException(status_code=401, detail='user does not own this file')
    return HTTPException(status_code=401, detail='user is not authorized')
