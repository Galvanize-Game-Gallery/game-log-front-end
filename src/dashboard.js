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
  const userId = str.substring(str.indexOf('=')+1);
  const {request} = require('../utils');

  function getPlatforms() {
    return request(`/game/userplatforms/${userId}`,'get').then(function(result){
      return result.data;
    });
  };

  getPlatforms().then(function(result){
    console.log(result);
    renderNavBar(result);
  })

//dummy data
  
  let allPlatforms = [{id: 49, name: 'Xbox One'}, {id: 48, name: "Playstation 4"}, {id: 130, name: "Nintendo Switch"}, {id: 6, name: "PC"}];


//populate navbar
function renderNavBar(userPlatforms) {
  console.log(userPlatforms);
    let navBar = document.getElementById('nav-tab')
    navBar.innerHTML = ''
    for (let platform of userPlatforms) {
      if (userPlatforms.indexOf(platform) === 0) {
        navBar.innerHTML +=`<a class="nav-item nav-link btn active bg-secondary text-light nav-tab" id="${platform.igdb_id}" data-toggle="tab" role="tab"
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
    addPlatform.addEventListener('click', function(){
      $('#add-platform-modal').modal()
    })

    const modalOptions = document.querySelector('#platform-options');
    let userOptions = allPlatforms.map(function(platform){
      let result = userPlatforms.some(ele => {
        return platform.id === ele.igdb_id
      })
      if (result) {
        return create.addplatformOwned(platform.id, platform.name)
      } else {return create.addplatformAvailable(platform.id, platform.name)}
    })
    let userOptionsFinal = userOptions.join('\n');
    modalOptions.innerHTML += userOptionsFinal;

    const addPlatformButton = document.querySelector('#add-platform-to-user')
    addPlatformButton.addEventListener('submit', function(event){
      event.preventDefault();
      let selectedOption = Array.from(document.querySelectorAll(`option:checked`));
      let selectedStr = selectedOption[0].id;
      request(`/user/${userId}/platforms`,'post',{
        userId: userId,
        platformId: parseInt(selectedStr),
      }) 
      .then(function(){
        console.log('Platform Added');
        renderAccordion(selectedStr);
      })
    })
}


//populate accordion
function renderAccordion(curPlatform) {
  let accordion = document.getElementById('accordion')
  accordion.innerHTML = ''
  for (game of curPlatform.games) {
      let i = curPlatform.games.indexOf(game) + 1
      let show = ''
      if (i == 1) {
        show = 'show'//shows the first game by default
      }
      accordion.innerHTML +=
      `<div class="card">
      <div class="card-header" id="heading${i}">
        <h5 class="mb-0">
          <button class="btn btn-link" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true"
            aria-controls="collapse1">
            ${game.title}
          </button>
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
                    <p><strong>My rating: </strong>${game.rating}/5</p>            
            </div>
          </div>
        </div>
      </div>
      </div>`
  }    
}

// renderAccordion(xbox)





    // document.addEventListener('click', (e) => {
    //   if (e.target.matches('.nav-item')) {
    //     if (e.target.innerHTML === 'Xbox One') {
    //       renderAccordion(xbox)
    //     } else if (e.target.innerHTML === "Playstation 4") {
    //         renderAccordion(ps4)
    //     } else if (e.target.innerHTML === "Nintendo Switch") {
    //       renderAccordion(nintendoSwitch)
    //     } else if (e.target.innerHTML === 'PC') {
    //       renderAccordion(pc)
    //     }
      
    //   }
    // })









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
  
  
  
  
  headingUser.innerHTML = userName
  headingName.innerText = fullName
  
}

module.exports = { init }