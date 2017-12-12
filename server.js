require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

//const PORT = process.env.PORT || 5000;
//const conString = 'postgres://postgres:perezed11//yxsatybwxtuuyr:f6a87f989873168a9547c26632dc59187d04a6c293870231c006f8b586298262@ec2-54-204-13-130.compute-1.amazonaws.com:5432/d97ekvb8qmegtj&ssl=true';
// Jacob's local connect string

const PORT = process.env.PORT || 3000;
const conString = (`postgres://localhost:5432/books`);
const client = new pg.Client(process.env.DATABASE_URL || conString);
// Liz's local connect string

const PORT = process.env.PORT || 3000;
const conString = (`postgres://localhost:5432/books-app`);

const client = new pg.Client(process.env.DATABASE_URL || conString);
// the client is hidden inside pg  // Heroku will include the database_url
client.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('/'));

app.get('/api/v1/books', (req, res) => {
    client.query(`SELECT * FROM books;`)
        .then(data => res.send(data.rows));
});

app.get(`/api/v1/books/:id`, (req, res) => {
    client.query(`SELECT * FROM books WHERE book_id = $1`,
        [
            req.params.book_id
        ])
        .then(data => res.send(data.rows))
        .catch(console.error);
});

app.post('/books', (req, res) => {
    client.query(
        `INSERT INTO
  books(book_id, title, author, isbn, "imageUrl", description)
  VALUES ($1, $2, $3, $4, $5, $6);`,
        [
            req.body.book_id,
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.imageUrl,
            req.body.description
        ],
        function(err) {
            if (err) console.error(err);
            res.send('insert complete');
        }
    );
});

app.put('/books', (req, res) => {
    client.query(`
      UPDATE books
      SET book_id=$1, title=$2, author=$3, isbn=$4, "imageUrl"=$5, description=$6
      `,
        [
            req.body.book_id,
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.imageUrl,
            req.body.description,
        ]
    )
        .then(() => res.send('Update complete'))
        .catch(console.error);

});

app.delete('/books/:id', (req, res) => {
    client.query(
        `DELETE FROM books WHERE book_id=$1;`,
        [req.params.book_id]
    )
        .then(() => res.send('Delete complete'))
        .catch(console.error);
});

app.delete('/books', (req, res) => {
    client.query('DELETE FROM books')
        .then(() => res.send('Delete complete'))
        .catch(console.error);
});

app.listen(PORT, () => {
    console.log(`Server starter on Port ${PORT}`);
});