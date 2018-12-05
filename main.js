const index = require('./src/index');
const dashboard = require('./src/dashboard');
const library = require('./src/library');
const libdetails = require('./src/libdetails')
const newlibgame = require('./src/newlibgame')

const pageInitialization = {
  '/' : index.init,
  '/index.html': index.init,
  '/dashboard.html': dashboard.init,
  '/library.html': library.init,
  '/libdetails.html': libdetails.init,
  '/newlibgame.html': newlibgame.init
}

const path = window.location.pathname
if(pageInitialization.hasOwnProperty(path)) {
  pageInitialization[path]()
}
else {
  console.error(`${path} does not have an initializer`)
}