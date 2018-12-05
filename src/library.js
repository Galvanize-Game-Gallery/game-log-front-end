function init() {

    const create = require('./templates');

    const testArr = [
        {
        igdb_id: 41608,
        title: 'Halo: The Master Chief Collection',
        cover_url: '//images.igdb.com/igdb/image/upload/t_thumb/kuaub4pjaajuepmlxuq3.jpg',
        desc: 'Relive the greatest adventures of the ultimate solder with Halo: The Master Chief Collection, which includes the complete story of the Master Chief on one console for the first time ever. Halo: Combat Evolved , Halo 2, Halo 3 and Halo 4 are all packed into this massive package. And not only is the debut Halo delivered in its acclaimed Anniversary package, but for the first time, an entirely remastered version of the iconic sequel that revolutionized online console gaming is available with the Halo 2 Anniversary version of the game. This collection lets you experience Halo in an all-new way, at higher visual fidelity running at 60 frames per second (fps) on dedicated servers. \n \nHalo: The Master Chief Collection features curated campaign and multiplayer playlists across all four games and features more than 100 multiplayer maps -- authentic to their original release. In addition, Halo 2 Anniversary includes six all-new maps built from the ground up for Xbox One.'
    },
    {
        igdb_id: 25076, 
        title: 'Red Dead Redemption 2', 
        cover_url: '//images.igdb.com/igdb/image/upload/t_thumb/yfk9f2lbo0r7slytuhra.jpg' ,
        desc: 'Developed by the creators of Grand Theft Auto V and Red Dead Redemption, Red Dead Redemption 2 is an epic tale of life in America’s unforgiving heartland. The game\'s vast and atmospheric world will also provide the foundation for a brand new online multiplayer experience.' 
    }
];

    function generateGames(arr) {

        function formatCover(str) {
            let newStr = str.slice(2);
            return `http://${newStr}`;
        };

        function formatDesc(str) {
            if(str.length <= 300) {
                return str
            } else {
                let newStr = str.slice(0, 300)
                return `${newStr}...`;
            }
        }

        const appliedTemplates = arr.map(game => create.publicGameRow(game.igdb_id, formatCover(game.cover_url), game.title, formatDesc(game.desc))).join('\n');
        document.querySelector(".main-body").innerHTML = appliedTemplates;
    }

    generateGames(testArr);
  
  function addNewEvent(){

    document.getElementById('add-new-game').addEventListener('click', function(e) {
        e.preventDefault()
        window.location = '/newlibgame.html'
    })
}

}
module.exports= {
    init,
}

