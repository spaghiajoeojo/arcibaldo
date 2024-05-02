import puppeteer from 'puppeteer';
import { Tool } from './Tool';

export class WebSearchTool implements Tool {
  name = 'web-search';

  desc = 'un strumento che consente di cercare su internet';

  input = '<inserisci termine da cercare>';

  async use(input: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = (await browser.pages())[0];
    await page.goto(`https://www.google.com/search?q=${input}`);
    const extractedText = (await page.$eval('*', (el) => el.innerText));
    await browser.close();
    return extractedText.slice(extractedText.indexOf('\nSponsorizzato\n') + 15).trim();
  }
}
