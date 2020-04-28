const mongoose = require('mongoose');

try{
    mongoose.connect('mongodb+srv://quotebot:quotebotpass@cluster0-sruce.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
} catch(e) {
    console.log(e)
}

const db = mongoose.connection;

const quoteSchema = new mongoose.Schema({
    user: {
        type: String,
        trim: true,
        required: true
    },
    quote: {
        type: String,
        required: true,
        trim: true
    },
    nick: {
        type: String,
        trim: true
    }
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;