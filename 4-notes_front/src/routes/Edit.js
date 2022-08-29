import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";
import './Edit.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';


export default function Edit() {
    const navigate = useNavigate()
    let [data, setData] = useState('');
    const [value, setValue] = useState('');
    const location = useLocation().pathname.slice(6);

    const modules = {
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic',  'strike', 'blockquote'],
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

    const printDiv = () => {
        const contents = document.getElementsByClassName("ql-editor")[0].innerHTML;
        const frame1 = document.createElement('iframe');
        frame1.name = "frame1";
        frame1.style.position = "absolute";
        frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);
        const frameDoc = (frame1.contentWindow) ? frame1.contentWindow : (frame1.contentDocument.document) ? frame1.contentDocument.document : frame1.contentDocument;
        frameDoc.document.open();
        frameDoc.document.write('<html><head><title>DIV Contents</title>');
        frameDoc.document.write('</head><body style="font-size: 14px;font-family: Arial, sans-serif";><div style="word-break: break-all;border-left: 1.8em solid white;border-right: 1.8em solid white;border-bottom: 5em solid white;">');
        frameDoc.document.write(contents);
        frameDoc.document.write('</div></body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            document.body.removeChild(frame1);
        }, 500);
        return false;
    }

    const logOut = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const getItems = async () => {
        axios.get(`/note/${location}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},).then(async function (response) {
            setData(response['data'])
            setValue(response['data']['data'])
        })
    }

    useEffect(() => {
        getItems()
    }, []);

    return (
        <>
            <div align={"center"}>
                <h2>edit: {data['filename']}</h2>
                <ReactQuill onKeyDown={(e) => update(e['key'])} id={'text'} className={'text'} theme="bubble"
                            value={value} onChange={setValue} modules={modules}
                            formats={formats}/><br/>
                <button onClick={printDiv}>print</button>
                <button onClick={logOut}>log out</button>
            </div>
        </>);
}
