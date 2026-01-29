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
    START_CHANNEL_ID: '1465401937389420687',
    VERIFICATION_CHANNEL_ID: process.env.VERIFICATION_CHANNEL_ID,
    UNVERIFIED_ROLE_ID: '1465665414238310400',
    VERIFIED_ROLE_ID: '1465806849927413820'
};

const userResponses = new Map();

const QUESTIONS = [
    { id: 1, question: "📊 Da quanto tempo fai trading?", options: [
        { label: "0-2 anni", emoji: "🌱", role: "Nuovo (0-1 anni esperienza)" },
        { label: "2-5 anni", emoji: "📚", role: "Esperto (1-5 anni)" },
        { label: "5+ anni", emoji: "🏆", role: "Pro (5+ anni)" }
    ]},
    { id: 2, question: "⏰ Fai trading full-time o part-time?", options: [
        { label: "Part-Time", emoji: "🕐" },
        { label: "Full-Time", emoji: "💼", role: "Full-Time Aspirante" },
        { label: "Aspirante Full-Time", emoji: "🎯", role: "Full-Time Aspirante" }
    ]},
    { id: 3, question: "🎯 Qual è il tuo obiettivo principale nel trading?", options: [
        { label: "Profitto costante", emoji: "💰" },
        { label: "Scalare l'account", emoji: "📈" },
        { label: "Passare una prop firm", emoji: "🏢", role: "Funding Hunter" }
    ]},
    { id: 4, question: "📅 Quale timeframe preferisci?", options: [
        { label: "Intraday (M1-M15)", emoji: "⚡", role: "Scalper" },
        { label: "Day Trading (H1-H4)", emoji: "📊" },
        { label: "Swing (Daily-Weekly)", emoji: "📈", role: "Swing Trader" }
    ]},
    { id: 5, question: "📖 Come impari meglio?", options: [
        { label: "Video", emoji: "🎥" },
        { label: "Contenuti scritti", emoji: "📚" },
        { label: "Webinar/Live", emoji: "🎓" },
        { label: "Pratica", emoji: "🎯" }
    ]},
    { id: 6, question: "⚠️ Qual è la tua sfida più grande nel trading?", options: [
        { label: "Psicologia/Emozioni", emoji: "🧠" },
        { label: "Strategia/Entrate", emoji: "🎯" },
        { label: "Risk Management", emoji: "⚖️" },
        { label: "Pazienza/Disciplina", emoji: "😌" }
    ]},
    { id: 7, question: "💼 Quale dimensione di account stai tradando?", options: [
        { label: "Meno di $10k", emoji: "1️⃣" },
        { label: "$10k - $50k", emoji: "2️⃣" },
        { label: "$50k+", emoji: "3️⃣" }
    ]},
    { id: 8, question: "📊 Quali mercati tradi?", options: [
        { label: "Forex", emoji: "💱" },
        { label: "Crypto", emoji: "🪙" },
        { label: "Indici", emoji: "📈" },
        { label: "Commodities", emoji: "🥇" }
    ]},
    { id: 9, question: "🎨 Qual è il tuo stile di trading?", options: [
        { label: "Scalping", emoji: "⚡", role: "Scalper" },
        { label: "Day Trading", emoji: "📊" },
        { label: "Swing Trading", emoji: "📈", role: "Swing Trader" },
        { label: "Position Trading", emoji: "💼" }
    ]},
    { id: 10, question: "🧠 Qual è il tuo punto di forza?", options: [
        { label: "Analisi Tecnica", emoji: "📊" },
        { label: "Analisi Fondamentale", emoji: "📰" },
        { label: "Controllo Emotivo", emoji: "😌" },
        { label: "Risk Management", emoji: "⚖️" }
    ]},
    { id: 11, question: "📱 Come ci hai conosciuto?", options: [
        { label: "Instagram", emoji: "📸", role: "Insta" },
        { label: "YouTube", emoji: "🎥" },
        { label: "Passaparola", emoji: "👥" },
        { label: "Altro", emoji: "🔍" }
    ]},
    { id: 12, question: "💻 Quale piattaforma usi?", options: [
        { label: "MetaTrader 4/5", emoji: "📊" },
        { label: "TradingView", emoji: "📈" },
        { label: "cTrader", emoji: "💼" },
        { label: "Altro", emoji: "🖥️" }
    ]},
    { id: 13, question: "⚖️ Qual è la tua tolleranza al rischio per trade?", options: [
        { label: "Conservativa (<1%)", emoji: "🛡️" },
        { label: "Moderata (1-2%)", emoji: "⚖️" },
        { label: "Aggressiva (2-5%)", emoji: "🔥" }
    ]},
    { id: 14, question: "🎯 Cosa vuoi ottenere nei prossimi 6 mesi?", options: [
        { label: "Profittabilità costante", emoji: "💰" },
        { label: "Scalare l'account", emoji: "📈" },
        { label: "Passare prop firm", emoji: "🏢", role: "Funding Hunter" },
        { label: "Vivere di trading", emoji: "🎯" }
    ]},
    { id: 15, question: "📚 Qual è la tua esperienza con l'analisi tecnica?", options: [
        { label: "Principiante", emoji: "🌱" },
        { label: "Intermedio", emoji: "📚" },
        { label: "Avanzato", emoji: "🎓" },
        { label: "Esperto", emoji: "🏆" }
    ]}
];

