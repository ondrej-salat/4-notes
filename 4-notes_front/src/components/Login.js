import React, {useState} from "react";
import {useNavigate, Navigate} from "react-router-dom";
import {fetchToken, setToken} from "./Auth";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //check to see if the fields are not empty
    const login = () => {
        if ((username === "") || (password === "")) {
            return;
        } else {
            axios
                .post("http://localhost:8000/login", {
                    username: username,
                    password: password,
                })
                .then(async function (response) {
                    console.log(response.data.token, "response.data.token");
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

    return (
        <>
            <div style={{minHeight: 800, marginTop: 30}}>
                <h1>login page</h1>
                <div style={{marginTop: 30}}>
                    {fetchToken() ? (
                       <Navigate to={'/'}/>
                    ) : (
                        <div>
                            <form>
                                <label style={{marginRight: 10}}>Input Username</label>
                                <input
                                    type="text"
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <label style={{marginRight: 10}}>Input Password</label>
                                <input
                                    type="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button onClick={login}>Login</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}