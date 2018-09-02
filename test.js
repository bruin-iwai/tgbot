'use strict';
const index = require('./index');
const event = {
  'chat_id': -25511902,
  'text': 'テスト通知です。\nたびたびごめん。'
};
index.handler(event)
  .then(result => console.log(JSON.stringify(result)))
  .catch(err => console.error(JSON.stringify(err)));
