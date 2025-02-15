// archivo index.js
const {Client, Events, GatewayIntentBits} = require('discord.js');
require('dotenv').config() // Conviguracion del archivo .env
// console.log(process.env) // Sirve para revisar los procesos, se ven en la consola

const axios = require("axios");
const puppeteer = require("puppeteer");

// crear nuevo cliente de discord
const client = new Client({
  intents: 3276799
});

// creando nuestro primer evento
client.on(Events.ClientReady, async () => {
    console.log(`Conectado como ${client.user.username}`)
});

// respuestas a mensajes
client.on(Events.MessageCreate, async (message) => {
    
    if(message.author.bot) return; // si el autor del mensaje es un bot nos retiramos
    if(!message.content.startsWith('-')) return; // si el contenido del mensaje NO comienza por !

    const args = message.content.slice(1).split(' ')[0] // el contenido del mensaje menos 1 caracter (-)

    // Lista de comandos segun el argumento si es que son varios, para no crear uno por uno.
    try{
        const command = require(`./commands/${args}`);
        command.run(message);

    } catch (error){
        console.log(`Ha ocurrido un error al utilizar el comando -${args}`, error.message);
    }


})

// Conectar el bot
client.login(process.env.TOKEN_BOT);
