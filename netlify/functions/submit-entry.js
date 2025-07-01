const { Client } = require('pg');

// Hardcoded Neon Postgres connection string here:
const connectionString = 'postgresql://neondb_owner:npg_rAwaYm1CuZM4@ep-shiny-credit-a5cr19gm-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    const client = new Client({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      }
    });

    await client.connect();

    const query = `
      INSERT INTO journal_entries (date, title, city, note, rating, emoji, photo)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      data.date,
      data.title,
      data.city,
      data.note,
      data.rating,
      data.emoji,
      data.photo
    ];

    const res = await client.query(query, values);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, entry: res.rows[0] }),
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: err.message }),
    };
  }
};