let messagesAlreadySent = false;

client.once('ready', async () => {
    console.log('✅ Bot online: ' + client.user.tag);
    
    if (!messagesAlreadySent) {
        try {
            const guild = client.guilds.cache.get(CONFIG.GUILD_ID);
            if (guild) {
                const startChannel = guild.channels.cache.get(CONFIG.START_CHANNEL_ID);
                if (startChannel) {
                    const button = new ButtonBuilder()
                        .setCustomId('next_step_verification')
                        .setLabel('📋 Passa al Prossimo Step')
                        .setStyle(ButtonStyle.Success);

                    const row = new ActionRowBuilder().addComponents(button);

                    const embed = new EmbedBuilder()
                        .setColor('#FF6B35')
                        .setTitle('🎉 BENVENUTO IN SMFX ACADEMY PREMIUM!')
                        .setDescription(
                            `Ora segui questi 4 step per essere verificato:\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            `**STEP 1️⃣ - VIDEOCORSI SU WHOP**\n` +
                            `Vai su Whop → **STRATEGY COURSES** e guarda:\n` +
                            `📹 **SMFX Strategy** (2-3 ore)\n` +
                            `📹 **H4-M15 Swing Strategy** (1-2 ore)\n\n` +
                            `✅ Una volta guardati → Procedi allo STEP 2\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            `**STEP 2️⃣ - PDF PSICOLOGIA SU WHOP**\n` +
                            `Vai su Whop → **Psicologia/Mindset** e leggi TUTTI i PDF:\n` +
                            `📄 Allenare_il_cervello_per_il_live_trading.pdf\n` +
                            `📄 Come_Allenare_Corpo_Allena_Mente_SMFX.pdf\n` +
                            `📄 Come_Controllare_Paura_e_Avidita_SMFX.pdf\n` +
                            `📄 Controllare_le_Emozioni_SMFX.pdf\n` +
                            `📄 Discipline_Gap_SMFX.pdf\n` +
                            `📄 Effetto_Specchio_SMFX.pdf\n\n` +
                            `✅ Una volta letti tutti → Procedi allo STEP 3\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            `**STEP 3️⃣ - VERIFICA NEL CANALE #CHI-SEI**\n` +
                            `Clicca il bottone qui sotto per accedere a #chi-sei\n` +
                            `Rispondi alle 15 domande di verifica\n` +
                            `Riceverai il ruolo **✅ VERIFICATO**\n\n` +
                            `✅ Una volta verificato → Procedi allo STEP 4\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            `**STEP 4️⃣ - PRESENTAZIONE NEL CANALE #PRESENTAZIONE**\n` +
                            `Vai nel canale #presentazione e scrivi:\n` +
                            `• Il tuo nome\n` +
                            `• Da quanto tempo fai trading\n` +
                            `• Il tuo obiettivo principale\n` +
                            `• Una cosa interessante su di te\n\n` +
                            `✅ Una volta fatto → Hai accesso COMPLETO! 🚀\n\n` +
                            `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                            `🔓 **Riceverai il ruolo ✅ VERIFICATO e accesso a TUTTI i canali!**\n\n` +
                            `**SMFX ACADEMY • Il tuo viaggio inizia ora!** 🚀`
                        )
                        .setFooter({ text: 'SMFX ACADEMY • Inizia il tuo percorso!' })
                        .setTimestamp();

                    await startChannel.send({ embeds: [embed], components: [row] });
                    console.log('✅ Messaggio inviato');
                }
            }
            messagesAlreadySent = true;
        } catch (error) {
            console.error('Errore:', error);
        }
    }
});

client.on('guildMemberAdd', async (member) => {
    try {
        const guild = member.guild;
        const unverifiedRole = guild.roles.cache.get(CONFIG.UNVERIFIED_ROLE_ID);
        if (unverifiedRole) await member.roles.add(unverifiedRole);

        const welcomeChannel = guild.channels.cache.get(CONFIG.WELCOME_CHANNEL_ID);
        if (welcomeChannel) {
            const embed = new EmbedBuilder()
                .setColor('#FF6B35')
                .setTitle('🎉 Benvenuto in SMFX ACADEMY!')
                .setDescription(
                    `Ciao ${member.user.username}! 👋\n\n` +
                    `Sei ufficialmente entrato nella **SMFX ACADEMY PREMIUM**, la community di trading più completa d'Italia!\n\n` +
                    `🚀 **Il tuo viaggio inizia qui:**\n\n` +
                    `Per accedere a tutti i contenuti esclusivi, vai nel canale <#${CONFIG.START_CHANNEL_ID}> e segui il percorso di verifica!\n\n` +
                    `💡 **Dopo aver completato tutti gli step, riceverai i ruoli in base al tuo profilo e potrai accedere a:**\n` +
                    `• 📚 Contenuti formativi avanzati\n` +
                    `• 📊 Analisi di mercato in tempo reale\n` +
                    `• 💬 Chat con altri trader\n` +
                    `• 🎯 Strategie esclusive\n` +
                    `• 🏆 E molto altro!\n\n` +
                    `**Iniziamo questo viaggio di successo insieme!** 💪`
                )
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: 'SMFX ACADEMY • Premium Trading Community' })
                .setTimestamp();
            
            await welcomeChannel.send({ embeds: [embed] });
        }
    } catch (error) {
        console.error('Errore membro:', error);
    }
});

