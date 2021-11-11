// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});




















client.login('OTA2MjY0MTA4NzU0NjczNzI1.YYWGOQ.Ade4tlgQIJ0DSJFzOwOcDnBzKGU');