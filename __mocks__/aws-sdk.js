const mockAwsPromise = jest.fn();

const mockSSMGetParameter = jest.fn(() => ({
  promise: mockAwsPromise,
}));

const SSM = jest.fn(() => ({
  getParameter: mockSSMGetParameter,
}));

module.exports = {
  mockAwsPromise,
  mockSSMGetParameter,
  SSM,
};
