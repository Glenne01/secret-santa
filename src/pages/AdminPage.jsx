import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [newName, setNewName] = useState('');
  const [exclusions, setExclusions] = useState({});
  const [drawCompleted, setDrawCompleted] = useState(false);
  const [assignments, setAssignments] = useState({});

  // Load data from localStorage
  useEffect(() => {
    const savedParticipants = localStorage.getItem('secretSantaParticipants');
    const savedExclusions = localStorage.getItem('secretSantaExclusions');
    const savedAssignments = localStorage.getItem('secretSantaAssignments');

    if (savedParticipants) setParticipants(JSON.parse(savedParticipants));
    if (savedExclusions) setExclusions(JSON.parse(savedExclusions));
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
      setDrawCompleted(true);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (participants.length > 0) {
      localStorage.setItem('secretSantaParticipants', JSON.stringify(participants));
    }
  }, [participants]);

  useEffect(() => {
    if (Object.keys(exclusions).length > 0) {
      localStorage.setItem('secretSantaExclusions', JSON.stringify(exclusions));
    }
  }, [exclusions]);

  const addParticipant = () => {
    if (newName.trim()) {
      const participant = {
        id: Date.now(),
        name: newName.trim(),
        hasDrawn: false
      };
      setParticipants([...participants, participant]);
      setNewName('');
    }
  };

  const removeParticipant = (id) => {
    setParticipants(participants.filter(p => p.id !== id));
    // Remove from exclusions
    const newExclusions = { ...exclusions };
    delete newExclusions[id];
    Object.keys(newExclusions).forEach(key => {
      newExclusions[key] = newExclusions[key].filter(excludedId => excludedId !== id);
    });
    setExclusions(newExclusions);
  };

  const toggleExclusion = (participantId, excludedId) => {
    const newExclusions = { ...exclusions };
    if (!newExclusions[participantId]) {
      newExclusions[participantId] = [];
    }

    if (newExclusions[participantId].includes(excludedId)) {
      newExclusions[participantId] = newExclusions[participantId].filter(id => id !== excludedId);
    } else {
      newExclusions[participantId].push(excludedId);
    }

    setExclusions(newExclusions);
  };

  const performDraw = () => {
    if (participants.length < 2) {
      alert('Il faut au moins 2 participants !');
      return;
    }

    // Fisher-Yates shuffle with exclusions
    const available = [...participants];
    const newAssignments = {};
    let attempts = 0;
    const maxAttempts = 1000;

    const tryDraw = () => {
      const tempAssignments = {};
      const receivers = [...participants];

      for (let giver of participants) {
        const excluded = [giver.id, ...(exclusions[giver.id] || [])];
        const validReceivers = receivers.filter(r => !excluded.includes(r.id));

        if (validReceivers.length === 0) {
          return false;
        }

        const randomIndex = Math.floor(Math.random() * validReceivers.length);
        const receiver = validReceivers[randomIndex];

        tempAssignments[giver.id] = receiver.id;
        receivers.splice(receivers.indexOf(receiver), 1);
      }

      return tempAssignments;
    };

    let result = false;
    while (!result && attempts < maxAttempts) {
      result = tryDraw();
      attempts++;
    }

    if (!result) {
      alert('Impossible de faire un tirage avec ces contraintes. Essayez de réduire les exclusions.');
      return;
    }

    setAssignments(result);
    setDrawCompleted(true);
    localStorage.setItem('secretSantaAssignments', JSON.stringify(result));
    alert('Tirage effectué avec succès !');
  };

  const resetDraw = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser le tirage ?')) {
      setAssignments({});
      setDrawCompleted(false);
      localStorage.removeItem('secretSantaAssignments');
      setParticipants(participants.map(p => ({ ...p, hasDrawn: false })));
    }
  };

  const getParticipantById = (id) => {
    return participants.find(p => p.id === id);
  };

  const notDrawnCount = participants.filter(p => !p.hasDrawn).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">
              Admin - Secret Santa EDM République
            </h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Retour
            </button>
          </div>

          {/* Add Participant Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ajouter un participant</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Nom complet"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={addParticipant}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:shadow-lg transition-all"
              >
                Ajouter
              </button>
            </div>
          </div>

          {/* Participants List */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Participants ({participants.length})
              {drawCompleted && (
                <span className="text-lg text-gray-600 ml-4">
                  • {notDrawnCount} n'ont pas encore tiré
                </span>
              )}
            </h2>

            {participants.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Aucun participant pour le moment</p>
            ) : (
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{participant.name}</p>
                      {drawCompleted && (
                        <p className="text-sm mt-1">
                          <span className={participant.hasDrawn ? 'text-green-600' : 'text-orange-600'}>
                            {participant.hasDrawn ? '✓ A tiré son nom' : '⏳ N\'a pas encore tiré'}
                          </span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Exclusions Section */}
          {participants.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contraintes / Exclusions</h2>
              <p className="text-gray-600 mb-4">
                Sélectionnez les personnes qui ne peuvent pas s'offrir de cadeaux entre elles
              </p>

              <div className="space-y-4">
                {participants.map((participant) => (
                  <div key={participant.id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-semibold text-gray-800 mb-2">{participant.name} ne peut pas offrir à :</p>
                    <div className="flex flex-wrap gap-2">
                      {participants
                        .filter(p => p.id !== participant.id)
                        .map((other) => (
                          <button
                            key={other.id}
                            onClick={() => toggleExclusion(participant.id, other.id)}
                            className={`px-3 py-1 rounded-full text-sm transition-all ${
                              exclusions[participant.id]?.includes(other.id)
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {other.name}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Draw Section */}
          {participants.length >= 2 && (
            <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tirage au sort</h2>

              {!drawCompleted ? (
                <button
                  onClick={performDraw}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-lg hover:shadow-lg transition-all"
                >
                  🎲 Effectuer le tirage
                </button>
              ) : (
                <div>
                  <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-semibold text-center">
                      ✓ Tirage effectué ! Les participants peuvent maintenant tirer leur nom.
                    </p>
                  </div>

                  {/* Show assignments (admin view) */}
                  <div className="mb-4 p-4 bg-white rounded-lg">
                    <h3 className="font-bold text-gray-800 mb-2">Résultats du tirage :</h3>
                    <div className="space-y-2">
                      {participants.map((giver) => {
                        const receiverId = assignments[giver.id];
                        const receiver = getParticipantById(receiverId);
                        return (
                          <div key={giver.id} className="text-sm">
                            <span className="font-semibold">{giver.name}</span> → {receiver?.name}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={resetDraw}
                    className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all"
                  >
                    Réinitialiser le tirage
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
