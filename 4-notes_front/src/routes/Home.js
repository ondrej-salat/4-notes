import {useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import "./Home.css"
import {PopUp} from "../components/PopUp";
import {NavBar} from "../components/NavBar";

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

    const getItem = async () => {
        axios.get('/all_notes', {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},).then(async function (response) {
            const res = JSON.parse(response['data'])
            let data = []
            for (let i = 1; i <= res[0]['len']; i++) {
                data[res[0]['len'] - i] = res[i]
            }
            setNotes(data)

        })
    }

    useEffect(() => {
        getItem()
    }, []);

    return (<>
            <NavBar style={'home'}/>
            <div align={'center'} style={{marginTop: 20, minHeight: 700}}>
                <h2 className={'title'}>Your notes</h2>
                <div className={'grid-container'}>
                    {notes.map((data) => (
                        <div onClick={() => redirectEdit(data['filename'])} key={data['filename']}
                             className={"noteBox"}>
                            <img className={"subject-logo"} src={`subjects/${data['subject']}.svg`}/>
                            <h3 className={'file-name'}>{data['filename']}</h3>
                            <p className={'time'}>{data['date']}</p>
                        </div>
                    ))}
                </div>
                <div onClick={divShow} id={'floating-button'}>
                    <p className={"plus"}>+</p>
                </div>
                <PopUp style={'home'}/>
            </div>
        </>
    );
}
