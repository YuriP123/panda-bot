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
	await page.click(".check-term", {ClickCount:1});
	await page.click(".button-in", {ClickCount:1});
	const [button] = await page.$x("//span[contains(., 'WAX Cloud Wallet')]");
	if (button) {
		await button.click();
	}
	//await browser.close(); --closes browser
	
})();












client.login(token);