const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const sharp = require('sharp');
const path = require('path');
const os = require('os');
const fs = require('fs');

if (!fs.existsSync('fotos/gatinhos')) try{fs.mkdirSync('fotos/gatinhos', { recursive: true });}
catch(e){console.log(e)}

// A LocalAuth é a estratégia padrão e cuidará do cache automaticamente.
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "sessao-principal" // Identificador da sua sessão
    }),
    puppeteer: {
        headless: true, // Pode ser false se quiser ver o navegador abrindo
    }
});

const startupTime = Math.floor(Date.now() / 1000);

let prefix = '/';


client.on('qr', qr => {
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log('⭐');
    sendMassaSticker("", "169178912805034@lid");
    //client.sendMessage("169178912805034@g.us", media, { caption: 'Feliz ano novo!' });
});

/**
 * Aqui vem como default 'message', bora trocar para 'message_create', 
 * dessa forma nós também poderemos dar comandos e não apenas seus 
 * contatos.
 */

let membros = {
    "default": "012345678901234567890",
    "miller": "169178912805034",
    "dudu": "217836664451235",
    "gabriel": "254125010890978",
    "dante": "271725434564648",
    "fausto": "260562999107774",
    "luscas": "262590626296045",
    "gx": "47687609122993",
    "ruan": "209143516409906"
}
let admins = [
    membros["miller"],
    membros.default
]

function adm(msg){
    const idCompleto = msg.author || msg.from;
    const numeroRemetente = idCompleto.split('@')[0];
    return admins.includes(numeroRemetente) 
}

