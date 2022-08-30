import './PopUp.css'
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function PopUp(props) {
    const navigate = useNavigate();
    const data = props.data

    const divHide = () => {
        document.getElementById('popup').style.display = "none";
    }

    const divHide2 = () => {
        document.getElementById('popup2').style.display = "none";
    }

    const rename = () => {
        axios.post(`/rename/${data['filename']}`, {
            filename: document.getElementById('filename2').value,
            subject: document.getElementById('subject2').value
        }, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},)
            .then(async function (response) {
                if (response['data']['new_name'] === undefined) {
                    divHide2()
                } else {
                    navigate(`/edit/${response['data']['new_name']}`)
                    divHide2()
                }

            })
    }

    const newFile = () => {
        console.log(document.getElementById('filename').value)
        console.log(document.getElementById('subject').value)
        axios.post(`/new/${document.getElementById('filename').value}`, {subject: document.getElementById('subject').value}, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},)
            .then(async function (response) {
                navigate(`/edit/${response['data']['filename']}`)
            })
    }

    const remove = () => {
        axios.delete(`/delete/${data['filename']}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},)
            .then(async function (response) {
                navigate(`/`)
            })
    }

    if (props.style === 'home') {
        return (
            <div id={'popup'}>
                <div id={'popupContent'}>
                    <h2>Create new note</h2>
                    <label htmlFor={'filename'}>Filename</label>
                    <input maxLength={30} required={true} id={'filename'}/><br/>
                    <label htmlFor={'subject'}>Subject</label>
                    <select required={true} id={'subject'}>
                        <option value={'other'}>Other</option>
                        <option value={'cj'}>CJ</option>
                        <option value={'m'}>M</option>
                        <option value={'bi'}>BI</option>
                        <option value={'z'}>Z</option>
                        <option value={'ch'}>CH</option>
                        <option value={'fy'}>FY</option>
                        <option value={'d'}>D</option>
                        <option value={'zsv'}>ZSV</option>
                    </select><br/>
                    <button onClick={divHide}>Cancel</button>
                    <button onClick={newFile}>Create</button>
                </div>
            </div>
        );
    } else if (props.style === 'edit') {
        return (
            <div align={'center'} id={'popup'}>
                <div id={'popupContent'}>
                    <h2>Permanently delete?</h2>
                    <button onClick={remove}>Yes</button>
                    <button onClick={divHide}>Cancel</button>
                </div>
            </div>
        )
    } else if (props.style === 'rename') {
        return (
            <div align={'center'} id={'popup2'}>
                <div id={'popupContent2'}>
                    <h2>Edit file</h2>
                    <label htmlFor={'filename2'}>Filename</label>
                    <input defaultValue={data['filename']} maxLength={30} required={true} id={'filename2'}/><br/>
                    <label htmlFor={'subject2'}>Subject</label>
                    <select defaultValue={data['subject']} required={true} id={'subject2'}>
                        <option value={'other'}>Other</option>
                        <option value={'cj'}>CJ</option>
                        <option value={'m'}>M</option>
                        <option value={'bi'}>BI</option>
                        <option value={'z'}>Z</option>
                        <option value={'ch'}>CH</option>
                        <option value={'fy'}>FY</option>
                        <option value={'d'}>D</option>
                        <option value={'zsv'}>ZSV</option>
                    </select><br/>
                    <button onClick={divHide2}>Cancel</button>
                    <button onClick={rename}>Create</button>
                </div>
            </div>
        )
    }
}
