import { Command } from "discord-akairo";
import { MessageActionRow, MessageAttachment, MessageButton, MessageEmbed } from "discord.js";
import { Message } from "discord.js";
import { resolve } from "path";
import puppeteer, { Page, ScreenshotOptions } from "puppeteer";
import { client } from "../bot";

const START_PAGE = "https://duckduckgo.com";

class Browser {
    public page: Page | undefined;
    public tab: puppeteer.Browser | undefined;
    public message: Message;
    public args: {
        url?: string
    }

    public _x: number = 0;
    public _y: number = 0;

    public get x() { return this._x };
    public get y() { return this._y };

    public set x(newValue: number) {
        this._x = newValue;
    }

    public set y(newValue: number) {
        this._y = newValue;
    }

    public fullscreen: boolean = false;

    public lastBuffer: Buffer | undefined;

    constructor(message: Message, args?: any) {
        this.init();

        this.message = message;
        this.args = args;
    }

    public checkPermissionRequirements(message: Message) {
        return message.author.id == this.message.author.id;
    }

    public async goto(url: string) {
        return await this.page?.goto(url, { waitUntil: "networkidle0" });
    }

    public async reload() {
        return await this.page?.reload({ waitUntil: "networkidle0" });
    }

    public async awaitReady() {
        return new Promise((resolve) => {
            this.page?.on("domcontentloaded", () => {
                setTimeout(() => {
                    const parsed = new URL(this.page?.url() || "");

                    console.log("request done", parsed.href)

                    if(parsed.hostname == "www.youtube.com") {
                        this.page?.focus("body");

                        for (let index = 0; index < 7; index++) {
                            this.page?.keyboard.press("Tab");
                        }

                        this.page?.keyboard.press("Enter");
                        this.page?.keyboard.press("Space");
                    }

                    resolve(true)
                }, 1500);
            });
        })
    }

    public async doTick(message: Message, screenshotOptions?: ScreenshotOptions) {
        this.fullscreen = !!screenshotOptions?.fullPage;

        const buffer: any = await this.page?.screenshot(screenshotOptions || {});

        if(buffer !== this.lastBuffer) {
            this.lastBuffer = buffer;

            const img = new MessageAttachment(buffer, "output.png");
            message.removeAttachments();

            const parsed = new URL(this.page?.url() || "");
            
            let title: any = "Untitled";

            try {
                title = await this.page?.title();
            } catch(e) {}

            const truncatedTitle = title.length >= 200
                ? title.substr(0, 200) + "..."
                : title;

            const hostname = parsed
                ? parsed.hostname.length
                    ? parsed.hostname
                    : parsed.href.replace(/http(s)?(:)?(\/\/)?|(\/\/)?/, "")
                : "about:blank"

            const embed = new MessageEmbed()
                .setColor("#2f3136")
                .setFooter(
                    `${truncatedTitle} • ${hostname}${parsed.pathname}${parsed.search}`, 
                    parsed.hostname.length 
                        ? `https://favicons.githubusercontent.com/${parsed.hostname}`
                        : `https://cdn.discordapp.com/emojis/878353997130506332.png?v=1`
                )

            message.edit({ 
                content: "__\n__",
                embeds: [embed], 
                files: [img], 
                components: [...this.constructRow()] 
            });
        }
    }

    public async scroll({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) {
        let res: any;

        switch(direction) {
            case "up":
                res = await this.page?.evaluate(() => {
                    window.scrollBy(0, -100);
                    return Promise.resolve(window.scrollY);
                });

                this.y = res;
                break;
            case "down":
                res = await this.page?.evaluate(() => {
                    window.scrollBy(0, 100);
                    return Promise.resolve(window.scrollY);
                });

                this.y = res;
                break;
        }
    }

    public async scrollTop() {
        await this.page?.evaluate(() => {
            window.scrollTo({ left: 0, top: 0 })
        });

        this.y = 0;
        this.x = 0;
    }

    public async init() {
        const browser = await puppeteer.launch({ 
            defaultViewport: null,
            args: [
                '--no-sandbox', 
                '--window-size=1280x720'
            ]
        });

        this.page = await browser.newPage();
        this.tab = browser;

        this.goto(this.args.url ? this.args.url : START_PAGE);

        await this.page.setViewport({ width: 0, height: 0 });
    }
    
    public constructRow() {
        return [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`Browser:ScrollUp-${this.message.id}`)
                    .setLabel("Up")
                    .setEmoji("⬆")
                    .setDisabled(this.y == 0)
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId(`Browser:ScrollDown-${this.message.id}`)
                    .setLabel("Down")
                    .setEmoji('⬇')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId(`Browser:Reload-${this.message.id}`)
                    .setLabel("Reload")
                    .setEmoji('🔄')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId(`Browser:Home-${this.message.id}`)
                    .setLabel("Home")
                    .setEmoji('🏠')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId(`Browser:InitGoto-${this.message.id}`)
                    .setLabel(`Go to`)
                    .setEmoji('🔗')
                    .setStyle('SECONDARY')
            ),
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId(`Browser:Fullscreen-${this.message.id}`)
                    .setLabel(this.fullscreen ? `Restore` : `Maximise`)
                    .setEmoji('📜')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId(`Browser:ForceRender-${this.message.id}`)
                    .setLabel(`Force Render`)
                    .setEmoji('🖌')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setCustomId(`Browser:Close-${this.message.id}`)
                    .setLabel(`Close Tab`)
                    .setEmoji('❌')
                    .setStyle('SECONDARY')
            )
        ];
    }
}

