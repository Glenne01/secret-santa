import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Les variables d\'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont requises');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('🚀 Configuration de la base de données Supabase...\n');

  // SQL pour créer les tables
  const createTablesSQL = `
    -- Table des participants
    CREATE TABLE IF NOT EXISTS participants (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name TEXT NOT NULL,
      has_drawn BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
    );

    -- Table des exclusions (qui ne peut pas offrir à qui)
    CREATE TABLE IF NOT EXISTS exclusions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      giver_id UUID REFERENCES participants(id) ON DELETE CASCADE,
      excluded_id UUID REFERENCES participants(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      UNIQUE(giver_id, excluded_id)
    );

    -- Table des assignations (qui offre à qui)
    CREATE TABLE IF NOT EXISTS assignments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      giver_id UUID REFERENCES participants(id) ON DELETE CASCADE,
      receiver_id UUID REFERENCES participants(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
      UNIQUE(giver_id)
    );

    -- Activer Row Level Security (RLS)
    ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
    ALTER TABLE exclusions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

    -- Supprimer les anciennes politiques si elles existent
    DROP POLICY IF EXISTS "Enable read access for all users" ON participants;
    DROP POLICY IF EXISTS "Enable insert for all users" ON participants;
    DROP POLICY IF EXISTS "Enable update for all users" ON participants;
    DROP POLICY IF EXISTS "Enable delete for all users" ON participants;

    DROP POLICY IF EXISTS "Enable read access for all users" ON exclusions;
    DROP POLICY IF EXISTS "Enable insert for all users" ON exclusions;
    DROP POLICY IF EXISTS "Enable update for all users" ON exclusions;
    DROP POLICY IF EXISTS "Enable delete for all users" ON exclusions;

    DROP POLICY IF EXISTS "Enable read access for all users" ON assignments;
    DROP POLICY IF EXISTS "Enable insert for all users" ON assignments;
    DROP POLICY IF EXISTS "Enable update for all users" ON assignments;
    DROP POLICY IF EXISTS "Enable delete for all users" ON assignments;

    -- Politiques pour permettre la lecture et l'écriture à tous
    CREATE POLICY "Enable read access for all users" ON participants FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON participants FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable update for all users" ON participants FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for all users" ON participants FOR DELETE USING (true);

    CREATE POLICY "Enable read access for all users" ON exclusions FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON exclusions FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable update for all users" ON exclusions FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for all users" ON exclusions FOR DELETE USING (true);

    CREATE POLICY "Enable read access for all users" ON assignments FOR SELECT USING (true);
    CREATE POLICY "Enable insert for all users" ON assignments FOR INSERT WITH CHECK (true);
    CREATE POLICY "Enable update for all users" ON assignments FOR UPDATE USING (true);
    CREATE POLICY "Enable delete for all users" ON assignments FOR DELETE USING (true);
  `;

  console.log('📝 Exécution du script SQL...\n');
  console.log('⚠️  IMPORTANT: Ce script doit être exécuté manuellement dans le SQL Editor de Supabase.\n');
  console.log('Instructions:');
  console.log('1. Va sur https://supabase.com/dashboard/project/tdojvlemcurungamnslv/sql');
  console.log('2. Copie et colle le SQL ci-dessous dans l\'éditeur SQL');
  console.log('3. Clique sur "Run" pour l\'exécuter\n');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log(createTablesSQL);
  console.log('─────────────────────────────────────────────────────────────────\n');

  // Tester la connexion
  console.log('🔍 Test de connexion à Supabase...');
  try {
    const { data, error } = await supabase.from('participants').select('count');

    if (error) {
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        console.log('⚠️  Les tables n\'existent pas encore. Exécute le SQL ci-dessus dans Supabase.');
      } else {
        console.error('❌ Erreur:', error.message);
      }
    } else {
      console.log('✅ Connexion réussie ! Les tables existent.');
      console.log('✅ Configuration terminée !');
    }
  } catch (err) {
    console.error('❌ Erreur de connexion:', err.message);
  }
}

setupDatabase();
