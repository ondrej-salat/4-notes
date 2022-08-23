import {useNavigate} from "react-router-dom";
import axios from "axios";
import {Component, useEffect, useState} from "react";

export default function Home() {
    const navigate = useNavigate();
    let [data, setData] = useState(0);

    const redirectEdit = () => {
        navigate('/edit/note(test)')
    }

    const signOut = () => {
        localStorage.removeItem("token");
        navigate("/");
        console.log('yes sir')
    };

    const getItem = async () => {
        axios.get('/all_notes', {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},).then(async function (response) {
            setData(JSON.parse(response['data']))
            console.log(response['data'])
        })
    }

    useEffect(() => {
        getItem()
    }, []);

    return (
        <>
            <div style={{marginTop: 20, minHeight: 700}}>
                <h1>Profile page</h1>
                <button onClick={redirectEdit}></button>
                <button onClick={signOut}>sign out</button>
                <p>{JSON.stringify(data)}</p>
                {data.map(product => <p noteName={data['filename']} name={data['username']}></p>)}
            </div>
        </>
    );
}
