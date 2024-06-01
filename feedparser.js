import { readFileSync, writeFileSync } from 'node:fs';
import Parser from "rss-parser";

let text = `### 📕 Recent Posting ([tistory](https://mag1c.tistory.com))\n`;

const parser = new Parser({
    headers: {
        Accept: 'application/rss+xml, application/xml, text/xml; q=0.1',
    }});

(async () => {
    try {
        const feed = await parser.parseURL('https://mag1c.tistory.com/rss');
        console.log('RSS feed fetched successfully.');

        let cnt = 0;
        for (const feedItem of feed.items) {
            if (cnt > 5) break;
            const {title, link} = feedItem;
            text += `- [${title}](${link})</br>\n`;
            cnt++;
        }

        console.log('Parsed RSS feed items:');
        console.log(text);

        let readmeContent = readFileSync('README.md', 'utf8');
        console.log('Current README.md content fetched.');

        const startMarker = '### 📕 Recent Posting ([tistory](https://mag1c.tistory.com))';
        const endMarker = '\n## ';
        const startIndex = readmeContent.indexOf(startMarker);
        const endIndex = readmeContent.indexOf(endMarker, startIndex + startMarker.length);

        if (startIndex !== -1 && endIndex !== -1) {
            const before = readmeContent.substring(0, startIndex);
            const after = readmeContent.substring(endIndex);
            readmeContent = `${before}${text}${after}`;
        } else if (startIndex !== -1) {
            readmeContent = readmeContent.substring(0, startIndex) + text;
        } else {
            readmeContent += `\n${text}`;
        }

        console.log('Updated README.md content:');
        console.log(readmeContent);

        if (readFileSync('README.md', 'utf8') !== readmeContent) {
            writeFileSync('README.md', readmeContent, 'utf8');
            console.log('README.md has been updated and saved.');
        } else {
            console.log('No changes detected in README.md');
        }
    } catch (error) {
        console.error('Error updating README.md:', error);
    }
})();
