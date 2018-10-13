const axios = require('axios');
const { handler } = require('../app/coopReminder');
const { mockAwsPromise, mockSSMGetParameter } = require('../__mocks__/aws-sdk');

jest.mock('axios');

describe('coopReminder', () => {
  test('normal', async () => {
    const post = jest.fn().mockResolvedValueOnce({ status: 200 });
    axios.create.mockReturnValueOnce({ post });
    mockAwsPromise.mockResolvedValueOnce({
      Parameter: {
        Value: 'https://api.telegram.org/hogehoge/sendMessage',
      },
    });

    await handler({
      chat_id: -3135,
      text: 'こんにちは',
    });

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('https://api.telegram.org/hogehoge/sendMessage', {
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
    expect(mockSSMGetParameter).toHaveBeenCalledTimes(1);
    expect(mockSSMGetParameter).toHaveBeenCalledWith({
      Name: '/CoopReminder/BOT_URI',
      WithDecryption: true,
    });
  });

  test('comm error', async () => {
    const post = jest.fn().mockResolvedValueOnce({
      status: 500,
      statusText: 'Internal Server Error',
    });
    axios.create.mockReturnValueOnce({ post });
    mockAwsPromise.mockResolvedValueOnce({
      Parameter: {
        Value: 'https://api.telegram.org/hogehoge/sendMessage',
      },
    });

    await expect(
      handler({
        chat_id: -4135,
        text: 'さようなら',
      })
    ).rejects.toThrow('500 Internal Server Error');

    expect(post).toHaveBeenCalledTimes(1);
    expect(post).toHaveBeenCalledWith('https://api.telegram.org/hogehoge/sendMessage', {
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
    expect(mockSSMGetParameter).toHaveBeenCalledTimes(1);
    expect(mockSSMGetParameter).toHaveBeenCalledWith({
      Name: '/CoopReminder/BOT_URI',
      WithDecryption: true,
    });
  });
});
