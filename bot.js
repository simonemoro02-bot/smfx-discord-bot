const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const CONFIG = {
    TOKEN: process.env.TOKEN,
    GUILD_ID: process.env.GUILD_ID,
    WELCOME_CHANNEL_ID: process.env.WELCOME_CHANNEL_ID,
    START_CHANNEL_ID: '1465401937389420687', // Canale #inizia-da-qui
    VERIFICATION_CHANNEL_ID: process.env.VERIFICATION_CHANNEL_ID,
    UNVERIFIED_ROLE_ID: '1465665414238310400',
    VERIFIED_ROLE_ID: '1465806849927413820'
};

const userResponses = new Map();

const QUESTIONS = [
    {
        id: 1,
        question: "📊 Da quanto tempo fai trading?",
        options: [
            { label: "0-2 anni", value: "0-2_anni", emoji: "🌱", role: "Nuovo (0-1 anni esperienza)" },
            { label: "2-5 anni", value: "2-5_anni", emoji: "📚", role: "Esperto (1-5 anni)" },
            { label: "5+ anni", value: "5+_anni", emoji: "🏆", role: "Pro (5+ anni)" }
        ]
    },
    {
        id: 2,
        question: "⏰ Fai trading full-time o part-time?",
        options: [
            { label: "Part-Time", value: "part_time", emoji: "🕐" },
            { label: "Full-Time", value: "full_time", emoji: "💼", role: "Full-Time Aspirante" },
            { label: "Aspirante Full-Time", value: "aspirante", emoji: "🎯", role: "Full-Time Aspirante" }
        ]
    },
    {
        id: 3,
        question: "🎯 Qual è il tuo obiettivo principale nel trading?",
        options: [
            { label: "Profitto costante", value: "profitto", emoji: "💰" },
            { label: "Scalare l'account", value: "scalare", emoji: "📈" },
            { label: "Passare una prop firm", value: "prop", emoji: "🏢", role: "Funding Hunter" }
        ]
    },
    {
        id: 4,
        question: "📅 Quale timeframe preferisci?",
        options: [
            { label: "Intraday (M1-M15)", value: "intraday", emoji: "⚡", role: "Scalper" },
            { label: "Day Trading (H1-H4)", value: "day", emoji: "📊" },
            { label: "Swing (Daily-Weekly)", value: "swing", emoji: "📈", role: "Swing Trader" }
        ]
    },
    {
        id: 5,
        question: "📖 Come impari meglio?",
        options: [
            { label: "Video", value: "video", emoji: "🎥" },
            { label: "Contenuti scritti", value: "scritti", emoji: "📚" },
            { label: "Webinar/Live", value: "live", emoji: "🎓" },
            { label: "Pratica", value: "pratica", emoji: "🎯" }
        ]
    },
    {
        id: 6,
        question: "⚠️ Qual è la tua sfida più grande nel trading?",
        options: [
            { label: "Psicologia/Emozioni", value: "psicologia", emoji: "🧠" },
            { label: "Strategia/Entrate", value: "strategia", emoji: "🎯" },
            { label: "Risk Management", value: "risk", emoji: "⚖️" },
            { label: "Pazienza/Disciplina", value: "disciplina", emoji: "😌" }
        ]
    },
    {
        id: 7,
        question: "💼 Quale dimensione di account stai tradando?",
        options: [
            { label: "Meno di $10k", value: "under_10k", emoji: "1️⃣" },
            { label: "$10k - $50k", value: "10k_50k", emoji: "2️⃣" },
            { label: "$50k+", value: "over_50k", emoji: "3️⃣" }
        ]
    },
    {
        id: 8,
        question: "📊 Quali mercati tradi?",
        options: [
            { label: "Forex", value: "forex", emoji: "💱" },
            { label: "Crypto", value: "crypto", emoji: "🪙" },
            { label: "Indici", value: "indici", emoji: "📈" },
            { label: "Commodities", value: "commodities", emoji: "🥇" }
        ]
    },
    {
        id: 9,
        question: "🎨 Qual è il tuo stile di trading?",
        options: [
            { label: "Scalping", value: "scalping", emoji: "⚡", role: "Scalper" },
            { label: "Day Trading", value: "daytrading", emoji: "📊" },
            { label: "Swing Trading", value: "swingtrading", emoji: "📈", role: "Swing Trader" },
            { label: "Position Trading", value: "position", emoji: "💼" }
        ]
    },
    {
        id: 10,
        question: "🧠 Qual è il tuo punto di forza?",
        options: [
            { label: "Analisi Tecnica", value: "tecnica", emoji: "📊" },
            { label: "Analisi Fondamentale", value: "fondamentale", emoji: "📰" },
            { label: "Controllo Emotivo", value: "emotivo", emoji: "😌" },
            { label: "Risk Management", value: "risk_mgmt", emoji: "⚖️" }
        ]
    },
    {
        id: 11,
        question: "📱 Come ci hai conosciuto?",
        options: [
            { label: "Instagram", value: "instagram", emoji: "📸", role: "Insta" },
            { label: "YouTube", value: "youtube", emoji: "🎥" },
            { label: "Passaparola", value: "passaparola", emoji: "👥" },
            { label: "Altro", value: "altro", emoji: "🔍" }
        ]
    },
    {
        id: 12,
        question: "💻 Quale piattaforma usi?",
        options: [
            { label: "MetaTrader 4/5", value: "mt4_5", emoji: "📊" },
            { label: "TradingView", value: "tradingview", emoji: "📈" },
            { label: "cTrader", value: "ctrader", emoji: "💼" },
            { label: "Altro", value: "altro_platform", emoji: "🖥️" }
        ]
    },
    {
        id: 13,
        question: "⚖️ Qual è la tua tolleranza al rischio per trade?",
        options: [
            { label: "Conservativa (<1%)", value: "conservativa", emoji: "🛡️" },
            { label: "Moderata (1-2%)", value: "moderata", emoji: "⚖️" },
            { label: "Aggressiva (2-5%)", value: "aggressiva", emoji: "🔥" }
        ]
    },
    {
        id: 14,
        question: "🎯 Cosa vuoi ottenere nei prossimi 6 mesi?",
        options: [
            { label: "Profittabilità costante", value: "profittabilita", emoji: "💰" },
            { label: "Scalare l'account", value: "scalare_account", emoji: "📈" },
            { label: "Passare prop firm", value: "prop_firm", emoji: "🏢", role: "Funding Hunter" },
            { label: "Vivere di trading", value: "vivere", emoji: "🎯" }
        ]
    },
    {
        id: 15,
        question: "📚 Qual è la tua esperienza con l'analisi tecnica?",
        options: [
            { label: "Principiante", value: "principiante", emoji: "🌱" },
            { label: "Intermedio", value: "intermedio", emoji: "📚" },
            { label: "Avanzato", value: "avanzato", emoji: "🎓" },
            { label: "Esperto", value: "esperto_at", emoji: "🏆" }
        ]
    }
];

