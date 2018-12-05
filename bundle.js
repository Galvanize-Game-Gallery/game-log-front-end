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
        })
        .catch(() => {
            alert('Login failed')
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

        axios.post(`http://localhost:3000/users`, { "username": username, "password": password, "fname": fname, "lname": lname } )
            .then(response => { 
                alert('user created!')
            })
            .catch(() => {
                throw {error: {status: 400, message: "Could not create user"}}
            })
    })

})

    



},{}],4:[function(require,module,exports){
arguments[4][2][0].apply(exports,arguments)
},{"dup":2}],5:[function(require,module,exports){
function init() {

    const create = require('./templates');

    const testArr = [
        {
        igdb_id: 41608,
        title: 'Halo: The Master Chief Collection',
        cover_url: '//images.igdb.com/igdb/image/upload/t_thumb/kuaub4pjaajuepmlxuq3.jpg',
        desc: 'Relive the greatest adventures of the ultimate solder with Halo: The Master Chief Collection, which includes the complete story of the Master Chief on one console for the first time ever. Halo: Combat Evolved , Halo 2, Halo 3 and Halo 4 are all packed into this massive package. And not only is the debut Halo delivered in its acclaimed Anniversary package, but for the first time, an entirely remastered version of the iconic sequel that revolutionized online console gaming is available with the Halo 2 Anniversary version of the game. This collection lets you experience Halo in an all-new way, at higher visual fidelity running at 60 frames per second (fps) on dedicated servers. \n \nHalo: The Master Chief Collection features curated campaign and multiplayer playlists across all four games and features more than 100 multiplayer maps -- authentic to their original release. In addition, Halo 2 Anniversary includes six all-new maps built from the ground up for Xbox One.'
    },
    {
        igdb_id: 25076, 
        title: 'Red Dead Redemption 2', 
        cover_url: '//images.igdb.com/igdb/image/upload/t_thumb/yfk9f2lbo0r7slytuhra.jpg' ,
        desc: 'Developed by the creators of Grand Theft Auto V and Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s unforgiving heartland. The game\'s vast and atmospheric world will also provide the foundation for a brand new online multiplayer experience.' 
    }
];

    function generateGames(arr) {

        function formatCover(str) {
            let newStr = str.slice(2);
            return `http://${newStr}`;
        };

        function formatDesc(str) {
            if(str.length <= 300) {
                return str
            } else {
                let newStr = str.slice(0, 300)
                return `${newStr}...`;
            }
        }

        const appliedTemplates = arr.map(game => create.publicGameRow(game.igdb_id, formatCover(game.cover_url), game.title, formatDesc(game.desc))).join('\n');
        document.querySelector(".main-body").innerHTML = appliedTemplates;
    }

    generateGames(testArr);
}
module.exports= {
    init,
}

},{"./templates":6}],6:[function(require,module,exports){
const publicGameRow = (id, coverArt, title, desc) => {
    console.log(coverArt);
    return `
    <div class="row justify-content-start item-rows border public-game-rows" data-id="${id}">
        <div class="col-4">
            <img src="${coverArt}" height="150px">
        </div>
        <div class="col-8">
            <div class="row justify-content-start">
                <div class="col-8">
                    <h2>${title}</h2>
                </div>
                <div class="col-4">
                    <ul id="actor-list" data-id=${id}> </ul>
                </div>
                <div class="row justify-content-center">
                    <div class="col">
                        <p>${desc}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};

module.exports = {
    publicGameRow,
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIiwic3JjL2Rhc2hib2FyZC5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9saWJyYXJ5LmpzIiwic3JjL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IGluZGV4ID0gcmVxdWlyZSgnLi9zcmMvaW5kZXgnKTtcbmNvbnN0IGRhc2hib2FyZCA9IHJlcXVpcmUoJy4vc3JjL2Rhc2hib2FyZCcpO1xuY29uc3QgbGlicmFyeSA9IHJlcXVpcmUoJy4vc3JjL2xpYnJhcnknKTtcbmNvbnN0IGxpYmRldGFpbHMgPSByZXF1aXJlKCcuL3NyYy9saWJkZXRhaWxzJylcblxuY29uc3QgcGFnZUluaXRpYWxpemF0aW9uID0ge1xuICAnLycgOiBpbmRleC5pbml0LFxuICAnL2luZGV4Lmh0bWwnOiBpbmRleC5pbml0LFxuICAnL2Rhc2hib2FyZC5odG1sJzogZGFzaGJvYXJkLmluaXQsXG4gICcvbGlicmFyeS5odG1sJzogbGlicmFyeS5pbml0LFxuICAnL2xpYmRldGFpbHMuaHRtbCc6IGxpYmRldGFpbHMuaW5pdFxufVxuXG5jb25zdCBwYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lXG5pZihwYWdlSW5pdGlhbGl6YXRpb24uaGFzT3duUHJvcGVydHkocGF0aCkpIHtcbiAgcGFnZUluaXRpYWxpemF0aW9uW3BhdGhdKClcbn1cbmVsc2Uge1xuICBjb25zb2xlLmVycm9yKGAke3BhdGh9IGRvZXMgbm90IGhhdmUgYW4gaW5pdGlhbGl6ZXJgKVxufSIsIiIsIi8vIGxldCBheGlvcyA9IHJlcXVpcmUoJ2F4aW9zJykgLSBcInJlcXVpcmUgaXMgbm90IGRlZmluZWRcIiAtIHVzaW5nIGNkblxuXG5cbmZ1bmN0aW9uIHJlcXVlc3QocGF0aCwgbWV0aG9kID0gJ2dldCcsIGJvZHkgPSBudWxsKSB7XG5sZXQgYmVhcmVyVG9rZW4gPSAnJ1xuY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgndG9rZW4nKVxuY29uc29sZS5sb2codG9rZW4pXG5pZih0b2tlbil7XG4gICAgYmVhcmVyVG9rZW4gPSBgQmVhcmVyICR7dG9rZW59YFxuICAgIGNvbnNvbGUubG9nKCdiZWFyZXJUb2tlbjogJyArIGJlYXJlclRva2VuKVxufVxuXG5yZXR1cm4gYXhpb3MoYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCR7cGF0aH1gLCB7XG4gICAgbWV0aG9kOiBtZXRob2QsXG4gICAgaGVhZGVyczoge1xuICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0FjY2VwdCc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAnQXV0aG9yaXphdGlvbic6IGJlYXJlclRva2VuXG4gICAgfSxcbiAgICBkYXRhOiBib2R5XG59KVxufVxuXG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7ICAgIFxuXG4gICAgbGV0IHN1Ym1pdFNpZ24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0LXNpZ25pbicpXG5cbiAgICBzdWJtaXRTaWduLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGxldCB1c2VybmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VybmFtZScpLnZhbHVlXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXNzd29yZCcpLnZhbHVlXG4gICAgICAgIGNvbnNvbGUubG9nKHVzZXJuYW1lLCBwYXNzd29yZClcblxuICAgICAgICByZXF1ZXN0KCcvYXV0aC90b2tlbicsICdwb3N0JywgeyB1c2VybmFtZSAsIHBhc3N3b3JkIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgndG9rZW4nLCByZXNwb25zZS5kYXRhLnRva2VuKVxuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSAnZGFzaGJvYXJkLmh0bWwnXG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICBhbGVydCgnTG9naW4gZmFpbGVkJylcbiAgICAgICAgICAgIHRocm93IHtlcnJvcjoge3N0YXR1czogNDAwLCBtZXNzYWdlOiBgQXV0aGVudGljYXRpb24gZmFpbGVkYH19XG4gICAgICAgIH0pXG5cbiAgICB9KVxuXG5cbiAgICBsZXQgc3VibWl0Q3JlYXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdC1jcmVhdGUnKVxuXG4gICAgc3VibWl0Q3JlYXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGxldCB1c2VybmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1c2VybmFtZS1jcmVhdGUnKS52YWx1ZVxuICAgICAgICBsZXQgZm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm5hbWUtY3JlYXRlJykudmFsdWVcbiAgICAgICAgbGV0IGxuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xuYW1lLWNyZWF0ZScpLnZhbHVlXG4gICAgICAgIGxldCBwYXNzd29yZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdwYXNzd29yZC1jcmVhdGUnKS52YWx1ZVxuXG4gICAgICAgIGF4aW9zLnBvc3QoYGh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC91c2Vyc2AsIHsgXCJ1c2VybmFtZVwiOiB1c2VybmFtZSwgXCJwYXNzd29yZFwiOiBwYXNzd29yZCwgXCJmbmFtZVwiOiBmbmFtZSwgXCJsbmFtZVwiOiBsbmFtZSB9IClcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHsgXG4gICAgICAgICAgICAgICAgYWxlcnQoJ3VzZXIgY3JlYXRlZCEnKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhyb3cge2Vycm9yOiB7c3RhdHVzOiA0MDAsIG1lc3NhZ2U6IFwiQ291bGQgbm90IGNyZWF0ZSB1c2VyXCJ9fVxuICAgICAgICAgICAgfSlcbiAgICB9KVxuXG59KVxuXG4gICAgXG5cblxuIiwiZnVuY3Rpb24gaW5pdCgpIHtcblxuICAgIGNvbnN0IGNyZWF0ZSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzJyk7XG5cbiAgICBjb25zdCB0ZXN0QXJyID0gW1xuICAgICAgICB7XG4gICAgICAgIGlnZGJfaWQ6IDQxNjA4LFxuICAgICAgICB0aXRsZTogJ0hhbG86IFRoZSBNYXN0ZXIgQ2hpZWYgQ29sbGVjdGlvbicsXG4gICAgICAgIGNvdmVyX3VybDogJy8vaW1hZ2VzLmlnZGIuY29tL2lnZGIvaW1hZ2UvdXBsb2FkL3RfdGh1bWIva3VhdWI0cGphYWp1ZXBtbHh1cTMuanBnJyxcbiAgICAgICAgZGVzYzogJ1JlbGl2ZSB0aGUgZ3JlYXRlc3QgYWR2ZW50dXJlcyBvZiB0aGUgdWx0aW1hdGUgc29sZGVyIHdpdGggSGFsbzogVGhlIE1hc3RlciBDaGllZiBDb2xsZWN0aW9uLCB3aGljaCBpbmNsdWRlcyB0aGUgY29tcGxldGUgc3Rvcnkgb2YgdGhlIE1hc3RlciBDaGllZiBvbiBvbmUgY29uc29sZSBmb3IgdGhlIGZpcnN0IHRpbWUgZXZlci4gSGFsbzogQ29tYmF0IEV2b2x2ZWQgLCBIYWxvIDIsIEhhbG8gMyBhbmQgSGFsbyA0IGFyZSBhbGwgcGFja2VkIGludG8gdGhpcyBtYXNzaXZlIHBhY2thZ2UuIEFuZCBub3Qgb25seSBpcyB0aGUgZGVidXQgSGFsbyBkZWxpdmVyZWQgaW4gaXRzIGFjY2xhaW1lZCBBbm5pdmVyc2FyeSBwYWNrYWdlLCBidXQgZm9yIHRoZSBmaXJzdCB0aW1lLCBhbiBlbnRpcmVseSByZW1hc3RlcmVkIHZlcnNpb24gb2YgdGhlIGljb25pYyBzZXF1ZWwgdGhhdCByZXZvbHV0aW9uaXplZCBvbmxpbmUgY29uc29sZSBnYW1pbmcgaXMgYXZhaWxhYmxlIHdpdGggdGhlIEhhbG8gMiBBbm5pdmVyc2FyeSB2ZXJzaW9uIG9mIHRoZSBnYW1lLiBUaGlzIGNvbGxlY3Rpb24gbGV0cyB5b3UgZXhwZXJpZW5jZSBIYWxvIGluIGFuIGFsbC1uZXcgd2F5LCBhdCBoaWdoZXIgdmlzdWFsIGZpZGVsaXR5IHJ1bm5pbmcgYXQgNjAgZnJhbWVzIHBlciBzZWNvbmQgKGZwcykgb24gZGVkaWNhdGVkIHNlcnZlcnMuIFxcbiBcXG5IYWxvOiBUaGUgTWFzdGVyIENoaWVmIENvbGxlY3Rpb24gZmVhdHVyZXMgY3VyYXRlZCBjYW1wYWlnbiBhbmQgbXVsdGlwbGF5ZXIgcGxheWxpc3RzIGFjcm9zcyBhbGwgZm91ciBnYW1lcyBhbmQgZmVhdHVyZXMgbW9yZSB0aGFuIDEwMCBtdWx0aXBsYXllciBtYXBzIC0tIGF1dGhlbnRpYyB0byB0aGVpciBvcmlnaW5hbCByZWxlYXNlLiBJbiBhZGRpdGlvbiwgSGFsbyAyIEFubml2ZXJzYXJ5IGluY2x1ZGVzIHNpeCBhbGwtbmV3IG1hcHMgYnVpbHQgZnJvbSB0aGUgZ3JvdW5kIHVwIGZvciBYYm94IE9uZS4nXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGlnZGJfaWQ6IDI1MDc2LCBcbiAgICAgICAgdGl0bGU6ICdSZWQgRGVhZCBSZWRlbXB0aW9uIDInLCBcbiAgICAgICAgY292ZXJfdXJsOiAnLy9pbWFnZXMuaWdkYi5jb20vaWdkYi9pbWFnZS91cGxvYWQvdF90aHVtYi95Zms5ZjJsYm8wcjdzbHl0dWhyYS5qcGcnICxcbiAgICAgICAgZGVzYzogJ0RldmVsb3BlZCBieSB0aGUgY3JlYXRvcnMgb2YgR3JhbmQgVGhlZnQgQXV0byBWIGFuZCBSZWQgRGVhZCBSZWRlbXB0aW9uLCBSZWQgRGVhZCBSZWRlbXB0aW9uIDIgaXMgYW4gZXBpYyB0YWxlIG9mIGxpZmUgaW4gQW1lcmljYeKAmXMgdW5mb3JnaXZpbmcgaGVhcnRsYW5kLiBUaGUgZ2FtZVxcJ3MgdmFzdCBhbmQgYXRtb3NwaGVyaWMgd29ybGQgd2lsbCBhbHNvIHByb3ZpZGUgdGhlIGZvdW5kYXRpb24gZm9yIGEgYnJhbmQgbmV3IG9ubGluZSBtdWx0aXBsYXllciBleHBlcmllbmNlLicgXG4gICAgfVxuXTtcblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlR2FtZXMoYXJyKSB7XG5cbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0Q292ZXIoc3RyKSB7XG4gICAgICAgICAgICBsZXQgbmV3U3RyID0gc3RyLnNsaWNlKDIpO1xuICAgICAgICAgICAgcmV0dXJuIGBodHRwOi8vJHtuZXdTdHJ9YDtcbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiBmb3JtYXREZXNjKHN0cikge1xuICAgICAgICAgICAgaWYoc3RyLmxlbmd0aCA8PSAzMDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBuZXdTdHIgPSBzdHIuc2xpY2UoMCwgMzAwKVxuICAgICAgICAgICAgICAgIHJldHVybiBgJHtuZXdTdHJ9Li4uYDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFwcGxpZWRUZW1wbGF0ZXMgPSBhcnIubWFwKGdhbWUgPT4gY3JlYXRlLnB1YmxpY0dhbWVSb3coZ2FtZS5pZ2RiX2lkLCBmb3JtYXRDb3ZlcihnYW1lLmNvdmVyX3VybCksIGdhbWUudGl0bGUsIGZvcm1hdERlc2MoZ2FtZS5kZXNjKSkpLmpvaW4oJ1xcbicpO1xuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLm1haW4tYm9keVwiKS5pbm5lckhUTUwgPSBhcHBsaWVkVGVtcGxhdGVzO1xuICAgIH1cblxuICAgIGdlbmVyYXRlR2FtZXModGVzdEFycik7XG59XG5tb2R1bGUuZXhwb3J0cz0ge1xuICAgIGluaXQsXG59XG4iLCJjb25zdCBwdWJsaWNHYW1lUm93ID0gKGlkLCBjb3ZlckFydCwgdGl0bGUsIGRlc2MpID0+IHtcbiAgICBjb25zb2xlLmxvZyhjb3ZlckFydCk7XG4gICAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1zdGFydCBpdGVtLXJvd3MgYm9yZGVyIHB1YmxpYy1nYW1lLXJvd3NcIiBkYXRhLWlkPVwiJHtpZH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC00XCI+XG4gICAgICAgICAgICA8aW1nIHNyYz1cIiR7Y292ZXJBcnR9XCIgaGVpZ2h0PVwiMTUwcHhcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtOFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtc3RhcnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLThcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgyPiR7dGl0bGV9PC9oMj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPHVsIGlkPVwiYWN0b3ItbGlzdFwiIGRhdGEtaWQ9JHtpZH0+IDwvdWw+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtY2VudGVyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2xcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPiR7ZGVzY308L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIGBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHB1YmxpY0dhbWVSb3csXG59Il19
