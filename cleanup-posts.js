import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

function cleanHtml(html) {
  if (!html) return html;
  let newHtml = html;

  // Remove completely empty p tags
  newHtml = newHtml.replace(/<p>(\s|&nbsp;)*<\/p>/g, '');

  // Find paragraphs that look like headers (short, no ending punctuation, title case or starts with capital)
  newHtml = newHtml.replace(/<p>(.*?)<\/p>/g, (match, p1) => {
    // If it contains other block tags inside, ignore
    if (p1.includes('<p>') || p1.includes('<ul>')) return match;

    // Strip HTML from inner content to check text properties
    const text = p1.replace(/<[^>]+>/g, '').trim();

    // Heuristics for a header:
    // - Length between 5 and 70 characters
    // - Does not end with ., ,, ;, :
    // - Not a URL
    if (
      text.length > 5 &&
      text.length < 80 &&
      !/[.,;:]$/.test(text) &&
      !text.startsWith('http') &&
      !text.includes('?') && // Avoid turning questions into headers automatically unless they are clearly headers, but safer to skip
      text.split(' ').length <= 10 // Max 10 words
    ) {
      // Check if it's already wrapped in strong, if so, remove strong and make it h2
      const innerHtml = p1.replace(/<\/?strong>/g, '');
      return `<h2>${innerHtml}</h2>`;
    }

    return match;
  });

  return newHtml;
}

async function run() {
  const { data, error } = await supabase.from('posts').select('id, title, markdown_content');
  if (error) {
    console.error(error);
    return;
  }

  for (const p of data) {
    const cleaned = cleanHtml(p.markdown_content);
    if (cleaned !== p.markdown_content) {
      console.log(`Updating post: ${p.title}`);
      const { error: updateErr } = await supabase.from('posts').update({ markdown_content: cleaned }).eq('id', p.id);
      if (updateErr) {
        console.error('Error updating:', updateErr);
      } else {
        console.log('Successfully updated.');
      }
    } else {
      console.log(`No changes needed for: ${p.title}`);
    }
  }
}

run();
