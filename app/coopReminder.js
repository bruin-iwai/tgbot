const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));
const axios = require('axios').default;

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
