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

module.exports = {
    handles: function (restaurant) {
        return restaurant == "kocka-menu" || restaurant == "light-menu" || restaurant == "seven";
    },

    restaurants: function () {
        return ["kocka-menu", "light-menu", "seven"]
    },

    get: async(function (restaurant) {
        switch (restaurant) {
            case "kocka-menu":
                return await(zelenaKocka());
            case "light-menu":
                return await(lightOfIndia());
            case "seven":
                return await(seven());
        }
    }),

    name: function (restaurant) {
        switch (restaurant) {
            case "kocka-menu":
                return "Zelená kočka";
            case "light-menu":
                return "Light of India";
            case "seven":
                return "Seven";
        }
    }
};