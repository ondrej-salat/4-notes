import {useLocation, Navigate} from "react-router-dom"

export const setToken = (token) => {

    localStorage.setItem('token', token)// make up your own token
}

export const fetchToken = (token) => {

    return localStorage.getItem('token')
}

export function RequireToken({children}) {

    let auth = fetchToken()
    let location = useLocation()

    if (!auth) {
        console.log('navigate login')
        return <Navigate to='/login' state={{from: location}}/>;
    }

    return children;
}
