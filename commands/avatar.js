// comando avatar , muestra los datos del usuario
const{EmbedBuilder} = require('discord.js')

module.exports = {
    description: 'Repite los argumentos dados',
    run: async (message) => {
        const target = message.mentions.users.first() || message.author ;
        const member = await message.guild.members.fetch(target.id);

        if(!member) return message.reply("Introduce un usuario válido.")

        const avatar = member.user.displayAvatarURL({size: 512})

        const embed = new EmbedBuilder()
            .setColor('Blurple')
            .setTitle(`<3 Avatar de @${member.user.displayName}`)
            .setImage(avatar)

        message.reply({embeds:[embed]})
    }
}