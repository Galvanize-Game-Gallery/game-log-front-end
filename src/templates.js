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
                <div class="col-4">
                    
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

module.exports = {
    publicGameRow,
}