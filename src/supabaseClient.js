import { createClient } from '@supabase/supabase-js';

// Ces valeurs seront à remplacer par vos vraies clés Supabase
// Vous les trouverez dans votre projet Supabase sous Settings > API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
