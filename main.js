// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token,guildId } = require('./config.json');
const puppeteer = require('puppeteer');
var x = true;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;
	
	if (commandName === 'auth') {
		const messageToSend = interaction.options.getString("code");
		interaction.reply({content:messageToSend});
	}
});

const signin = async () =>{
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await page.goto('https://all-access.wax.io/');
  
	await page.waitForSelector('input[name=userName]', {
	  visible: true,
	});
  
	await page.type('input[name=userName', 'miguel.pasamonte2@gmail.com');
	await page.type('input[name=password', 'YuriP123!');
	await page.click('button.button-primary');
  
	await page.waitForNavigation({
	  waitUntil: 'networkidle0',
	});
  
	const hasAuth = (await page.content()).match(/Login Authentication/gi);

	if(hasAuth) {
		client.channels.cache.get(guildId).send('Send Authentication Code Here');
		await page.content();
	} 
	else {
		await page.waitForTimeout(8000);
		await launch(browser);
	}
};

const launch = async (browser) =>{
	const page2 = await browser.newPage();        
	await page2.goto('https://game.nftpanda.space/', {waitUntil: 'load', timeout: 0});
	await page2.waitForTimeout(4000);
	await page2.bringToFront();
	await maintCheck(page2);
	await page2.click(".check-term", {ClickCount:1});
	await page2.click(".button-in", {ClickCount:1});
	const [button] = await page2.$x("//span[contains(., 'WAX Cloud Wallet')]");
	if (button) {
		await button.click();
	}  
	await page2.waitForTimeout(4000);
	const [button2] = await page2.$x("//span[contains(., 'Begin adventure')]");
	if (button2) {
		await button2.click();
	}
	await page2.waitForTimeout(4000);
	const [button3] = await page2.$x("//span[contains(., 'SEND to adventure')]");
	if (button3) {
		await button3.click();
		await button3.click();
		await button3.click();
		await client.channels.cache.get(guildId).send('Harvest Sucessful');
	}
};

const maintCheck = async (page2) =>{
	if (await page2.$(".maint")){
		client.channels.cache.get(guildId).send('STATUS: Maintenance - will try again in 10 minutes');
		await page2.waitForTimeout(300000);
		maintCheck();
	}
	else{
		return;
	}
};

signin();
setInterval(signin, 7200000);
	/*
	const browser = await puppeteer.launch({headless: false});
	await page.click(".check-term", {ClickCount:1});
	await page.click(".button-in", {ClickCount:1});
	const [button] = await page.$x("//span[contains(., 'WAX Cloud Wallet')]");
	if (button) {
		await button.click();
	}
	browser.on('targetcreated', async (target) => { //This block intercepts all new events
		if (target.type() === 'page') {               // if it tab/page
			   //const page = await target.page();      // declare it
			   const page2 = await target.page();      // declare it
			   const url = page2.url();                // example, look at her url
			   console.log('***** ' + url);
			   await page2.waitForSelector("#userName");
			   await page2.type("#userName","emailrighthere");
			   //.....
		}
	});
	*/
/*
	-------------POPUP HANDLING-----------
        browser.on('targetcreated', async (target) => { //This block intercepts all new events
      if (target.type() === 'page') {               // if it tab/page
             //const page = await target.page();      // declare it
             const page = await target.page();      // declare it
             const url = page.url();                // example, look at her url
             console.log('***** ' + url);

             //.....
      }
    });

*/


client.login(token);