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
                if (response['data']['filename'] === undefined) {
                    divHide()
                    alert('ERROR file was not created')
                } else {
                    navigate(`/edit/${response['data']['filename']}`)
                }

            })
    }

    const remove = () => {
        axios.delete(`/delete/${data['filename']}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},)
            .then(async function (response) {
                if (response['data']['message'] === 'ok') {
                    navigate(`/`)
                    alert('file deleted successfully')
                } else {
                    alert('ERROR file was not deleted')
                }

            })
    }

    if (props.style === 'home') {
        return (
            <div id={'popup'}>
                <div id={'popupContent'}>
                    <h2>Create new note</h2>
                    <label htmlFor={'filename'}>Filename</label>
                    <input className={'filename'} maxLength={30} required={true} id={'filename'}/>
                    <label htmlFor={'subject'}>Subject</label>
                    <select className={'select'} required={true} id={'subject'}>
                        <option value={'other'}>Other</option>
                        <option value={'cj'}>CJ</option>
                        <option value={'m'}>M</option>
                        <option value={'bi'}>BI</option>
                        <option value={'z'}>Z</option>
                        <option value={'ch'}>CH</option>
                        <option value={'fy'}>FY</option>
                        <option value={'d'}>D</option>
                        <option value={'zsv'}>ZSV</option>
                    </select>
                    <button className={'cancel'} onClick={divHide}>Cancel</button>
                    <button className={'confirm'} onClick={newFile}>Create</button>
                </div>
            </div>
        );
    } else if (props.style === 'edit') {
        return (
            <div align={'center'} id={'popup'}>
                <div id={'popupContent'}>
                    <h2 className={'title'}>Permanently delete?</h2>
                    <button className={'cancel'} onClick={divHide}>Cancel</button>
                    <button className={'delete'} onClick={remove}>Delete</button>
                </div>
            </div>
        )
    } else if (props.style === 'rename') {
        return (
            <div align={'center'} id={'popup2'}>
                <div id={'popupContent2'}>
                    <h2>Edit file</h2>
                    <label htmlFor={'filename2'}>Filename</label>
                    <input className={'filename'} defaultValue={data['filename']} maxLength={30} required={true}
                           id={'filename2'}/>
                    <label htmlFor={'subject2'}>Subject</label>
                    <select className={'select'} defaultValue={data['subject']} required={true} id={'subject2'}>
                        <option value={'other'}>Other</option>
                        <option value={'cj'}>CJ</option>
                        <option value={'m'}>M</option>
                        <option value={'bi'}>BI</option>
                        <option value={'z'}>Z</option>
                        <option value={'ch'}>CH</option>
                        <option value={'fy'}>FY</option>
                        <option value={'d'}>D</option>
                        <option value={'zsv'}>ZSV</option>
                    </select>
                    <button className={'cancel'} onClick={divHide2}>Cancel</button>
                    <button className={'confirm'} onClick={rename}>Edit</button>
                </div>
            </div>
        )
    }
}
