import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env explicitly
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
// For an external script, you ideally want a service_role key to bypass RLS for inserts.
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_API_KEY) {
  console.error("Missing environment variables. Make sure VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (or ANON_KEY), and GEMINI_API_KEY are set.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function researchAndWrite(topic) {
  console.log(`\n🔍 Researching and drafting article for: "${topic}"...`);
  
  const prompt = `
  You are 'Arthur' - an expert financial strategy, M&A, and business acquisition writer for Ryan Kroge.
  Write a high-value, deeply strategic article about "${topic}".
  
  Requirements:
  - Title (60–70 chars)
  - Slug (kebab-case)
  - Read time estimate (in minutes, integer)
  - Meta Description (140-160 chars)
  - Clean Markdown format for the body (NO HTML)
  - Provide a minimum of 3 relevant FAQs with clear answers at the very end.
  
  Return ONLY a raw JSON object (do NOT wrap it in backticks or markdown JSON blocks) exactly structured like this:
  {
    "title": "...",
    "slug": "...",
    "category": "Strategic Financial Guidance",
    "read_time": 5,
    "meta_description": "...",
    "markdown_content": "...",
    "faqs": [
      { "question": "...", "answer": "..." }
    ]
  }`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    // Parse JSON
    let jsonStr = response.text().trim();
    if (jsonStr.startsWith("```json")) {
       jsonStr = jsonStr.substring(7);
       if (jsonStr.endsWith("```")) {
           jsonStr = jsonStr.substring(0, jsonStr.length - 3);
       }
    }
    const articleData = JSON.parse(jsonStr);
    console.log(`✅ Draft generated successfully: ${articleData.title}`);
    return articleData;
    
  } catch (err) {
    console.error("Error generating content:", err);
    process.exit(1);
  }
}

async function publishToSupabase(article) {
  console.log(`\n☁️ Uploading to Supabase...`);
  
  // 1. Insert Post
  const { data: post, error: postError } = await supabase
    .from('posts')
    .insert([{
      title: article.title,
      slug: article.slug,
      category: article.category,
      read_time: article.read_time,
      markdown_content: article.markdown_content,
      meta_description: article.meta_description,
      author_name: "Ryan Kroge (AI Assisted)",
      is_published: false, // Draft mode by default
      published_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (postError) {
    console.error("Failed to insert post. Ensure your un-authenticated role allows inserts if you aren't using a service key:", postError);
    return;
  }
  
  console.log(`✅ Post uploaded with ID: ${post.id}`);

  // 2. Insert FAQs
  if (article.faqs && article.faqs.length > 0) {
    const faqsToInsert = article.faqs.map((faq, index) => ({
      post_id: post.id,
      question: faq.question,
      answer: faq.answer,
      position: index
    }));

    const { error: faqError } = await supabase
      .from('post_faqs')
      .insert(faqsToInsert);

    if (faqError) {
      console.error("Failed to insert FAQs:", faqError);
    } else {
      console.log(`✅ ${article.faqs.length} FAQs attached to post.`);
    }
  }

  console.log(`\n🎉 Success! The post is in Draft mode. Go to /admin to publish it.`);
}

// Execution
const topicArgs = process.argv.slice(2).join(" ");
const topic = topicArgs || "Navigating Interest Rate Changes when Buying a Business in 2026";
researchAndWrite(topic).then(publishToSupabase);
