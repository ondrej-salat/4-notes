from pydantic import BaseModel


class LoginItem(BaseModel):
    username: str
    password: str


class SignupItem(BaseModel):
    username: str
    password: str
    email: str


class UpdateItem(BaseModel):
    data: str


class NewItem(BaseModel):
    subject: str
