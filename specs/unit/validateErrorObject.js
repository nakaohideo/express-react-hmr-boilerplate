import chai from 'chai';
import validateErrorObject from '../../build/server/utils/validateErrorObject';
let expect = chai.expect;

describe('#validateErrorObject', () => {
  it('should pass when there is no error', () => {
    expect(validateErrorObject({})).to.be.true;
    expect(validateErrorObject({
      nested: {},
    })).to.be.true;
    expect(validateErrorObject({
      multiple: {},
      nested: {},
      fields: {},
    })).to.be.true;
    expect(validateErrorObject({
      nested: {
        foo: {},
        bar: {},
      },
    })).to.be.true;
  });
  it('should reject when there is error', () => {
    expect(validateErrorObject({
      field1: 'some error happened to field1',
    })).to.be.false;
    expect(validateErrorObject({
      field1: 'some error happened to field1',
      field2: 'some error happened to field2',
    })).to.be.false;
    expect(validateErrorObject({
      nested: {
        field1: 'some error happened to nested field1',
      },
    })).to.be.false;
    expect(validateErrorObject({
      multiple: {
        nested1: 'some error happened to nested field1',
        nested2: 'some error happened to nested field2',
      },
    })).to.be.false;
    expect(validateErrorObject({
      deep: {
        nested: {
          field1: 'some error happened to deep nested field1',
        },
      },
    })).to.be.false;
  });
});
