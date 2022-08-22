import {useLocation, useNavigate} from "react-router-dom";
import axios from "axios";
import {useEffect, useState} from "react";


export default function Edit() {
    const navigate = useNavigate()
    let [data, setData] = useState('');
    const location = useLocation().pathname.slice(6);

    const signOut = () => {
        localStorage.removeItem("token");
        navigate("/");
        console.log('yes sir')
    };

    const getItems = async () => {
        axios.get(`/note/${location}`, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},).then(async function (response) {
            setData(response['data'])
        })
    }

    useEffect(() => {
        getItems()
    }, []);

    return (
        <>
            <h1>edit page</h1>
            <h2>{data['data']}</h2>
            <h3>{data['subject']}</h3>
            <h4>{data['date']}</h4>
            <button onClick={signOut}></button>
        </>);
}
