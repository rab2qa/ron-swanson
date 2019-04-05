# Ron Swanson quotes Server

A simple API that allows users (uniquely identified by their IP) to view and rate Ron Swanson Quotes.

The server generates an in-memory object-relational model with the followng relationships:

### User - has many ratings
### Rating - has one user and one quote
### Quote - has many ratings

Users and quotes are linked together via ratings.

# Server start

node server.js (runs on port 3001 by default)

## APIs

### `GET /v2/quotes`

Returns an array with one object:

```json
[
    {
        "userRating: 4"
        "aggregateRating: 3.4"
        "value: Capitalism: God’s way of determining who is smart and who is poor."
    }
]
```

### `GET /v2/quotes/<count>`

Returns an array with `<count>` objects e.g. `GET /quotes/2`

```json
[
    {
        "userRating: 4"
        "aggregateRating: 3.4"
        "value: Capitalism: God’s way of determining who is smart and who is poor."
    },
    {
        "userRating: 3"
        "aggregateRating: 2.7"
        "value: Clear alcohols are for rich women on diets."
    }
]
```
### `POST /v2/rating`

Allows the user to set a rating (rating parameter) for a given quote (quoteID parameter)

```json
{
    "quoteID: 54"
    "rating: 4"
}
```
