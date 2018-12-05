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
    return `
    <div class="row justify-content-start item-rows border public-game-rows" data-id="${id}">
        <div class="col-3 border">
            <img src="${coverArt}" height="150px" width="125">
        </div>
        <div class="col-9">
            <div class="row justify-content-start">
                <div class="col-8">
                    <h2>${title}</h2>
                </div>
                <div class="col-4">
                    <button id="edit-film" data-id="${id}" type="button" class="btn btn-success">Add</button>
                </div>
                <div class="row justify-content-center">
                    <div class="col">
                        <p class="public-game-rows-text">${desc}</p>
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIiwic3JjL2Rhc2hib2FyZC5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9saWJyYXJ5LmpzIiwic3JjL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBpbmRleCA9IHJlcXVpcmUoJy4vc3JjL2luZGV4Jyk7XG5jb25zdCBkYXNoYm9hcmQgPSByZXF1aXJlKCcuL3NyYy9kYXNoYm9hcmQnKTtcbmNvbnN0IGxpYnJhcnkgPSByZXF1aXJlKCcuL3NyYy9saWJyYXJ5Jyk7XG5jb25zdCBsaWJkZXRhaWxzID0gcmVxdWlyZSgnLi9zcmMvbGliZGV0YWlscycpXG5cbmNvbnN0IHBhZ2VJbml0aWFsaXphdGlvbiA9IHtcbiAgJy8nIDogaW5kZXguaW5pdCxcbiAgJy9pbmRleC5odG1sJzogaW5kZXguaW5pdCxcbiAgJy9kYXNoYm9hcmQuaHRtbCc6IGRhc2hib2FyZC5pbml0LFxuICAnL2xpYnJhcnkuaHRtbCc6IGxpYnJhcnkuaW5pdCxcbiAgJy9saWJkZXRhaWxzLmh0bWwnOiBsaWJkZXRhaWxzLmluaXRcbn1cblxuY29uc3QgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuaWYocGFnZUluaXRpYWxpemF0aW9uLmhhc093blByb3BlcnR5KHBhdGgpKSB7XG4gIHBhZ2VJbml0aWFsaXphdGlvbltwYXRoXSgpXG59XG5lbHNlIHtcbiAgY29uc29sZS5lcnJvcihgJHtwYXRofSBkb2VzIG5vdCBoYXZlIGFuIGluaXRpYWxpemVyYClcbn0iLCIiLCIvLyBsZXQgYXhpb3MgPSByZXF1aXJlKCdheGlvcycpIC0gXCJyZXF1aXJlIGlzIG5vdCBkZWZpbmVkXCIgLSB1c2luZyBjZG5cblxuXG5mdW5jdGlvbiByZXF1ZXN0KHBhdGgsIG1ldGhvZCA9ICdnZXQnLCBib2R5ID0gbnVsbCkge1xubGV0IGJlYXJlclRva2VuID0gJydcbmNvbnN0IHRva2VuID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3Rva2VuJylcbmNvbnNvbGUubG9nKHRva2VuKVxuaWYodG9rZW4pe1xuICAgIGJlYXJlclRva2VuID0gYEJlYXJlciAke3Rva2VufWBcbiAgICBjb25zb2xlLmxvZygnYmVhcmVyVG9rZW46ICcgKyBiZWFyZXJUb2tlbilcbn1cblxucmV0dXJuIGF4aW9zKGBodHRwOi8vbG9jYWxob3N0OjMwMDAke3BhdGh9YCwge1xuICAgIG1ldGhvZDogbWV0aG9kLFxuICAgIGhlYWRlcnM6IHtcbiAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgJ0F1dGhvcml6YXRpb24nOiBiZWFyZXJUb2tlblxuICAgIH0sXG4gICAgZGF0YTogYm9keVxufSlcbn1cblxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4geyAgICBcblxuICAgIGxldCBzdWJtaXRTaWduID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdC1zaWduaW4nKVxuXG4gICAgc3VibWl0U2lnbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsZXQgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcm5hbWUnKS52YWx1ZVxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFzc3dvcmQnKS52YWx1ZVxuICAgICAgICBjb25zb2xlLmxvZyh1c2VybmFtZSwgcGFzc3dvcmQpXG5cbiAgICAgICAgcmVxdWVzdCgnL2F1dGgvdG9rZW4nLCAncG9zdCcsIHsgdXNlcm5hbWUgLCBwYXNzd29yZCB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3Rva2VuJywgcmVzcG9uc2UuZGF0YS50b2tlbilcbiAgICAgICAgd2luZG93LmxvY2F0aW9uID0gJ2Rhc2hib2FyZC5odG1sJ1xuICAgICAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgYWxlcnQoJ0xvZ2luIGZhaWxlZCcpXG4gICAgICAgICAgICB0aHJvdyB7ZXJyb3I6IHtzdGF0dXM6IDQwMCwgbWVzc2FnZTogYEF1dGhlbnRpY2F0aW9uIGZhaWxlZGB9fVxuICAgICAgICB9KVxuXG4gICAgfSlcblxuXG4gICAgbGV0IHN1Ym1pdENyZWF0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQtY3JlYXRlJylcblxuICAgIHN1Ym1pdENyZWF0ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgICBsZXQgdXNlcm5hbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXNlcm5hbWUtY3JlYXRlJykudmFsdWVcbiAgICAgICAgbGV0IGZuYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZuYW1lLWNyZWF0ZScpLnZhbHVlXG4gICAgICAgIGxldCBsbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsbmFtZS1jcmVhdGUnKS52YWx1ZVxuICAgICAgICBsZXQgcGFzc3dvcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGFzc3dvcmQtY3JlYXRlJykudmFsdWVcblxuICAgICAgICBheGlvcy5wb3N0KGBodHRwOi8vbG9jYWxob3N0OjMwMDAvdXNlcnNgLCB7IFwidXNlcm5hbWVcIjogdXNlcm5hbWUsIFwicGFzc3dvcmRcIjogcGFzc3dvcmQsIFwiZm5hbWVcIjogZm5hbWUsIFwibG5hbWVcIjogbG5hbWUgfSApXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7IFxuICAgICAgICAgICAgICAgIGFsZXJ0KCd1c2VyIGNyZWF0ZWQhJylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRocm93IHtlcnJvcjoge3N0YXR1czogNDAwLCBtZXNzYWdlOiBcIkNvdWxkIG5vdCBjcmVhdGUgdXNlclwifX1cbiAgICAgICAgICAgIH0pXG4gICAgfSlcblxufSlcblxuICAgIFxuXG5cbiIsImZ1bmN0aW9uIGluaXQoKSB7XG5cbiAgICBjb25zdCBjcmVhdGUgPSByZXF1aXJlKCcuL3RlbXBsYXRlcycpO1xuXG4gICAgY29uc3QgdGVzdEFyciA9IFtcbiAgICAgICAge1xuICAgICAgICBpZ2RiX2lkOiA0MTYwOCxcbiAgICAgICAgdGl0bGU6ICdIYWxvOiBUaGUgTWFzdGVyIENoaWVmIENvbGxlY3Rpb24nLFxuICAgICAgICBjb3Zlcl91cmw6ICcvL2ltYWdlcy5pZ2RiLmNvbS9pZ2RiL2ltYWdlL3VwbG9hZC90X3RodW1iL2t1YXViNHBqYWFqdWVwbWx4dXEzLmpwZycsXG4gICAgICAgIGRlc2M6ICdSZWxpdmUgdGhlIGdyZWF0ZXN0IGFkdmVudHVyZXMgb2YgdGhlIHVsdGltYXRlIHNvbGRlciB3aXRoIEhhbG86IFRoZSBNYXN0ZXIgQ2hpZWYgQ29sbGVjdGlvbiwgd2hpY2ggaW5jbHVkZXMgdGhlIGNvbXBsZXRlIHN0b3J5IG9mIHRoZSBNYXN0ZXIgQ2hpZWYgb24gb25lIGNvbnNvbGUgZm9yIHRoZSBmaXJzdCB0aW1lIGV2ZXIuIEhhbG86IENvbWJhdCBFdm9sdmVkICwgSGFsbyAyLCBIYWxvIDMgYW5kIEhhbG8gNCBhcmUgYWxsIHBhY2tlZCBpbnRvIHRoaXMgbWFzc2l2ZSBwYWNrYWdlLiBBbmQgbm90IG9ubHkgaXMgdGhlIGRlYnV0IEhhbG8gZGVsaXZlcmVkIGluIGl0cyBhY2NsYWltZWQgQW5uaXZlcnNhcnkgcGFja2FnZSwgYnV0IGZvciB0aGUgZmlyc3QgdGltZSwgYW4gZW50aXJlbHkgcmVtYXN0ZXJlZCB2ZXJzaW9uIG9mIHRoZSBpY29uaWMgc2VxdWVsIHRoYXQgcmV2b2x1dGlvbml6ZWQgb25saW5lIGNvbnNvbGUgZ2FtaW5nIGlzIGF2YWlsYWJsZSB3aXRoIHRoZSBIYWxvIDIgQW5uaXZlcnNhcnkgdmVyc2lvbiBvZiB0aGUgZ2FtZS4gVGhpcyBjb2xsZWN0aW9uIGxldHMgeW91IGV4cGVyaWVuY2UgSGFsbyBpbiBhbiBhbGwtbmV3IHdheSwgYXQgaGlnaGVyIHZpc3VhbCBmaWRlbGl0eSBydW5uaW5nIGF0IDYwIGZyYW1lcyBwZXIgc2Vjb25kIChmcHMpIG9uIGRlZGljYXRlZCBzZXJ2ZXJzLiBcXG4gXFxuSGFsbzogVGhlIE1hc3RlciBDaGllZiBDb2xsZWN0aW9uIGZlYXR1cmVzIGN1cmF0ZWQgY2FtcGFpZ24gYW5kIG11bHRpcGxheWVyIHBsYXlsaXN0cyBhY3Jvc3MgYWxsIGZvdXIgZ2FtZXMgYW5kIGZlYXR1cmVzIG1vcmUgdGhhbiAxMDAgbXVsdGlwbGF5ZXIgbWFwcyAtLSBhdXRoZW50aWMgdG8gdGhlaXIgb3JpZ2luYWwgcmVsZWFzZS4gSW4gYWRkaXRpb24sIEhhbG8gMiBBbm5pdmVyc2FyeSBpbmNsdWRlcyBzaXggYWxsLW5ldyBtYXBzIGJ1aWx0IGZyb20gdGhlIGdyb3VuZCB1cCBmb3IgWGJveCBPbmUuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBpZ2RiX2lkOiAyNTA3NiwgXG4gICAgICAgIHRpdGxlOiAnUmVkIERlYWQgUmVkZW1wdGlvbiAyJywgXG4gICAgICAgIGNvdmVyX3VybDogJy8vaW1hZ2VzLmlnZGIuY29tL2lnZGIvaW1hZ2UvdXBsb2FkL3RfdGh1bWIveWZrOWYybGJvMHI3c2x5dHVocmEuanBnJyAsXG4gICAgICAgIGRlc2M6ICdEZXZlbG9wZWQgYnkgdGhlIGNyZWF0b3JzIG9mIEdyYW5kIFRoZWZ0IEF1dG8gViBhbmQgUmVkIERlYWQgUmVkZW1wdGlvbiwgUmVkIERlYWQgUmVkZW1wdGlvbiAyIGlzIGFuIGVwaWMgdGFsZSBvZiBsaWZlIGluIEFtZXJpY2HigJlzIHVuZm9yZ2l2aW5nIGhlYXJ0bGFuZC4gVGhlIGdhbWVcXCdzIHZhc3QgYW5kIGF0bW9zcGhlcmljIHdvcmxkIHdpbGwgYWxzbyBwcm92aWRlIHRoZSBmb3VuZGF0aW9uIGZvciBhIGJyYW5kIG5ldyBvbmxpbmUgbXVsdGlwbGF5ZXIgZXhwZXJpZW5jZS4nIFxuICAgIH1cbl07XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUdhbWVzKGFycikge1xuXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1hdENvdmVyKHN0cikge1xuICAgICAgICAgICAgbGV0IG5ld1N0ciA9IHN0ci5zbGljZSgyKTtcbiAgICAgICAgICAgIHJldHVybiBgaHR0cDovLyR7bmV3U3RyfWA7XG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZm9ybWF0RGVzYyhzdHIpIHtcbiAgICAgICAgICAgIGlmKHN0ci5sZW5ndGggPD0gMzAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0clxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgbmV3U3RyID0gc3RyLnNsaWNlKDAsIDMwMClcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7bmV3U3RyfS4uLmA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBhcHBsaWVkVGVtcGxhdGVzID0gYXJyLm1hcChnYW1lID0+IGNyZWF0ZS5wdWJsaWNHYW1lUm93KGdhbWUuaWdkYl9pZCwgZm9ybWF0Q292ZXIoZ2FtZS5jb3Zlcl91cmwpLCBnYW1lLnRpdGxlLCBmb3JtYXREZXNjKGdhbWUuZGVzYykpKS5qb2luKCdcXG4nKTtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYWluLWJvZHlcIikuaW5uZXJIVE1MID0gYXBwbGllZFRlbXBsYXRlcztcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUdhbWVzKHRlc3RBcnIpO1xufVxubW9kdWxlLmV4cG9ydHM9IHtcbiAgICBpbml0LFxufVxuIiwiY29uc3QgcHVibGljR2FtZVJvdyA9IChpZCwgY292ZXJBcnQsIHRpdGxlLCBkZXNjKSA9PiB7XG4gICAgcmV0dXJuIGBcbiAgICA8ZGl2IGNsYXNzPVwicm93IGp1c3RpZnktY29udGVudC1zdGFydCBpdGVtLXJvd3MgYm9yZGVyIHB1YmxpYy1nYW1lLXJvd3NcIiBkYXRhLWlkPVwiJHtpZH1cIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC0zIGJvcmRlclwiPlxuICAgICAgICAgICAgPGltZyBzcmM9XCIke2NvdmVyQXJ0fVwiIGhlaWdodD1cIjE1MHB4XCIgd2lkdGg9XCIxMjVcIj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtOVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBqdXN0aWZ5LWNvbnRlbnQtc3RhcnRcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLThcIj5cbiAgICAgICAgICAgICAgICAgICAgPGgyPiR7dGl0bGV9PC9oMj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTRcIj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cImVkaXQtZmlsbVwiIGRhdGEtaWQ9XCIke2lkfVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tc3VjY2Vzc1wiPkFkZDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cganVzdGlmeS1jb250ZW50LWNlbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInB1YmxpYy1nYW1lLXJvd3MtdGV4dFwiPiR7ZGVzY308L3A+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICAgIGBcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHB1YmxpY0dhbWVSb3csXG59Il19
