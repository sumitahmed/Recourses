import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export async function parseSanfoundry(url: string, topicOverride: string) {
    console.log(`Fetching Sanfoundry MCQs from: ${url} using Puppeteer...`);
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const html = await page.content();
        await browser.close();

        const $ = cheerio.load(html);
        
        const questions: any[] = [];
        const entryContent = $('.entry-content');
        
        let currentQuestion = '';
        let currentOptions = '';
        
        entryContent.find('p').each((i, el) => {
            if (questions.length > 50) return false;
            
            const text = $(el).text().trim();
            
            if (/^\d+\./.test(text) && text.includes('?')) {
                currentQuestion = text;
                currentOptions = '';
            } 
            else if (/^[a-d]\)/.test(text)) {
                currentOptions += text + '\n';
            }
        });
        
        entryContent.find('.collapseomatic_content').each((i, el) => {
             const answerText = $(el).text().trim();
             if (questions[i]) {
                 questions[i].idealAnswer = answerText;
             } else if (currentQuestion && questions.length === i) {
                 questions.push({
                     question: currentQuestion + '\n\n' + currentOptions,
                     idealAnswer: answerText,
                     difficulty: "Easy",
                     type: "MCQ",
                     topicIdName: topicOverride,
                     company: null
                 });
             }
        });
        
        console.log(`Extracted ${questions.length} questions from Sanfoundry.`);
        return questions;
    } catch (error: any) {
        console.warn(`[WARNING] Failed to fetch Sanfoundry URL ${url}. (${error.message})`);
        return [];
    }
}
