const axios = require('axios')

function request(path, method = 'get', body = null) {
 
  // return axios(`http://localhost:3000${path}`, {
  //   method: method,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'
  //   },
  //   data: body
  // })

  return axios(`https://lit-escarpment-87610.herokuapp.com${path}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    data: body
  })
}

module.exports = { request }