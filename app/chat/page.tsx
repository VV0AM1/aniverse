'use client';

export default function ChatComingSoon() {
  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-purple-500 neon pulse">
        COMING SOON
      </h1>

      <style jsx>{`
        .neon {
          text-shadow:
            0 0 5px #9333ea,
            0 0 10px #9333ea,
            0 0 20px #9333ea,
            0 0 40px #9333ea;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.7;
          }
        }

        .pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}