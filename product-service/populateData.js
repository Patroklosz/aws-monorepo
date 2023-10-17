const AWS = require('aws-sdk');
const { books } = require('./src/content/books.json');
const { count } = require('./src/content/count.json');

AWS.config.update({
  region: 'eu-central-1'
});

const docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Add books
 */
books.forEach((book) => {
  const params = {
    TableName: 'Products',
    Item: book,
  };

  docClient.put(params, (err, _) => {
    if (err) {
      console.error('Error inserting book:', err);
    } else {
      console.log('Book inserted successfully:', book.name);
    }
  });
});

/**
 * Add count
 */
let success = 0;
count.forEach(c => {
  const params = {
    TableName: 'Stocks',
    Item: c
  }

  docClient.put(params, (err, _) => {
    if (err) {
      console.error('Error inserting quantity:', err);
    } else {
      success++;
    }
  })
})
console.log(`(${success}/${count.length}) Quantity successfully added!`);
