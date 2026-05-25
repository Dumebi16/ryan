import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const { data, error } = await supabase.from('posts').select('title, is_published, created_at, published_at');
if (error) console.error(error);
else console.log(JSON.stringify(data, null, 2));
