const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const CONFIG = {
    TOKEN: process.env.TOKEN,
    GUILD_ID: process.env.GUILD_ID,
    START_CHANNEL_ID: '1465401937389420687', // ID canale #inizia-da-qui
};

client.once('ready', async () => {
    try {
        const guild = client.guilds.cache.get(CONFIG.GUILD_ID);
        
        if (!guild) {
            console.log('❌ Server non trovato');
            process.exit(1);
        }

        // Trova il canale #inizia-da-qui
        const startChannel = guild.channels.cache.get(CONFIG.START_CHANNEL_ID);

        if (!startChannel) {
            console.log('❌ Canale #inizia-da-qui non trovato');
            process.exit(1);
        }

        // Crea il bottone
        const button = new ButtonBuilder()
            .setCustomId('start_verification')
            .setLabel('🚀 Inizia Verifica')
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        // Crea l'embed
        const embed = new EmbedBuilder()
            .setColor('#FF6B35')
            .setTitle('🎉 Hai Completato i 3 Step!')
            .setDescription(
                `Fantastico! 🎊\n\n` +
                `✅ **Presentazione** completata\n` +
                `✅ **Videocorsi** su Whop guardati\n` +
                `✅ **PDF Psicologia** letti\n\n` +
                `**Adesso sei pronto per il passo finale!** 🔓\n\n` +
                `Clicca il bottone qui sotto per accedere al canale **#chi-sei** e rispondere alle **15 domande** di verifica.\n\n` +
                `Una volta completato, riceverai il ruolo **✅ VERIFICATO** e avrai accesso a **TUTTI i canali** della community! 🚀`
            )
            .setFooter({ text: 'SMFX ACADEMY • Sei quasi arrivato!' })
            .setTimestamp();

        // Invia il messaggio con bottone
        await startChannel.send({
            embeds: [embed],
            components: [row],
        });

        console.log('✅ Messaggio con bottone inviato su #inizia-da-qui');
        process.exit(0);
    } catch (error) {
        console.error('❌ Errore:', error);
        process.exit(1);
    }
});

client.login(CONFIG.TOKEN);
