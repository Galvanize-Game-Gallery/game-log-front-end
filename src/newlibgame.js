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
        render(result.data)
    })
}


function render(searchArray){
    let tbldiv = document.getElementById('tbl')
    if(document.querySelector('table')) {
        tbldiv.removeChild(document.querySelector('table'))
    }

    let table = document.createElement('table')
    table.className='container col-md-6 col-sm-6'
    let hrow = document.createElement('tr')
    hrow.className='row tab'
        let hrowCA = document.createElement('th')
        hrowCA.className='col-md-4 col-sm-4'
        hrowCA.innerText = 'Cover Art'
        let hrowtitle = document.createElement('th')
        hrowtitle.className='col-md-8 col-sm-8'
        hrowtitle.innerText = 'Game Title'
    hrow.appendChild(hrowCA)
    hrow.appendChild(hrowtitle)
    table.appendChild(hrow)

    searchArray.forEach(element => {
        let coverArt = (!element.cover || !element.cover.url) ? 'https://pbs.twimg.com/profile_images/999040468804550656/fz9_TwiQ_400x400.jpg' : `http:${element.cover.url}`
        let row = document.createElement('tr')
            row.className = 'row tab game'
            row.id = element.id
        let cover = document.createElement('td')
        let ca = document.createElement('img')
            ca.src = coverArt
        cover.appendChild(ca)
        cover.className='col-md-4 col-sm-4'
        let title = document.createElement('td')
            title.innerText = element.name
            title.className='col-md-8 col-sm-8'
        row.appendChild(cover)
        row.appendChild(title)
        table.appendChild(row)
    })
    tbldiv.appendChild(table)
}

function init(){
    addEventListeners()
}

module.exports = {init}