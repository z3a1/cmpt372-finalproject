import axios from "axios"

let getUserId = async (id) => {
    let data = {}
    if(id == undefined || id == null || id == "undefined"){
        return null
    }
    else{
        await axios.post(process.env.SERVER_URL + "/auth/getUserId", {id: id})
        .then(serverRes => {
            data = serverRes.data
        })
        .catch(err => {
            alert(err)
        })
        return data
    }
}

let getcurrentSession = async(sessionID) => {
    let res = {}
    await axios.post(process.env.SERVER_URL + "/auth/getSessionById", {id: sessionID}).then(serverRes => {
        res = serverRes
    })
    .catch(err => {
        alert(err)
        return null
    })
    return res
}

let debugRoute = async (id) => {
    await axios.post(process.env.SERVER_URL + "/auth/debugRoute", {
        id: id
    })
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        alert(err)
    })
}

module.exports = {getUserId, debugRoute, getcurrentSession}