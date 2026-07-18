import axios from 'axios';

export async function parseGithubMarkdown(url: string, topicOverride: string) {
  // Convert github.com/.../blob/... to raw.githubusercontent.com/...
  let rawUrl = url;
  if (url.includes('github.com') && url.includes('/blob/')) {
      rawUrl = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }
  
  console.log(`Fetching GitHub Markdown: ${rawUrl}...`);
  try {
      const response = await axios.get(rawUrl);
      const text = response.data;
      
      const questions: any[] = [];
      
      // Split by Markdown Headers (e.g. ## Question 1)
      const sections = text.split(/^#+\s+/gm);
      
      for (const section of sections) {
          if (!section.trim()) continue;
          
          const lines = section.trim().split('\n');
          const title = lines[0].trim();
          const body = lines.slice(1).join('\n').trim();
          
          if (title.length > 5 && title.endsWith('?')) {
              questions.push({
                  question: title,
                  idealAnswer: body || 'No answer provided.',
                  difficulty: "Medium",
                  type: "General",
                  topicIdName: topicOverride,
                  company: null
              });
          }
      }
      
      console.log(`Extracted ${questions.length} questions from GitHub.`);
      return questions;
  } catch (error: any) {
      console.warn(`[WARNING] Failed to fetch GitHub Markdown from ${rawUrl}. Is it a private repo? (${error.message})`);
      return [];
  }
}
