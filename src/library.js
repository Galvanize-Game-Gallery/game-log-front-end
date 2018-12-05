function addNewEvent(){
    document.getElementById('add-new-game').addEventListener('click', function(e) {
        e.preventDefault()
        window.location = '/newlibgame.html'
    })
}

function init(){
    addNewEvent
}

module.exports = {init}