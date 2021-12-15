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

    }
}