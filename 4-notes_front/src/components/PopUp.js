import './PopUp.css'
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function PopUp() {
    const navigate = useNavigate();
    const divHide = () => {
        document.getElementById('popup').style.display = "none";
    }

    const newFile = () => {
        console.log(document.getElementById('filename').value)
        console.log(document.getElementById('subject').value)
        axios.post(`/new/${document.getElementById('filename').value}`, {subject: document.getElementById('subject').value}, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},)
            .then(async function (response) {
                navigate(`/edit/${response['data']['filename']}`)
            })
    }

    return (
        <div id={'popup'}>
            <div id={'popupContent'}>
                <h2>Create new note</h2>
                <input maxLength={30} required={true} id={'filename'}/>
                <h2>Select subject</h2>
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
                </select>
                <button onClick={divHide}>Cancel</button>
                <button onClick={newFile}>Create</button>
            </div>
        </div>
    );
}
