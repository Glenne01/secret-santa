import { useState } from 'react';
import { supabase } from '../supabaseClient';

const RevealPage = () => {
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNameSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      // Charger les participants
      const { data: participants, error: participantsError } = await supabase
        .from('participants')
        .select('*');

      if (participantsError) throw participantsError;

      // Charger les assignations
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*');

      if (assignmentsError) throw assignmentsError;

      if (!participants || participants.length === 0 || !assignments || assignments.length === 0) {
        setError('Le tirage n\'a pas encore été effectué. Contacte l\'admin !');
        setLoading(false);
        return;
      }

      // Trouver l'utilisateur par nom (insensible à la casse)
      const user = participants.find(
        p => p.name.toLowerCase().trim() === userName.toLowerCase().trim()
      );

      if (!user) {
        setError('Ce nom n\'existe pas dans la liste. Vérifie l\'orthographe !');
        setLoading(false);
        return;
      }

      setCurrentUser({
        id: user.id,
        name: user.name,
        hasDrawn: user.has_drawn
      });
      setLoading(false);

    } catch (error) {
      console.error('Erreur lors de la recherche du participant:', error);
      setError('Une erreur est survenue. Contacte l\'admin !');
      setLoading(false);
    }
  };

  const handleReveal = async () => {
    if (!currentUser) return;

    setLoading(true);

    try {
      // Charger les assignations et participants
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*');

      if (assignmentsError) throw assignmentsError;

      const { data: participants, error: participantsError } = await supabase
        .from('participants')
        .select('*');

      if (participantsError) throw participantsError;

      // Trouver l'assignation pour cet utilisateur
      const assignment = assignments.find(a => a.giver_id === currentUser.id);

      if (!assignment) {
        setError('Une erreur est survenue. Contacte l\'admin !');
        setLoading(false);
        return;
      }

      // Trouver la personne assignée
      const assignedPerson = participants.find(p => p.id === assignment.receiver_id);

      if (!assignedPerson) {
        setError('Une erreur est survenue. Contacte l\'admin !');
        setLoading(false);
        return;
      }

      // Marquer l'utilisateur comme ayant tiré
      const { error: updateError } = await supabase
        .from('participants')
        .update({ has_drawn: true })
        .eq('id', currentUser.id);

      if (updateError) throw updateError;

      setCurrentUser({ ...currentUser, assignedTo: assignedPerson.name });
      setRevealed(true);
      setLoading(false);

    } catch (error) {
      console.error('Erreur lors de la révélation:', error);
      setError('Une erreur est survenue. Contacte l\'admin !');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        {!currentUser ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Bienvenue au Secret Santa de l'EDM République 🎁
              </h1>
            </div>
            <p className="text-center text-gray-600 mb-6 text-lg">
              Entre ton prénom pour découvrir à qui tu vas offrir un cadeau
            </p>
            <input
              type="text"
              placeholder="Ton prénom"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
              disabled={loading}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none mb-4 text-center text-lg disabled:opacity-50"
            />
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <button
              onClick={handleNameSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-full text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Chargement...' : 'Continuer'}
            </button>
          </>
        ) : !revealed ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Bonjour {currentUser.name} ! 👋
              </h1>
            </div>
            <p className="text-center text-gray-600 mb-4 text-lg">
              Es-tu prêt(e) à découvrir à qui tu vas devoir offrir un cadeau ?
            </p>
            <p className="text-center text-gray-500 mb-8 text-sm">
              Budget minimum : 10€
            </p>
            <button
              onClick={handleReveal}
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-full text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Chargement...' : 'Tirer un nom ✨'}
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center mt-4">{error}</p>
            )}
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              🎄 Ton Secret Santa 🎄
            </h2>
            <p className="text-lg text-gray-600 mb-4">Tu dois offrir un cadeau à :</p>
            <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 rounded-2xl mb-6">
              <p className="text-3xl font-bold">{currentUser.assignedTo}</p>
            </div>
            <p className="text-sm text-gray-500">
              N'oublie pas : c'est un secret ! 🤫
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RevealPage;
