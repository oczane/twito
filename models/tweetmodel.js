var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('TweetModel', new Schema({ 
    clienttweet: String,
    client:  {
        type:String,
    },
    hasseen: {
        type: Boolean,
    },
    adddate: {
        type: Date,
    }
},{strict: true}));