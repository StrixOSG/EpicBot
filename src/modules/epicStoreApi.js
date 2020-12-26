const fetch = require('node-fetch');

module.exports = {
    async getFreeGames() {
        const url = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=IN&allowCountries=IN';
        const freeGamesData = [];
        let error;
        try {
            const freeGamesResp = await fetch(url);
            const freeGamesJson = await freeGamesResp.json();
            for (let i = 1; i < freeGamesJson.data.Catalog.searchStore.elements.length; i++) {
                const obj = freeGamesJson.data.Catalog.searchStore.elements[i];
                const imageUrl = obj.keyImages.reduce((acc, cur) => {
                    if (cur.type === 'DieselStoreFrontWide') {
                        return cur;
                    }
                    else {
                        return acc;
                    }
                }).url;

                if (obj.promotions.promotionalOffers.length !== 0) {
                    const game = {
                        title: obj.title,
                        offerTill: new Date(
                            obj.promotions.promotionalOffers[0].promotionalOffers[0].endDate,
                        ),
                        image: imageUrl,
                        productSlug: obj.productSlug,
                    };
                    freeGamesData.push(game);
                }
            }
        }
        catch (e) {
            error = e;
        }

        return { freeGamesData, error };
    },
};