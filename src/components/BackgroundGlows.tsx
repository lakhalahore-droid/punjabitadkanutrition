import React from 'react';

export const BackgroundGlows: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Soft gradient canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/50 via-white to-orange-50/30" />

      {/* Warm Orange Blob (Top-Right) */}
      <div 
        className="absolute -top-32 -right-32 w-96 h-96 md:w-[32rem] md:h-[32rem] rounded-full bg-gradient-to-br from-orange-400/25 to-amber-300/20 blur-3xl transform-gpu animate-float-slow" 
      />

      {/* Pale Sky Blue Blob (Mid-Left) */}
      <div 
        className="absolute top-1/3 -left-36 w-80 h-80 md:w-[30rem] md:h-[30rem] rounded-full bg-gradient-to-tr from-sky-400/20 to-indigo-300/15 blur-3xl transform-gpu animate-float-alt" 
      />

      {/* Pastel Pink / Rose Blob (Bottom-Right) */}
      <div 
        className="absolute top-2/3 -right-20 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-gradient-to-tl from-rose-300/20 to-purple-300/15 blur-3xl transform-gpu animate-float-slow" 
      />

      {/* Subtle Warm Amber Glow (Near Footer) */}
      <div 
        className="absolute bottom-10 left-1/4 w-96 h-96 rounded-full bg-gradient-to-t from-orange-300/15 to-transparent blur-3xl transform-gpu" 
      />
    </div>
  );
};
