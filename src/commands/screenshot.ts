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
                },
                 {
                    id: 'whole',
                    match: 'flag',
                    flag: '--whole'
                },
                 {
                    id: 'engine',
                    match: 'option',
                    flag: 'engine:',
                    default: 'google'
                }
            ]
        });
    }

    public async exec(message: Message, args: { url?: string, whole?: boolean, engine?: string }) {
        if(args.url) {
          if(args.url && (args.url as any).startsWith("http")) args.url = args.url
          else {
            let url = ""

            switch(args.engine || "google") {
              case "google":
                url = "https://google.com/search?q=";
                break;
              case "ddg":
              case "duckduckgo":
                url = "https://duckduckgo.com/?q=";
                break;
              case "bing":
                url = "https://bing.com/search?q=";
                break;
              case "ecosia":
                url = "https://ecosia.com/search?q=";
                break;
              case "sp":
              case "startpage":
                url = "https://startpage.com/search?q=";
                break;
              default:
                url = "https://google.com/search?q=";
                break;
            } 
            args.url = `${url}${args.url}`
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

          await page.setUserAgent(
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0"
          );

          await page.goto(args.url || "");

         await page.setViewport({ width: 0, height: 0 });

          const buff: any  = await page.screenshot({ fullPage: !!args.whole });

          const img = new MessageAttachment(buff, "output.png");
          message.channel.send(img)
        } catch(e) {
          message.channel.send(e.message.substr(0, 1999));
        }
    }
}