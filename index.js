const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client;
const readline = require('readline');
const db = require('quick.db')
bot.commands = new Discord.Collection();

//nie tykac
fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if(jsfile.length <= 0){
    console.log("Nie znaleziono komendy.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} załadowany!`);
    bot.commands.set(props.help.name, props);
  });

});
// aktywnosc bota
bot.on("ready", async () => {
  console.log(`${bot.user.username} jest dostępny na ${bot.guilds.size} serwerach!`);
  bot.user.setActivity("Tutaj zmien sobie aktywnosc co ma pisac na bocie", {type: "WATCHING"});

});
// nie tykac
bot.on('message', async message => {

  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});
// wiadmość kiedy ktoś w zadniu będzie miał ip albo wyspa, przyda sie to do startujących serwerów gdzie każdy sie o to pyta
  bot.on("message", (message) => {
    if (message.content.includes("ip")) {
      message.channel.send("```Ip naszego serwera roleplay: ...................```");
    }
  });

  bot.on("message", (message) => {
    if (message.content.includes("wyspa")) {
      message.channel.send("```Planowany start wyspy przewiduje się na .............```");
    }
  });

  

  //autorole member i wiadomość

bot.on('guildMemberAdd', member => {
  let logChannel = member.guild.channels.find('name', '│przybycia│'); //zamiast │przybycia│ daj nazwe swojego kanalu przywitania
  
    let logEmbed = new Discord.RichEmbed()
    .setAuthor("Gasmon | Nowi") // mozna zmienic
    .setDescription(member.user.username + " ``dołączył na serwer.`` (" + member.user.id + ")")
    .setColor('RANDOM')
    .setFooter("Użytkownik dołączył", member.user.displayAvatarURL)
    .setTimestamp()
    logChannel.send(logEmbed);
  

  var role = member.guild.roles.find('name', 'Obywatel'); //zamiast Obywatel daj range ktora ma otrzymac osoba po dołączeniu
  member.addRole(role);
    
});

//////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


bot.login(botconfig.token);
