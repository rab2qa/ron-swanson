const guid = require("../utilities/guid");

class Rating {
    constructor(user, quote, value) {
        this.id = guid.get();
        this.user = user;
        this.quote = quote;
        this.value = value;
    }
}

module.exports = Rating;