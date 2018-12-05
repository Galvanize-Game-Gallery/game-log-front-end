function init() {
    const create = require('./templates');
    const game = "http://localhost:3000/game";
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
            let newStr = str.slice(2);
            return `http://${newStr}`;
        };

        function formatDesc(str) {
            if (str.length <= 300) {
                return str
            } else {
                let newStr = str.slice(0, 300)
                return `${newStr}...`;
            }
        }

        const appliedTemplates = arr.map(game => create.publicGameRow(game.igdb_id, formatCover(game.cover_url), game.title, formatDesc(game.desc))).join('\n');
        document.querySelector(".main-body").innerHTML = appliedTemplates;

        for (let game of arr) {
            
        }
    }

    function addNewEvent() {

        document.getElementById('add-new-game').addEventListener('click', function (e) {
            e.preventDefault()
            window.location = '/newlibgame.html'
        })
    }
    getlibrary();
}


module.exports= {
    init,
}

