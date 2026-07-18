import fs from 'fs';
const pdfParse = require('pdf-parse');

export async function parseCTCI(filePath: string) {
  console.log(`Reading PDF from ${filePath}...`);
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  const text = data.text;
  
  const questions = [];
  
  // This is a basic heuristic parser. Real-world parsing of a 700 page book requires sophisticated regex.
  // In CTCI, questions are usually in chapters and start with numbers like "1.1 Is Unique: ..."
  
  const questionRegex = /(\d+\.\d+)\s+([^:]+):([\s\S]*?)(?=\d+\.\d+\s+[^:]+:|Solutions to Chapter|$)/gi;
  
  let match;
  while ((match = questionRegex.exec(text)) !== null) {
      if (questions.length > 200) break; // limit for now
      
      const number = match[1].trim();
      const title = match[2].trim();
      const description = match[3].trim();
      
      // Determine topic heuristically from chapter prefix
      let topic = 'Data Structures & Algorithms';
      const chapterNum = parseInt(number.split('.')[0]);
      
      if (chapterNum === 1) topic = 'Arrays & Strings';
      else if (chapterNum === 2) topic = 'Linked Lists';
      else if (chapterNum === 3) topic = 'Stacks & Queues';
      else if (chapterNum === 4) topic = 'Trees & Graphs';
      else if (chapterNum === 5) topic = 'Bit Manipulation';
      else if (chapterNum === 8) topic = 'Recursion & Dynamic Programming';
      else if (chapterNum === 10) topic = 'Sorting & Searching';
      else if (chapterNum >= 12 && chapterNum <= 15) topic = 'System Design'; // approx
      
      questions.push({
          question: `[CTCI ${number}] ${title}`,
          idealAnswer: description, // In reality, we'd need to parse the Solutions section
          difficulty: "Medium",
          type: "System Design",
          topicIdName: topic,
          company: "General"
      });
  }
  
  console.log(`Extracted ${questions.length} questions from CTCI PDF.`);
  return questions;
}
