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

module.exports = {
    handles: function (restaurant) {
        return restaurant == "zelenaKocka" || restaurant == "lightOfIndia";
    },

    restaurants: function () {
        return ["zelenaKocka", "lightOfIndia"]
    },

    get: async(function (restaurant) {
        switch (restaurant) {
            case "zelenaKocka":
                return await(zelenaKocka());
            case "lightOfIndia":
                return await(lightOfIndia());
        }
    }),

    name: function (restaurant) {
        switch (restaurant) {
            case "zelenaKocka":
                return "Zelená kočka";
            case "lightOfIndia":
                return "Light of India";
        }
    }
};