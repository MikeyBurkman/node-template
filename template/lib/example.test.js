'use strict';

const expect = require('expect');
const testFile = __filename.replace('.test.js', '.js');

describe(__filename, function() {

  let sut;

  beforeEach(function() {
    sut = require(testFile);
  });

  it('Should add two positive numbers', function() {
    const res = sut.add(2, 4);
    expect(res).toEqual(6);
  });

  it('Should add two negative numbers', function() {
    const res = sut.add(-4, -5);
    expect(res).toEqual(-9);
  });
});
