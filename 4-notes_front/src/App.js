import React, {Routes, Route} from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import {RequireToken} from "./components/Auth";
import NoPage from "./components/NoPage";
import Edit from "./components/Edit";

function App() {

    return (<div className="App">
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<RequireToken>
                <Home/></RequireToken>}/>
            <Route path="/edit/:name" element={<Edit/>}/>
            <Route path="*" element={<NoPage/>}/>
        </Routes></div>);
}

export default App;
