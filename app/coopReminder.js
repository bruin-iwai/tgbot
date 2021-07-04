const { SSM, GetCalendarStateCommand } = require('@aws-sdk/client-ssm');
const AWSXRay = require('aws-xray-sdk');
// AWSXRay.captureHTTPsGlobal(require('http'));
// AWSXRay.captureHTTPsGlobal(require('https'));

module.exports.handler = async (event) => {
  // AWSXRay.capturePromise();
  // eslint-disable-next-line global-require
  const axios = require('axios').default;

  // ChanageCalendarがopenでないときはスキップする
  const ssm = AWSXRay.captureAWSv3Client(new SSM({}));
  const command = new GetCalendarStateCommand({
    CalendarNames: [process.env.CALENDAR_NAME],
  });
  const state = await ssm.send(command).then((ret) => ret.State);
  if (state !== 'OPEN') {
    console.log('Calendar is not open, then skipped.');
    return;
  }

  await axios.post(process.env.BOT_URI, {
    chat_id: event.chat_id,
    text: event.text,
  });
};
