const request = require('../utils')

function addEventListeners(){
    console.log('hello!')
    document.getElementById('searchSub').addEventListener('click', function(e){
        console.log('hello!')
        let searchBox = document.getElementById('searchText')
        searchIGDB(searchBox.value)
    })
}

function searchIGDB(searchString){
    request(`/games/${searchString}`, 'get')
    .then(result => {
        console.log(result)
    })


    // .then(result => {
    //     document.querySelector('#newSuccess').classList.remove('hide-confirm')
    //     setTimeout(() => {
    //         document.querySelector('#newSuccess').classList.add('hide-confirm')
    //         window.location = `/show.html?=${result.data[0].id}`
    //     }, 1000);
    // })
    // .catch(error => {
    //     if(error.response.status === 406) {alert("ERROR 406, Invalid Parameters: Ratings must be 1-5")}
    //     else {
    //         alert(error)
    //         window.location = '/home.html'
    //     }   
    // })
}

function init(){
    addEventListeners()
}

module.exports = {init}