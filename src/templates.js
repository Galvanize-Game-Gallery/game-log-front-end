const publicGameRow = (id, coverArt, title, desc) => {
    console.log(coverArt);
    return `
    <div class="row justify-content-start item-rows border public-game-rows" data-id="${id}">
        <div class="col-4">
            <img src="${coverArt}" height="150px">
        </div>
        <div class="col-8">
            <div class="row justify-content-start">
                <div class="col-8">
                    <h2>${title}</h2>
                </div>
                <div class="col-4">
                    <ul id="actor-list" data-id=${id}> </ul>
                </div>
                <div class="row justify-content-center">
                    <div class="col">
                        <p>${desc}</p>
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