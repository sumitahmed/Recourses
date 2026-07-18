import { NotionAPI } from 'notion-client';

const notion = new NotionAPI();

export async function parseNotionQA(pageId: string, topicOverride: string) {
  console.log(`Fetching Notion Page: ${pageId}...`);
  try {
      const recordMap = await notion.getPage(pageId);
      
      const blocks = Object.values(recordMap.block);
      
      let fullText = '';
      
      for (const blockData of blocks) {
          const block = blockData.value as any;
          if (!block) continue;
          
          if (block.properties && block.properties.title) {
              const text = block.properties.title.map((t: any) => t[0]).join('');
              fullText += text + '\n';
          }
      }
      
      const questions: any[] = [];
      
      // Try to parse Q1:, Q2:, etc.
      // Regex looks for "Q" followed by number and colon, or just a question mark.
      // If it doesn't match Q1: perfectly, we'll try to split by '?' or just return chunks.
      const qRegex = /Q\d+:\s*(.*?)\nAnswer:\s*([\s\S]*?)(?=Q\d+:|$)/g;
      
      let match;
      while ((match = qRegex.exec(fullText)) !== null) {
          questions.push({
              question: match[1].trim(),
              idealAnswer: match[2].trim(),
              difficulty: "Medium",
              type: "General",
              topicIdName: topicOverride,
              company: null
          });
      }
      
      // If no Q1: format found, just try to extract paragraphs that end with ?
      if (questions.length === 0) {
          const lines = fullText.split('\n');
          let currentQ = '';
          let currentA = '';
          for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.endsWith('?')) {
                  if (currentQ) {
                      questions.push({
                          question: currentQ,
                          idealAnswer: currentA.trim() || 'To be discussed.',
                          difficulty: "Medium",
                          type: "General",
                          topicIdName: topicOverride,
                          company: null
                      });
                  }
                  currentQ = trimmed;
                  currentA = '';
              } else if (trimmed !== '') {
                  if (currentQ) {
                      currentA += trimmed + '\n\n';
                  }
              }
          }
          if (currentQ) {
              questions.push({
                  question: currentQ,
                  idealAnswer: currentA.trim() || 'To be discussed.',
                  difficulty: "Medium",
                  type: "General",
                  topicIdName: topicOverride,
                  company: null
              });
          }
      }
      
      console.log(`Extracted ${questions.length} questions from Notion Page ${pageId}`);
      return questions;
  } catch (error) {
      console.error(`Error parsing Notion page ${pageId}:`, error);
      return [];
  }
}
