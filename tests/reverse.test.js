// Jest expects by default that the names of test files contain .test

// The ESLint configuration complains about the test and expect commands
// in our test file since the configuration does not allow globals.
// Adding "jest": true to the env property in the .eslintrc.js file
// removes the complaints

const reverse = require('../utils/for_testing').reverse


// Individual test cases are defined with the test function. The first
// parameter of the function is the test description as a string. The
// second parameter is a function, that defines the functionality for
// the test case.
test('reverse of a', () => {
  const result = reverse('a')

  expect(result).toBe('a')
})

test('reverse of react', () => {
  const result = reverse('react')

  expect(result).toBe('tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')

  expect(result).toBe('releveler')
})