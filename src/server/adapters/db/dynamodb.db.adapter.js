const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();

// TODO: rmv fallback
const TABLE_NAME =  process.env['TCQ_DB_DYNAMODB_MEETINGS_TABLE'] || 'tcq-reloaded-staging-meetings';

async function getMeeting(id) {
    return new Promise((resolve, reject) => {
        dynamodb.getItem({
            TableName: TABLE_NAME,
            Key: AWS.DynamoDB.Converter.marshall({ id })
        }, (err, data) => {
            if (err) return reject(err);
            if (!data.Item) return resolve(undefined);
            resolve(AWS.DynamoDB.Converter.unmarshall(data.Item));
        });
    });
}

async function createMeeting(meeting) {
    const marshalledMeeting = AWS.DynamoDB.Converter.marshall(meeting);
    dynamodb.putItem({
        Item: marshalledMeeting,
        ReturnConsumedCapacity: 'TOTAL',
        TableName: TABLE_NAME
    }, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response

    });
    return meeting;
}

async function updateMeeting(meeting) {
    return createMeeting(meeting);
}

module.exports = {
    getMeeting,
    updateMeeting,
    createMeeting
}

/*async function main() {
    console.log('Main!');
    await createMeeting({meet: 'testd', id:'462'});
    console.log('Got meeting:', await getMeeting('462'));
}

main();
*/
