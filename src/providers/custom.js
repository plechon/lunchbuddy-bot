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

var siamThai = async(function () {
    var data = await(request.get({
        url: "http://www.siamthai.cz/tydenni-menu/"
    }));

    // get actual day word name in Czech
    var date = new Date();
    var dayNumber = date.getDay()
    var dayWordArray = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    var dayWord = dayWordArray[dayNumber];

    var res = [];
    var parsedHTML = $.load(data);

    parsedHTML("h2:contains('" + dayWord + "')").parent().first().children().map(function () {
        var name = $(this).text().replace(/\s\s+/g, ' ').trim();
        if (name && name.length > 0) {
            if ((name.indexOf("Menu 1") === 0)
                || (name.indexOf("Menu 2") === 0)
                || (name.indexOf("Dezert") === 0)
                || (name.indexOf("Polévka") === 0)) {
                name = name + " " + $(this).nextAll().slice(0,3).text().trim();
                res.push({
                    "name": name
                });
            }
        }
    });

    return res;
});

var bistroFriends = async(function () {
    var data = await(request.get({
        url: "http://www.bistrofriends.cz/p/menu.html"
    }));

    // get actual day word name in Czech
    var date = new Date();
    var dayNumber = date.getDay()
    var dayWordArray = ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"];
    var dayWord = dayWordArray[dayNumber];

    var res = [];
    var parsedHTML = $.load(data);

    parsedHTML("td.xl66").filter(function() {
            return $(this).text() === dayWord;
        }).parent().nextAll().slice(0, 6).map(function () {
            var name = $(this).text();
            res.push({
                "name": name
            });
    });

    return res;
});

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

var namaskar = async(function () {
    var res = [];

    res.push({
        "name": "https://www.facebook.com/pg/Namaskarbrno/posts/"
    });

    return res;
});

module.exports = {
    handles: function (restaurant) {
        return restaurant == "menu-ohpho" || restaurant == "menu-podloubi" || restaurant == "menu-vitalite" || restaurant == "menu-pivnidvere"
            || restaurant == "menu-friends" || restaurant == "menu-siamthai" || restaurant == "menu-namaskar";
    },

    restaurants: function () {
        return ["menu-ohpho", "menu-podloubi", "menu-vitalite", "menu-pivnidvere", "menu-friends", "menu-siamthai", "menu-namaskar"]
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
            case "menu-friends":
                return await(bistroFriends());
            case "menu-siamthai":
                return await(siamThai());
            case "menu-namaskar":
                return await(namaskar());
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
            case "menu-friends":
                return "Bistro Friends";
            case "menu-siamthai":
                return "Siam Thai";
            case "menu-namaskar":
                return "Namaskar";
        }
    }
};