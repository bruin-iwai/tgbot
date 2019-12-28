const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));
const axios = require('axios').default;

const ssm = new AWS.SSM();

module.exports.handler = async (event) => {
  // ChanageCalendarがopenでないときはスキップする
  const state = await ssm
    .getCalendarState({
      CalendarNames: [process.env.CALENDAR_NAME],
    })
    .promise()
    .then((ret) => ret.State);
  if (state !== 'OPEN') {
    console.log('Calendar is not open, then skipped.');
    return;
  }

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
