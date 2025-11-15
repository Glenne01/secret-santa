# Configuration Supabase pour Secret Santa

## 1. Créer un compte Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub ou créez un compte

## 2. Créer un nouveau projet

1. Cliquez sur "New Project"
2. Donnez un nom à votre projet (ex: "secret-santa-edm")
3. Choisissez un mot de passe pour la base de données (IMPORTANT: gardez-le en sécurité!)
4. Choisissez la région la plus proche (ex: Europe West pour la France)
5. Cliquez sur "Create new project"

## 3. Créer les tables dans la base de données

1. Dans votre projet Supabase, allez dans l'onglet "SQL Editor"
2. Copiez et collez le code SQL ci-dessous:

```sql
-- Table des participants
CREATE TABLE participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  has_drawn BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Table des exclusions (qui ne peut pas offrir à qui)
CREATE TABLE exclusions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  giver_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  excluded_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(giver_id, excluded_id)
);

-- Table des assignations (qui offre à qui)
CREATE TABLE assignments (
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

-- Politiques pour permettre la lecture et l'écriture à tous (car c'est une app publique)
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
```

3. Cliquez sur "Run" pour exécuter le SQL

## 4. Obtenir vos clés API

1. Allez dans "Settings" > "API"
2. Vous verrez deux informations importantes:
   - **Project URL**: votre URL Supabase (ex: https://xxxxx.supabase.co)
   - **anon public**: votre clé API publique (une longue chaîne de caractères)

## 5. Configurer l'application

1. Créez un fichier `.env` à la racine du projet secret-santa-app
2. Copiez le contenu de `.env.example` dans `.env`
3. Remplacez les valeurs par vos vraies clés:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre-vraie-cle-ici
```

4. Enregistrez le fichier

## 6. Tester l'application

1. Redémarrez le serveur de développement:
   ```
   npm run dev
   ```

2. Allez sur http://localhost:5173/admin
3. Ajoutez des participants
4. Le tout devrait maintenant être sauvegardé dans Supabase!

## 7. Déployer sur Vercel

Quand vous déployez sur Vercel, n'oubliez pas d'ajouter les variables d'environnement:
1. Dans Vercel, allez dans Project Settings > Environment Variables
2. Ajoutez:
   - `VITE_SUPABASE_URL` avec votre URL
   - `VITE_SUPABASE_ANON_KEY` avec votre clé

C'est tout! Votre application Secret Santa utilisera maintenant Supabase comme backend et les données seront partagées entre tous les utilisateurs.
