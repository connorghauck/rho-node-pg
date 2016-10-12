var router = require('express').Router();
var pg = require('pg');

//it needs to know location and name of database it's attempting to access
var config = {
    database: 'connor'
};

//initialize the database connection pool
var pool = new pg.Pool(config);


router.get('/:id', function(req, res){
    pool.connect(function(err, client, done){ //done means you're finished with the connection so it pushes to someone else (returns the conneciton back to the pool)
        if (err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return;
        }
        //1. SQL string
        //2. (optional) any input parameters
        //3. callback function to execute once the query is finished.

        client.query('SELECT * FROM books WHERE id = $1;', [req.params.id], function(err, result){
                done();
                if(err){
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    return;
                }

                console.log('Got rows from the DB: ',result.rows);
                res.send(result.rows);
        });//client.query is used for basically everything we will type

    });
});


//http POST = SQL insert, http GET = SQL select, http PUT = SQL update, http DELETE = SQL delete
router.get('/', function(req, res){
    //err is an error object, will be not-null if there was an error connecting.
    //possible errors being things like "database not running" or "config is wrong"
    //the client is an object that is used to make queries against the database.
    pool.connect(function(err, client, done){ //done means you're finished with the connection so it pushes to someone else (returns the conneciton back to the pool)
        if (err){
            console.log('Error connecting to the DB', err);
            res.sendStatus(500);
            done();
            return;
        }
        //1. SQL string
        //2. (optional) any input parameters
        //3. callback function to execute once the query is finished.

        client.query('SELECT * FROM books;', function(err, result){
                done();
                if(err){
                    console.log('Error querying the DB', err);
                    res.sendStatus(500);
                    return;
                }

                console.log('Got rows from the DB: ',result.rows);
                res.send(result.rows);
        });//client.query is used for basically everything we will type

    });
});

router.post('/', function(req, res){
    pool.connect(function(err, client, done){
        if (err){
            res.sendStatus(500);
            done();
            return;
        }
        client.query('INSERT INTO books (author, title, published, publisher, edition) VALUES ($1, $2, $3, $4, $5) returning *;',
        [req.body.author, req.body.title, req.body.published, req.body.publisher, req.body.edition],
        function(err,result){
            done();
            if(err){
                res.sendStatus(500);
                return;
            }
            res.send(result.rows);

        });
    });
});

module.exports = router;
