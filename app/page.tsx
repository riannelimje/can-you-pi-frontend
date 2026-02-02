import Link from 'next/link';

// Pixel Mascot Component
const Mascot = ({ mood = 'happy' }: { mood?: 'happy' | 'sad' | 'thinking' }) => {
  return (
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
    </div>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#ffffff] font-mono relative overflow-hidden selection:bg-[#FF99CC] selection:text-white">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-5" 
           style={{
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>
      
      {/* Pi Watermark */}
      <div className="fixed -bottom-40 -right-40 text-[600px] font-bold text-black/[0.02] pointer-events-none select-none -rotate-12">
        π
      </div>

      <div className="relative container mx-auto px-8 py-12">
        {/* High Score Display */}
        <div className="flex justify-start mb-8">
          <div className="bg-[#ffffff] border-[4px] border-[#333] p-6 shadow-[8px_8px_0px_0px_rgba(51,51,51,1)]">
            <div className="text-[#666] text-sm font-black mb-2 tracking-wider">HIGH SCORE</div>
            <div className="text-[#FF99CC] text-4xl font-black">0 ■</div>
          </div>
        </div>

        {/* Character */}
        <div className="flex justify-center mb-6">
          <Mascot mood="happy" />
        </div>

        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4 tracking-tighter">
            <span className="text-[#333]">CAN YOU</span>{" "}
            <span className="text-[#FF99CC]">PI</span>
            <span className="text-[#FF99CC] inline-block animate-pulse" style={{animationDelay: '0.5s'}}>?</span>
          </h1>
        </div>

        {/* Game Mode Cards */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch max-w-4xl mx-auto">
          {/* Sequential Mode */}
          <Link href="/sequential" className="flex-1">
            <div className="h-full bg-[#ffffff] border-[4px] border-[#333] shadow-[8px_8px_0px_0px_rgba(51,51,51,1)] p-8 hover:shadow-[12px_12px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-100 cursor-pointer">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-[#FF99CC] border-[4px] border-[#333] mx-auto flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(51,51,51,1)]">
                    <span className="text-[#333] text-2xl font-black">123</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-[#333] mb-4 tracking-wider">SEQUENTIAL</h2>
                <p className="text-[#666] font-bold text-sm tracking-wide">Recite digits in order</p>
              </div>
            </div>
          </Link>

          {/* Quiz Mode */}
          <Link href="/quiz" className="flex-1">
            <div className="h-full bg-[#ffffff] border-[4px] border-[#333] shadow-[8px_8px_0px_0px_rgba(51,51,51,1)] p-8 hover:shadow-[12px_12px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-100 cursor-pointer">
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-24 h-24 bg-[#66CCFF] border-[4px] border-[#333] mx-auto flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(51,51,51,1)]">
                    <span className="text-[#333] text-3xl font-black">?</span>
                  </div>
                </div>
                <h2 className="text-2xl font-black text-[#333] mb-4 tracking-wider">QUIZ</h2>
                <p className="text-[#666] font-bold text-sm tracking-wide">Guess digit at position X</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
