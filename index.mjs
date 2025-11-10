// npm init -y

// Open Terminal Window
// Create a new folder (mkdir myNodeApp)
// Go inside the folder (cd myNodeApp)
// Initialize node app by running:
//  npm init
// It will create the package.json file.
// Optionally, you can run: npm init -y 
// (silent mode)


// Create an index.mjs file. Add some JS code.
// Run the file by using:
// node index.mjs

// npm i express ejs mysql2



import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "jsftj8ez0cevjz8v.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "rq63ro5rtenc2twm",
    password: "y7mdpsql6fhn9lrp",
    database: "x6ij0hyll3qwgfjk",
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/', async (req, res) => {
    //res.send('Hello Express app!')
    let authorSql =  `SELECT authorId, firstName, lastName FROM authors`;   //temperal literal
    const [authorRows] = await pool.query(authorSql);
    console.log(authorRows);

    let categorySql =  `SELECT DISTINCT(category) FROM quotes;`;
    const [cRows] = await pool.query(categorySql);

    res.render('home.ejs',{authorRows, cRows});
    
});

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest

app.get("/searchByKeyword", async(req, res) => {
   console.log(req);
   let keyword = req.query.keyword; //must match name with input's name value.
   let sql =  `SELECT *
                FROM authors
                NATURAL JOIN quotes
                WHERE quote LIKE ?`;   //temperal literal
   let sqlParams = [`%${keyword}%`]; //methdo to prevent SQL injection.

   const [rows] = await pool.query(sql, sqlParams);
   console.log(rows);
   res.render('results.ejs',{rows});
});//searchByKeyword

app.get("/searchByAuthor", async(req, res) => {
   console.log(req);
   let authorId = req.query.authorId; //must match name with input's name value.
   let sql =  `SELECT *
                FROM authors
                NATURAL JOIN quotes
                WHERE authorId = ?`;   //temperal literal
   let sqlParams = [`${authorId}`]; //methdo to prevent SQL injection.

   const [rows] = await pool.query(sql, sqlParams);
   console.log(rows);
   res.render('results.ejs',{rows});
});//searchByAuthor

app.get("/searchByCategory", async(req, res) => {
    console.log(req);
    let category = req.query.category; //must match name with input's name value.
    let sql =  `SELECT *
                FROM authors
                NATURAL JOIN quotes
                WHERE category = ?`;   //temperal literal
    let sqlParams = [`${category}`]; //methdo to prevent SQL injection.

    const [rows] = await pool.query(sql, sqlParams);
    console.log(rows);
    res.render('results.ejs',{rows});

});//searchByCategory


app.get("/searchByLike", async(req, res) => {
    console.log(req);
    let minLikes = req.query.minLikes;
    let maxLikes = req.query.maxLikes;

    let sql =  `SELECT *
                FROM authors
                NATURAL JOIN quotes
                WHERE likes BETWEEN ? AND ?`;   //temperal literal // TODO
    let sqlParams = [`${minLikes}`, `${maxLikes}`]; //methdo to prevent SQL injection.

    const [rows] = await pool.query(sql, sqlParams);
    console.log(rows);
    res.render('results.ejs',{rows});

});//searchByLike





//local API to get all info for a specific author
app.get('/api/authors/:authorId', async (req, res) => {
    let authorId = req.params.authorId;
    let sql =  `SELECT *
                FROM authors
                WHERE authorId = ?`;
    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
});

app.listen(3000, ()=>{
    console.log("Express server running")
})