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

    if (!msg.content.match(/"([^"]+)"/)){
        await msg.reply('quote must be between quote marks ("").');
        return undefined;
    }
    return 1;
}

const createQuote = async (msg) => {
    nick = null;
    if(msg.content.match(/\(([^)]+)\)/)) nick = msg.content.match(/\(([^)]+)\)/)[1];

    const quote = new Quote({
        user: msg.mentions.members.first().user.id,
        quote: msg.content.match(/"([^"]+)"/)[1],
        nick
    })

    quote.save()
}

const getQuoteRand = async (msg) => {
    const quotes = await Quote.find({
        user: msg.mentions.members.first().user.id
    })
    if (!quotes[0]) return undefined;
    const rand = (Math.floor(Math.random() * quotes.length))
    return quotes[rand].quote;
}

const getQuoteNick = async (nick) => {
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

    if (msg.content.charAt(0) !== '!') return;
    const msgArr = msg.content.split(' ');
    
    if (msgArr[0] === '!addquote' && msg.member.roles.cache.find(r => r.name === 'Moderators')) {
        checkCall(msg).then((res, err) => {
            if (res) {
                createQuote(msg)
                msg.reply("quote added.")
            }
        })
    }

    if (msgArr[0] === "!quote") {
        if (msg.content.match(/\(([^)]+)\)/)) {
            getQuoteNick(msg.content.match(/\(([^)]+)\)/)).then(res => {
                if (res) return msg.reply('"' + res + '"');
            })
        }
        if (msg.mentions.members.first()) {
            getQuoteRand(msg).then(res => {
                if (res) return msg.reply('"' + res + '"');
            })
        }
    }
});

client.login(process.env.DISCORD_API);
    
    
    //     const myQuote = new Quote({
    //         user: 'cwied',
    //         quote: 'knobs',
    //         nick: 'k'
    //     })
        
    //     myQuote.save();


// Add bot link:
// https://discordapp.com/oauth2/authorize?client_id=703430861139476511&scope=bot