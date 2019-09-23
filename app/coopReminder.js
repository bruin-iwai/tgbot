const axios = require('axios').default;
const AWS = require('aws-sdk');

const ssm = new AWS.SSM();

module.exports.handler = async (event) => {
  const botUri = await ssm
    .getParameter({
      Name: '/CoopReminder/BOT_URI',
      WithDecryption: true,
    })
    .promise()
    .then((ret) => ret.Parameter.Value);

  await axios.post(botUri, {
    chat_id: event.chat_id,
    text: event.text,
  });
};
