function init() {

  let userID = function getUserID() {
    let linkID = window.location.search
    let userID = linkID.slice(4)
    return userID
  }
  userID()

  function dynamicLink(link, nav) {
    let linkID = window.location.search
    let userID = linkID.slice(4)
    dynamicLink = link + linkID
    nav.setAttribute('href', dynamicLink)
  }

  let navLibrary = document.querySelector('#navDashboard')
  let userLibraryLink = 'dashboard.html'
  dynamicLink(userLibraryLink, navLibrary)


  const create = require('./templates');
  const game = "https://lit-escarpment-87610.herokuapp.com/game";
  const axios = require('axios');

  function getlibrary() {
    axios.get(game + '/library')
      .then(function (result) {
        let library = result.data;
        generateGames(library);
      })
  };

  function generateGames(arr) {

    function formatCover(str) {
      if (str[0] === '/') {
        let newStr = str.slice(2);
        return `http://${newStr}`;
      } else {
        return str
      }
    };

    function formatDesc(str) {
      if (str.length <= 300) {
        return str
      } else {
        let newStr = str.slice(0, 300)
        return `${newStr}...`;
      }
    }

    // const headers = create.gameHeaders()

    const appliedTemplates = arr.map(game => create.publicGameRow(game.igdb_id, formatCover(game.cover_url), game.title, formatDesc(game.desc))).join('\n');
    // document.querySelector(".main-body").innerHTML = headers + appliedTemplates;
    document.querySelector(".main-body").innerHTML = appliedTemplates;

    for (let game of arr) {
      const platformList = [];
      for (let system of game.platforms) {
        if (system === 'Xbox One') {
          platformList.push(create.platformTagXbox(system))
        } else if (system === 'Playstation 4') {
          platformList.push(create.platformTagPS4(system))
        } else if (system === 'PC') {
          platformList.push(create.platformTagPC(system))
        } else {
          platformList.push(create.platformTagSwitch(system))
        }
      }
      const platformsFormatted = platformList.join('\n');
      document.querySelector(`#platform-area[data-id="${game.igdb_id}"`).innerHTML = platformsFormatted;
    }
  }

  function addNewEvent() {
    let link = '/newlibgame.html'
    let linkID = window.location.search
    let dynamicLink1 = link + linkID

    document.getElementById('add-new-game').addEventListener('click', function (e) {
      e.preventDefault()
      window.location = dynamicLink1
    })
  }
  addNewEvent()
  getlibrary();
}


module.exports = {
  init
}