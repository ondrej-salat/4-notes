from fastapi import FastAPI, Request, HTTPException
import jwt
from pydantic import BaseModel
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware

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


def get_token(req):
    token = req.headers["Authorization"].split()[1]
    return token


def authorize_token(token):
    data = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
    if data['username'] == test_user['username'] and data['password'] == test_user["password"]:
        return True
    return False


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/login")
async def user_login(login_item: LoginItem):
    data = jsonable_encoder(login_item)
    if data['username'] == test_user['username'] and data['password'] == test_user['password']:
        encoded_jwt = jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)
        return {"token": encoded_jwt}
    else:
        return {"message": "login failed"}


@app.get("/notes")
async def notes(req: Request):
    token = get_token(req)
    if authorize_token(token):
        return {"message": f"{jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)['username']}"}
    return HTTPException(status_code=401, detail='user is not authorized')
