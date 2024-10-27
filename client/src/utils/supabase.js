// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your Supabase project URL and anon key
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export let supabase = createClient(supabaseUrl, supabaseAnonKey);
