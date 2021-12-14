import { 
    AkairoClient, 
    CommandHandler, 
    InhibitorHandler, 
    ListenerHandler 
} from "discord-akairo";

import discordThreads from "discord-threads";

import { Player, Queue } from "discord-player";

import { config } from "dotenv";
import { resolve } from "path";

import { Settings } from "./settings";
import { exec } from "child_process";

config();

class BingusBot extends AkairoClient {
    public commandHandler: CommandHandler;
    public inhibitorHandler: InhibitorHandler;
    public listenerHandler: ListenerHandler

    public settings: Settings;
    public player: Player;

    public vm: string = "";
    public restartingVm: boolean = false;

    public queues = new Map<any, Queue>();

    public constructor() {
        super({
            ownerID: ["217562587938816000"],
            allowedMentions: {
                parse: [],
                users: [],
                roles: [],
                repliedUser: false,
            },
            partials: ["REACTION", "MESSAGE", "CHANNEL", "GUILD_MEMBER", "USER"],
            intents: [
                'GUILDS',
                'GUILD_MEMBERS',
                'GUILD_BANS',
                'GUILD_EMOJIS_AND_STICKERS',
                'GUILD_INTEGRATIONS',
                'GUILD_WEBHOOKS',
                'GUILD_INVITES',
                'GUILD_VOICE_STATES',
                'GUILD_PRESENCES',
                'GUILD_MESSAGES',
                'GUILD_MESSAGE_REACTIONS',
                'GUILD_MESSAGE_TYPING',
                'DIRECT_MESSAGES',
                'DIRECT_MESSAGE_REACTIONS',
                'DIRECT_MESSAGE_TYPING',
            ]
        });

        this.settings = new Settings();
        this.player = new Player(this);

        this.initVM();

        this.player.on("trackStart", (queue: any, track) => {
            queue.metadata.channel.send(`▶ **Now Playing** ${track.title} by ${track.author}`);
        })

        this.player.on("trackAdd", (queue: any, track) => {
            queue.metadata.channel.send(`⏭ **Up Next** ${track.title} by ${track.author}`);
        })

        this.player.on("botDisconnect", (queue: any) => {
            queue.metadata.channel.send("❌ I was manually disconnected from the voice channel, clearing queue!");
        });
    
        this.player.on("channelEmpty", (queue: any) => {
            queue.metadata.channel.send("❌ Nobody is in the voice channel, leaving...");
        });
    
        this.player.on("queueEnd", (queue: any) => {
            queue.metadata.channel.send("✅ Queue finished!");
        });

        this.commandHandler = new CommandHandler(this, {
            directory: resolve(__dirname, "commands"),
            prefix: "-",
            allowMention: true,
            handleEdits: true,
            commandUtil: true,
            commandUtilSweepInterval: 0,
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

    public async initVM() {
        this.restartingVm = true;

        return new Promise((resolve) => {
            exec(`docker rm -f bingus-vm`, (error, stdout, stderr) => {
                exec(`docker run -d --cap-add NET_ADMIN -m 10MB --name bingus-vm python:3-alpine tail -f /dev/null`, (error, stdout, stderr) => {
                    resolve(true)
                    this.restartingVm = false;
                });
            })
        })
    }
}

export const client = new BingusBot();

client.login(process.env.TOKEN);