export default class BrowserCommand extends Command {
    public constructor() {
        super('browser', {
            aliases: ['browser'],
            args: [
                {
                    id: 'url',
                    type: 'string',
                    match: 'rest'
                }
            ]
        });
    }

    public async exec(message: Message, args: { url?: string }) {
        const browser = new Browser(message, args);

        let msg = await message.reply({ content: "Starting browser..." });

        await browser.awaitReady();
        await msg.edit({ content: "Ready." });

        browser.doTick(msg);
        
        const filter = (btn: any) => btn.user.id == message.author.id;

        const collector = message.channel.createMessageComponentCollector({ 
            filter, 
            max: 99999,
            time: 1500000
        });

        collector.on('collect', async i => {
            i.deferred = true;

            if(
                !i.customId.startsWith("Browser:Scroll") ||
                !i.customId.startsWith("Browser:Close") ||
                !i.customId.startsWith("Browser:ForceRender")
            ) {
                msg.removeAttachments();
                const embed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setFooter(`Loading...`, `https://cdn.discordapp.com/emojis/878349151627264010.gif`)
                msg.edit({ content: "__\n__", embeds: [embed], components: [] });
            }

            switch(i.customId) {
                case `Browser:ScrollDown-${message.id}`:
                    browser.scroll({ direction: "down" });
                    browser.doTick(msg);
                    break;
                case `Browser:ScrollUp-${message.id}`:
                    browser.scroll({ direction: "up" });
                    browser.doTick(msg);
                    break;
                case `Browser:Reload-${message.id}`:  
                    browser.reload().then(async _ => {
                        await browser.scrollTop();
                        browser.doTick(msg);
                    });

                    break;
                case `Browser:Home-${message.id}`:
                    await browser.goto(START_PAGE);
                    browser.doTick(msg);
                    break;
                case `Browser:InitGoto-${message.id}`:
                    msg.removeAttachments();
                    const gotoInit = await msg.edit({ content: `📎 **${message.author.tag}**, enter a URL or search terms or type \`cancel\` to go back to your page.`, embeds: [], components: [], files: [] });

                    const filter = (m: Message) => {
                        return m.author.id == message.author.id;
                    }
                    const gotoCollect = gotoInit.channel.createMessageCollector({ filter, max: 1, time: 1500000 });

                    gotoCollect.on('collect', async gotoMessage => {
                        let url: string;

                        if(gotoMessage.content == "cancel") return browser.doTick(msg);

                        if(gotoMessage.content.startsWith("http")) {
                            try {
                                url = new URL(gotoMessage.content).href;

                                const embed = new MessageEmbed()
                                    .setColor("#2f3136")
                                    .setFooter(`Loading...`, `https://cdn.discordapp.com/emojis/878349151627264010.gif`)
            
                                msg.edit({ content: "__\n__", embeds: [embed] });

                                browser.goto(url);
                                gotoMessage.delete();
                                await browser.awaitReady();
                                browser.doTick(msg);
                            } catch(e) {
                                msg.edit({ content: `❌ Failed to parse as valid URL.` });

                                setTimeout(() => {
                                    browser.doTick(msg);
                                }, 2000);
                            }
                        } else {
                            url = `https://startpage.com/search?q=${gotoMessage.content}`

                            const embed = new MessageEmbed()
                                .setColor("#2f3136")
                                .setFooter(`Loading...`, `https://cdn.discordapp.com/emojis/878349151627264010.gif`)
        
                            msg.edit({ content: "__\n__", embeds: [embed] });

                            browser.goto(url);
                            gotoMessage.delete();
                            await browser.awaitReady();
                            browser.doTick(msg);
                        }
                    });

                    break;
                case `Browser:Fullscreen-${message.id}`:
                    const fullPage = !browser.fullscreen;

                    browser.doTick(msg, { fullPage });
                    break;
                case `Browser:ForceRender-${message.id}`:
                    browser.doTick(msg);
                    break;
                case `Browser:Close-${message.id}`:
                    msg.delete();
                    message.react("✅");
                    browser.tab?.close();
                    break;
            }
        });
    }
}