import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import './Edit.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import {NavBar} from "../components/NavBar";
import {PopUp} from "../components/PopUp";


export default function Edit() {
    const navigate = useNavigate()
    let [data, setData] = useState('');
    const [value, setValue] = useState('');
    const location = useLocation().pathname.slice(6);

    const modules = {
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            //[{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            ['clean']
        ],
    }

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    const update = async (key) => {
        if (key === ' ') {
            axios.post(`/update/${data['filename']}`, {data: document.getElementsByClassName('ql-editor')[0].innerHTML}, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},).then(async function (response) {
            })
        }
    }


    const getItems = async () => {
        axios.get(`/note/${location}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},).then(async function (response) {
            if (response['data'] != undefined) {
                setData(response['data'])
                setValue(response['data']['data'])
            } else {
                navigate('/')
            }

        })
    }

    useEffect(() => {
        getItems()
        document.getElementById('text').focus()
    }, []);

    return (
        <>
            <NavBar data={data} style={'edit'}/>
            <div align={"center"}>
                <h2>edit: {data['filename']}</h2>
                <ReactQuill onKeyDown={(e) => update(e['key'])} id={'text'} className={'text'} theme="bubble"
                            value={value} onChange={setValue} modules={modules}
                            formats={formats}/><br/>

            </div>
            <PopUp style={'edit'} data={data}/>
            <PopUp style={'rename'} data={data}/>

        </>);
}
