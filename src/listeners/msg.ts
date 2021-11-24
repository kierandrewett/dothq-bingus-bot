import { Listener } from "discord-akairo";
import { Collection, Message, MessageEmbed, Snowflake, ThreadChannel } from "discord.js";
import { client } from "../bot";
import { responses } from "../shared/responses";

export default class MessageListener extends Listener {
    constructor() {
        super('messageCreate', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

    public async exec(message: Message) {
        const channel = client.channels.cache.get("564914480090185728");
        const threads = (channel as any).threads.cache as Collection<Snowflake, ThreadChannel>;

        console.log(channel)

        threads.forEach(t => {
            console.log(t.name)

            if(t.archived) {
                console.log("Unarchived", t.name, t.id);
                t.setArchived(false, "Auto unarchive");
            }
        })
    }
}