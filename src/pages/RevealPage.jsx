import { useState } from 'react';

const RevealPage = () => {
  const [userName, setUserName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState('');

  const handleNameSubmit = () => {
    setError('');

    // Load data from localStorage
    const savedParticipants = localStorage.getItem('secretSantaParticipants');
    const savedAssignments = localStorage.getItem('secretSantaAssignments');

    if (!savedParticipants || !savedAssignments) {
      setError('Le tirage n\'a pas encore été effectué. Contacte l\'admin !');
      return;
    }

    const participants = JSON.parse(savedParticipants);
    const assignments = JSON.parse(savedAssignments);

    // Find user by name (case insensitive)
    const user = participants.find(
      p => p.name.toLowerCase().trim() === userName.toLowerCase().trim()
    );

    if (!user) {
      setError('Ce nom n\'existe pas dans la liste. Vérifie l\'orthographe !');
      return;
    }

    setCurrentUser(user);
  };

  const handleReveal = () => {
    if (!currentUser) return;

    // Get assigned person
    const savedAssignments = localStorage.getItem('secretSantaAssignments');
    const savedParticipants = localStorage.getItem('secretSantaParticipants');

    const assignments = JSON.parse(savedAssignments);
    const participants = JSON.parse(savedParticipants);

    const assignedId = assignments[currentUser.id];
    const assignedPerson = participants.find(p => p.id === assignedId);

    if (!assignedPerson) {
      setError('Une erreur est survenue. Contacte l\'admin !');
      return;
    }

    // Mark user as having drawn
    const updatedParticipants = participants.map(p =>
      p.id === currentUser.id ? { ...p, hasDrawn: true } : p
    );
    localStorage.setItem('secretSantaParticipants', JSON.stringify(updatedParticipants));

    setCurrentUser({ ...currentUser, assignedTo: assignedPerson.name });
    setRevealed(true);
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
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none mb-4 text-center text-lg"
            />
            {error && (
              <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}
            <button
              onClick={handleNameSubmit}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-full text-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Continuer
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
              Budget minimum : 15€
            </p>
            <button
              onClick={handleReveal}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 rounded-full text-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Tirer un nom ✨
            </button>
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
