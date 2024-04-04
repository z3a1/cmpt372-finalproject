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

module.exports = {getUserId}