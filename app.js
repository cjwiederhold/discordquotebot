require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const Quote = require('./quote')

const currId = 10

const checkCall = async (msg) => {

    // check correct number of arguments
    const len = msg.content.split(' ').length;
    if (len < 3) {
        await msg.reply('usage: !addquote @user "Quote"');
        return undefined;
    }
    
    // check that a valid user is quoted
    if (!msg.mentions.members.first()) {
        await msg.reply('invalid mention.');
        return undefined;
    }

    // check for valid quote 
    if (!msg.content.match(/"([^"]+)"/)){
        await msg.reply('quote must be between quote marks ("").');
        return undefined;
    }

    // I'm not good with promises, so this is my way of making things work
    return 1;
}

const createQuote = async (msg) => {
    // set nickname for quote to be null, only updates if one is provided
    nick = null;
    if(msg.content.match(/\(([^)]+)\)/)) nick = msg.content.match(/\(([^)]+)\)/)[1];

    // creqte quote object
    const quote = new Quote({
        user: msg.mentions.members.first().user.id,
        quote: msg.content.match(/"([^"]+)"/)[1],
        nick
    })

    // save quote to database
    quote.save()
}

const getQuoteRand = async (msg) => {
    // function is only called if a quote is not called by nickname
    // load all quotes from a user
    const quotes = await Quote.find({
        user: msg.mentions.members.first().user.id
    })
    if (!quotes[0]) return undefined; //break if user has no quotes

    // get random index in range of number of quotes and select
    const rand = (Math.floor(Math.random() * quotes.length))
    return quotes[rand].quote;
}

const getQuoteNick = async (nick) => {
    // get quote by nickname if it exists
    const quotes = await Quote.find({
        nick
    })
    if (quotes[0]) return (quotes[0].quote);
    else return undefined;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    guild = msg.guild;

    // check for command syntax of messages, break if not relevant
    // 70% sure this does what I want it to do
    if (msg.content.charAt(0) !== '!') return;
    const msgArr = msg.content.split(' ');
    
    // addquote command call
    if (msgArr[0] === '!addquote' && msg.member.roles.cache.find(r => r.name === 'Moderators')) {
        checkCall(msg).then((res, err) => {
            if (res) {
                createQuote(msg)
                msg.reply("quote added.")
            }
        })
    }

    // find quote command call
    if (msgArr[0] === "!quote") {
        // find quote when nickname is provided
        if (msg.content.match(/\(([^)]+)\)/)) {
            getQuoteNick(msg.content.match(/\(([^)]+)\)/)).then(res => {
                if (res) return msg.reply('"' + res + '"');
            })
        }
        // find quote when no nickname is provided
        if (msg.mentions.members.first()) {
            getQuoteRand(msg).then(res => {
                if (res) return msg.reply('"' + res + '"');
            })
        }
    }
});

client.login(process.env.DISCORD_API);
    
    // This works to insert a quote to DB

    //     const myQuote = new Quote({
    //         user: 'cwied',
    //         quote: 'test quote',
    //         nick: 'k'
    //     })
        
    //     myQuote.save();


// Add bot link:
// https://discordapp.com/oauth2/authorize?client_id=703430861139476511&scope=bot