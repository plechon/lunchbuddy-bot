var Bot = require('slackbots');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('config.json'));
var zomato = require('./providers/zomato.js');
var custom = require('./providers/custom.js');

var providers = [zomato, custom];

var settings = {
    token: config.token,
    name: config.name
};
var bot = new Bot(settings);

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function formatLine(record) {
    var line = record.name.replace(/(\r\n|\n|\r)/gm, "").trim();
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
    console.log('received: ' + msg);

    switch (msg) {
        case "help":
            var restaurants = "";

            providers.forEach(function (provider) {
                provider.restaurants().forEach(function (restaurant) {
                    restaurants = restaurants + " *" + restaurant + "*,";
                })
            });

            bot.postMessage(id, "I know" + restaurants.substring(0, restaurants.length - 1) + ".");
            break;

        case "about":
            bot.postMessage(id, "Lunchbuddy bot by *Igor Kulman*");
            break;

        case "moro-menu":
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
                    handled = true;

                    provider.get(msg).then(function (data) {
                        sendResponse(id, data, provider.name(msg));
                    });
                }
            });

            if (!handled) {
                bot.postMessage(id, "Sorry, I do not know " + msg + ". Use *help* to see what I know.");
            }
            break;
    }
}

bot.on('start', function () {
    console.log("bot started");
});

bot.on('message', function (data) {
    // all ingoing events https://api.slack.com/rtm 
    if (data.type == "message" && data.text.startsWith('<@' + bot.self.id + '>:')) {
        var msg = data.text.replace('<@' + bot.self.id + '>: ', '');
        process(msg, data.channel);
    }

    if (data.type == "message" && data.channel.startsWith('D') && !data.bot_id) {
        process(data.text, data.channel);
    }

});