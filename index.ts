import express from "express";
import { config } from "dotenv";
import Discord, { Collection, Snowflake, Webhook } from "discord.js";
import discordThreads from "discord-threads";
import axios from "axios";

config();

const app = express();

app.use(express.json());

const client = new Discord.Client({
    partials: ["REACTION", "MESSAGE", "CHANNEL", "GUILD_MEMBER", "USER"],
    intents: [
        "GUILDS", 
        "GUILD_MEMBERS", 
        "GUILD_VOICE_STATES", 
        "GUILD_BANS", 
        "GUILD_INVITES", 
        "GUILD_MESSAGES", 
        "GUILD_MESSAGE_REACTIONS", 
        "GUILD_WEBHOOKS", 
        "DIRECT_MESSAGES", 
        "GUILD_VOICE_STATES"
    ]
});

discordThreads(client);

app.post("/hook", async (req, res) => {
    if(req.query.token && req.query.token == process.env.HOOK_TOKEN) {
        const guildId = req.query.guild_id as any;
        const channelId = req.query.channel_id as any;
        const guild = client.guilds.cache.get(guildId);
        const channel = await guild?.channels.cache.get(channelId);

        if(guild && channel) {
            let thread = (channel as any).threads.cache.find((x: any) => x.name == req.body.repository.name);

            if(!thread) {
                thread = await (channel as any).threads.create({
                    name: req.body.repository.name,
                    autoArchiveDuration: 60,
                    reason: req.body.repository.description,
                })
            }

            guild.members.cache.each(async member => {
                await thread.members.add(member.id);
            })

            const webhooks = await (channel as any).fetchWebhooks() as Collection<Snowflake, Webhook>;
            let webhook = webhooks.find(w => w.name.toLowerCase() == "github");

            if(!webhook) {
                webhook = await (channel as any).createWebhook("github");
            }

            const url = webhook?.url;

            const headers = req.headers;

            delete headers.host;
            delete headers.origin;

            axios.post(`${url}/github?thread_id=${thread.id}`, req.body, { headers })
                .then(r => res.end("OK"))
                .catch(e => console.log(e))
        }
    } else {
        res.end("🖕")
    }
})

app.listen(process.env.PORT || 3000, () => {
    client.login(process.env.TOKEN)
    console.log(`http://localhost:${process.env.PORT || 3000}`)
});