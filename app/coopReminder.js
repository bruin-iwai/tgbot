const axiosBase = require('axios');
const AWS = require('aws-sdk');

const ssm = new AWS.SSM();

module.exports.handler = async (event) => {
  const axios = axiosBase.create({
    baseURL: '',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });

  const botUri = await ssm
    .getParameter({
      Name: '/CoopReminder/BOT_URI',
      WithDecryption: true,
    })
    .promise()
    .then((ret) => ret.Parameter.Value);

  const res = await axios.post(botUri, {
    chat_id: event.chat_id,
    text: event.text,
  });
  if (res.status !== 200) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
};
