'use strict';

const axiosBase = require('axios');
const axios = axiosBase.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
});

module.exports.handler = (event, context, callback) => {
  axios.post(process.env.BOT_URI, {
    'chat_id': event.chat_id,
    'text': event.text
  }).then(res => {
    if (res.status !== 200) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    callback();
  }).catch(err => {
    callback(err);
  });
};
