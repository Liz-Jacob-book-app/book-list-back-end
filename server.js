require('dotenv').config();
const express = require('express');
const app = express();
const fs = require('fs');
const pg = require('pg');

const PORT = process.env.PORT || 3000;
const conString = (`postgres://localhost:5432/books-app`);

const client = new pg.Client(process.env.DATABASE_URL || conString);
// the client is hidden inside pg  // Heroku will include the database_url
client.connect();

app.get(`/api/v1/books`, (req,res) => {
    client.query(`SELECT * FROM books;`)
        .then(data => res.send(data.rows));
    // n.b. data is returned as json data in console
});

app.get(`/api/v1/#/:book`, (req, res) => {
    client.query(`SELECT * FROM books WHERE book = $1`, [req.params.books])
        .then(data => res.send(data.rows));
});

app.listen(PORT, () => {
    console.log(`listening for API requests to port $(PORT)`);
});
///// DATABASE HANDLER //////////

//function loadBooks() {
//    fs.readFile('./data/books.json', (err, fd) => {
//        JSON.parse(fd.toString()).forEach(ele => {
//            client.query(
//                'INSERT INTO books "(book_id, title, author, isbn, "imageUrl", description) VALUES" ($1, $2, $3, $4, //$5, $6) ON CONFLICT DO NOTHING',
//                [ele.book_id, ele.title, ele.author, ele.isbn, ele.image_url, ele.description]
//            )
//                .catch(console.error);
//        });
//    });
//}

//function loadDB() {
//    client.query(`
//    CREATE TABLE IF NOT EXISTS
//    books (
//      book_id SERIAL PRIMARY KEY,
//      title VARCHAR(50),
//      author VARCHAR(50),
//      isbn VARCHAR(50),
//      "imageUrl" VARCHAR(255),
//      description VARCHAR);`
//    )
//        .then(loadBooks)
//        .catch(console.error);
//}

//loadDB();