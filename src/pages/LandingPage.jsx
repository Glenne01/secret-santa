import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 via-pink-400 to-red-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full"
      >
        {/* Card Container */}
        <div className="bg-gradient-to-b from-red-500 to-red-600 rounded-[3rem] shadow-2xl overflow-hidden relative">
          {/* Decorative top corner */}
          <div className="absolute top-0 left-0 w-32 h-32">
            <div className="absolute top-0 left-0 w-24 h-24 bg-black rounded-br-full opacity-80"></div>
            <div className="absolute top-0 left-0 w-16 h-16 bg-black rounded-br-full opacity-60"></div>
          </div>

          {/* Content */}
          <div className="relative px-8 pt-20 pb-12">
            {/* Gift Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="relative">
                {/* Main gift boxes */}
                <div className="flex items-end gap-3">
                  {/* Red gift box */}
                  <div className="w-24 h-28 bg-red-600 rounded-lg relative shadow-lg border-2 border-red-700">
                    <div className="absolute top-1/2 left-0 right-0 h-3 bg-yellow-400 -translate-y-1/2"></div>
                    <div className="absolute top-0 left-1/2 bottom-0 w-3 bg-yellow-400 -translate-x-1/2"></div>
                    {/* Bow */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-6 bg-yellow-400 rounded-full"></div>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-3 bg-yellow-400 rounded-t-full"></div>
                  </div>

                  {/* White polka dot gift box */}
                  <div className="w-28 h-32 bg-white rounded-lg relative shadow-lg overflow-hidden">
                    {/* Polka dots */}
                    <div className="absolute inset-0">
                      <div className="absolute top-2 left-2 w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="absolute top-8 left-4 w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="absolute top-8 right-2 w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="absolute top-14 left-2 w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="absolute top-14 right-4 w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="absolute top-20 left-3 w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="absolute top-20 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    {/* Ribbon */}
                    <div className="absolute top-1/2 left-0 right-0 h-4 bg-yellow-400 -translate-y-1/2"></div>
                    <div className="absolute top-0 left-1/2 bottom-0 w-4 bg-yellow-400 -translate-x-1/2"></div>
                    {/* Bow */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-8 bg-yellow-400 rounded-full"></div>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-4 bg-yellow-400 rounded-t-full"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white text-center mb-10"
            >
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Partager l'amour du Christ à travers les gestes simples
              </h1>
              <p className="text-sm text-white/90 leading-relaxed px-2">
                Dans le but de diffuser l'amour et renforcer nos liens fraternels, l'EDM République organise son Secret Santa ! Un moment de joie et de partage pour célébrer la naissance de notre Sauveur ensemble.
              </p>
            </motion.div>

            {/* Start Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/reveal')}
              className="w-full bg-white text-red-600 font-semibold py-4 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Commencer
            </motion.button>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-6 flex justify-center gap-2"
            >
              <div className="w-20 h-1 bg-white rounded-full"></div>
              <div className="w-8 h-1 bg-white/40 rounded-full"></div>
              <div className="w-8 h-1 bg-white/40 rounded-full"></div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
