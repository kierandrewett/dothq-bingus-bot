import { Argument, Command } from "discord-akairo";
import { Message, MessageEmbed, MessageAttachment } from "discord.js";
import { inspect } from "util";
import puppeteer from "puppeteer";

export default class ScreenshotCommand extends Command {
    public constructor() {
        super('screenshot', {
            aliases: ['screenshot', 'ss'],
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
        if(args.url) {
          if(args.url && (args.url as any).startsWith("http")) args.url = args.url
          else {
            args.url = `https://google.com/search?q=${args.url}`
          }
        }

        try {
          const parsed = new URL(args.url || "");

          if(
            parsed.hostname.includes("saco.ml") ||
            parsed.hostname.includes("glitch.me") ||
            message.content.toLowerCase().includes("sex") ||
            message.content.toLowerCase().includes("porn") ||
            message.content.toLowerCase().includes("hentai")
          ) return message.reply("no");

          const browser = await puppeteer.launch({ args: ['--no-sandbox', '--window-size=854,480'], defaultViewport: null });
          const page = await browser.newPage();

          await page.goto(args.url || "");

         await page.setViewport({ width: 0, height: 0 });

          const buff: any  = await page.screenshot();

          const img = new MessageAttachment(buff, "output.png");
          message.channel.send({ files: [img] })
        } catch(e) {
          message.channel.send(e.message.substr(0, 1999));
        }
    }
}