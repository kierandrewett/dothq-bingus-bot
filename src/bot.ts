import { 
    AkairoClient, 
    CommandHandler, 
    InhibitorHandler, 
    ListenerHandler 
} from "discord-akairo";

import { config } from "dotenv";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "node:path";

config();

class BingusBot extends AkairoClient {
    public commandHandler: CommandHandler;
    public inhibitorHandler: InhibitorHandler;
    public listenerHandler: ListenerHandler

    public settings: any;

    constructor() {
        super({
            ownerID: ["217562587938816000", "381541244360327168", "249448403803570176", "277822562116042753"],
            allowedMentions: {
                parse: [],
                users: [],
                roles: [],
                repliedUser: false,
            },
            messageCacheLifetime: 150,
            messageSweepInterval: 60,
            messageCacheMaxSize: 30,
            restSweepInterval: 30,
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

        if(!existsSync(resolve(process.cwd(), "data.json"))) {
            writeFileSync(
                resolve(process.cwd(), "data.json"),
                JSON.stringify({}, null, 2)
            )

            this.settings = {};
        } else {
           try {
                let data = JSON.parse(readFileSync(
                    resolve(process.cwd(), "data.json"), 
                    "utf-8"
                ));

                this.settings = data;
            } catch(e) {
                throw new Error(e);
            }
        }

        console.log("Loaded settings.");

        setInterval(() => {
            try {
                writeFileSync(
                    resolve(process.cwd(), "data.json"),
                    JSON.stringify(this.settings, null, 2)
                )
            } catch(e) {
                throw new Error(e);
            }
        }, 2000);

        this.commandHandler = new CommandHandler(this, {
            directory: resolve(__dirname, "commands"),
            prefix: "-",
            allowMention: true,
            handleEdits: true,
            commandUtil: true
        });

        this.inhibitorHandler = new InhibitorHandler(this, {
            directory: resolve(__dirname, "inhibitors")
        });

        this.listenerHandler = new ListenerHandler(this, {
            directory: resolve(__dirname, "listeners")
        });

        this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
        this.commandHandler.useListenerHandler(this.listenerHandler);

        this.inhibitorHandler.loadAll();
        this.listenerHandler.loadAll();
        this.commandHandler.loadAll();

        process.on("uncaughtException", (e) => {
            console.log(e)
        })
    }
}

export const client = new BingusBot();

client.login(process.env.TOKEN);
