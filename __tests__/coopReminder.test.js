const axios = require('axios');
const { handler } = require('../app/coopReminder');

jest.mock('axios');

describe('coopReminder', () => {
  test('normal', async () => {
    const post = jest.fn().mockResolvedValueOnce({ status: 200 });
    axios.create.mockReturnValueOnce({ post });

    await handler({
      chat_id: -3135,
      text: 'こんにちは',
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(process.env.BOT_URI, {
      chat_id: -3135,
      text: 'こんにちは',
    });
    expect(axios.create).toHaveBeenCalledTimes(1);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
  });

  test('comm error', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      status: 500,
      statusText: 'Internal Server Error',
    });
    axios.create.mockReturnValueOnce({ post });

    await expect(
      handler({
        chat_id: -4135,
        text: 'さようなら',
      })
    ).rejects.toThrow('500 Internal Server Error');

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith(process.env.BOT_URI, {
      chat_id: -4135,
      text: 'さようなら',
    });
    expect(axios.create).toHaveBeenCalledTimes(1);
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    });
  });
});
