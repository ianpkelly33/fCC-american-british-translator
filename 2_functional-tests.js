const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

suite('Functional Tests', () => {

    test('Translation with  text and locale fields : POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .set('content-type', 'application/json')
            .send({ text: 'I ate yogurt for breakfast.', locale: 'american-to-british' })
            .end((err, res) => {
                if (err) throw err
                assert.equal(res.body.text, 'I ate yogurt for breakfast.');
                assert.equal(res.body.translation, 'I ate <span class="highlight">yoghurt</span> for breakfast.')
                done();
            });
    });

    test('Translation with with  empty text : POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .set('content-type', 'application/json')
            .send({ text: '', locale: 'american-to-british' })
            .end((err, res) => {
                if (err) throw err
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'No text to translate');
                done();
            });
    });

    test('Translation with missing text field: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .set('content-type', 'application/json')
            .send({ locale: 'american-to-british' })
            .end((err, res) => {
                if (err) throw err
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Translation with missing locale field: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .set('content-type', 'application/json')
            .send({ text: 'some text' })
            .end((err, res) => {
                if (err) throw err
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Translation with text and invalid locale field: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .set('content-type', 'application/json')
            .send({ text: 'some text', locale: 'bad-locale' })
            .end((err, res) => {
                if (err) throw err
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            });
    });

    test('Translation with that needs no translation: POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .set('content-type', 'application/json')
            .send({ text: 'Some text', locale: 'american-to-british' })
            .end((err, res) => {
                if (err) throw err
                assert.equal(res.status, 200);
                assert.equal(res.body.text, 'Some text');
                assert.equal(res.body.translation, 'Everything looks good to me!')
                done();
            });
    });

});
