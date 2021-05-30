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

  await axios.post(process.env.BOT_URI, {
    chat_id: event.chat_id,
    text: event.text,
  });
};