client.once('ready', () => {
    console.log('Bot online come: ' + client.user.tag);
    console.log('Pronto in ' + client.guilds.cache.size + ' server!');
});

client.on('guildMemberAdd', async (member) => {
    try {
        const guild = member.guild;
        const unverifiedRole = guild.roles.cache.get(CONFIG.UNVERIFIED_ROLE_ID);
        if (unverifiedRole) {
            await member.roles.add(unverifiedRole);
        }

        const welcomeChannel = guild.channels.cache.get(CONFIG.WELCOME_CHANNEL_ID);
        if (welcomeChannel) {
            const welcomeEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🎉 Benvenuto in SMFX ACADEMY!')
                .setDescription(`**Ciao ${member.user.username}!** 👋\n\nSei ufficialmente entrato nella **SMFX ACADEMY PREMIUM**, la community di trading più completa d'Italia!\n\n🚀 **Il tuo viaggio inizia qui:**\n\nPer accedere a tutti i contenuti esclusivi, vai nel canale <#${CONFIG.START_CHANNEL_ID}> e segui il percorso di verifica!\n\n💡 Dopo aver completato tutti gli step, riceverai i ruoli in base al tuo profilo e potrai accedere a:\n• 📚 Contenuti formativi avanzati\n• 📊 Analisi di mercato in tempo reale\n• 💬 Chat con altri trader\n• 🎯 Strategie esclusive\n• 🏆 E molto altro!\n\n**Iniziamo questo viaggio di successo insieme!** 💪`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: 'SMFX ACADEMY • Premium Trading Community' })
                .setTimestamp();

            await welcomeChannel.send({ embeds: [welcomeEmbed] });
        }
    } catch (error) {
        console.error('Errore nel gestire nuovo membro:', error);
    }
});

