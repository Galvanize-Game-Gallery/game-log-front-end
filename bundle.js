(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const index = require('./src/index');
const dashboard = require('./src/dashboard');
const library = require('./src/library');
const libdetails = require('./src/libdetails')

const pageInitialization = {
  '/' : index.init,
  '/index.html': index.init,
  '/dashboard.html': dashboard.init,
  '/library.html': library.init,
  '/libdetails.html': libdetails.init
}

const path = window.location.pathname
 
if(pageInitialization.hasOwnProperty(path)) {
  pageInitialization[path]()
}
else {
  console.error(`${path} does not have an initializer`)
}
},{"./src/dashboard":2,"./src/index":3,"./src/libdetails":4,"./src/library":5}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
// let axios = require('axios') - "require is not defined" - using cdn
const createUserFormHTML = 
`

<form class='col-md-4 offset-md-4 form-signin'>
    <h2>Create an account:</h2><br>
    <label for="username-create">Username</label>
    <input type="text" name="username-create" id="username-create" class="form-control" placeholder="User" required autofocus><br>
   
    <label for="fname-create">First name:</label>
    <input type="text" name="fname-create" id="fname-create" class="form-control" placeholder="First" required autofocus><br>
    <label for="lname-create">Last name:</label>
    <input type="text" name="lname-create" id="lname-create" class="form-control" placeholder="Last" required autofocus><br>

    <label for="password-create">Password</label>
    <input type="text" name="password-create" id="password-create" class="form-control" placeholder="password" required> <br>
    <input type="submit" id="submit-create" class="btn btn-primary">

</form>

`

function request(path, method = 'get', body = null) {
let bearerToken = ''
const token = localStorage.getItem('token')
if(token){
    bearerToken = `Bearer ${token}`
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
        })
        .catch(() => {
            alert('Login failed')
            throw {error: {status: 400, message: `Authentication failed`}}
        })

    })

    let goToCreate = document.getElementById('go-to-create')
    goToCreate.addEventListener('click', () => {
        console.log('clicked')
        let formSpace = document.getElementById('form-space')
        formSpace.innerHTML = createUserFormHTML

        let submitCreate = document.getElementById('submit-create')

        submitCreate.addEventListener('click', (e) => {
            e.preventDefault()
            let username = document.getElementById('username-create').value
            let fname = document.getElementById('fname-create').value
            let lname = document.getElementById('lname-create').value
            let password = document.getElementById('password-create').value
    
            axios.post(`http://localhost:3000/users`, { "username": username, "password": password, "fname": fname, "lname": lname } )
                .then(response => { 
                    alert('user created!')
                })
                .catch(() => {
                    throw {error: {status: 400, message: "Could not create user"}}
                })
        })
    })







})

    






},{}],4:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],5:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}]},{},[1]);
