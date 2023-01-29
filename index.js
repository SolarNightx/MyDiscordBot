const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js")
const Discord = require("discord.js")
const client = new Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent
  ]
})
const config = require("./src/config.js");
const { readdirSync } = require("fs")
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')
const { Player } = require("discord-player")
const db = require("croxydb")
const languagefile = require("./src/language.json")
const player = new Player(client);
client.player = player;
client.distube = new DisTube(client, {
  leaveOnStop: false,
  leaveOnFinish: true,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
})
let token = config.token

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const commands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
})
client.distube.on("finish", queue => {
  client.guilds.cache.filter(guild => {
const data = db.fetch(`music_${guild.id}`)
if (!data) return;
const mesaj = data.mesaj
const channels = data.kanal
const channel = guild.channels.cache.get(channels)
const messagef = channel.messages.fetch(mesaj).then(async messagef => {
messagef.edit({content: "🎵 | Music ended.", embeds: [], components: []}).catch(err => {})
})
})
})

client.on("ready", async () => {
  client.guilds.cache.filter(guild => {
const data = db.fetch(`music_${guild.id}`)
if (!data) return;
db.delete(`music_${guild.id}`)
})
})
client.on("ready", async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    console.log(`Bot logged in as ${client.user.tag}!`);
})
readdirSync('./src/events').forEach(async file => {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})

client.on("interactionCreate", interaction => {
  if (interaction.customId === "fast") {
    const queue = client.distube.getQueue(interaction);
       if (!queue) return interaction.reply(`There is no song on the list yet.`)
    let data = db.fetch(`music_${interaction.guild.id}`)
    if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    queue.filters.add("nightcore")
interaction.reply({content: "Speed online!", ephemeral: true})
  }
  if (interaction.customId === "slowmode") {
    const queue = client.distube.getQueue(interaction);
       if (!queue) return interaction.reply(`There is no song on the list yet.`)
    let data = db.fetch(`music_${interaction.guild.id}`)
    if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    queue.filters.add("vaporwave")
interaction.reply({content: "Slowmode online!", ephemeral: true})
  }
  if (interaction.customId === "bassboost") {
    const queue = client.distube.getQueue(interaction);
       if (!queue) return interaction.reply(`There is no song on the list yet.`)
    let data = db.fetch(`music_${interaction.guild.id}`)
    if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    queue.filters.add("bassboost")
interaction.reply({content: "Bassboost online!", ephemeral: true})
  }
  if (interaction.customId === "soru") {
    const queue = client.distube.getQueue(interaction);
       if (!queue) return interaction.reply(`There is no song on the list yet.`)
    let data = db.fetch(`music_${interaction.guild.id}`)
    if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    const part = Math.floor((queue.currentTime / queue.songs[0].duration) * 20);
    const embed = new Discord.EmbedBuilder()
        .setColor('Purple')
        .setDescription(`**[${queue.songs[0].name}](${queue.songs[0].url})**`)
        .setImage(`${queue.songs[0].thumbnail}`)
        .addFields({ name: 'Music Author:', value: `[${queue.songs[0].uploader.name}](${queue.songs[0].uploader.url})`, inline: true })
        .addFields({ name: 'Member:', value: `${queue.songs[0].user}`, inline: true })
        .addFields({ name: 'Voice:', value: `${queue.volume}%`, inline: true })
        .addFields({ name: 'Views:', value: `${queue.songs[0].views}`, inline: true })
        .addFields({ name: 'Like:', value: `${queue.songs[0].likes}`, inline: true })
        .addFields({ name: 'Filtre:', value: `${queue.filters.names.join(', ') || "Normal"}`, inline: true })
        .addFields({ name: `Video Time: **[${queue.formattedCurrentTime} / ${queue.songs[0].formattedDuration}]**`, value: ` ${'<:circle:1033057941647016056>'.repeat(part) + '🎵' + '<:asd:1033046466438107158>'.repeat(20 - part)}`, inline: false })
return interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {})
  }
if (interaction.customId === "dur") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.guild.id}`)
  if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
  let usır = data.user
  let string = data.string
  if (interaction.user.id !== usır) return interaction.reply({content: "Only the person who wrote the command can use this button.", ephemeral: true})
const baslik = data.başlık
const author = data.yükleyen
const sure = data.süre
const izlenme = data.görüntülenme
const thumb = data.thumb
const url = data.video
const embed = new Discord.EmbedBuilder()
.addFields({name: "Title", value: `${baslik}`, inline: true})
.addFields({name: "Author", value: `${author}`, inline: true})
.addFields({name: "Time", value: `${sure}`, inline: true})
.addFields({name: "Views", value: `${izlenme}`, inline: true})
.addFields({name: "Thumbnail", value: "[Click]("+thumb+")", inline: true})
.addFields({name: "Video", value: "[Click]("+url+")", inline: true})
.setColor("Aqua")
.setImage(`${thumb}`)
const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setEmoji("🎵")
.setStyle(Discord.ButtonStyle.Danger)
.setCustomId("devam")
)
client.distube.pause(interaction)
return interaction.update({embeds: [embed], components: [row]})
}
if (interaction.customId === "skip") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.guild.id}`)
  if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
    if (queue.songs.length === 1) return interaction.reply("No song found in the queue!")
  let usır = data.user
  let string = data.string
  if (interaction.user.id !== usır) return interaction.reply({content: "Only the person who wrote the command can use this button.", ephemeral: true})