client.on('message_create', async msg => {
    if (msg.timestamp < startupTime) return;
    
    const chat = await msg.getChat();
    
    const mensagem = msg.body; // texto completo
    const command = msg.body.split(' ')[0];// texto ate o primeiro espaço
    const extraido = command.toLowerCase();

    const sender = msg.from.includes("84848484") ? msg.to : msg.from
    
    if (!true) oprimir("209143516409906"); // oprimir o ruan de graça

    //console.log(command);
    if (true) console.log(`De: ${msg.from} | Por: ${msg.author} | Texto: ${msg.body}`);
    if (mensagem === "/marcar") {
    let userPhone = "5511973706804";
    setTimeout(() => {
  console.log("Marcação enviada!");
  chat.sendMessage(msg.from, `Marcado`, {
      mentions: [userPhone]
    }, 2000);
    });
    }

    //easter eggs do bot
    if (mensagem === 'gx') msg.reply('viado!');
    if (mensagem === 'dudu') msg.reply('abusado!');
    if (mensagem === 'ruan') msg.reply('baitolinha!');
    if (mensagem === 'gabriel') msg.reply('judeu!');
    if (mensagem === 'like') msg.react('👍');
    if (mensagem === 'massa') await sendMassaSticker(msg, msg.from);

    //comandos padrão
    if (mensagem === "@183056489005212") msg.reply("Me chamou?");
    if (extraido === prefix+"fixar") fixamsg(msg);
    // if (extraido === prefix+"desfixar") desfixamsg(msg);
    if (extraido === (prefix+"s"))  fazSticker(msg, sender, false); //generateSticker(msg, sender);
    if (extraido === (prefix+"st"))  fazSticker(msg, sender, true);
    if (extraido.startsWith(prefix+"menu")) msg.reply(menu());
    
    if (extraido.startsWith(prefix+'ping')) {
        // Calcula o atraso (latência)
        // msg.timestamp é o horário que o WhatsApp recebeu a mensagem (em segundos)
        // Date.now() é o horário atual (em milissegundos)
        const timestampMsg = msg.timestamp * 1000;
        const latencia = Date.now() - timestampMsg;

        // Responde com o tempo de resposta em milissegundos
        msg.reply(`🏓 *Pong!* \nLatência: _${latencia}ms_`);
    }
    if (extraido.startsWith(prefix+'svgatinho')) {
        if(msg.hasMedia) {
        try {
            const media = await msg.downloadMedia();

            if (media && media.mimetype.includes('image')) {
                // 3. Define o nome do arquivo (ex: gatinho_1735520000.jpg)
                const extensao = media.mimetype.split('/')[1]; // jpg, png, etc
                const nomeArquivo = `gatinho_${Date.now()}.${extensao}`;
                const caminhoFinal = path.join(__dirname, 'fotos/gatinhos', nomeArquivo);

                // 4. Salva o arquivo fisicamente na pasta
                fs.writeFile(caminhoFinal, media.data, { encoding: 'base64' }, (err) => {
                    if (err) {
                        console.error("Erro ao gravar arquivo:", err);
                        msg.reply("❌ Erro ao salvar a foto localmente.");
                    } else {
                        console.log(`Foto salva com sucesso em: ${caminhoFinal}`);
                        msg.react('💾'); // Reage para confirmar que salvou
                    }
                });
            }
        } catch (e) {
            console.error("Erro no download da mídia:", e);
            msg.reply("❌ Falha ao baixar a imagem.");
        }
    }
    else if(msg.hasQuotedMsg){
        const quoted = await msg.getQuotedMessage();
        if (quoted.hasMedia) media = await quoted.downloadMedia();
        // Validação crucial: verifica se a mídia foi baixada e se tem conteúdo
            if (media && media.mimetype.includes('image')) {
                // 3. Define o nome do arquivo (ex: gatinho_1735520000.jpg)
                const extensao = media.mimetype.split('/')[1]; // jpg, png, etc
                const nomeArquivo = `gatinho_${Date.now()}.${extensao}`;
                const caminhoFinal = path.join(__dirname, 'fotos/gatinhos', nomeArquivo);

                // 4. Salva o arquivo fisicamente na pasta
                fs.writeFile(caminhoFinal, media.data, { encoding: 'base64' }, (err) => {
                    if (err) {
                        console.error("Erro ao gravar arquivo:", err);
                        msg.reply("❌ Erro ao salvar a foto localmente.");
                    } else {
                        console.log(`Foto salva com sucesso em: ${caminhoFinal}`);
                        msg.react('💾'); // Reage para confirmar que salvou
                    }
                });
            }
    }
    else{
        msg.reply("Mas cadê o gatinho? 🤔");
    }
    }
    if (extraido.startsWith(prefix+'gatinho')){
        try {
            const pastaFotos = path.join(__dirname, 'fotos/gatinhos');

            // 1. Lê todos os arquivos da pasta
            const arquivos = fs.readdirSync(pastaFotos);

            // 2. Filtra para garantir que pegamos apenas imagens (extensões comuns)
            const fotos = arquivos.filter(arquivo => 
                ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(arquivo).toLowerCase())
            );

            // 3. Verifica se a pasta não está vazia
            if (fotos.length === 0) {
                return msg.reply("❌ A pasta de fotos está vazia!");
            }

            // 4. Sorteia uma foto aleatória
            const fotoSorteada = fotos[Math.floor(Math.random() * fotos.length)];
            const caminhoCompleto = path.join(pastaFotos, fotoSorteada);

            // 5. Cria a mídia e envia
            const media = MessageMedia.fromFilePath(caminhoCompleto);
            
            await client.sendMessage(msg.from, media, {
                caption: "Aqui está um gatinho aleatório! 🐱"
            });

            console.log(`Foto enviada: ${fotoSorteada}`);

        } catch (e) {
            console.error("Erro ao enviar foto aleatória:", e);
            msg.reply("❌ Ocorreu um erro ao buscar a foto.");
        }
    }
    //palhaçada esquizoide do gx
    //if (command === "/cp") msg.reply("https://t.me/fdebikini");
    //if (command === "/cp2") msg.reply("https://t.me/springfield007");

    if (mensagem === prefix+'cp') {//foto do gabriel
        try {
            const filePath = path.join(__dirname, 'fotos', 'cp.jpg');
            const media = MessageMedia.fromFilePath(filePath);
            client.sendMessage(msg.from, media, { caption: 'Feliz ano novo!', isViewOnce: true });
        } catch (e) {console.log(e);}
    }




    
    if (extraido === '/status') {
        // 1. Cálculo de Latência (Ping)
        const latencia = Math.abs(Date.now() - (msg.timestamp * 1000));

        // 2. Cálculo de Memória RAM
        const ramLivre = os.freemem() / 1024 / 1024 / 1024; // GB
        const ramTotal = os.totalmem() / 1024 / 1024 / 1024; // GB
        const ramUso = ramTotal - ramLivre;

        // 3. Informações de CPU
        const cpus = os.cpus();
        const modeloCpu = cpus[0].model.trim();
        const cores = cpus.length;

        // 4. Tempo de Atividade (Uptime) do Sistema
        const uptimeDias = Math.floor(os.uptime() / 86400);
        const uptimeHoras = Math.floor((os.uptime() % 86400) / 3600);

        const statusMsg = `🖥️ *STATUS DO SISTEMA*
--------------------------------
🏓 *Ping:* \`${latencia}ms\`
🧠 *RAM:* \`${ramUso.toFixed(2)}GB / ${ramTotal.toFixed(2)}GB\`
⚙️ *CPU:* \`${modeloCpu}\` (${cores} cores)
🕒 *Uptime:* \`${uptimeDias}d ${uptimeHoras}h\`
🤖 *Prefixo:* \`${prefix}\`
--------------------------------`
console.log(modeloCpu);
        msg.reply(statusMsg);
    }
    // comandos (apenas adm)
    if (mensagem === "/pref reset"){
        if(adm(msg)){
            prefix = '/';
            msg.reply(`Prefixo resetado: ${prefix}`);
        }
        else{
            msg.reply("Você não tem permissao 🤺")
        }
    }
    else if (mensagem.startsWith(prefix + "pref ")) {//mudar prefixo 
        
        if(adm(msg)){
            // Remove o comando e o espaço
            const resto = msg.body.replace((prefix + "pref "), '');
            // Pega apenas o primeiro caractere do que sobrou
            if (resto.length === 1) {
                console.log("Novo caractere detectado:", resto);
                prefix = resto;
                msg.reply(`Prefixo alterado: ${prefix}`)
                // Aqui você pode salvar o caractere como seu novo prefixo
            } 
            else if (resto.length === 0) {
                console.log("Erro: Nenhum caractere enviado.");
                msg.reply("❌ Você precisa digitar um caractere após o comando. Ex: !pref #");
            } 
            else {
                console.log("Erro: Enviou mais de um caractere.");
                msg.reply("❌ Erro: O prefixo deve ser apenas um único caractere.");
            }
        }
        else{
            msg.reply("Você não tem permissao 🤺")
        }
    }
    
});





