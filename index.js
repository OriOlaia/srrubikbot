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

// ANUNCIOS EN EL CANAL ANUNCIOS PARA YT, TIKTOK E IG

// YOUTUBE SHORT / COMPLETOS
// 🔴 YouTube Shorts
async function checkYouTube() {
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&channelId=${process.env.YOUTUBE_CANAL}&part=snippet,id&order=date&maxResults=5`;

    try {
        const response = await axios.get(apiUrl);
        const videos = response.data.items.filter(v => v.id.videoId);

        if (videos.length > 0) {
            const latestVideo = videos[0];
            const videoUrl = `https://www.youtube.com/watch?v=${latestVideo.id.videoId}`;
            
            if (videoUrl.includes("shorts")) {
                sendDiscordMessage(`🎬 **Nuevo YouTube Short:** ${videoUrl}`);
            } else {
                sendDiscordMessage(`📢 **Nuevo video de YouTube:** ${videoUrl}`);
            }
        }
    } catch (error) {
        console.error("Error verificando YouTube:", error);
    }
}

// 🎭 Scraping TikTok
async function checkTikTok(username) {
    const url = `https://www.tiktok.com/@${username}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "networkidle2" });
        const videoLinks = await page.$$eval("a[href*='/video/']", links => links.map(link => link.href));

        if (videoLinks.length > 0) {
            sendDiscordMessage(`📱 **Nuevo TikTok:** ${videoLinks[0]}`);
        }
    } catch (error) {
        console.error("Error verificando TikTok:", error);
    } finally {
        await browser.close();
    }
}

// 📸 Scraping Instagram Reels
async function checkInstagram(username) {
    const url = `https://www.instagram.com/${username}/reels/`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: "networkidle2" });
        const videoLinks = await page.$$eval("a[href*='/reel/']", links => links.map(link => "https://www.instagram.com" + link.getAttribute("href")));

        if (videoLinks.length > 0) {
            sendDiscordMessage(`📷 **Nuevo Instagram Reel:** ${videoLinks[0]}`);
        }
    } catch (error) {
        console.error("Error verificando Instagram:", error);
    } finally {
        await browser.close();
    }
}

// 📩 Enviar mensaje a Discord
async function sendDiscordMessage(message) {
    const channel = client.channels.cache.get(process.env.DISCORD_CANAL);
    if (channel) {
        channel.send(message);
    } else {
        console.error("No se encontró el canal de Discord.");
    }
}

// ⏰ Verificar cada 10 minutos
client.once("ready", () => {
    setInterval(checkYouTube, 60000 * 1);
    setInterval(() => checkTikTok("rabbit.1704"), 60000 * 1);
    setInterval(() => checkInstagram("rabbit.1704"), 60000 * 1);
});

// Conectar el bot
client.login(process.env.TOKEN_BOT);
