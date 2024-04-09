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
    await axios.post(process.env.SERVER_URL + "/auth/getSessionById", {id: sessionID}, {withCredentials: true}).then(serverRes => {
        res = serverRes
    })
    .catch(err => {
        alert(err)
        return null
    })
    return res
}
module.exports = {getUserId, getcurrentSession}