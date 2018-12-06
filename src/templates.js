const publicGameRow = (id, coverArt, title, desc) => {
    return `
    <div class="row justify-content-start item-rows border public-game-rows" data-id="${id}">
        <div class="col-2">
            <img class="cover-art" src="${coverArt}" height="150px" width="125">
        </div>
        <div class="col-10">
            <div class="row justify-content-start">
                <div class="col-8">
                    <h2>${title}</h2>
                </div>
                <div class="col-4" id="platform-area" data-id="${id}">
                    
                </div>
                <div class="row justify-content-center">
                    <div class="col">
                        <p class="public-game-rows-text">${desc}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
};

// const gameHeaders =()=> {
//     return `<div class="row justify-content-start item-rows border public-game-rows">The Games</div>`
// }

const platformTagXbox = (name) => {
    return `
    <span class="badge badge-success">${name}</span>
    `
}

const platformTagPS4 = (name) => {
    return `
    <span class="badge badge-primary">${name}</span>
    `
}

const platformTagPC = (name) => {
    return `
    <span class="badge badge-dark">${name}</span>
    `
}

const platformTagSwitch = (name) => {
    return `
    <span class="badge badge-danger">${name}</span>
    `
}

const addplatformAvailable = (id, name) => {
    return `
    <option id="${id}">${name}</option>
    `
}

const addplatformOwned = (id, name) => {
    return `
    <option data-id="${id}" disabled>${name}: You Already Own One</option>
    `
}


const addPlatformModal = () => {
    return `
        <div class="modal fade" id="add-platform-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">Select a Platform to Add to Your Collection</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                    </div>
                    <div class="modal-body platformList">
                            <form id="add-platform-to-user">
                                <select class="form-control" id="platform-options">
                                    <option>Select a Platform to Add</option>

                                </select>  
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <input type="submit" class="btn btn-primary" id="ad-platform" value="ADD">
                                </div>
                            </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`
}

module.exports = {
    publicGameRow,
    platformTagXbox,
    platformTagPS4,
    platformTagPC,
    platformTagSwitch,
    addPlatformModal,
    platformTagSwitch,
    addplatformAvailable,
    addplatformOwned,
    // ,gameHeaders

}