const baslik = data.başlık
const author = data.yükleyen
const sure = data.süre
const izlenme = data.görüntülenme
const thumb = data.thumb
const url = data.video
const embed = new Discord.EmbedBuilder()
.addFields({name: "Title", value: `${baslik}`, inline: true})
.addFields({name: "Author", value: `${author}`, inline: true})
.addFields({name: "Time", value: `${sure}`, inline: true})
.addFields({name: "Views", value: `${izlenme}`, inline: true})
.addFields({name: "Thumbnail", value: "[Click]("+thumb+")", inline: true})
.addFields({name: "Video", value: "[Click]("+url+")", inline: true})
.setColor("Aqua")
.setImage(`${thumb}`)

client.distube.skip(interaction)
return interaction.update({embeds: [embed]})
}
if (interaction.customId === "loop") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.guild.id}`)
  if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
  let usır = data.user
  let string = data.string
  if (interaction.user.id !== usır) return interaction.reply({content: "Only the person who wrote the command can use this button.", ephemeral: true})
const baslik = data.başlık
const author = data.yükleyen
const sure = data.süre
const izlenme = data.görüntülenme
const thumb = data.thumb
const url = data.video
const embed = new Discord.EmbedBuilder()
.addFields({name: "Title", value: `${baslik}`, inline: true})
.addFields({name: "Author", value: `${author}`, inline: true})
.addFields({name: "Time", value: `${sure}`, inline: true})
.addFields({name: "Views", value: `${izlenme}`, inline: true})
.addFields({name: "Thumbnail", value: "[Click]("+thumb+")", inline: true})
.addFields({name: "Video", value: "[Click]("+url+")", inline: true})
.setColor("Aqua")
.setImage(`${thumb || "https://cdn.discordapp.com/attachments/997487955860009038/1009062859889705062/Baslksz-1.png"}`)
client.distube.setRepeatMode(interaction, 1);
return interaction.update({embeds: [embed]})
}
if (interaction.customId === "devam") {
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
  let data = db.fetch(`music_${interaction.guild.id}`)
  if (!data) return interaction.reply({content: "I'm sorry.Error **404**", ephemeral: true})
  let usır = data.user
  let string = data.string
  if (interaction.user.id !== usır) return interaction.reply({content: "Only the person who wrote the command can use this button.", ephemeral: true})
  const baslik = data.başlık
  const author = data.yükleyen
  const sure = data.süre
  const izlenme = data.görüntülenme
  const thumb = data.thumb
  const url = data.video
  const embed = new Discord.EmbedBuilder()
  .addFields({name: "Title", value: `${baslik}`, inline: true})
  .addFields({name: "Author", value: `${author}`, inline: true})
  .addFields({name: "Time", value: `${sure}`, inline: true})
  .addFields({name: "Views", value: `${izlenme}`, inline: true})
  .addFields({name: "Thumbnail", value: "[Click]("+thumb+")", inline: true})
  .addFields({name: "Video", value: "[Click]("+url+")", inline: true})
  .setColor("Aqua")
  .setImage(`${thumb}`)
 const row = new Discord.ActionRowBuilder()
.addComponents(
new Discord.ButtonBuilder()
.setEmoji("🎵")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("dur"),
new Discord.ButtonBuilder()
.setEmoji("🔊")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("volume"),
new Discord.ButtonBuilder()
.setEmoji("⏩")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("skip"),
new Discord.ButtonBuilder()
.setEmoji("🌀")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("loop"),
new Discord.ButtonBuilder()
.setEmoji("❓")
.setStyle(Discord.ButtonStyle.Secondary)
.setCustomId("soru")

)
const row2 = new Discord.ActionRowBuilder()
.addComponents(
  new Discord.ButtonBuilder()
  .setEmoji("🥁")
  .setStyle(Discord.ButtonStyle.Secondary)
  .setCustomId("bassboost"),
  new Discord.ButtonBuilder()
  .setEmoji("<:slowmode:740952943460614185>")
  .setStyle(Discord.ButtonStyle.Secondary)
  .setCustomId("slowmode"),
  new Discord.ButtonBuilder()
  .setEmoji("💨")
  .setStyle(Discord.ButtonStyle.Secondary)
  .setCustomId("fast"),
  new Discord.ButtonBuilder()
  .setLabel("Support Server")
  .setStyle(Discord.ButtonStyle.Link)
  .setURL("https://discord.gg/altyapilar")
)
  client.distube.resume(interaction)
  interaction.update({embeds: [embed], components: [row, row2]})
}
})

const modal = new Discord.ModalBuilder()
.setCustomId('form')
.setTitle('CrinkeyCrongmas!')
  const a1 = new Discord.TextInputBuilder()
  .setCustomId('setvolume')
  .setLabel('Volume')
  .setStyle(Discord.TextInputStyle.Paragraph)
  .setMinLength(1)
  .setPlaceholder('1 - 100')
  .setRequired(true)

    const row = new Discord.ActionRowBuilder().addComponents(a1);

    modal.addComponents(row);


client.on('interactionCreate', async (interaction) => {

	if(interaction.customId === "volume"){
    await interaction.showModal(modal);
	}
})
client.on('interactionCreate', async interaction => {
    if (interaction.type !== Discord.InteractionType.ModalSubmit) return;
    if (interaction.customId === 'form') {
  const string = interaction.fields.getTextInputValue('setvolume')
  const volume = parseInt(string)
  const queue = client.distube.getQueue(interaction);
     if (!queue) return interaction.reply(`There is no song on the list yet.`)
     if (isNaN(volume)) return interaction.reply("Give me number!")
     if (volume < 1) return interaction.reply("The number must not be less than 1.")
     if (volume > 100) return interaction.reply("The number should not be greater than 100.")
     client.distube.setVolume(interaction, volume);
     interaction.reply("Successfully set the volume of the music to **"+volume+"**")
}
})
client.login(token)































/*

async function createSlash(name, description) {
  await getApp(guildId).commands.post({
    data: {
      name: name,
      description: description
    }
  });
  return;
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on('ready' , async () => {
  
  const commands = await getApp(guildId).commands.get();
  //console.log(commands);

  createSlash('ping', 'Replies pong.');
  createSlash('skip', 'Skips the currently playing song.');
  createSlash('stop', 'Stops the currently playing song.');
  createSlash('fart', 'Farts.');
  createSlash('bruh', 'Bruh.');
  createSlash('bababooey', 'Bababooey.');
  createSlash('amogus', 'Amogus.');
  createSlash('knock', 'Knock knock.');
  createSlash('imposter', 'When imposter is sus.');
  createSlash('canada', 'OH CANADA');
  await getApp(guildId).commands.post({
    data: {
      name: 'play',
      description: 'Plays music.',
      options: [
        {
          name: 'song',
          description: 'Link to song.',
          required: true,
          type: 3 // 3 = string, 4 = integer
        },
        {
          name: 'channel',
          description: 'Voice channel to play in.',
          required: false,
          type: 3 // 3 = string, 4 = integer
        }
      ]
    }
  });
  await getApp(guildId).commands.post({
    data: {
      name: 'spam',
      description: 'Spams a message.',
      options: [
        {
          name: 'message',
          description: 'Message to spam.',
          required: true,
          type: 3 // 3 = string, 4 = integer
        },
        {
          name: 'number',
          description: 'Number of times to spam.',
          required: true,
          type: 4 // 3 = string, 4 = integer
        }
      ]
    }
  });
  await getApp(guildId).commands.post({
    data: {
      name: 'clearspam',
      description: 'Clears spam.',
      options: [
        {
          name: 'repeats',
          description: 'Number of times a message needs to be repeated for it to be cleared.',
          required: true,
          type: 4 // 3 = string, 4 = integer
        },
        {
          name: 'amount',
          description: 'How far back to check for spam. Max: 100',
          required: true,
          type: 4 // 3 = string, 4 = integer
        }
      ]
    }
  });

  client.ws.on('INTERACTION_CREATE', async (interaction) => {
    const { name, options } = interaction.data;
    const command = name.toLowerCase();
    const args = {};
    const serverQueue = queue.get(guildId);

    //console.log(interaction);
    //console.log("----------------------------------------- Pause -----------------------------------------");
    //console.log(interaction.data);

    if (options) {
      for (const option of options) {
        const { name, value } = option;
        args[name] = value;
      }
    }

    console.log(command);
    if (command === 'ping') {
      respond('pong', interaction);
    } else if (command === `play`) {
      executeSlash(args, serverQueue, interaction);
      return;
    } else if (command === `skip`) {
      skipSlash(serverQueue, interaction);
      return;
    } else if (command === `stop`) {
      stopSlash(serverQueue, interaction);
      return;
    } else if (command === `spam`) {
      respond("Spamming!", interaction);
      spamSlash(args, interaction);
      return;
    } else if (command === `clearspam`) {
      clearspamSlash(args, interaction);
      return;
    } else if (command === `fart`) {
      sound('fart.mp3', interaction);
      return;
    } else if (command === `bruh`) {
      sound('bruh.mp3', interaction);
      return;
    } else if (command === `bababooey`) {
      sound('bababooey.mp3', interaction);
      return;
    } else if (command === `amogus`) {
      sound('amogus.mp3', interaction);
      return;
    } else if (command === `knock`) {
      sound('knockingSound.mp3', interaction);
      return;
    } else if (command === `imposter`) {
      sound('whenImposterIsSus.mp3', interaction);
      return;
    } else if (command === `canada`) {
      sound('Canada.mp3', interaction);
      return;
    }
  })

});

client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

client.once("disconnect", () => {
  console.log("Disconnect!");
});


async function spamSlash(args, interaction) {

  await sleep(10);
  channel = getChannel(interaction.channel_id);
  for (let i = 0; i < args['number']; i++) {
    channel.send(args['message']);
    await sleep(20);
  }

}

async function clearspamSlash(args, interaction) {
  channel = getChannel(interaction.channel_id);
  let same = 0;

  if (args['repeats'] <= 1) 
    return respond(
      "Number must be larger than one!", interaction
    );
  if (args['amount'] <= 1) 
    return respond(
      "Number must be larger than one!", interaction
    );
  if (args['amount'] > 100) 
    return respond(
      "Number must be less than 100!", interaction
    );
    respond('Clearing!', interaction);

  channel.messages.fetch({ limit: args['amount'] }).then((messages) => {
    let arr = messages.array()
    //console.log(arr);
    //console.log(arr[0].toString());
    // ...
    for (let i = 1; i < args['amount']; i++) {
      //console.log(arr[i].toString());
      if (arr[i].toString() == arr[i-1].toString()) {
        same++;
      } else {
        if (same >= args['repeats']) {
          for (let j=1; j < same+1; j++){
            arr[i-j].delete();
          }
        }
        same = 1;
      }
    }
  });

  return;
}

client.on("message", async message => {
  // Logs the user ID and message to the console
  console.log(String(message.author.tag)+ ": " + String(message.content));
  //console.log(message);

  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const serverQueue = queue.get(message.guild.id);

  console.log("Message Read");

  if (message.content.startsWith(`${prefix}play`)) {
    execute(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}skip`)) {
    skip(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}stop`)) {
    stop(message, serverQueue);
    return;
  } else if (message.content.startsWith(`${prefix}spam`)) {
    console.log("Spamming!");
    spam(message);
    return;
  } else if (message.content.startsWith(`${prefix}clearspam`)) {
    console.log("Clearing!");
    clearspam(message);
    return;
  } else {
    message.channel.send("You need to enter a valid command!");
  }
});

async function sound(filename, interaction) {
  const guild = client.guilds.cache.get(interaction.guild_id)
  const member = guild.members.cache.get(interaction.member.user.id);
  const voiceChannel = member.voice.channel;

  if (!voiceChannel)
    return respond(
      "You need to be in a voice channel!", interaction
    );
  const permissions = voiceChannel.permissionsFor(client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return respond(
      "I need the permissions to join and speak in your voice channel!", interaction
    );
  }

  respond("Done", interaction);

  try {
    var connection = await voiceChannel.join();
  } catch (err) {
    console.log(err);
    return;
  }

  const dispatcher = connection
    .play('./' + filename)
    .on("finish", () => {
      voiceChannel.leave();
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(1);
  
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

*/

