import React, {useState} from "react";
import {useNavigate, Navigate} from "react-router-dom";
import {fetchToken, setToken} from "./Auth";
import axios from "axios";
import './Login.css'

export default function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("")

    const login = async () => {
        if ((username === "") || (password === "")) {
            return;
        } else {
            axios
                .post("/login", {
                    username: username, password: password,
                })
                .then(async function (response) {
                    if (response.data.token) {
                        setToken(response.data.token);
                        navigate('/');
                    }
                })
                .catch(function (error) {
                    console.log(error, "error");
                });
        }
    };

    const signup = async () => {
        if ((username === "") || (password === "") || (email === "")) {
            return;
        } else {
            axios
                .post("/signup", {
                    username: username, email: email, password: password,
                })
                .then(async function (response) {
                    if (response.data.token) {
                        setToken(response.data.token);
                        navigate('/');
                    }
                })
                .catch(function (error) {
                    console.log(error, "error");
                });
        }
    };

    if (fetchToken() == null) {
        return (
            <>
                <div className={'body'}>
                    <div className={"main"}>
                        <input type={"checkbox"} id={"chk"} aria-hidden={"true"}/>
                        <div className={"login"}>

                            <label className={'label'} htmlFor={"chk"} aria-hidden={"true"}>Login</label>
                            <input className={'input'} type={"text"}
                                   onChange={(e) => setUsername(e.target.value)}
                                   placeholder={"Username"} required={true}/>
                            <input className={'input'} type={"password"}
                                   onChange={(e) => setPassword(e.target.value)}
                                   placeholder={"Password"} required={true}/>
                            <button className={'button'} onClick={login}>Login</button>

                        </div>
                        <div className={"signup"}>

                            <label className={'label'} htmlFor={"chk"} aria-hidden={"true"}>Sign up</label>
                            <input className={'input'} onChange={(e) => setUsername(e.target.value)}
                                   type={"text"} placeholder={"Username"} required={true}/>
                            <input className={'input'} onChange={(e) => setEmail(e.target.value)}
                                   type={"email"} placeholder={"Email"} required={true}/>
                            <input className={'input'} onChange={(e) => setPassword(e.target.value)}
                                   type={"password"} placeholder={"Password"} required={true}/>
                            <button onClick={signup} className={'button2'}>Sign up</button>

                        </div>


                    </div>
                </div>

            </>)
    } else {
        return <Navigate to={'/'}/>
    }
}

