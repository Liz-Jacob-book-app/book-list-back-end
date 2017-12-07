require('dotenv').config();
const express = require('express');
const app = express();
const pg = require('pg');
const PORT = process.env.PORT || 5050;
const conString = `postgres://localhost:5432/database_name`;
const client = new pg.Client(process.env.DATABASE_URL);
// the client is hidden inside pg  // Heroku will include the database_url

client.connect();

app.get(`/api/v1/#`, (req,res) => {
    client.query(`SELECT * FROM cards;`)
        .then(data => res.send(data.rows));
    // n.b. data is returned as json data in console
});

app.get(`/api/v1/#/:book`, (req, res) => {
    client.query(`SELECT * FROM cards WHERE recipient = $1`, [req.params.recipient])
        .then(data => res.send(data.rows));
});

app.listen(PORT, () => {
    console.log(`listening for API requests to port $(PORT)`);
});