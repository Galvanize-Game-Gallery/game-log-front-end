function authorize(path, method = 'get', body = null) {
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


function init() {
  const create = require('./templates');
  const str = window.location.search;
  const userId = str.substring(str.indexOf('=') + 1);
  const { request } = require('../utils');


  function getPlatforms() {
    return request(`/game/userplatforms/${userId}`, 'get').then(function (result) {
      return result.data;
    });
  };

  getPlatforms().then(function (result) {
    renderNavBar(result);
    if (result) {
      renderAccordion(result[0].igdb_id)
    }
  })

  //dummy data we didn't have time to query properly
  let allPlatforms = [{ id: 49, name: 'Xbox One' }, { id: 48, name: "Playstation 4" }, { id: 130, name: "Nintendo Switch" }, { id: 6, name: "PC" }];


  //populate navbar
  function renderNavBar(userPlatforms) {
    let navBar = document.getElementById('nav-tab')
    navBar.innerHTML = ''
    for (let platform of userPlatforms) {
      if (userPlatforms.indexOf(platform) === 0) {
        navBar.innerHTML += `<a class="nav-item nav-link btn active bg-secondary text-light nav-tab" id="${platform.igdb_id}" data-toggle="tab" role="tab"
                    aria-controls="nav-home" aria-selected="true">${platform.name}</a>`
      } else {
        navBar.innerHTML +=
          `<a class="nav-item btn nav-link bg-secondary text-light nav-tab" id="${platform.igdb_id}" data-toggle="tab"  role="tab"
        aria-controls="nav-profile" aria-selected="false">${platform.name}</a>`
      }
    };
    navBar.innerHTML +=
      `<a class="nav-item btn nav-link bg-secondary text-light nav-tab" id="new-platform-tab" data-toggle="tab"  role="tab"
        aria-controls="nav-profile" data-toggle="modal" data-target="#add-platform-modal" aria-selected="false">Add a platform</a>`
    const add_modal = create.addPlatformModal();
    navBar.innerHTML += add_modal;

    const addPlatform = document.querySelector('#new-platform-tab');
    addPlatform.addEventListener('click', function () {
      $('#add-platform-modal').modal()
    })

    const modalOptions = document.querySelector('#platform-options');
    let userOptions = allPlatforms.map(function (platform) {
      let result = userPlatforms.some(ele => {
        return platform.id === ele.igdb_id
      })
      if (result) {
        return create.addplatformOwned(platform.id, platform.name)
      } else { return create.addplatformAvailable(platform.id, platform.name) }
    })
    let userOptionsFinal = userOptions.join('\n');
    modalOptions.innerHTML += userOptionsFinal;

    const addPlatformButton = document.querySelector('#add-platform-to-user')

    addPlatformButton.addEventListener('submit', function (event) {
      event.preventDefault();
      let selectedOption = Array.from(document.querySelectorAll(`option:checked`));
      let selectedStr = selectedOption[0].id;
      request(`/user/${userId}/platforms`, 'post', {
        userId: userId,
        platformId: parseInt(selectedStr),
      })
        .then(function () {
          console.log('Platform Added');
          // renderAccordion(selectedStr);
          window.location.reload()
          $('#add-platform-modal').modal('toggle'); //or  $('#IDModal').modal('hide');
          return false;
        })
    })
  }

  function populateGames(platformId) {
    return request(`/game/library/${userId}/${platformId}`)
      .then(function (result) {
        let dd = document.getElementById('addGameMenu')
        dd.innerHTML = ''
        if (result.data.length > 0) {
          for(let i = 0; i<result.data.length; i++){
            dd.innerHTML +=` <a class="dropdown-item addGamePlat" id=${result.data[i].igdb_id}>${result.data[i].title}</a>`
          }

          document.addEventListener('click', (e) => {
            if (e.target.matches('.addGamePlat')) { 
                return request(`/user/${userId}/platforms/${platformId}/games`, 'post', {"game_id": e.target.id})
                .then(result => {
                  location.reload()
                })
            }
          })

        }
        else {
          dd.innerHTML += `<a class="dropdown-item" id='None'>You Have Everything For That Platform!</a>`
        }
      });
  }

  //populate accordion
  function renderAccordion(curPlatform) {
    return request(`/game/usergames/${userId}/${curPlatform}`)
      .then(result => {
        if (result.data.length > 0) {
          for (let i = 0; i < result.data.length; i++) {
            let game = result.data[i]
            let show = ''
            if (i === 0) { show = 'show' } //shows first game by default
            //umm this is working but where do I tell it where accordion is?
            accordion.innerHTML +=
              `<div class="card">
      <div class="card-header" id="heading${i}">
        <h5 class="mb-0" id=${game.igdb_id}>
          <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true"
            aria-controls="collapse1">
            ${game.title}
          </button>
          <button class="btn btn-danger delPlatGame">Remove My Game</button>
          <button class="btn btn-success editPlatGame">Edit My Game</button>
        </h5>
      </div>
      <div id="collapse${i}" class="collapse ${show}" aria-labelledby="heading${i}" data-parent="#accordion">
        <div class="card-body">
          <div class="row justify-content-start">
            <img class="img img-fluid dashboard-image col-md-3" src="${game.cover_url}">
            <div class="col-9">
                  <h2>${game.title}</h2>
                    <p>${game.desc}
                    </p>
                    <p>
                      <strong>Notes:</strong>${game.notes}
                    </p>
                    <p><strong>My rating: </strong>${game.user_rating}/5</p>            
            </div>
          </div>
            <div class="row hide-confirm update-form" data-id="${game.igdb_id}">
              <form class="update-form" data-id="${game.igdb_id}">
                <div class="form-row justify-content-center">
                <div class="col-3">
                  <div class="menuBar">
                    <label class="menuBar" for="update-rating">Your Rating</label>
                    </div>
                      <input class="update-form-fields" type="text" data-id="${game.igdb_id}"  id="update-rating" value="${game.user_rating}">
                    </div>
                      <div class="col-6 item-columns">
                      <div class="menuBar">
                    <label class="menuBar" for="update-notes">Your Personal Notes</label>
                  </div>
                    <input class="update-form-fields" type="text" data-id="${game.igdb_id}"  id="update-title" value="${game.notes}">
                </div>
                  <div class="col-3 item-columns">
                    <button id = "stop-post" data-id="${game.igdb_id}" type="button" class="close-button btn-sm btn-outline-dark">X</button>
                    <input type="submit" class=" btn btn-primary" id="submit-update" data-id="${game.igdb_id}" value="Update My Game">
                  </div>
                </div>
                </div>
              </form>
            </div>
        </div>
      </div>
      </div>
      `
      const updateGameField = document.querySelector(`.update-form[data-id="${game.igdb_id}"]`);
      const closeUpdateForm = document.querySelector(`#stop-post[data-id="${game.igdb_id}"]`)

            document.addEventListener('click', (e) => {
              if (e.target.matches('.editPlatGame')) { 
                if (updateGameField.classList.contains('hide-confirm')) {
                  updateGameField.classList.remove('hide-confirm')
                } else {updateGameField.classList.add('hide-confirm')}
              }
              else if(e.target.matches('.delPlatGame')) {
                let gameId = e.target.parentNode.id
                  return request(`/user/${userId}/platforms/${curPlatform}/games/${gameId}`, 'delete')
                  .then(()=> {
                    location.reload()
                  })
              }
            })
          }
        }
        else {
          accordion.innerHTML +=
            `<div class="card">
        <div class="card-header" id="heading">
         <h5 class="mb-0">
          You Do Not Appear To Have Any Games For This Platform
         </h5>
        </div>
      </div>`
        }
        populateGames(curPlatform, userId)
        return
      })
  }

  document.addEventListener('click', (e) => {
    if (e.target.matches('.nav-item')) {
      if (e.target.innerHTML !== 'Add a platform') {
        document.getElementById('accordion').innerHTML = ''
        renderAccordion(e.target.id)
      }
    }
  })

  let headingUser = document.querySelector('h4')
  let headingName = document.querySelector('h5')

  function getUser() {
    return request(`/user/${userId}`).then(function (result) {
      return result.data;
    });
  };

  getUser().then(function (result) {
    if (result) {
      headingUser.innerHTML = result.username
      headingName.innerText = result.fname + ' ' + result.lname
    }
  })

  //place link variables for page here
  // dynamic link function
  function dynamicLink(link, nav) {
    let linkID = window.location.search
    let userID = linkID.slice(4)
    dynamicLink = link + linkID
    nav.setAttribute('href', dynamicLink)
  }

  // dynamic link invoke here. 
  let navLibrary = document.querySelector('#navlibrary')
  let userLibraryLink = 'library.html'
  dynamicLink(userLibraryLink, navLibrary)
}


module.exports = { init }