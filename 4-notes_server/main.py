from fastapi import FastAPI, Request
import jwt
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from google.oauth2 import id_token
from google.auth.transport import requests

SECRET_KEY = "YOUR_FAST_API_SECRET_KEY"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 800

test_user = {
    "username": "user",
    "password": "password",

}
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


class LoginItem(BaseModel):
    username: str
    password: str


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/login")
async def user_login(loginitem: LoginItem):
    data = jsonable_encoder(loginitem)
    if data['username'] == test_user['username'] and data['password'] == test_user['password']:
        encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        return {"token": encoded_jwt}
    else:
        return {"message": "login failed"}


@app.get("/edit/{filename}")
async def say_hello(filename: str):
    return {"message": f"Hello {filename}"}
