const axios = require('axios');
const { handler } = require('../app/coopReminder');
const { mockAwsPromise, mockSSMGetParameter } = require('../__mocks__/aws-sdk');

jest.mock('axios');

describe('coopReminder', () => {
  test('normal', async () => {
    axios.default.post.mockResolvedValueOnce();
    mockAwsPromise.mockResolvedValueOnce({
      Parameter: {
        Value: 'https://api.telegram.org/hogehoge/sendMessage',
      },
    });

    await handler({
      chat_id: -3135,
      text: 'こんにちは',
    });

    expect(axios.default.post).toHaveBeenCalledTimes(1);
    expect(axios.default.post).toHaveBeenCalledWith(
      'https://api.telegram.org/hogehoge/sendMessage',
      {
        chat_id: -3135,
        text: 'こんにちは',
      }
    );
    expect(mockSSMGetParameter).toHaveBeenCalledTimes(1);
    expect(mockSSMGetParameter).toHaveBeenCalledWith({
      Name: '/CoopReminder/BOT_URI',
      WithDecryption: true,
    });
  });

  test('comm error', async () => {
    axios.default.post.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });
    mockAwsPromise.mockResolvedValueOnce({
      Parameter: {
        Value: 'https://api.telegram.org/hogehoge/sendMessage',
      },
    });

    try {
      await handler({
        chat_id: -4135,
        text: 'さようなら',
      });
    } catch (err) {
      expect(err.response.status).toEqual(500);
    }

    expect(axios.default.post).toHaveBeenCalledTimes(1);
    expect(axios.default.post).toHaveBeenCalledWith(
      'https://api.telegram.org/hogehoge/sendMessage',
      {
        chat_id: -4135,
        text: 'さようなら',
      }
    );
    expect(mockSSMGetParameter).toHaveBeenCalledTimes(1);
    expect(mockSSMGetParameter).toHaveBeenCalledWith({
      Name: '/CoopReminder/BOT_URI',
      WithDecryption: true,
    });
  });
});
