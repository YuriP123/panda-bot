// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const puppeteer = require('puppeteer'); 

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

(async () =>{
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await page.goto('https://game.nftpanda.space/');
	 
})();












client.login(token);