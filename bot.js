const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
require('dotenv').config();

const client = nuovo Client({
    intenti: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

costante CONFIG = {
    TOKEN: processo.ambiente.TOKEN,
    GUILD_ID: process.env.GUILD_ID,
    WELCOME_CHANNEL_ID: process.env.WELCOME_CHANNEL_ID,
    VERIFICATION_CHANNEL_ID: process.env.VERIFICATION_CHANNEL_ID,
    ID_RUOLO_NON_VERIFICATO: '1465665414238310400',
    VERIFIED_ROLE_ID: '1465806849927413820' // Aggiungi l'ID del ruolo VERIFICATO
};

const userResponses = new Map();

const DOMANDE = [
    {
        ID: 1,
        domanda: "📊 Da quanto tempo fai trading?",
        opzioni: [
            { label: "0-2 anni", value: "0-2_anni", emoji: "🌱", role: "Nuovo (0-1 anni esperienza)" },
            { etichetta: "2-5 anni", valore: "2-5_anni", emoji: "📚", ruolo: "Esperto (1-5 anni)" },
            { etichetta: "5+ anni", valore: "5+_anni", emoji: "🏆", ruolo: "Pro (5+ anni)" }
        ]
    },
    {
        ID: 2,
        domanda: "⏰ Fai trading a tempo pieno o part-time?",
        opzioni: [
            { etichetta: "Part-Time", valore: "part_time", emoji: "🕐" },
            { etichetta: "Tempo pieno", valore: "tempo_pieno", emoji: "💼", ruolo: "Aspirante a tempo pieno" },
            { etichetta: "Aspirante a tempo pieno", valore: "aspirante", emoji: "🎯", ruolo: "Aspirante a tempo pieno" }
        ]
    },
    {
        ID: 3,
        domanda: "🎯 Qual è il tuo obiettivo principale nel trading?",
        opzioni: [
            {etichetta: "Profitto costante", valore: "profitto", emoji: "💰" },
            { label: "Scalare l'account", value: "scalare", emoji: "📈" },
            { label: "Passare una prop firm", value: "prop", emoji: "🏢", role: "Funding Hunter" }
        ]
    },
    {
        ID: 4,
        domanda: "📅 Quale intervallo temporale preferisci?",
        opzioni: [
            { etichetta: "Intraday (M1-M15)", valore: "intraday", emoji: "⚡", ruolo: "Scalper" },
            { etichetta: "Day Trading (H1-H4)", valore: "giorno", emoji: "📊" },
            { etichetta: "Swing (giornaliero-settimanale)", valore: "swing", emoji: "📈", ruolo: "Swing Trader" }
        ]
    },
    {
        ID: 5,
        domanda: "📖 Come impari meglio?",
        opzioni: [
            { etichetta: "Video", valore: "video", emoji: "🎥" },
            { etichetta: "Contenuti scritti", valore: "scritti", emoji: "📚" },
            { etichetta: "Webinar/Live", valore: "live", emoji: "🎓" },
            { etichetta: "Pratica", valore: "pratica", emoji: "🎯" }
        ]
    },
    {
        ID: 6,
        domanda: "⚠️ Qual è la tua sfida più grande nel trading?",
        opzioni: [
            { etichetta: "Psicologia/Emozioni", valore: "psicologia", emoji: "🧠" },
            { etichetta: "Strategia/Entrate", valore: "strategia", emoji: "🎯" },
            { etichetta: "Gestione del rischio", valore: "rischio", emoji: "⚖️" },
            { etichetta: "Pazienza/Disciplina", valore: "disciplina", emoji: "😌" }
        ]
    },
    {
        ID: 7,
        domanda: "💼 Quale dimensione di account stai tradando?",
        opzioni: [
            { label: "Meno di $10k", value: "under_10k", emoji: "1️⃣" },
            { etichetta: "$10k - $50k", valore: "10k_50k", emoji: "2️⃣" },
            { etichetta: "$50k+", valore: "oltre_50k", emoji: "3️⃣" }
        ]
    },
    {
        ID: 8,
        domanda: "📊 Quali mercati tradi?",
        opzioni: [
            { etichetta: "Forex", valore: "forex", emoji: "💱" },
            { etichetta: "Cripto", valore: "cripto", emoji: "🪙" },
            { etichetta: "Indici", valore: "indici", emoji: "📈" },
            { etichetta: "Materie prime", valore: "materie prime", emoji: "🥇" }
        ]
    },
    {
        ID: 9,
        domanda: "🎨 Qual è il tuo stile di trading?",
        opzioni: [
            { etichetta: "Scalping", valore: "scalping", emoji: "⚡", ruolo: "Scalper" },
            { etichetta: "Day Trading", valore: "daytrading", emoji: "📊" },
            { etichetta: "Swing Trading", valore: "swingtrading", emoji: "📈", ruolo: "Swing Trader" },
            { etichetta: "Position Trading", valore: "posizione", emoji: "💼" }
        ]
    },
    {
        ID: 10,
        domanda: "🧠 Qual è il tuo punto di forza?",
        opzioni: [
            { etichetta: "Analisi Tecnica", valore: "tecnica", emoji: "📊" },
            { etichetta: "Analisi Fondamentale", valore: "fondamentale", emoji: "📰" },
            { label: "Controllo Emotivo", value: "emotivo", emoji: "😌" },
            { etichetta: "Gestione del rischio", valore: "risk_mgmt", emoji: "⚖️" }
        ]
    },
    {
        ID: 11,
        domanda: "📱 Come ci hai conosciuto?",
        opzioni: [
            { etichetta: "Instagram", valore: "instagram", emoji: "📸", ruolo: "Insta" },
            { etichetta: "YouTube", valore: "youtube", emoji: "🎥" },
            { etichetta: "Passaparola", valore: "passaparola", emoji: "👥" },
            {etichetta: "Altro", valore: "altro", emoji: "🔍" }
        ]
    },
    {
        ID: 12,
        domanda: "💻 Quale piattaforma usi?",
        opzioni: [
            { etichetta: "MetaTrader 4/5", valore: "mt4_5", emoji: "📊" },
            { etichetta: "TradingView", valore: "tradingview", emoji: "📈" },
            {etichetta: "cTrader", valore: "ctrader", emoji: "💼" },
            { etichetta: "Altro", valore: "altro_platform", emoji: "🖥️" }
        ]
    },
    {
        ID: 13,
        domanda: "⚖️ Qual è la tua tolleranza al rischio per trade?",
        opzioni: [
            { etichetta: "Conservativa (<1%)", valore: "conservativa", emoji: "🛡️" },
            { etichetta: "Moderata (1-2%)", valore: "moderata", emoji: "⚖️" },
            {etichetta: "Aggressiva (2-5%)", valore: "aggressiva", emoji: "🔥" }
        ]
    },
    {
        ID: 14,
        domanda: "🎯 Cosa vuoi ottenere nei prossimi 6 mesi?",
        opzioni: [
            { etichetta: "Profittabilità costante", valore: "profittabilità", emoji: "💰" },
            { label: "Scalare l'account", value: "scalare_account", emoji: "📈" },
            { etichetta: "Passare prop firm", valore: "prop_firm", emoji: "🏢", ruolo: "Cacciatore di finanziamenti" },
            { etichetta: "Vivere di trading", valore: "vivere", emoji: "🎯" }
        ]
    },
    {
        ID: 15,
        domanda: "📚 Qual è la tua esperienza con l'analisi tecnica?",
        opzioni: [
            { etichetta: "Principiante", valore: "principiante", emoji: "🌱" },
            {etichetta: "Intermedio", valore: "intermedio", emoji: "📚" },
            { etichetta: "Avanzato", valore: "avanzato", emoji: "🎓" },
            {etichetta: "Esperto", valore: "esperto_at", emoji: "🏆" }
        ]
    }
];

client.once('pronto', () => {
    console.log('Bot online arrivato: ' + client.user.tag);
    console.log('Pronto in ' + client.guilds.cache.size + ' server!');
});

client.on('guildMemberAdd', async (member) => {
    Tentativo {
        const gilda = membro.gilda;
        
        // Assegnazione ruolo NON VERIFICATO
        const unverifiedRole = guild.roles.cache.get(CONFIG.UNVERIFIED_ROLE_ID);
        se (ruolo non verificato) {
            attendi member.roles.add(unverifiedRole);
        }
        
        //Messaggio di benvenuto personalizzato
        const welcomeChannel = guild.channels.cache.get(CONFIG.WELCOME_CHANNEL_ID);
        se (welcomeChannel) {
            const welcomeEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🎉 Benvenuto in SMFX ACADEMY!')
                .setDescription(`**Ciao ${member.user.username}!** 👋\n\nSei ufficialmente entrato nella **SMFX ACADEMY PREMIUM**, la community di trading più completa d'Italia!\n\n🚀 **Il tuo viaggio inizia qui:**\n\n📋 Per accedere a tutti i contenuti esclusivi, vai nel canale <#${CONFIG.VERIFICATION_CHANNEL_ID}> e rispondi alle **15 domande** che ti aiuteranno a personalizzare la tua esperienza.\n\n💡 Dopo aver completato il questionario, riceverai i ruoli in base al tuo profilo e potrai accedere a:\n• 📚 Contenuti formativi avanzati\n• 📊 Analisi di mercato in tempo reale\n• 💬 Chat con altri trader\n• 🎯 Strategie esclusive\n• 🏆 E molto altro!\n\n**Iniziamo questo viaggio di successo insieme!** 💪`)
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setFooter({ text: 'SMFX ACADEMY • Community di trading premium' })
                .impostaTimestamp();
            
            attendi welcomeChannel.send({ embeds: [welcomeEmbed] });
        }
        
        // Invia prima domanda
        const verificationChannel = guild.channels.cache.get(CONFIG.VERIFICATION_CHANNEL_ID);
        se (verificaCanale) {
            impostaTimeout(asincrono () => {
                attendi sendQuestion(membro, verificationChannel, 0);
            }, 3000);
        }
    } cattura (errore) {
        console.error('Errore nel gestire il nuovo membro:', error);
    }
});

funzione asincrona sendQuestion(membro, canale, indice domanda) {
    se (indicedomande >= lunghezzaDOMANDE) {
        attendi completeVerification(membro, canale);
        ritorno;
    }
    
    const question = DOMANDA[indicedomande];
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Domanda ' + (questionIndex + 1) + ' di ' + QUESTIONS.length)
        .setDescription(domanda.domanda)
        .setFooter({ testo: membro.utente.nomeutente + ' • Clicca sui pulsanti per rispondere' })
        .impostaTimestamp();
    
    const buttons = question.options.map((opzione, indice) =>
        nuovo ButtonBuilder()
            .setCustomId('q' + questionIndex + '_' + indice)
            .setLabel(opzione.etichetta)
            .setEmoji(opzione.emoji)
            .setStyle(ButtonStyle.Primary)
    );
    
    righe costanti = [];
    per (lascia che i = 0; i < lunghezza dei pulsanti; i += 5) {
        righe.push(new ActionRowBuilder().addComponents(pulsanti.slice(i, i + 5)));
    }
    
    attendi canale.invia({ contenuto: membro.toString(), incorporamenti: [incorporamento], componenti: righe });
}

client.on('interactionCreate', async (interazione) => {
    se (!interaction.isButton()) ritorno;
    
    Tentativo {
        const membro = interazione.membro;
        const customId = interaction.customId;
        const match = customId.match(/q(\d+)_(\d+)/);
        
        se (!match) ritorno;
        
        const questionIndex = parseInt(match[1]);
        const answerIndex = parseInt(match[2]);
        
        console.log(`Domanda ${questionIndex + 1}: L'utente ha risposto`);
        
        const question = DOMANDA[indicedomande];
        se (!domanda) {
            console.error(`Errore: Domanda ${questionIndex} non trovata!`);
            ritorno;
        }
        
        const selectedOption = question.options[answerIndex];
        se (!selectedOption) {
            console.error(`Errore: Opzione ${answerIndex} non trovata per domanda ${questionIndex}!`);
            ritorno;
        }
        
        se (!userResponses.has(member.id)) {
            userResponses.set(member.id, []);
        }
        
        userResponses.get(member.id).push({
            domanda: domanda.domanda,
            risposta: selectedOption.label,
            ruolo: selectedOption.role
        });
        
        attendi interazione.rispondi({
            content: '✅ Risposta registrata: **' +selectedOption.label + '**\n\nProssima domanda in arrivo...',
            effimero: vero
        });
        
        attendi interazione.messaggio.elimina();
        
        const canale = interazione.canale;
        impostaTimeout(asincrono () => {
            console.log(`Invio domanda ${questionIndex + 2} (indice ${questionIndex + 1})`);
            attendi sendQuestion(membro, canale, indice domanda + 1);
        }, 1500);
    } cattura (errore) {
        console.error('Errore nel gestire il bottone:', errore);
        console.error('Stack trace:', error.stack);
    }
});

funzione asincrona completeVerification(membro, canale) {
    Tentativo {
        risposte costanti = userResponses.get(member.id);
        se (!risposte) ritorno;
        
        const rolesToAssign = new Set();
        risposte.perOgni(risposta => {
            se (risposta.ruolo) {
                rolesToAssign.add(response.role);
            }
        });
        
        const gilda = membro.gilda;
        
        // Assegna ruoli di profilazione
        per (const roleName di rolesToAssign) {
            const role = guild.roles.cache.find(r => r.name === roleName);
            se (ruolo) {
                attendi membro.ruoli.aggiungi(ruolo);
            }
        }
        
        // Assegna ruolo VERIFICATO
        const verifiedRole = guild.roles.cache.get(CONFIG.VERIFIED_ROLE_ID);
        se (ruoloverificato) {
            attendi member.roles.add(verifiedRole);
        }
        
        // Rimuovi ruolo NON VERIFICATO
        const unverifiedRole = guild.roles.cache.get(CONFIG.UNVERIFIED_ROLE_ID);
        se (unverifiedRole && member.roles.cache.has(CONFIG.UNVERIFIED_ROLE_ID)) {
            attendi member.roles.remove(unverifiedRole);
        }
        
        const completionEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Verifica Completata!')
            .setDescription('**Complimenti ' + member.user.username + '!** 🎉\n\nHai completato con successo il questionario di benvenuto!\n\n**🎯 Ruoli assegnati:**\n' + (Array.from(rolesToAssign).map(r => '• ' + r).join('\n') || '• Profilo base') + '\n\n🚀 **Ora puoi accedere a tutti i canali della community!**\n\n💪 Inizia subito ad esplorare i contenuti, partecipare alle discussioni e migliorare le tue abilità di trading!\n\n📈 **Buon trading e benvenuto nella famiglia SMFX!**')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: 'SMFX ACADEMY • Il tuo viaggio inizia ora!' })
            .impostaTimestamp();
        
        attendi canale.invia({ contenuto: membro.toString(), incorpora: [completionEmbed] });
        userResponses.delete(member.id);
    } cattura (errore) {
        console.error('Errore nel completare la verifica:', errore);
    }
}

client.login(CONFIG.TOKEN);
