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

Returns an array with `<count>` quotes e.g. `GET /quotes/2`

```json
[
    "Capitalism: God’s way of determining who is smart and who is poor.",
    "Clear alcohols are for rich women on diets."
]
```
### `POST /v2/rating`