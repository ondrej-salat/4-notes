import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";

export default function Profile() {
    const navigate = useNavigate();
    let [username, setUsername] = useState('');

    const signOut = () => {
        localStorage.removeItem("token");
        navigate("/");
        console.log('yes sir')
    };

    const getItem = async () => {
        axios.get('/notes', {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},).then(async function (response) {
            setUsername(response['data']['message'])
            console.log(username)
        })
    }

    useEffect(() => {
        getItem()
    })

    return (
        <>
            <div style={{marginTop: 20, minHeight: 700}}>
                <h1>Profile page</h1>
                <p>Hello {username}, welcome to your profile page</p>

                <button onClick={signOut}>sign out</button>
            </div>
        </>
    );
}