async function sendQuestion(member, interaction, verificationChannel, questionIndex) {
    try {
        if (questionIndex >= QUESTIONS.length) {
            await completeVerification(member, interaction, verificationChannel);
            return;
        }

        const question = QUESTIONS[questionIndex];
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Domanda ${questionIndex + 1} di ${QUESTIONS.length}`)
            .setDescription(question.question)
            .setTimestamp();

        const buttons = question.options.map((opt, idx) =>
            new ButtonBuilder()
                .setCustomId(`q${questionIndex}_${idx}`)
                .setLabel(opt.label)
                .setEmoji(opt.emoji)
                .setStyle(ButtonStyle.Primary)
        );

        const rows = [];
        for (let i = 0; i < buttons.length; i += 5) {
            rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
        }

        // Invia nel canale #chi-sei (ephemeral)
        await interaction.followUp({ embeds: [embed], components: rows, ephemeral: true });
    } catch (error) {
        console.error('Errore domanda:', error);
    }
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    try {
        if (interaction.customId === 'next_step_verification') {
            const member = interaction.member;
            const verificationChannel = interaction.guild.channels.cache.get(CONFIG.VERIFICATION_CHANNEL_ID);
            
            if (!verificationChannel) {
                return interaction.reply({ content: '❌ Canale non trovato!', ephemeral: true });
            }

            await interaction.reply({ content: `✅ Vai nel canale <#${CONFIG.VERIFICATION_CHANNEL_ID}> per iniziare!`, ephemeral: true });
            
            // Invia la prima domanda nel canale #chi-sei
            const question = QUESTIONS[0];
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Domanda 1 di ${QUESTIONS.length}`)
                .setDescription(question.question)
                .setTimestamp();

            const buttons = question.options.map((opt, idx) =>
                new ButtonBuilder()
                    .setCustomId(`q0_${idx}`)
                    .setLabel(opt.label)
                    .setEmoji(opt.emoji)
                    .setStyle(ButtonStyle.Primary)
            );

            const rows = [];
            for (let i = 0; i < buttons.length; i += 5) {
                rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
            }

            // Invia direttamente nel canale #chi-sei (ephemeral)
            await interaction.followUp({ 
                embeds: [embed], 
                components: rows,
                ephemeral: true
            });

            return;
        }

        const match = interaction.customId.match(/q(\d+)_(\d+)/);
        if (!match) return;

        const [, qIdx, aIdx] = match;
        const questionIndex = parseInt(qIdx);
        const answerIndex = parseInt(aIdx);

        const question = QUESTIONS[questionIndex];
        const option = question.options[answerIndex];

        if (!userResponses.has(interaction.member.id)) {
            userResponses.set(interaction.member.id, []);
        }

        userResponses.get(interaction.member.id).push({
            question: question.question,
            answer: option.label,
            role: option.role
        });

        await interaction.reply({
            content: `✅ Risposta: **${option.label}**`,
            ephemeral: true
        });

        const verificationChannel = interaction.guild.channels.cache.get(CONFIG.VERIFICATION_CHANNEL_ID);
        await new Promise(r => setTimeout(r, 1000));
        await sendQuestion(interaction.member, interaction, verificationChannel, questionIndex + 1);

    } catch (error) {
        console.error('Errore interazione:', error);
    }
});

async function completeVerification(member, interaction, verificationChannel) {
    try {
        const responses = userResponses.get(member.id);
        if (!responses) return;

        const roles = new Set();
        responses.forEach(r => r.role && roles.add(r.role));

        const guild = member.guild;
        for (const roleName of roles) {
            const role = guild.roles.cache.find(r => r.name === roleName);
            if (role) await member.roles.add(role);
        }

        const verifiedRole = guild.roles.cache.get(CONFIG.VERIFIED_ROLE_ID);
        if (verifiedRole) await member.roles.add(verifiedRole);

        const unverifiedRole = guild.roles.cache.get(CONFIG.UNVERIFIED_ROLE_ID);
        if (unverifiedRole) await member.roles.remove(unverifiedRole);

        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Verifica Completata!')
            .setDescription(
                `Complimenti **${member.user.username}**! 🎉\n\n` +
                `Hai completato con successo il questionario di benvenuto!\n\n` +
                `**🎯 Ruoli assegnati:**\n` +
                (Array.from(roles).map(r => `• ${r}`).join('\n') || '• Profilo base') +
                `\n\n🚀 **Ora puoi accedere a tutti i canali della community!**\n\n` +
                `💪 Inizia subito a esplorare i contenuti, partecipare alle discussioni e migliorare le tue skills di trading!\n\n` +
                `📈 **Buon trading e benvenuto nella famiglia SMFX!**`
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'SMFX ACADEMY • Il tuo viaggio inizia ora!' })
            .setTimestamp();

        await interaction.followUp({ embeds: [embed], ephemeral: true });
        userResponses.delete(member.id);

    } catch (error) {
        console.error('Errore verifica:', error);
    }
}

client.login(CONFIG.TOKEN);
