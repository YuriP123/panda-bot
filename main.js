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

const commandProcess = async (page) =>{
	console.log('running command process');	
	await client.channels.cache.get(guildId).send('Authentication Required, Please eneter code using the command');
	client.on('interactionCreate', async interaction => {
		await page.content();
		if (!interaction.isCommand()) return;
	
		const { commandName } = interaction;
		
		if (commandName === 'auth') {
			const messageToSend = interaction.options.getString("code");
			await page.type('input[name=code', messageToSend);
			await interaction.reply({content:messageToSend});
			await page.click('.button-text');
		}
	});
	await page.waitForTimeout(1500);
};

const signin = async () =>{
	const browser = await puppeteer.launch({headless: false});
	const page = await browser.newPage();
	await page.goto('https://all-access.wax.io/');
  
	await page.waitForSelector('input[name=userName]', {
	  visible: true,
	});
  
	await page.type('input[name=userName', 'miguel.pasamonte2@gmail.com');
	await page.type('input[name=password', 'YuriP123!');
	await page.waitForTimeout(1000);
	await page.click('.button-primary');

	await page.waitForTimeout(2000);
  
	const hasAuth = (await page.content()).match(/Login Authentication/gi);
	//const hasAuth = await page.waitForXPath("//*[contains(text(), 'Login Authentication')]");
	//Incorrect authentication code
	if(hasAuth) {
		console.log('1st try');
		await commandProcess(page);
		await page.waitForTimeout(2000);
		const hasAuth2 = (await page.content()).match(/Incorrect authentication code/gi);
		if(hasAuth2){
			await client.channels.cache.get(guildId).send('Incorrect authentication code');
			console.log('incorrect code');
			await commandProcess(page);
		}
		else{
			await page.waitForTimeout(4000);
			console.log('checking for successful login');
			console.log(page.url());
			if (page.url () === 'https://wallet.wax.io/dashboard'){
				await page.waitForTimeout(8000);
				console.log('launching game...');
				await launch(browser);
			}
			else{
				await commandProcess(page);
			}
		}
	}
};

const foodCheck = async (page2) =>{

	const element = await page2.waitForSelector('.energy-info-number'); // select the element
	const value = await element.evaluate(el => el.textContent); // grab the textContent from the element, by evaluating this function in the browser context	
	await client.channels.cache.get(guildId).send('Panda currently has: ' + value.substring(3));
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
		await page2.waitForTimeout(10000);
		await page2.waitForSelector('.count-up');
		let element = await page2.$('.count-up');
		let value = await page2.evaluate(el => el.textContent, element)
		await client.channels.cache.get(guildId).send('Harvest Sucessful, gained: ' + value + ' BAM.');
	}
	else{
		await client.channels.cache.get(guildId).send('Harvest Unsucessful, will try again soon...');
	}
	await foodCheck(page2);
	await browser.close();
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
client.login(token);