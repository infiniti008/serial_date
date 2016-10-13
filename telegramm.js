var TelegramBot = require('node-telegram-bot-api');

var token = '243522358:AAGAH71YYI5eXXXNrtZODeh82ET_Dfg5KrQ';
// Setup polling way
function new_message(){

  var bot = new TelegramBot(token, {polling: true});

  // Matches /echo [whatever]
  bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    // console.log(resp);
    // bot.sendMessage(fromId, resp);
  });

  bot.onText(/\/add (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    resp = resp + '111111';
    // console.log(resp);
    // bot.sendMessage(fromId, resp);
  });

}

// Any kind of message
// bot.on('message', function (msg) {
//   var chatId = msg.chat.id;
//   // photo can be: a file path, a stream or a Telegram file_id
//   var photo = 'cats.png';
//   bot.sendPhoto(chatId, photo, {caption: 'Lovely kittens'});
// });


module.exports = {
  new_message : new_message
}