async function sendQuestion(member, channel, questionIndex) {
    if (questionIndex >= QUESTIONS.length) {
        await completeVerification(member, channel);
        return;
    }

    const question = QUESTIONS[questionIndex];
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Domanda ' + (questionIndex + 1) + ' di ' + QUESTIONS.length)
        .setDescription(question.question)
        .setFooter({ text: member.user.username + ' • Clicca sui bottoni per rispondere' })
        .setTimestamp();

    const buttons = question.options.map((option, index) =>
        new ButtonBuilder()
            .setCustomId('q' + questionIndex + '_' + index)
            .setLabel(option.label)
            .setEmoji(option.emoji)
            .setStyle(ButtonStyle.Primary)
    );

    const rows = [];
    for (let i = 0; i < buttons.length; i += 5) {
        rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
    }

    await channel.send({ content: member.toString(), embeds: [embed], components: rows });
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        // Bottone "Passa al Prossimo Step" dal canale #inizia-da-qui
        if (interaction.customId === 'next_step_verification') {
            const member = interaction.member;
            const guild = interaction.guild;
            
            const verificationChannel = guild.channels.cache.get(CONFIG.VERIFICATION_CHANNEL_ID);

            if (!verificationChannel) {
                return interaction.reply({
                    content: '❌ Canale di verifica non trovato!',
                    ephemeral: true
                });
            }

            await interaction.reply({
                content: `✅ Vai su ${verificationChannel} e inizia le 15 domande di verifica! 🚀`,
                ephemeral: true
            });

            setTimeout(async () => {
                await sendQuestion(member, verificationChannel, 0);
            }, 1000);

            console.log(`✅ ${member.user.tag} ha cliccato il bottone Passa al Prossimo Step`);
            return;
        }

        // Resto delle domande (le 15 domande)
        const member = interaction.member;
        const customId = interaction.customId;
        const match = customId.match(/q(\d+)_(\d+)/);

        if (!match) return;

        const questionIndex = parseInt(match[1]);
        const answerIndex = parseInt(match[2]);

        const question = QUESTIONS[questionIndex];
        if (!question) {
            console.error(`Errore: Domanda ${questionIndex} non trovata!`);
            return;
        }

        const selectedOption = question.options[answerIndex];
        if (!selectedOption) {
            console.error(`Errore: Opzione ${answerIndex} non trovata per domanda ${questionIndex}!`);
            return;
        }

        if (!userResponses.has(member.id)) {
            userResponses.set(member.id, []);
        }

        userResponses.get(member.id).push({
            question: question.question,
            answer: selectedOption.label,
            role: selectedOption.role
        });

        await interaction.reply({
            content: '✅ Risposta registrata: **' + selectedOption.label + '**\n\nProssima domanda in arrivo...',
            ephemeral: true
        });

        await interaction.message.delete();

        const channel = interaction.channel;
        setTimeout(async () => {
            await sendQuestion(member, channel, questionIndex + 1);
        }, 1500);
    } catch (error) {
        console.error('Errore nel gestire bottone:', error);
    }
});

async function completeVerification(member, channel) {
    try {
        const responses = userResponses.get(member.id);
        if (!responses) return;

        const rolesToAssign = new Set();
        responses.forEach(response => {
            if (response.role) {
                rolesToAssign.add(response.role);
            }
        });

        const guild = member.guild;

        for (const roleName of rolesToAssign) {
            const role = guild.roles.cache.find(r => r.name === roleName);
            if (role) {
                await member.roles.add(role);
            }
        }

        const verifiedRole = guild.roles.cache.get(CONFIG.VERIFIED_ROLE_ID);
        if (verifiedRole) {
            await member.roles.add(verifiedRole);
        }

        const unverifiedRole = guild.roles.cache.get(CONFIG.UNVERIFIED_ROLE_ID);
        if (unverifiedRole && member.roles.cache.has(CONFIG.UNVERIFIED_ROLE_ID)) {
            await member.roles.remove(unverifiedRole);
        }

        const completionEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Verifica Completata!')
            .setDescription('**Complimenti ' + member.user.username + '!** 🎉\n\nHai completato con successo il questionario di benvenuto!\n\n**🎯 Ruoli assegnati:**\n' + (Array.from(rolesToAssign).map(r => '• ' + r).join('\n') || '• Profilo base') + '\n\n🚀 **Ora puoi accedere a tutti i canali della community!**\n\n💪 Inizia subito a esplorare i contenuti, partecipare alle discussioni e migliorare le tue skills di trading!\n\n📈 **Buon trading e benvenuto nella famiglia SMFX!**')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'SMFX ACADEMY • Il tuo viaggio inizia ora!' })
            .setTimestamp();

        await channel.send({ content: member.toString(), embeds: [completionEmbed] });
        userResponses.delete(member.id);
    } catch (error) {
        console.error('Errore nel completare verifica:', error);
    }
}

client.login(CONFIG.TOKEN);
