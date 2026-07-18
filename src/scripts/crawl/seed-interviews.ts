import { PrismaClient } from '@prisma/client';
import { parseCTCI } from './parsers/ctci-parser';
import { parseNotionQA } from './parsers/notion-parser';
import { parseGithubMarkdown } from './parsers/github-parser';
import { parseSanfoundry } from './parsers/sanfoundry-parser';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    console.log('--- STARTING INTERVIEW DATA INGESTION ---');
    
    let allQuestions: any[] = [];
    
    // 1. PDF Parser
    const pdfPath = 'C:\\Users\\sksum\\OneDrive\\Documents\\Placement Prep\\Recourses\\Cracking-the-Coding-Interview-6th-Edition-189-Programming-Questions-and-Solutions.pdf';
    try {
        const pdfQuestions = await parseCTCI(pdfPath);
        allQuestions.push(...pdfQuestions);
    } catch (e: any) {
        console.error('Failed to parse CTCI PDF:', e.message);
    }
    
    // 2. Notion API (DBMS, DSA, Java)
    const dbmsPageId = '35635b99f24c8094826ed8869a128b0c';
    const dbmsQuestions = await parseNotionQA(dbmsPageId, 'Database Management System');
    allQuestions.push(...dbmsQuestions);
    
    const dsaPageId = '2d335b99f24c80478324c7e81bbe1a1b';
    const dsaQuestions = await parseNotionQA(dsaPageId, 'Data Structures & Algorithms');
    allQuestions.push(...dsaQuestions);
    
    const javaPageId = '24e35b99f24c808da7b8c0cd1b8fb500';
    const javaQuestions = await parseNotionQA(javaPageId, 'Java');
    allQuestions.push(...javaQuestions);
    
    // 3. GitHub Markdown Parser
    const githubUrl = 'https://raw.githubusercontent.com/sumitahmed/java-codes/main/JAVA_qa.md';
    const githubQuestions = await parseGithubMarkdown(githubUrl, 'Java');
    allQuestions.push(...githubQuestions);
    
    // 4. Sanfoundry Scraper (Java and DSA examples)
    const sfJavaUrl = 'https://www.sanfoundry.com/java-mcqs/'; // base, might need specific page
    const sfJavaQs = await parseSanfoundry(sfJavaUrl, 'Java');
    allQuestions.push(...sfJavaQs);
    
    const sfDsaUrl = 'https://www.sanfoundry.com/data-structure-questions-answers/';
    const sfDsaQs = await parseSanfoundry(sfDsaUrl, 'Data Structures & Algorithms');
    allQuestions.push(...sfDsaQs);
    
    console.log(`\\nTotal Questions Extracted: ${allQuestions.length}`);
    
    if (allQuestions.length === 0) {
        console.log('No questions found. Exiting.');
        return;
    }
    
    console.log('Inserting into database...');
    
    // Ensure topics exist to link against
    // We are linking by topicIdName. If the Topic doesn't exist, this will fail.
    // Let's create dummy topics if they don't exist, or map them properly.
    
    for (const q of allQuestions) {
        if (!q.question || !q.idealAnswer) continue;
        
        // Find or create topic
        // We find by title because slug might vary or title might not be unique, but we will assume title is unique for script
        let topic = await prisma.topic.findFirst({
            where: { title: q.topicIdName }
        });
        
        if (!topic) {
            topic = await prisma.topic.create({
                data: {
                    title: q.topicIdName,
                    slug: q.topicIdName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    description: `Crawled topic: ${q.topicIdName}`,
                    module: 'Backend', // default
                    status: 'Not Started'
                }
            });
        }
        
        // Find or create question to avoid duplicates on re-run
        const existing = await prisma.interviewQuestion.findFirst({
            where: {
                question: q.question.substring(0, 500),
                topicId: topic.id
            }
        });
        
        if (!existing) {
            await prisma.interviewQuestion.create({
                data: {
                    question: q.question.substring(0, 500),
                    idealAnswer: q.idealAnswer,
                    difficulty: q.difficulty,
                    type: q.type,
                    topicId: topic.id,
                    company: q.company
                }
            });
        }
    }
    
    console.log('--- INGESTION COMPLETE ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
