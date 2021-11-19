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

const waxLogin = async (page, channel) => {
	await page.goto('https://all-access.wax.io/');
  
	await page.waitForSelector('input[name=userName]', {
	  visible: true,
	});
  
	await page.type('input[name=userName', 'mmborado@gmail.com');
	await page.type('input[name=password', 'Fireballing23.');
	await page.click('button.button-primary');
  
	await page.waitForNavigation({
	  waitUntil: 'networkidle0',
	});
  
	const hasAuth = (await page.content()).match(/Login Authentication/gi)
  
	if(hasAuth) {
	  channel.send('Login Authentication Required');
	} else {
  
	  state.isWaxLogin = true;
	  init(page);
	}
  
}

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
	//await browser.close(); --closes browser
	
})();

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