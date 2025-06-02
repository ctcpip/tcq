const AWS = require('aws-sdk');
const DynamoDBStoreSession = require('connect-dynamodb');

const dynamodb = new AWS.DynamoDB();
const TABLE_NAME = process.env['TCQ_SESSION_STORE_DYNAMODB_TABLE'];

function createSessionStoreForSession(session) {
    const DynamoDBStore = DynamoDBStoreSession(session);
    const sessionStore = new DynamoDBStore(
        // -> https://www.npmjs.com/package/connect-dynamodb/v/2.0.6
        {
            table: TABLE_NAME,
            // explicitly set the client to skip broken default client creation
            client: dynamodb,
        });
    return sessionStore;
}

module.exports = {
    createSessionStoreForSession
}