client.initialize();

const fixamsg = async (msg) => {
    try{
        if(msg.hasQuotedMsg){
        const quoted = await msg.getQuotedMessage();
        quoted.pin(600); //604800: 7 dias
        msg.react("✅");
        }else{
            msg.react("❓");
            msg.reply("o que eu deveria fixar?🤔 ");
        }}
    catch(e){
        console.log(e);
    }
}
// const desfixamsg = async (msg) => {
//     try{
//         if(msg.hasQuotedMsg){
//         const quoted = await msg.getQuotedMessage();
//         quoted.unpin().then(success => {
//             if (success) {
//                 console.log('Chat desafixado com sucesso!');
//             } else {
//                 console.log('Falha ao desafixar o chat.');
//             }
//         }).catch(err => {
//             console.error('Erro ao desafixar chat:', err);
//         });
//         }else{
//             msg.react("❓");
//             msg.reply("o que eu deveria desfixar?🤔 ");
//         }}
//     catch(e){
//         console.log(e);
//     }
// }

const fazSticker = async (msg, sender, tipo) => {
    try {
        let media;
        if (msg.hasQuotedMsg) {
            const quoted = await msg.getQuotedMessage();
            if (quoted.hasMedia) media = await quoted.downloadMedia();
        } else if (msg.hasMedia) {
            media = await msg.downloadMedia();
        }

        // Validação de segurança
        if (!media || !media.data) {
            return msg.reply("❌ Erro ao baixar mídia. A imagem pode estar expirada.");
        }

        const buffer = await sharp(Buffer.from(media.data, 'base64'))
            .resize(512, 512, { fit: tipo ? 'fill' : 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 } 
            })
            .webp()
            .toBuffer();

        const sticker = new MessageMedia("image/webp", buffer.toString('base64'), "sticker.webp");
        await client.sendMessage(sender, sticker, { 
            sendMediaAsSticker: true,
            stickerName: "Sua Mae",
            stickerAuthor: "Miller bot"
        });
    } catch (e) {
        console.error("Erro no Download/Sharp:", e);
        msg.reply("❌ Erro ao gerar sticker esticado.");
    }
};

