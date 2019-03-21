'use strict';

//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

const express = require('express');
const path = require('path');
const schema = require('./schema.json');
const bodyParser = require('body-parser');

/**********/
/* MODELS */
/**********/

const User = require('./models/user');
const Quote = require('./models/quote');
const Rating = require('./models/rating');

/////////////////////
//                 //
//     GLOBALS     //
//                 //
/////////////////////

const app = express();
const port = process.env.PORT || 3001;

const users = {};
const quotes = require('./quotes').map(value => new Quote(value)) || [];

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
});

//////////////////////////////
//                          //
//     HELPER FUNCTIONS     //
//                          //
//////////////////////////////

/***********************/
/* APPEND RANDOM QUOTE */
/***********************/

const appendRandomQuote = (currentQuotes, filter) => {
    let filteredQuotes = filterQuotes(filter);
    const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

    return currentQuotes.includes(quote)
        ? appendRandomQuote(currentQuotes, filter)
        : [
            ...currentQuotes,
            quote,
        ];
};

/*****************/
/* FILTER QUOTES */
/*****************/

const filterQuotes = filter => {
    switch (filter) {
        case 'small':
            return quotes.filter(quote => {
                const quoteLength = quote.value.split(' ').length;
                return quoteLength <= 4;
            });
        case 'medium':
            return quotes.filter(quote => {
                const quoteLength = quote.value.split(' ').length;
                return quoteLength >= 5 && quoteLength <= 12;
            });
        case 'large':
            return quotes.filter(quote => {
                const quoteLength = quote.value.split(' ').length;
                return quoteLength >= 13;
            });
        default:
            return quotes;
    }
};

/*********************/
/* GET RANDOM QUOTES */
/*********************/

const getRandomQuotes = (quoteCount, filter) =>
    range(Math.min(quoteCount, quotes.length)).reduce(out => appendRandomQuote(out, filter), []);

/*************/
/* GET QUOTE */
/*************/

const getQuote = id =>
    quotes.find(quote => quote.id === id);

/*********/
/* RANGE */
/*********/

const range = count => Array(count).fill(null);

////////////////////////////
//                        //
//     INITIALIZATION     //
//                        //
////////////////////////////

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

/////////////////
//             //
//     API     //
//             //
/////////////////

app.all('*', (req, res, next) => {
    console.log(`${dateFormatter.format(new Date())} - request for ${req.path}`);

    // If this is a new user then create a profile for them
    users[req.ip] = users[req.ip] || new User();

    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control');
    res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    next();
});

/***************/
/* ENTRY POINT */
/***************/

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

/**********/
/* QUOTES */
/**********/

app.get('/v2/quotes/:num?', (req, res) => {
    const user = users[req.ip];

    // Get a list of randomQuotes
    const randomQuotes = getRandomQuotes(parseInt(req.params.num, 10) || 1, req.query.filter);

    // Link each randomQuote to this user via a null rating
    randomQuotes.forEach(randomQuote => {
        if (!randomQuote.ratings.find(rating => rating.user === user)) {
            const newRating = new Rating(user, randomQuote, null);
            randomQuote.ratings.push(newRating);
            user.ratings.push(newRating);
        }
    });

    // Send response
    try {
        res.send(JSON.stringify(randomQuotes.map(randomQuote => {
            const userRating = randomQuote.getUserRating(user);
            return {
                id: randomQuote.id,
                userRating: userRating ? userRating.value : null,
                aggregateRating: randomQuote.getAggregateRating(),
                value: randomQuote.value
            }
        })));
    } catch (e) {
        console.log('error attempting to stringify quote');
        res.end();
    }
});

/**********/
/* SCHEMA */
/**********/

app.get('/v2/schema', (req, res) => {
    res.set('Cache-Control', 'max-age=172800, stale-while-revalidate=3600');
    res.json(schema);
});

/**********/
/* RATING */
/**********/

app.post('/v2/rating', function (req, res) {
    const quoteID = parseInt(req.body.quoteID, 10)
    const newRating = parseInt(req.body.rating, 10);

    if (Number.isInteger(quoteID)) {
        const quote = getQuote(quoteID);
        if (quote) {
            const user = users[req.ip];
            const userRating = quote.getUserRating(user);
            if (Number.isInteger(newRating) && newRating >= 0 && newRating <= 5) {
                userRating.value = newRating;
                try {
                    res.send(JSON.stringify(quote.getAggregateRating()));
                } catch (e) {
                    console.log('error attempting to stringify aggregate rating');
                    res.end();
                }
            }
        }
    }

    res.end();
});

////////////////////
//                //
//     SERVER     //
//                //
////////////////////

app.listen(port, () => {
    console.log('Server running on port', port);
});