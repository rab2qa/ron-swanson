const guid = require("../utilities/guid");

class Quote {
    constructor(value) {
        this.id = guid.get();
        this.ratings = [];
        this.value = value;
    }

    getUserRating(user) {
        const userRating = this.ratings.find(rating => rating.user === user);
        return userRating;
    }

    getAggregateRating() {
        const activeRatings = this.ratings.filter(rating => Number.isFinite(rating.value));
        return activeRatings.length ? activeRatings.reduce((sum, rating) =>  { return sum + rating.value }, 0) / activeRatings.length : null;
    }
}

module.exports = Quote;