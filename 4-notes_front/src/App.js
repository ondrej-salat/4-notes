import React, {Routes, Route} from "react-router-dom";
import Login from "./routes/Login";
import Home from "./routes/Home";
import {RequireToken} from "./routes/Auth";
import NoPage from "./routes/NoPage";
import Edit from "./routes/Edit";
import "./App.css"

function App() {

    return (<div className="App">
        <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<RequireToken><Home/></RequireToken>}/>
            <Route path="/edit/:name" element={<RequireToken><Edit/></RequireToken>}/>
            <Route path="*" element={<NoPage/>}/>
        </Routes></div>);
}

export default App;
