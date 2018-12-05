function addNewEvent(){

    document.getElementById('add-new-game').addEventListener('click', function(e) {
        e.preventDefault()
        window.location = '/newlibgame.html'
    })
}

function init(){
    addNewEvent()
}

//add to index for quick entry <a href='./library.html'>YES</a>

module.exports = {init}