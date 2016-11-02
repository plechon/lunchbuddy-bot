var Bot = require('slackbots');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var zomato = require('./providers/zomato.js');
var custom = require('./providers/custom.js');
var schedule = require('node-schedule');

var providers = [zomato, custom];

var settings = {
    token: config.token,
    name: config.name
};

var bot = new Bot(settings);

var lunchChannelId = "C2E2Q8LSZ";

function isEmptyOrSpaces(str) {
    return str === null || str === undefined || str.match(/^ *$/) !== null;
}

function formatLine(record) {
    var line = "";
    if (!isEmptyOrSpaces(record.name)) {
        line += record.name.replace(/(\r\n|\n|\r)/gm, "").trim();
    }
    if (!isEmptyOrSpaces(record.price)) {
        line += " | " + record.price;
    }
    line += "\r\n\r\n";
    return line;
}

function sendResponse(id, data, title) {
    var res = "\r\n\r\n*" + title + "*\r\n\r\n";

    if (data.length == 0) {
        bot.postMessage(id, res + formatLine("data not available"));
        return;
    }

    data.forEach(function (line) {
        res = res + formatLine(line);
    });

    bot.postMessage(id, res);
}

function process(msg, id) {
    switch (msg) {
        case "menu-help":
            var restaurants = " *menu-all*,";

            providers.forEach(function (provider) {
                provider.restaurants().forEach(function (restaurant) {
                    restaurants = restaurants + " *" + restaurant + "*,";
                })
            });

            bot.postMessage(id, "I know" + restaurants.substring(0, restaurants.length - 1) + ".");
            break;

        case "menu-about":
            bot.postMessage(id, "Lunchbuddy bot by *Igor Kulman*, *Vojtěch Šobáň*");
            break;

        case "menu-all":
            providers.forEach(function (provider) {
                provider.restaurants().forEach(function (restaurant) {
                    if (provider.handles(restaurant)) {

                        provider.get(restaurant).then(function (data) {
                            sendResponse(id, data, provider.name(restaurant));
                        });
                    }
                })
            });
            break;

        default:
            providers.forEach(function (provider) {
                if (provider.handles(msg)) {
                    provider.get(msg).then(function (data) {
                        sendResponse(id, data, provider.name(msg));
                    });
                }
            });
            break;
    }
}

bot.on('start', function () {
    console.log("MoroLunchBuddy started.");
});

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm
    if (data.type == "message" && data.channel.startsWith(lunchChannelId)) {
        process(data.text, data.channel);
    }
});

/**
 * Starts on working day at 9:30 UTC.
 */
schedule.scheduleJob({hour: 9, minute: 30, dayOfWeek: new schedule.Range(1, 5)}, function() {
    console.log("All menus was sent to chanel brno-obed.");
    var date = new Date();
    var greeting;
    if (date.getDay() == 5) {
        // english friday
        greeting = "*Hi Brňáci, lunch time is coming so I'm sending daily menus. Enjoy your meal!*";
    } else {
        // normal working day
        greeting = "*Zdar Brňáci, čas obědu je na spadnutí, tak posílám dnešní obědová menu. Dobrou chuť!*";
    }

    bot.postMessage(lunchChannelId, greeting).then(function() {
        process("menu-all", lunchChannelId);
    });
});
