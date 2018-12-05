const { request } = require('../utils')

function addEventListeners(){

    document.getElementById('searchSub').addEventListener('click', function(e){
        e.preventDefault()
        let alert =  document.querySelector('.alert')
        if(!alert.classList.contains('hide-confirm')) alert.classList.add('hide-confirm')
        let searchBox = document.getElementById('searchText')
            if(!searchBox.value){
                alert.classList.remove('hide-confirm')
            } 
            else {
                searchIGDB(searchBox.value)
            }
    })
}

function searchIGDB(searchString){
    return request(`/games/${searchString}`, 'get')
    .then(result => {
        console.log(result)
        render(result)
    })
}


function render(searchArray){
    let tbldiv = document.getElementById('tbl')
    while (tbldiv.hasChildNodes()) {
        tbldiv.removeChild(tbldiv.childNodes[0]);
    }

    let table = document.createElement('table')
    let hrow = document.createElement('tr')
        let hrowCA = document.createElement('th')
        hrowCA.innerText = 'Cover Art'
        let hrowtitle = document.createElement('th')
        hrowtitle.innerText = 'Game Title'
    hrow.appendChild(hrowCA)
    hrow.appendChild(hrowtitle)
    table.appendChild(hrow)
    // searchArray.forEach(element => {
        
    // });

    tbldiv.appendChild(table)
}

function init(){
    addEventListeners()
}

module.exports = {init}