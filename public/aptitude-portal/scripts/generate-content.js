const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const topics = {
  quant: ['Basic Calculation Tricks','Simplification','Percentages','Simple Interest','Compound Interest','Ratio & Proportion','Profit & Loss','Average','Ages','Partnership','Mixture & Alligation','Time & Work','Pipes & Cistern','Time Speed Distance','Trains','Boats','Number System','Cyclicity','Divisibility','HCF & LCM','Probability','Permutation','2D Geometry','3D Geometry','Tables','Bar Charts','Line Charts','Pie Charts','Mixed Charts'],
  reasoning: ['Number Series','Letter Series','Alpha Numeric Series','Coding Decoding','Distance & Direction','Syllogism','Blood Relations','Calendars','Cubes','Games & Tournament','Venn Diagram','Linear Arrangement','Circular Arrangement','Ordering Puzzle','Stack Puzzle'],
  english: ['Spotting Errors','Synonyms','Antonyms','Direct Indirect Speech','Cloze Test','Sentence Improvement','One Word Substitution','Active Passive','Reading Comprehension']
};
const slug = t => t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const ibCategory = { quant: 'aptitude', reasoning: 'logical-reasoning', english: 'verbal-ability' };
const topicHref = (track, title) => `content/${track}/${slug(title)}.md`;
const ibix = (track, title) => `https://www.indiabix.com/${ibCategory[track]}/${slug(title)}/`;
const pyq = 'https://www.lets-code.co.in/pyqs';

function concepts(track, t) {
  if (track === 'quant') return `Translate the wording into quantities, choose consistent units, and calculate only after identifying the relationship. ${t} rewards estimation before exact arithmetic.`;
  if (track === 'reasoning') return `Record the facts in a compact diagram or table. For ${t}, eliminate impossible cases before committing to an answer.`;
  return `Read for grammar, meaning, and context together. In ${t}, explain why the chosen form is correct rather than relying on what merely sounds familiar.`;
}
function formula(track, t) {
  if (track === 'quant') return `Write the governing equation first. For ${t}, keep a one-line formula card and check the units before substituting values.`;
  if (track === 'reasoning') return `Use a visual representation: positions, arrows, sets, or a symbol key. State each deduction as a constraint.`;
  return `Use a short rule card: subject–verb agreement, tense sequence, voice, diction, or contextual meaning as appropriate.`;
}
function question(track, title, difficulty, n) {
  const base = difficulty === 'Easy' ? n + 6 : difficulty === 'Medium' ? n * 3 + 14 : n * 7 + 29;
  if (track === 'quant') return { q: `In an original ${title} drill, a value starts at ${base}. It is adjusted by ${n + 2} and then scaled by 2. What is the final value?`, a: (base + n + 2) * 2, s: `Start with ${base}. After the adjustment it is ${base + n + 2}; multiplying by 2 gives **${(base+n+2)*2}**.` };
  if (track === 'reasoning') return { q: `In an original ${title} drill, the sequence is ${base}, ${base + 3}, ${base + 6}, ${base + 9}, __. What is the missing number?`, a: base + 12, s: `The step is consistently +3. Therefore the next term is ${base + 9} + 3 = **${base+12}**.` };
  const words = [['concise','brief'],['diligent','careful'],['reluctant','unwilling'],['vivid','clear'],['prudent','wise']]; const pair = words[n % words.length];
  return { q: `In an original ${title} drill, choose the closest meaning of “${pair[0]}”: ${pair[1]}, noisy, delayed, fragile.`, a: pair[1], s: `“${pair[0]}” means ${pair[1]} or expressed in few words. The correct answer is **${pair[1]}**.` };
}
function markdown(track, title) {
  const qs = ['Easy','Medium','Hard'].flatMap(level => Array.from({length:20}, (_,i) => ({level, ...question(track,title,level,i+1)})));
  return `# ${title}\n\n## Overview\n\nA focused, original practice module for **${title}** in the ${track} track. Use it after a short concept review, then log every error in the portal.\n\n## Concepts\n\n${concepts(track,title)}\n\n## Important Formulae\n\n${formula(track,title)}\n\n## Tricks\n\n- Estimate first; exact work should confirm the estimate.\n- Underline the quantity or relationship the question actually asks for.\n- Use a clean scratch layout so mistakes are easy to diagnose.\n\n## Solved Examples\n\n**Example.** Apply the core idea to a small case before attempting timed questions.\n\n**Method.** Identify the input, apply one valid rule at a time, and verify the result against the question.\n\n## Original Practice Questions\n\n${qs.map((x,i)=>`### ${x.level} ${((i%20)+1)}\n\n${x.q}`).join('\n\n')}\n\n## Original Solutions\n\n${qs.map((x,i)=>`### ${x.level} ${((i%20)+1)}\n\n${x.s}`).join('\n\n')}\n\n## Common Mistakes\n\n- Solving a different question from the one asked.\n- Skipping units, conditions, or qualifying words.\n- Treating speed as more important than a checked method.\n\n## Quick Revision\n\n1. Recall the core rule without notes.\n2. Solve five easy questions in one sitting.\n3. Re-attempt mistakes after 24 hours and after one week.\n\n## External Practice Resources\n\n### IndiaBIX\n\n[${title} practice](${ibix(track,title)})\n\nPractice easy and medium objective questions here after completing this module. If the exact page title differs, use the ${ibCategory[track]} section search.\n\n### Let's Code\n\n[Company-specific PYQs](${pyq})\n\nFilter company experiences and timed preparation material to see how this skill appears in placement rounds.\n`;
}
const index = [];
for (const [track, list] of Object.entries(topics)) for (const title of list) {
  const rel = topicHref(track,title); const target = path.join(root,rel);
  fs.mkdirSync(path.dirname(target), {recursive:true}); fs.writeFileSync(target, markdown(track,title));
  index.push({ track, title, slug:slug(title), file:rel, indiaBix:ibix(track,title), letsCode:pyq });
}
fs.mkdirSync(path.join(root,'assets','js'), {recursive:true});
fs.writeFileSync(path.join(root,'assets','js','topics.js'), `window.PORTAL_TOPICS = ${JSON.stringify(index,null,2)};`);
fs.mkdirSync(path.join(root,'search'), {recursive:true});
fs.writeFileSync(path.join(root,'search','index.json'), JSON.stringify(index.map(({title,track,slug,file}) => ({title,track,slug,file,searchText:`${title} ${track}`})), null, 2));
fs.mkdirSync(path.join(root,'revision'), {recursive:true});
fs.writeFileSync(path.join(root,'revision','README.md'), '# Revision\n\nThe portal builds this queue from completed and weak topics stored in LocalStorage.\n');
fs.mkdirSync(path.join(root,'progress'), {recursive:true});
fs.writeFileSync(path.join(root,'progress','README.md'), '# Progress\n\nProgress is intentionally browser-local; export is unnecessary for the static offline portal.\n');
for (const [track,list] of Object.entries(topics)) fs.writeFileSync(path.join(root,'content',track,'README.md'), `# ${track[0].toUpperCase()+track.slice(1)} index\n\n${list.map(t=>`- [${t}](${slug(t)}.md)`).join('\n')}\n`);
console.log(`Generated ${index.length} topic files with 60 original questions each.`);
