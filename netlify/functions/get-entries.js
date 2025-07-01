const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_rAwaYm1CuZM4@ep-shiny-credit-a5cr19gm-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

exports.handler = async function(event) {
  try {
    const client = new Client({
      connectionString,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    const date = event.queryStringParameters?.date;

    let res;
    if (date) {
      res = await client.query('SELECT * FROM journal_entries WHERE date = $1 ORDER BY created_at DESC', [date]);
    } else {
      res = await client.query('SELECT * FROM journal_entries ORDER BY created_at DESC');
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(res.rows),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
