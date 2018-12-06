
function init() {
  const create = require('./templates');
  const str = window.location.search;
  const userId = str.substring(str.indexOf('=')+1);
  const axios = require('axios');
  const userAPI = 'http://localhost:3000/user';

//dummy data
  
  let usersPlatforms = [{igdb_id: 49, name: 'Xbox One'}, {igdb_id: 52, name: "Nintendo Switch"}, {igdb_id: 51, name: "PC"}];
  const allPlatforms = [{igdb_id: 49, name: 'Xbox One'}, {igdb_id: 50, name: "Playstation 4"}, {igdb_id: 52, name: "Nintendo Switch"}, {igdb_id: 51, name: "PC"}];

  let ps4 ={name: "Playstation 4", games: [{title: "Red Dead Redemption 2", notes: `there's a snake in my boot!`, desc: `Developed by the creators of Grand Theft Auto V and
  Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
  unforgiving heartland. The game's vast and atmospheric world will also provide the
  foundation for a brand new online multiplayer experience.`, rating: 4, cover_url: '//images.igdb.com/igdb/image/upload/t_thumb/yfk9f2lbo0r7slytuhra.jpg'},
  {title: "Bill Laimbeer's Combat Basketball", notes: 'the b button does everything.', desc: `Developed by the creators of Grand Theft Auto V and
  Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
  unforgiving heartland. The game's vast and atmospheric world will also provide the
  foundation for a brand new online multiplayer experience.`, rating: 2, cover_url: 'https://vignette.wikia.nocookie.net/gamegrumps/images/f/fb/Bill_LaimbeersCombatBasketballCover.jpg/revision/latest?cb=20131129180958'},
  {title: "Bill Laimbeer's Combat Basketball", notes: 'the b button does everything.', desc: `Developed by the creators of Grand Theft Auto V and
  Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
  unforgiving heartland. The game's vast and atmospheric world will also provide the
  foundation for a brand new online multiplayer experience.`, rating: 1, cover_url: 'https://vignette.wikia.nocookie.net/gamegrumps/images/f/fb/Bill_LaimbeersCombatBasketballCover.jpg/revision/latest?cb=20131129180958'}
] }


  let xbox = {name: "Xbox One", games:  [{title: "Microsoft Cowboy Simulator 2007", notes: `someone poisoned the waterin hole!`, desc: `Developed by the creators of Grand Theft Auto V and
  Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
  unforgiving heartland. The game's vast and atmospheric world will also provide the
  foundation for a brand new online multiplayer experience.`, rating: 4, cover_url: 'https://static1.funidelia.com/54007-f4_large/mans-cowboy-costume-with-inflatable-horse.jpg'},
  {title: "Bill Laimbeer's Xbox Basketball", notes: 'the b button does everything.', desc: `Developed by the creators of Grand Theft Auto V and
  Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
  unforgiving heartland. The game's vast and atmospheric world will also provide the
  foundation for a brand new online multiplayer experience.`, rating: 2, cover_url: 'https://vignette.wikia.nocookie.net/gamegrumps/images/f/fb/Bill_LaimbeersCombatBasketballCover.jpg/revision/latest?cb=20131129180958'},
  {title: "Earthbound, now for Xbox", notes: 'the b button does everything.', desc: `Developed by the creators of Grand Theft Auto V and
  Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
  unforgiving heartland. The game's vast and atmospheric world will also provide the
  foundation for a brand new online multiplayer experience.`, rating: 1, cover_url: 'https://vignette.wikia.nocookie.net/gamegrumps/images/f/fb/Bill_LaimbeersCombatBasketballCover.jpg/revision/latest?cb=20131129180958'}
   
] }

let nintendoSwitch ={name: "Nintendo Switch", games: [{title: "Mario", notes: `jump on top of guys + run into a mushroom = good`, desc: `Developed by the creators of Grand Theft Auto V and
Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
unforgiving heartland. The game's vast and atmospheric world will also provide the
foundation for a brand new online multiplayer experience.`, rating: 4, cover_url: 'https://i.kym-cdn.com/photos/images/original/000/596/519/7d2.png'},
{title: "Bill Laimbeer's Combat Basketball", notes: 'the b button does everything.', desc: `Developed by the creators of Grand Theft Auto V and
Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
unforgiving heartland. The game's vast and atmospheric world will also provide the
foundation for a brand new online multiplayer experience.`, rating: 2, cover_url: 'https://vignette.wikia.nocookie.net/gamegrumps/images/f/fb/Bill_LaimbeersCombatBasketballCover.jpg/revision/latest?cb=20131129180958'},
{title: "Bill Laimbeer's Combat Basketball", notes: 'the b button does everything.', desc: `Developed by the creators of Grand Theft Auto V and
Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
unforgiving heartland. The game's vast and atmospheric world will also provide the
foundation for a brand new online multiplayer experience.`, rating: 1, cover_url: 'https://vignette.wikia.nocookie.net/gamegrumps/images/f/fb/Bill_LaimbeersCombatBasketballCover.jpg/revision/latest?cb=20131129180958'}
] }

let pc ={name: "PC", games: [{title: "The Curse of Monkey Island", notes: `there's a snake in my boot!`, desc: `Developed by the creators of Grand Theft Auto V and
Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
unforgiving heartland. The game's vast and atmospheric world will also provide the
foundation for a brand new online multiplayer experience.`, rating: 4, cover_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/26/The_Curse_of_Monkey_Island_artwork.jpg/220px-The_Curse_of_Monkey_Island_artwork.jpg'},
{title: "Bill Laimbeer's Combat Basketball", notes: 'the b button does everything.', desc: `Developed by the creators of Grand Theft Auto V and
Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
unforgiving heartland. The game's vast and atmospheric world will also provide the
foundation for a brand new online multiplayer experience.`, rating: 2, cover_url: 'https://vignette.wikia.nocookie.net/gamegrumps/images/f/fb/Bill_LaimbeersCombatBasketballCover.jpg/revision/latest?cb=20131129180958'},
{title: "Bill Laimbeer's Combat Basketball", notes: 'the b button does everything.', desc: `Developed by the creators of Grand Theft Auto V and
Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s
unforgiving heartland. The game's vast and atmospheric world will also provide the
foundation for a brand new online multiplayer experience.`, rating: 1, cover_url: 'https://vignette.wikia.nocookie.net/gamegrumps/images/f/fb/Bill_LaimbeersCombatBasketballCover.jpg/revision/latest?cb=20131129180958'}
] }

  window.addEventListener("DOMContentLoaded", function(event) {
    console.log('connected')
  
//populate navbar
function renderNavBar() {
    let navBar = document.getElementById('nav-tab')
    navBar.innerHTML = ''
    for (let platform of usersPlatforms) {
      if (usersPlatforms.indexOf(platform) === 0) {
        navBar.innerHTML +=`<a class="nav-item nav-link btn active" id="${platform.name}-tab" data-toggle="tab" role="tab"
                    aria-controls="nav-home" aria-selected="true">${platform.name}</a>`
      } else {
        navBar.innerHTML +=
        `<a class="nav-item btn nav-link" id="${platform.name}-tab" data-toggle="tab"  role="tab"
        aria-controls="nav-profile" aria-selected="false">${platform.name}</a>`
      }
    };
    navBar.innerHTML +=
        `<a class="nav-item btn nav-link" id="new-platform-tab" data-toggle="tab"  role="tab"
        aria-controls="nav-profile" data-toggle="modal" data-target="#add-platform-modal" aria-selected="false">Add a platform</a>`
    const add_modal = create.addPlatformModal();
    navBar.innerHTML += add_modal;

    const addPlatform = document.querySelector('#new-platform-tab');
    addPlatform.addEventListener('click', function(){
      $('#add-platform-modal').modal()
    })

    const modalOptions = document.querySelector('#platform-options');
    let userOptions = allPlatforms.map(function(platform){
      let result = usersPlatforms.some(userPlatform => {
        return platform.igdb_id === userPlatform.igdb_id
      })
      if (result) {
        return create.addplatformOwned(platform.igdb_id, platform.name)
      } else {return create.addplatformAvailable(platform.igdb_id, platform.name)}
    })
    let userOptionsFinal = userOptions.join('\n');
    modalOptions.innerHTML += userOptionsFinal;

    const addPlatformButton = document.querySelector('#add-platform-to-user')
    addPlatformButton.addEventListener('submit', function(event){
      event.preventDefault();
      let selectedOption = Array.from(document.querySelectorAll(`option:checked`));
      let selectedStr = selectedOption[0].id;
      console.log(typeof parseInt(selectedStr));
      axios.post(userAPI + `/${userId}/platforms`, {
        user_id: userId,
        platform_id: parseInt(selectedStr),
      })
      .then(function(){
        console.log('Platform Added');
        init();
      })
    })
}

renderNavBar()



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

renderAccordion(xbox)





    document.addEventListener('click', (e) => {
      // e.preventDefault()
      console.log('clicked!')
      if (e.target.matches('.nav-item')) {
        if (e.target.innerHTML === 'Xbox One') {
          renderAccordion(xbox)
        } else if (e.target.innerHTML === "Playstation 4") {
            renderAccordion(ps4)
        } else if (e.target.innerHTML === "Nintendo Switch") {
          renderAccordion(nintendoSwitch)
        } else if (e.target.innerHTML === 'PC') {
          renderAccordion(pc)
        }
      
      }
    })





















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



}

module.exports = { init }