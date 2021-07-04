const axios = require('axios');

const mockSsmSend = jest.fn();
const mockSsmGetCalendarStateCommand = jest.fn();
jest.doMock('@aws-sdk/client-ssm', () => ({
  SSM: jest.fn(() => ({
    send: mockSsmSend,
  })),
  GetCalendarStateCommand: mockSsmGetCalendarStateCommand,
}));

const { handler } = require('../app/coopReminder');

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
    mockSsmSend.mockResolvedValueOnce({
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
    expect(mockSsmGetCalendarStateCommand).toHaveBeenCalledTimes(1);
    expect(mockSsmGetCalendarStateCommand).toHaveBeenCalledWith({
      CalendarNames: [process.env.CALENDAR_NAME],
    });
  });

  test('comm error', async () => {
    axios.default.post.mockRejectedValueOnce({
      response: {
        status: 500,
      },
    });
    mockSsmSend.mockResolvedValueOnce({
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
    expect(mockSsmGetCalendarStateCommand).toHaveBeenCalledTimes(1);
    expect(mockSsmGetCalendarStateCommand).toHaveBeenCalledWith({
      CalendarNames: [process.env.CALENDAR_NAME],
    });
  });

  test('skip by calendar', async () => {
    mockSsmSend.mockResolvedValueOnce({
      State: 'CLOSED',
    });

    await handler({
      chat_id: -4135,
      text: 'もしもし',
    });

    expect(axios.default.post).not.toHaveBeenCalled();
    expect(mockSsmGetCalendarStateCommand).toHaveBeenCalledTimes(1);
    expect(mockSsmGetCalendarStateCommand).toHaveBeenCalledWith({
      CalendarNames: [process.env.CALENDAR_NAME],
    });
  });
});
