import { Listener } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { client } from "../bot";
import { responses } from "../shared/responses";

export default class MessageListener extends Listener {
    constructor() {
        super('messageCreate', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

    exec(message: Message) {
    }
}