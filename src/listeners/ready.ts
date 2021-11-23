import { Listener } from "discord-akairo";
import { client } from "../bot";

export default class ReadyListener extends Listener {
    constructor() {
        super('ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec(event: any) {
        console.log(`Loaded ${this.client.user?.tag}`);

        let activity = "";

        let users = 0;

        this.client.guilds.cache.forEach(g => users += g.memberCount);

        let x = 0;

        let messages: any = [
            () => ({
                name: `-help • ${users} users`,
                type: "WATCHING"
            }),
            () => {
                if(client.player.queues && client.player.queues.first()) {
                    const queue: any = client.player.queues.first();

                    return {
                        name: `${queue.current.title} - ${queue.current.author}`,
                        type: "LISTENING"
                    }
                } else {
                    return {
                        name: `Nothing playing`,
                        type: "LISTENING"
                    }
                }
            },
        ]

        setInterval(() => {
            if(x >= messages.length) x = 0;

            this.client.user?.setPresence({ status: 'online', activities: [messages[x]()] });

            x++;
        }, 10000);

        (this.client as any).settings = client.settings;
    }
}