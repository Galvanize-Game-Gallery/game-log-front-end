
document.addEventListener("DOMContentLoaded", function(event) {
console.log('connected')
  //dashboard query selectors
let dashSwitch = document.querySelector('#dashPC')
let dashPC = document.querySelector('#dashSwitch')
let dashPlay = document.querySelector('#dashPlay')
let dashAdd = document.querySelector('#dashXbox')
let dashXbox = document.querySelector('#dashAdd')
let headingUser = document.querySelector('h4')
let headingName = document.querySelector('h5')
let userName = 'dynamically set Name'
let fullName = 'pull full name'
//Fill in user info

headingUser.innerHTML = userName
headingName.innerText = fullName






})
