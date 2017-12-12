require('dotenv').config();
const express = require('express');
const app = express();
// const fs = require('fs');
const pg = require('pg');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
// const conString = 'postgres://yxsatybwxtuuyr:f6a87f989873168a9547c26632dc59187d04a6c293870231c006f8b586298262@ec2-54-204-13-130.compute-1.amazonaws.com:5432/d97ekvb8qmegtj&ssl=true';
const conString = 'postgres://postgres:perezed11@localhost:5432/books';
const client = new pg.Client(process.env.DATABASE_URL || conString);
// the client is hidden inside pg  // Heroku will include the database_url

client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/v1/books', (req, res) => {
    client.query(`SELECT * FROM books;`)
        .then(data => res.send(data.rows))
        .catch(console.error);
    console.log('in get');
    // n.b. data is returned as json data in console
});

app.put('/api/v1/books/:id', (req, res) => {
    client.query(`
    UPDATE books SET title=$1, author=$2, isbn=$3, "imageUrl=$4", description=$5 
    WHERE id=$6
    `, [
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.imageUrl,
            req.body.description
        ])
        .then(data => res.status(200).send('put request complete!'));
});

app.post('/api/v1/books', (req, res) => {
    console.log(req.body);
    client.query(`
    INSERT INTO books (title, author, isbn, "imageUrl", description)
    VALUES ($1, $2, $3, $4, $5);
    `, [
            req.body.title,
            req.body.author,
            req.body.isbn,
            req.body.imageUrl,
            req.body.description
        ])
        .then(data => res.status(200).send('asd'))
        .catch(console.error);
});

// app.delete('/api/v1/cards/:id', (req, res) => {
//     client.query(`
//     `

//     )
// });

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get(`/api/v1/books/:book_id`, (req, res) => {
    client.query(
        `SELECT * FROM books WHERE book_id = $1`,
        [
            req.params.book_id,
        ])
        .then(data => res.send(data.rows))
        .catch(console.error);
});

app.listen(PORT, () => {
    console.log(`listening for API requests to port ${PORT}`);
});

///// DATABASE HANDLER //////////

// function loadBooks() {
//     fs.readFile('./data/books.json', (err, fd) => {
//         JSON.parse(fd.toString()).forEach(ele => {
//             client.query(
//                 'INSERT INTO books "(book_id, title, author, isbn, "imageUrl", description) VALUES" ($1, $2, $3, $4, //$5, $6) ON CONFLICT DO NOTHING',
//                 [ele.book_id, ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
//             )
//                 .catch(console.error);
//         });
//     });
// }

// function loadDB() {
//     client.query(`
//     CREATE TABLE IF NOT EXISTS
//     books (
//     book_id SERIAL PRIMARY KEY,
//     title VARCHAR(50),
//     author VARCHAR(50),
//     isbn VARCHAR(50),
//     "imageUrl" VARCHAR(255),
//     description VARCHAR(2000));`
//     )
//         .then(loadBooks)
//         .catch(console.error);
// }

// loadDB();