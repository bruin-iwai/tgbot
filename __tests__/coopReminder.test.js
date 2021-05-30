const axios = require('axios');
const { handler } = require('../app/coopReminder');
const {
  mockAwsPromise,
  mockSSMGetParameter,
  mockSSMGetCalendarState,
} = require('../__mocks__/aws-sdk');

jest.mock('axios');

describe('coopReminder', () => {
  beforeEach(() => {
    process.env.CALENDAR_NAME = 'cc';
    process.env.BOT_URI = 'dd';
  });

  afterEach(() => {
    delete process.env.CALENDAR_NAME;
    delete process.env.BOT_URI;
  });

  test('normal', async () => {
    axios.default.post.mockResolvedValueOnce();
    mockAwsPromise.mockResolvedValueOnce({
      State: 'OPEN',
    });

    await handler({
      chat_id: -3135,
      text: 'こんにちは',
    });

    expect(axios.default.post).toHaveBeenCalledTimes(1);
    expect(axios.default.post).toHaveBeenCalledWith(process.env.BOT_URI, {
      chat_id: -3135,
      text: 'こんにちは',
    });
    expect(mockSSMGetCalendarState).toHaveBeenCalledTimes(1);
    expect(mockSSMGetCalendarState).toHaveBeenCalledWith({
      CalendarNames: [process.env.CALENDAR_NAME],
    });
  });

  test('comm error', async () => {
    axios.default.post.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });
    mockAwsPromise.mockResolvedValueOnce({
      State: 'OPEN',
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
    expect(axios.default.post).toHaveBeenCalledWith(process.env.BOT_URI, {
      chat_id: -4135,
      text: 'さようなら',
    });
    expect(mockSSMGetCalendarState).toHaveBeenCalledTimes(1);
    expect(mockSSMGetCalendarState).toHaveBeenCalledWith({
      CalendarNames: [process.env.CALENDAR_NAME],
    });
  });

  test('skip by calendar', async () => {
    mockAwsPromise.mockResolvedValueOnce({
      State: 'CLOSED',
    });

    await handler({
      chat_id: -4135,
      text: 'もしもし',
    });

    expect(axios.default.post).not.toHaveBeenCalled();
    expect(mockSSMGetCalendarState).toHaveBeenCalledTimes(1);
    expect(mockSSMGetCalendarState).toHaveBeenCalledWith({
      CalendarNames: [process.env.CALENDAR_NAME],
    });
    expect(mockSSMGetParameter).not.toHaveBeenCalled();
  });
});
