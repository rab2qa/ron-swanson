const guid = require("../utilities/guid");

class User {
    constructor() {
        this.id = guid.get();
        this.ratings = [];
    }
}

module.exports = User;