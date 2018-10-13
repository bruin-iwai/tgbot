const axiosBase = require('axios');

module.exports.handler = async (event) => {
  const axios = axiosBase.create({
    baseURL: '',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  });

  const res = await axios.post(process.env.BOT_URI, {
    chat_id: event.chat_id,
    text: event.text,
  });
  if (res.status !== 200) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
};
