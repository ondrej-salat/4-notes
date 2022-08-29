import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import "./Home.css"
import {PopUp} from "../components/PopUp";

export default function Home() {
    const navigate = useNavigate();
    let [notes, setNotes] = useState([]);


    const redirectEdit = (filename) => {
        navigate(`/edit/${filename}`)
    }

    const divShow = () => {
        document.getElementById('popup').style.display = "block";
        document.getElementById('filename').value = 'New_file' + Math.round(Math.random() * 10000);
    }


    const logOut = () => {
        localStorage.removeItem("token");
        navigate("/");
        console.log('yes sir')
    };


    const getItem = async () => {
        axios.get('/all_notes', {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},).then(async function (response) {
            const res = JSON.parse(response['data'])
            let data = []
            for (let i = 1; i <= res[0]['len']; i++) {
                data.push(res[i])
            }
            setNotes(data)

        })
    }

    useEffect(() => {
        getItem()
    }, []);

    return (<>
        <div align={'center'} style={{marginTop: 20, minHeight: 700}}>
            <h1>Home page</h1>
            <button onClick={divShow}>New note</button>
            <button onClick={logOut}>log out</button>

            {notes.map((data) => (
                <div onClick={() => redirectEdit(data['filename'])} key={data['filename']} className={"noteBox"}>
                    <p> {data['filename']}</p>
                    <p> {data['subject']}</p>
                    <p>{data['date']}</p>
                </div>
            ))}
            <PopUp/>
        </div>

    </>);
}
