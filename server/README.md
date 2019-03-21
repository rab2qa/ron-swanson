# Ron Swanson quotes Server

Modified from original api

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