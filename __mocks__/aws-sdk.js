const mockAwsPromise = jest.fn();

const mockSSMGetParameter = jest.fn(() => ({
  promise: mockAwsPromise,
}));

const mockSSMGetCalendarState = jest.fn(() => ({
  promise: mockAwsPromise,
}));

const SSM = jest.fn(() => ({
  getParameter: mockSSMGetParameter,
  getCalendarState: mockSSMGetCalendarState,
}));

module.exports = {
  mockAwsPromise,
  mockSSMGetParameter,
  mockSSMGetCalendarState,
  SSM,
};
