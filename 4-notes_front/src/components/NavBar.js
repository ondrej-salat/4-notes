import './NavBar.css'
import axios from "axios";
import {useNavigate} from "react-router-dom";

export function NavBar(props) {
    const navigate = useNavigate();
    const data = props.data;


    const logOut = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const update = async () => {
        axios.post(`/update/${data['filename']}`, {data: document.getElementsByClassName('ql-editor')[0].innerHTML}, {headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`}},)
            .then(async function (response) {
                navigate('/')
            })
    }

    const showRemove = () => {
        document.getElementById('popup').style.display = "block";
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


    if (props.style === 'edit') {
        return (
            <div align={'center'}>
                <div className={"topNav"}>
                    <a className={"active"} onClick={update}>
                        4NOTES
                    </a>
                    <a onClick={printDiv} className={'active_button'}>
                        <img className={'svg'} src={'/print.svg'}/>
                    </a>
                    <a className={'active_button'}>
                        <img className={'svg'} src={'/pencil.svg'}/>
                    </a>
                    <a onClick={showRemove} className={'active_button'}>
                        <img className={'svg'} src={'/trash.svg'}/>
                    </a>

                    <a id={'logout'} onClick={logOut}>Logout</a>
                </div>
            </div>

        );

    } else {
        return (
            <div align={'center'}>
                <div className={"topNav"}>
                    <a className={"active"} href="/">
                        4NOTES {props.color}
                    </a>
                    <a id={'logout'} onClick={logOut}>Logout</a>
                </div>
            </div>

        );
    }
}
