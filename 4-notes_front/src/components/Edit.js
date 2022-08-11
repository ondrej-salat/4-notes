import React, {useLocation} from "react-router-dom";
import {useEffect} from "react";

export default function Profile() {

    let location = useLocation().pathname;

    useEffect(() => {
        console.log(location.slice(6))
    });
    return (
        <>
            <h1>edit page</h1>
        </>
    );
}
