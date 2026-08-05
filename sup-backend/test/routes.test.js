const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { validate, schemas, validateField } = require('../middleware/inputValidator');

describe('Input Validation & Payload Security Schemas', () => {
  test('validateField rejects missing required field', () => {
    const schema = { required: true, type: 'string' };
    const result = validateField(undefined, schema, 'testField');
    assert.equal(result, '"testField" is required.');
  });

  test('validateField rejects invalid data type', () => {
    const schema = { required: true, type: 'string' };
    const result = validateField(12345, schema, 'testField');
    assert.equal(result, '"testField" must be a string, got number.');
  });

  test('validateField passes valid string input', () => {
    const schema = { required: true, type: 'string', minLength: 3 };
    const result = validateField('Phoenix Project', schema, 'testField');
    assert.equal(result, null);
  });

  test('disruptResume schema requires resumeText', () => {
    const schema = schemas.disruptResume;
    assert.ok(schema.resumeText.required);
    assert.equal(validateField(undefined, schema.resumeText, 'resumeText'), '"resumeText" is required.');
  });

  test('judgeExplainer schema requires projectTitle', () => {
    const schema = schemas.judgeExplainer;
    assert.ok(schema.projectTitle.required);
    assert.equal(validateField(undefined, schema.projectTitle, 'projectTitle'), '"projectTitle" is required.');
  });

  test('signup schema enforces minLength on password', () => {
    const schema = schemas.signup;
    assert.ok(schema.password.required);
    const shortPassResult = validateField('123', schema.password, 'password');
    assert.ok(shortPassResult.includes('at least 6 characters'));
  });
});

describe('Middleware Validation Execution', () => {
  test('validate middleware returns 400 on missing required field', () => {
    const middleware = validate({ title: { type: 'string', required: true } });
    const req = { body: {} };
    let statusSet = 0;
    let jsonSent = null;

    const res = {
      status(s) {
        statusSet = s;
        return this;
      },
      json(data) {
        jsonSent = data;
        return this;
      }
    };

    middleware(req, res, () => {
      assert.fail('Should not call next when validation fails');
    });

    assert.equal(statusSet, 400);
    assert.equal(jsonSent.error, 'VALIDATION_ERROR');
    assert.ok(jsonSent.details.length > 0);
  });

  test('validate middleware strips unknown fields when configured', () => {
    const middleware = validate({ title: { type: 'string', required: true } });
    const req = { body: { title: 'Hackathon Project', maliciousExtra: 'DROP TABLE users' } };

    const res = {};
    let nextCalled = false;

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.ok(nextCalled);
    assert.equal(req.body.title, 'Hackathon Project');
    assert.equal(req.body.maliciousExtra, undefined);
  });
});
