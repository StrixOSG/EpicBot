const fetch = require('node-fetch');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = {
    async getFreeGames() {
        const url = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=IN&allowCountries=IN';
        const freeGamesData = [];
        let error;
        try {
            const freeGamesResp = await fetch(url);
            const freeGamesJson = await freeGamesResp.json();
            for (let i = 0; i < freeGamesJson.data.Catalog.searchStore.elements.length; i++) {
                const obj = freeGamesJson.data.Catalog.searchStore.elements[i];
                const imageUrl = obj.keyImages.reduce((acc, cur) => {
                    if (cur.type === 'DieselStoreFrontWide') {
                        return cur;
                    }
                    else {
                        return acc;
                    }
                }).url;
                if (obj.promotions && obj.promotions.promotionalOffers.length !== 0) {
                    const endDate = obj.promotions.promotionalOffers[0].promotionalOffers[0].endDate;
                    const timezoneAdjustedEndDate = dayjs(endDate).tz('America/Regina').utc(true).format('YYYY-MM-DD, HH:mm A');
                    const game = {
                        title: obj.title,
                        offerTill: timezoneAdjustedEndDate,
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