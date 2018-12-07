// let axios = require('axios') - "require is not defined" - using cdn


function init() {


  const createUserFormHTML =
    `
    <form class='form-signin'>
        <h2 class='audiowide'>Create your user:</h2>
        <label for="username-create">Username</label>
        <input type="text" name="username-create" id="username-create" class="form-control" placeholder="User" required autofocus><br>
    
        <label for="fname-create">First name</label>
        <input type="text" name="fname-create" id="fname-create" class="form-control" placeholder="First" required><br>
        <label for="lname-create">Last name</label>
        <input type="text" name="lname-create" id="lname-create" class="form-control" placeholder="Last" required><br>

        <label for="password-create">Password</label>
        <input type="text" name="password-create" id="password-create" class="form-control" placeholder="Password" required> <br>
        <input type='submit' id="submit-create" class="btn btn-primary" value='Start my log!'>
        <button class='btn btn-primary' id='back-to-sign-in'>Back to sign-in</button>

    </form>
    `

  function request(path, method = 'get', body = null) {
    let bearerToken = ''
    const token = localStorage.getItem('token')
    if (token) {
      bearerToken = `Bearer ${token}`
    }

    return axios(`https://lit-escarpment-87610.herokuapp.com${path}`, {
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
    //sign in
    submitSign.addEventListener('click', (e) => {
      e.preventDefault()
      let alertBar = document.getElementById('alert-bar')
      alertBar.innerHTML = ``
      let username = document.getElementById('username').value
      let password = document.getElementById('password').value
      console.log(username, password)
      if (!username || !password) {
        let alertBar = document.getElementById('alert-bar')
        alertBar.innerHTML = ` 
                    <div class="alert alert-danger" role="alert">
                    Please fill out both User and Password fields.
                    </div>`
        return
      }
      request('/auth/token', 'post', {
          username,
          password
        })
        .then(response => {
          localStorage.setItem('token', response.data.token)
          return request('/auth/token', 'get')

        }).then(function (response) {
          userID = response.data.id
          console.log('login user ID', userID)
          window.location = `dashboard.html?id=${userID}`


          // if (response.data.error) {
          //     let alertBar = document.getElementById('alert-bar')  
          //     alertBar.innerHTML = ` 
          //         <div class="alert alert-danger" role="alert">
          //         Incorrect username or password.
          //         </div>`
          // }
        })
        .catch(() => {
          let alertBar = document.getElementById('alert-bar')
          alertBar.innerHTML = ` 
                    <div class="alert alert-danger" role="alert">
                    Incorrect username or password.
                    </div>`


        })

    })
    //create user
    let goToCreate = document.getElementById('go-to-create')
    goToCreate.addEventListener('click', () => {
      let alertBar = document.getElementById('alert-bar')
      alertBar.innerHTML = ``
      let formSpace = document.getElementById('form-space')
      formSpace.innerHTML = createUserFormHTML
      let backBtn = document.getElementById('back-to-sign-in')
      backBtn.addEventListener('click', () => {
        location.reload()
      })


      let submitCreate = document.getElementById('submit-create')

      submitCreate.addEventListener('click', (e) => {
        e.preventDefault()
        let username = document.getElementById('username-create').value
        let fname = document.getElementById('fname-create').value
        let lname = document.getElementById('lname-create').value
        let password = document.getElementById('password-create').value
        if (!username || !fname || !lname || !password) {
          let alertBar = document.getElementById('alert-bar')
          alertBar.innerHTML = ` 
                        <div class="alert alert-danger" role="alert">
                        Please fill out all fields.
                        </div>`
          return
        }
        console.log(username, fname, lname, password)
        axios.post(`https://lit-escarpment-87610.herokuapp.com/user`, {
            "username": username,
            "password": password,
            "fname": fname,
            "lname": lname
          })
          .then(response => {
            console.log(response)
            if (response.data.error) {
              console.log(response.data.error.message)
              let alertBar = document.getElementById('alert-bar')
              alertBar.innerHTML = ` 
                                <div class="alert alert-danger" role="alert">
                                <strong>Error:</strong>${response.data.error.message}
                                </div>`

            }
            userID = response.data.data.id
            console.log('login user ID', userID)

            window.location = `dashboard.html?id=${userID}`
            //can add custom dashboard welcome message here for new user if we want  
          })
          .catch(() => {
            let alertBar = document.getElementById('alert-bar')
            alertBar.innerHTML = ` 
                            <div class="alert alert-danger" role="alert">
                            Could not create user.
                            </div>`
            throw {
              error: {
                status: 400,
                message: "Could not create user"
              }
            }
          })
      })
    })

  })
}




module.exports = {
  init
}