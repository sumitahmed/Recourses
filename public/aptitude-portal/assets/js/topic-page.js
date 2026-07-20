const slug = new URLSearchParams(location.search).get('topic');
const topic = window.PORTAL_TOPICS.find(item => item.slug === slug);
const target = document.querySelector('#reader-content');
const escapeHtml = text => text.replace(/[&<>]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[char]));
const inline = text => escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1 ↗</a>');
function render(markdown) {
  return markdown.trim().split(/\n\n+/).map(block => {
    const lines = block.split('\n'), first = lines[0], rest = lines.slice(1).join(' ');
    if (first.startsWith('# ')) return `<div class="reader-hero"><p class="eyebrow">${topic.track.toUpperCase()} · PRACTICE MODULE</p><h1>${inline(first.slice(2))}</h1><p>Concept notes, original drills, complete solutions, and useful practice links.</p><div class="reader-meta"><span>60 original questions</span><span>20 Easy · 20 Medium · 20 Hard</span></div></div>`;
    if (first.startsWith('## ')) return `<h2 class="reader-heading">${inline(first.slice(3))}</h2>`;
    if (first.startsWith('### ')) return `<article class="${first.includes('Solution') ? 'solution-card' : 'question-card'}"><div class="question-label">${inline(first.slice(4))}</div>${rest ? `<p>${inline(rest)}</p>` : ''}</article>`;
    if (lines.every(line => line.startsWith('- '))) return `<ul>${lines.map(line => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
    if (/^\d+\. /.test(first)) return `<ol>${lines.map(line => `<li>${inline(line.replace(/^\d+\. /,''))}</li>`).join('')}</ol>`;
    return `<p>${lines.map(inline).join('<br>')}</p>`;
  }).join('');
}
if (!topic) target.innerHTML = '<p class="empty">That topic does not exist. <a href="index.html#topics">Return to the syllabus.</a></p>';
else { document.title = `${topic.title} — Prep Desk`; fetch(topic.file).then(r => { if (!r.ok) throw Error(); return r.text() }).then(markdown => target.innerHTML = render(markdown)).catch(() => target.innerHTML = '<p class="empty">Start the portal with <code>python -m http.server 8080</code>, then reopen this page.</p>'); }
