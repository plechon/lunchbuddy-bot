var $ = require('cheerio');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request-promise');

var zelenaKocka = async(function () {
    var data = await(request.get({
        url: "http://www.zelenakocka.cz"
    }));

    var res = [];

    var parsedHTML = $.load(data);
    parsedHTML('#dnesni-menu br').map(function () {
        var name = this.nextSibling.nodeValue;

        if (name && name.indexOf("cena ,- Kč") < 0) {
            res.push({
                "name": name
            });
        }
    });

    return res;
});

var lightOfIndia = async(function () {
    var data = await(request.get({
        url: "http://www.lightofindia.cz/"
    }));

    var res = [];

    var parsedHTML = $.load(data);

    parsedHTML('p > br').map(function () {
        var name;
        if (this.nextSibling) {
            name = this.nextSibling.nodeValue;
        } else {
            name = $(this).nextUntil("p").text();
        }
        if (name && name.match("^.*Kč.*")) {
            res.push({
                "name": name
            });
        }
    });

    return res;
});

var seven = async(function () {
    var res = [];

    res.push({
        "name": "https://www.facebook.com/7FoodTrio/"
    });

    return res;
});

var lokofu = async(function () {
    var res = [];

    res.push({
        "name": "https://www.zomato.com/cs/brno/lokofu-veveří-brno-střed/menu"
    });

    return res;
});

var pagoda = async(function () {
    var res = [];

    res.push({
        "name": "Gyros && (nudle || hranolky || rýže)"
    });

    return res;
});

module.exports = {
    handles: function (restaurant) {
        return restaurant == "menu-kocka" || restaurant == "menu-light" || restaurant == "menu-seven" || restaurant == "menu-lokofu" || restaurant == "menu-pagoda";
    },

    restaurants: function () {
        return ["menu-kocka", "menu-light", "menu-seven", "menu-lokofu", "menu-pagoda"]
    },

    get: async(function (restaurant) {
        switch (restaurant) {
            case "menu-kocka":
                return await(zelenaKocka());
            case "menu-light":
                return await(lightOfIndia());
            case "menu-seven":
                return await(seven());
            case "menu-lokofu":
                return await(lokofu());
            case "menu-pagoda":
                return await(pagoda());
        }
    }),

    name: function (restaurant) {
        switch (restaurant) {
            case "menu-kocka":
                return "Zelená kočka";
            case "menu-light":
                return "Light of India";
            case "menu-seven":
                return "Seven";
            case "menu-lokofu":
                return "Lokofu";
            case "menu-pagoda":
                return "Asijské bistro Pagoda";
        }
    }
};