// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token,channelId } = require('./config.json');
const puppeteer = require('puppeteer');
require('./deploy-commands.js');
const prefix = '-';

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('message',message=>{
	if(!message.content.startsWith(prefix)) return;

	const args = msg.content.substring(prefix.length).split(" ");
	const command = args.shift().toLowerCase();

	if(command === 'ping'){
		console.log(args);
		console.log(command);
		client.channels.cache.get(channelId).send('pong');
	}
});

const waxLogin = async () => {
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
		client.channels.cache.get(channelId).send('Send Authentication Code Here');
		await page.content();
	} else {
	}
}

const launch = async () =>{
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
	//await browser.close(); --closes browser
	
};

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