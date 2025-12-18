const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const DB_HOST = process.env.DB_HOST || 'database';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 'testdb';
const DB_USER = process.env.DB_USER || '';
const DB_PASS = process.env.DB_PASS || '';

const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;

let db;
MongoClient.connect(uri)
  .then(client => {
    db = client.db(DB_NAME);
    console.log('Connected to DB');
  })
  .catch(err => console.error(err));

app.get('/health', (req, res) => res.send('API is healthy'));
app.get('/items', async (req, res) => {
  const items = await db.collection('items').find().toArray();
  res.json(items);
});

app.listen(3000, () => console.log('Backend running on 3000'));

