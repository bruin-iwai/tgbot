'use strict';
const index = require('./index');
const event = {
  'chat_id': -25511902,
  'text': 'テスト通知です。\nたびたびごめん。'
};
index.handler(event, null, (err, result) => {
  if (err) {
    console.error(JSON.stringify(err));
    return;
  }
  console.log(JSON.stringify(result));
});
