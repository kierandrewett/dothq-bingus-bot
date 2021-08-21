import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { Client } from "asana";

const projectIds = [
    { gid: "1200406259906997", name: "Dot Browser", aliases: ["browser", "desktop"] },
    { gid: "1200406260705689", name: "Dot New Tab Page", aliases: ["ntp", "compass", "new tab", "newtab", "new tab page"] },
    { gid: "1200406260705691", name: "Dot Launch Trailer", aliases: ["latr"] },
    { gid: "1200406260705693", name: "Dot One", aliases: ["id", "dot id", "one", "accounts"] },
    { gid: "1200406260705695", name: "Dot Shield", aliases: ["adblock", "adblocker", "shield"] },
    { gid: "1200406260705697", name: "Website", aliases: ["site"] }
]

export default class TodoCommand extends Command {
    public asana: Client;

    public constructor() {
        super('todo', {
            aliases: ['todo', 't'],
            args: [
                {
                    id: 'msg',
                    type: 'string',
                    match: 'rest'
                },
                {
                    id: 'product',
                    match: "option",
                    type: "string",
                    flag: '--product'
                }
            ]
        });
        
        this.asana = Client.create().useAccessToken(process.env.ASANA_TOKEN || "");
    }

    public async exec(message: Message, args: any) {
        if(!message.member) return;

        if(!message.member.roles.cache.has("662323136343179264")) {
            return message.channel.send("🖕 no permission lmao")
        }

        if(!args.product) return message.channel.send(`❌ \`--product\` flag must be set.`);
        if(!args.msg || args.msg.trim().length == 0) return message.channel.send(`❌ Message must be set.`);

        var projId = "";

        if(args.product) {
            const match = projectIds.find((_) => {
                if(_.name.toLowerCase() == args.product.toLowerCase()) return _;
                else if(_.aliases.includes(args.product.toLowerCase())) return _;
            })

            if(match) projId = match.gid;
            else return message.channel.send(`❌ Could not find project from name or alias.`);
        }

        var embed = new MessageEmbed();
            embed.setTitle(`⌛ Creating an Asana task...`)
            embed.setColor(`${message.guild?.me?.displayHexColor}` as any);

        let d = await message.channel.send({ embeds: [embed] });

        const workspace = await this.asana.workspaces.findAll();

        const workspaceId = workspace.data[0].gid;

        const channelName = (message.channel as any).name;

        this.asana.tasks.create(({
            name: args.msg,
            projects: [projId],
            workspace: workspaceId
        } as any))
            .then(task => {
                this.asana.tasks.addComment(task.gid, {
                    text: `
Author: ${message.author.username}#${message.author.discriminator} (${message.author.id})\n
Channel: #${channelName} (${message.channel.id})
                    `
                }).then(_ => {
                    const url = `https://app.asana.com/0/${projId}/${task.gid}/f`;

                    var embed = new MessageEmbed();
                                    embed.setTitle(`✅ All done.`)
                                    embed.setDescription(`You can [view the Asana task here](${url}).`)
                                    embed.setFooter(`Task ID: ${task.gid}`)
                                    embed.setColor(`${message.guild?.me?.displayHexColor}` as any);
                        
                    d.edit({ embeds: [embed] });
                })
            }).catch(e => {
                console.log(e)
                message.channel.send(`❌ ${e.message}`)
            })

    }
}