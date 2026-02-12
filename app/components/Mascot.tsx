'use client';

type MascotProps = {
  mood?: 'happy' | 'sad' | 'thinking';
  href?: string;
  tooltip?: string;
};

export default function Mascot({ mood = 'happy', href, tooltip = 'GitHub' }: MascotProps) {
  const mascotBody = (
    <div className="relative w-24 h-24 mb-6 animate-bounce flex flex-col items-center">
      <div className="w-20 h-20 bg-[#FF99CC] border-[4px] border-[#333] relative flex items-center justify-center">
        {/* Eyes */}
        <div className="absolute top-5 left-5 w-2.5 h-2.5 bg-[#333]"></div>
        <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-[#333]"></div>
        
        {/* Mouth */}
        {mood === 'happy' && <div className="absolute bottom-5 w-5 h-[3px] bg-[#333]"></div>}
        {mood === 'sad' && <div className="absolute bottom-6 w-3 h-2 border-t-[3px] border-[#333]"></div>}
        {mood === 'thinking' && <div className="absolute bottom-5 w-2 h-[3px] bg-[#333]"></div>}
        
        {/* Cheeks */}
        <div className="absolute top-9 left-2 w-3 h-2 bg-[#FF6699] opacity-30"></div>
        <div className="absolute top-9 right-2 w-3 h-2 bg-[#FF6699] opacity-30"></div>
      </div>
      
      <div className="flex justify-between w-14 -mt-1">
        <div className="w-4 h-3 bg-[#333]"></div>
        <div className="w-4 h-3 bg-[#333]"></div>
      </div>
      <div className="w-16 h-1.5 bg-black opacity-5 rounded-full mt-2"></div>

      {href && (
        <div className="absolute -top-2 -right-2 bg-[#ffffff] border-[3px] border-[#333] px-2 py-0.5 text-[10px] font-black text-[#333] shadow-[2px_2px_0px_0px_rgba(51,51,51,1)]">
          GitHub
        </div>
      )}
    </div>
  );

  if (!href) {
    return mascotBody;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={tooltip}
      title={tooltip}
      className="group inline-flex"
    >
      {mascotBody}
    </a>
  );
}
