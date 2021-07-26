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
        const owners = Array.from(this.client.ownerID);

        console.log(`Loaded ${this.client.user?.tag}`);

        let activity = "";

        let users = 0;

        this.client.guilds.cache.forEach(g => users += g.memberCount);

        setInterval(() => {
            if(activity !== `-help • ${users} users`) {
                activity = `-help • ${users} users`;

                this.client.user?.setPresence({ status: 'online', activities: [{
                    name: activity,
                    type: "WATCHING"
                }] });
            }
        }, 1000);

        (this.client as any).settings = client.settings;
    }
}