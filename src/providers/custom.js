var $ = require('cheerio');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request-promise');

// var zelenaKocka = async(function () {
//     var data = await(request.get({
//         url: "http://www.zelenakocka.cz"
//     }));
//
//     var res = [];
//
//     var parsedHTML = $.load(data);
//     parsedHTML('#dnesni-menu br').map(function () {
//         var name = this.nextSibling.nodeValue;
//
//         if (name && name.indexOf("cena ,- Kč") < 0) {
//             res.push({
//                 "name": name
//             });
//         }
//     });
//
//     return res;
// });
//
// var lightOfIndia = async(function () {
//     var data = await(request.get({
//         url: "http://www.lightofindia.cz/"
//     }));
//
//     var res = [];
//
//     var parsedHTML = $.load(data);
//
//     parsedHTML('p > br').map(function () {
//         var name;
//         if (this.nextSibling) {
//             name = this.nextSibling.nodeValue;
//         } else {
//             name = $(this).nextUntil("p").text();
//         }
//         if (name && name.match("^.*Kč.*")) {
//             res.push({
//                 "name": name
//             });
//         }
//     });
//
//     return res;
// });
//
// var madanMohan = async(function () {
//     var data = await(request.get({
//         url: "http://www.madanmohan.cz/menu/"
//     }));
//
//     var res = [];
//
//     res.push({
//         "name": "Rozvoz zdarma, menu 89 Kč, objednávka nejpozději do 9:15 (http://www.madanmohan.cz/objednat-obed)"
//     });
//
//     var parsedHTML = $.load(data);
//
//     parsedHTML("div.today").parent().parent().find("li").map(function () {
//         var name = $(this).text();
//         res.push({
//             "name": name
//         });
//     });
//
//     return res;
// });

var ohPho = async(function () {
    var res = [];

    res.push({
        "name": "https://www.facebook.com/pg/ohphobrno/photos/?tab=album&album_id=1118477601568286"
    });

    return res;
});

var podloubi = async(function () {
    var res = [];

    res.push({
        "name": "https://www.facebook.com/128155897986/photos/a.228426292986.133732.128155897986/10153352299757987/?type=3&theater"
    });

    return res;
});

var vitalite = async(function () {
    var res = [];

    res.push({
        "name": "http://www.vitalite.cz/restaurace/"
    });

    return res;
});

var pivniDvere = async(function () {
    var res = [];

    res.push({
        "name": "http://www.pivnidvere.cz/denni-menu/"
    });

    return res;
});

module.exports = {
    handles: function (restaurant) {
        return restaurant == "menu-ohpho" || restaurant == "menu-podloubi" || restaurant == "menu-vitalite" || restaurant == "menu-pivnidvere";
    },

    restaurants: function () {
        return ["menu-ohpho", "menu-podloubi", "menu-vitalite", "menu-pivnidvere"]
    },

    get: async(function (restaurant) {
        switch (restaurant) {
            case "menu-ohpho":
                return await(ohPho());
            case "menu-podloubi":
                return await(podloubi());
            case "menu-vitalite":
                return await(vitalite());
            case "menu-pivnidvere":
                return await(pivniDvere());
        }
    }),

    name: function (restaurant) {
        switch (restaurant) {
            case "menu-ohpho":
                return "Oh Pho";
            case "menu-podloubi":
                return "Podloubí";
            case "menu-vitalite":
                return "Vitalité";
            case "menu-pivnidvere":
                return "Pivní dveře";
        }
    }
};