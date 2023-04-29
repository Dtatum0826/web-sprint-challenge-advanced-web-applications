import axios from "axios"

// ✨ implement axiosWithAuth


export const axiosWithAuth = () => {
    const token = localStorage.getItem('token')

    return axios.create({
        baseURL : 'http://localhost:9000/api/',
         headers :{authorization : token} 
        })
}

