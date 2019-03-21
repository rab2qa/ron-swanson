//////////////////
//              //
//     GUID     //
//              //
//////////////////

class GUID {

    /***************/
    /* CONSTRUCTOR */
    /***************/

    constructor() { 
        this.counter = 0; 
    }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    get() { return (++this.counter); };

} // End class GUID

const guid = new GUID();

module.exports = guid;