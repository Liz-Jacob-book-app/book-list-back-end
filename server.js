require('dotenv').config();
const express = require('express');
const app = express();
const pg = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const superAgent = require('superagent');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('/'));
app.use(cors());

const PORT = process.env.PORT || 5000;
const conString = 'postgres://postgres:perezed11//yxsatybwxtuuyr:f6a87f989873168a9547c26632dc59187d04a6c293870231c006f8b586298262@ec2-54-204-13-130.compute-1.amazonaws.com:5432/d97ekvb8qmegtj&ssl=true';
// const conString = 'postgres://postgres:perezed11@localhost:5432/books';
// const conString = 'postgres://localhost:5432/books';

const client = new pg.Client(process.env.DATABASE_URL || conString);
client.connect();

app.get('/search', (req, res) => {
    const googleUrl = 'https://www.googleapis.com/books/v1/volumes?q=search+terms';
    const G_API_KEY = process.env.GOOGLE_API_KEY;
    const searchFor = req.params.search;

    superAgent.get(`${googleUrl}${searchFor}&key=${G_API_KEY}`)
        .end(err,resp => {

            const smallBooks = resp.body.items.slice(0,10).map( book => {
                return {
                    title: book.volumeInfo.title,
                    author: book.volumeInfo.authors[0],
                    isbn: book.volumeInfo.industryIdentifiers[0].identifier,
                    image_url: book.volumeInfo.imageLinks.thumbnail,
                    description: book.volumeInfo.description
                };
            });
            console.log(smallBooks);
            res.send(smallBooks);
        });
});

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
  books(title, author, isbn, "imageUrl", description)
  VALUES ($1, $2, $3, $4, $5);`,
        [
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.imageUrl,
            req.body.description
        ],
        function(err) {
            if (err) console.error(err);
            res.send(data => res.status(201).send(data.rows));
        }
    );
});

app.put('/books/:id', (req, res) => {
    client.query(`
      UPDATE books
      SET title=$1, author=$2, isbn=$3, "imageUrl"=$4, description=$5
      WHERE book_id=$6
      `,
        [
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.imageUrl,
            req.body.description,
            req.params.book_id
        ]
    )
        .then(data => res.status(200).send('put'))
        .catch(console.error);

});

// app.delete('/books/:id', (req, res) => {
//     client.query(
//         `DELETE FROM books WHERE book_id=$1;`,
//         [req.params.book_id]
//     )
//         .then(() => res.send('Delete complete'))
//         .catch(console.error);
// });

// app.delete('/books', (req, res) => {
//     client.query('DELETE FROM books')
//         .then(() => res.send('Delete complete'))
//         .catch(console.error);
// });

app.listen(PORT, () => {
    console.log(`Server starter on Port ${PORT}`);
});