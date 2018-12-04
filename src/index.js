// let axios = require('axios') - "require is not defined" - using cdn


function request(path, method = 'get', body = null) {
let bearerToken = ''
const token = localStorage.getItem('token')
console.log(token)
if(token){
    bearerToken = `Bearer ${token}`
    console.log('bearerToken: ' + bearerToken)
}

return axios(`http://localhost:3000${path}`, {
    method: method,
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': bearerToken
    },
    data: body
})
}



window.addEventListener('DOMContentLoaded', () => {    

    let submitSign = document.getElementById('submit-signin')

    submitSign.addEventListener('click', (e) => {
        e.preventDefault()
        let username = document.getElementById('username').value
        let password = document.getElementById('password').value
        console.log(username, password)

        request('/auth/token', 'post', { username , password })
        .then(function(response){

        localStorage.setItem('token', response.data.token)
        window.location = 'dashboard.html'
        console.log('this is the then')
        })
        .catch(function(error){
            console.log('this is the catch')
            throw {error: {status: 400, message: `Authentication failed`}}
        })

    })


    let submitCreate = document.getElementById('submit-create')

    submitCreate.addEventListener('click', (e) => {
        e.preventDefault()
        let username = document.getElementById('username-create').value
        let fname = document.getElementById('fname-create').value
        let lname = document.getElementById('lname-create').value
        let password = document.getElementById('password-create').value
        console.log(username, fname, lname, password)

        axios.post(`http://localhost:3000/users`, { "username": username, "password": password, "fname": fname, "lname": lname } )
            .then(response => { 
                alert('user created: ' + response.data.username)
            })
            .catch(() => {
                throw {error: {status: 400, message: "Could not create user"}}
            })


    })









})

    