const sendMassaSticker = async (msg, sender) => {
    try {
        const filePath = path.join(__dirname, 'fotos', 'massa.jpeg');
        if (!fs.existsSync(filePath)) {
            return console.log("❌ Erro: O arquivo massa.jpeg não foi encontrado na pasta /fotos.");
        }
        const buffer = await sharp(filePath)
            .resize(512, 512, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            })
            .webp()
            .toBuffer();
        const sticker = new MessageMedia(
            "image/webp", 
            buffer.toString('base64'), 
            "massa.webp"
        );
        await client.sendMessage(sender, sticker, { 
            sendMediaAsSticker: true,
            stickerName: "Sua Mae",
            stickerAuthor: "Miller bot"
        });

    } catch (e) {
        console.error("Erro ao gerar figurinha massa:", e);
    }
};
function menu(){
    return `
╔════════════════════╗
      🐾 *MILLER BOT* 🐾
╚════════════════════╝

╭━━━〔 🛠️ *UTILITÁRIOS* 〕━━━🌀
┃
┃ ⚡ \`${prefix}ping\` - Ver latência do bot
┃ 📊 \`/status\` - CPU, RAM e Uptime
┃ 👍 \`${prefix}like\` - Reação rápida
┃ 📌 \`${prefix}fixar\` - Fixa a mensagem marcada
┃
╰━━━━━━━━━━━━━━━━━━━━🌀

╭━━━〔 🎨 *FIGURINHAS* 〕━━━✨
┃
┃ 🖼️ \`${prefix}s\` - Sticker (Proporção Original)
┃ 📐 \`${prefix}st\` - Sticker (Esticado 1:1)
┃ 📝 _Dica: Use na legenda ou responda_
┃
╰━━━━━━━━━━━━━━━━━━━━✨

╭━━━〔 🐱 *GATINHOS* 〕━━━━🐾
┃
┃ 🎲 \`${prefix}gatinho\` - Envia foto aleatória
┃ 💾 \`${prefix}svgatinho\` - Salva a foto enviada
┃ ✨ _Envie o comando na legenda da foto_
┃
╰━━━━━━━━━━━━━━━━━━━━🐾

╭━━〔 🤺 *COMANDOS DE ADMIN* 〕━━🕶️
┃
┃ ⚙️ \`${prefix}pref <prefixo>\` - Alterar o prefixo
┃ 🔄 \`/pref reset\` - Resetar prefixo
┃
╰━━━━━━━━━━━━━━━━━━━━🕶️
  *Miller Bot v2.0 - 2025*
`;
}
function oprimir(numero){
    if (msg.author.includes(numero)) {msg.reply("clbc safada");msg.react('🍅');}
    if (msg.body.includes(numero)) msg.react('💦');
}