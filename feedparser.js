import { readFileSync, writeFileSync } from 'node:fs';
import Parser from "rss-parser";

let text = `## 📕 Recent Posting\n`;

const parser = new Parser({
    headers: {
        Accept: 'application/rss+xml, application/xml, text/xml; q=0.1',
    }});

(async () => {

    const feed = await parser.parseURL('https://mag1c.tistory.com/rss');
    for (const feedItem of feed.items) {
        const {title, link} = feedItem;
        text += `- [${title}](${link})</br>\n`;
    }

    let readmeContent = readFileSync('README.md', 'utf8');

    const startMarker = '## 📕 Recent Posting';
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

    writeFileSync('README.md', readmeContent, 'utf8', (e) => {
        if (e) {
            console.log(e);
        }
    });

    console.log(text);
})();
