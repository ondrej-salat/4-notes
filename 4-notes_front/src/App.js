import React, {Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home"
import {RequireToken} from "./components/Auth";
import NoPage from "./components/NoPage"

function App() {
    /* const [message, setMessage] = useState("");
     const getMessage = async () => {
         const requestOptions = {
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
             },
         };
         const response = await fetch("/hello/ondrejadfadsfa", requestOptions);
         const data = await response.json();
         setMessage(data);
         console.log(data);
     };

     useEffect(() => {
         getMessage()
     }, []);
    */
    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/" element={<RequireToken>
                    <Home/></RequireToken>}/>
                <Route path="*" element={<NoPage/>}/>
            </Routes></div>
    );
}

export default App;
