'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QuizMode() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [position, setPosition] = useState<number | null>(null);
  const [maxPosition, setMaxPosition] = useState('100');
  const [customPosition, setCustomPosition] = useState('');
  const [useCustomPosition, setUseCustomPosition] = useState(false);
  const [currentGuess, setCurrentGuess] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [expectedDigit, setExpectedDigit] = useState<string | null>(null);

  const startQuiz = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      const response = await fetch('http://localhost:8000/api/quiz/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position: useCustomPosition ? parseInt(customPosition) : null,
          max_position: parseInt(maxPosition)
        })
      });
      
      const data = await response.json();
      setQuizId(data.quiz_id);
      setPosition(data.position);
      setMessage(data.message);
      setQuizStarted(true);
    } catch (error) {
      setMessage('Failed to start quiz. Is the backend running?');
    }
    setIsLoading(false);
  };

  const checkGuess = async (guess: string) => {
    if (!quizId || isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/quiz/${quizId}/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess })
      });
      
      const data = await response.json();
      setWasCorrect(data.correct);
      setExpectedDigit(data.expected_digit);
      setMessage(data.message);
      setQuizComplete(true);
    } catch (error) {
      setMessage('Error checking guess');
    }
    setIsLoading(false);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizId(null);
    setPosition(null);
    setCurrentGuess('');
    setMessage('');
    setQuizComplete(false);
    setWasCorrect(false);
    setExpectedDigit(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentGuess.length === 1) {
      checkGuess(currentGuess);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-mono relative overflow-hidden selection:bg-[#FF99CC] selection:text-white">
      {/* Grid Background Pattern */}
      <div className="absolute inset-0 opacity-5" 
           style={{
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>
      
      <div className="relative container mx-auto px-8 py-12 max-w-3xl">
        {/* Back Button */}
        <Link href="/">
          <button className="bg-[#ffffff] border-[4px] border-[#333] px-6 py-3 font-black shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 mb-8">
            ← BACK
          </button>
        </Link>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 tracking-tighter">
            <span className="text-[#66CCFF]">QUIZ</span>{" "}
            <span className="text-[#333]">MODE</span>
          </h1>
          <p className="text-[#666] font-bold text-sm tracking-wide">Guess the digit at a specific position</p>
        </div>

        {!quizStarted ? (
          /* Start Quiz Screen */
          <div className="bg-[#ffffff] border-[4px] border-[#333] shadow-[8px_8px_0px_0px_rgba(51,51,51,1)] p-8">
            <h2 className="text-2xl font-black text-[#333] mb-6">SETUP QUIZ</h2>
            
            {/* Position Selection */}
            <div className="space-y-4 mb-6">
              <div 
                onClick={() => setUseCustomPosition(false)}
                className={`border-[4px] p-4 cursor-pointer transition-all ${
                  !useCustomPosition 
                    ? 'border-[#66CCFF] bg-[#66CCFF] bg-opacity-10' 
                    : 'border-[#333] hover:border-[#666]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 border-[3px] border-[#333] flex items-center justify-center ${!useCustomPosition ? 'bg-[#66CCFF]' : 'bg-white'}`}>
                    {!useCustomPosition && <span className="text-white text-lg font-black">✓</span>}
                  </div>
                  <div>
                    <div className="font-black text-[#333]">RANDOM POSITION</div>
                    <div className="text-sm text-[#666]">System picks a random position</div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => setUseCustomPosition(true)}
                className={`border-[4px] p-4 cursor-pointer transition-all ${
                  useCustomPosition 
                    ? 'border-[#66CCFF] bg-[#66CCFF] bg-opacity-10' 
                    : 'border-[#333] hover:border-[#666]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 border-[3px] border-[#333] flex items-center justify-center ${useCustomPosition ? 'bg-[#66CCFF]' : 'bg-white'}`}>
                    {useCustomPosition && <span className="text-white text-lg font-black">✓</span>}
                  </div>
                  <div>
                    <div className="font-black text-[#333]">CHOOSE POSITION</div>
                    <div className="text-sm text-[#666]">Select a specific position</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Max Position Input */}
            <div className="mb-4">
              <label className="block font-black text-[#333] mb-2">MAX POSITION RANGE:</label>
              <input
                type="number"
                min="1"
                value={maxPosition}
                onChange={(e) => setMaxPosition(e.target.value)}
                className="w-full border-[4px] border-[#333] p-3 font-black text-2xl text-center focus:outline-none focus:border-[#66CCFF]"
                placeholder="100"
              />
              <p className="text-xs text-[#666] mt-2">Random positions will be between 1 and this number</p>
            </div>

            {/* Custom Position Input */}
            {useCustomPosition && (
              <div className="mb-6">
                <label className="block font-black text-[#333] mb-2">SPECIFIC POSITION:</label>
                <input
                  type="number"
                  min="1"
                  max={maxPosition}
                  value={customPosition}
                  onChange={(e) => setCustomPosition(e.target.value)}
                  className="w-full border-[4px] border-[#333] p-3 font-black text-2xl text-center focus:outline-none focus:border-[#66CCFF]"
                  placeholder="42"
                />
              </div>
            )}

            {/* Start Button */}
            <button
              onClick={startQuiz}
              disabled={isLoading || (useCustomPosition && !customPosition)}
              className="w-full bg-[#66CCFF] border-[4px] border-[#333] py-4 font-black text-xl shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'STARTING...' : 'START QUIZ'}
            </button>

            {message && (
              <div className="mt-4 p-4 bg-[#FFFF66] border-[3px] border-[#333] font-bold text-sm">
                {message}
              </div>
            )}
          </div>
        ) : (
          /* Quiz Screen */
          <div className="space-y-6">
            {!quizComplete ? (
              <>
                {/* Question Display */}
                <div className="bg-[#ffffff] border-[4px] border-[#333] shadow-[8px_8px_0px_0px_rgba(51,51,51,1)] p-8 text-center">
                  <div className="text-sm text-[#666] font-black mb-4">QUESTION:</div>
                  <h2 className="text-3xl font-black text-[#333] mb-2">
                    What is the digit at position{' '}
                    <span className="text-[#66CCFF]">{position}</span>?
                  </h2>
                  <p className="text-sm text-[#666]">(After the decimal point)</p>
                </div>

                {/* Input Area */}
                <div className="bg-[#ffffff] border-[4px] border-[#333] shadow-[8px_8px_0px_0px_rgba(51,51,51,1)] p-6">
                  <label className="block text-sm text-[#666] font-black mb-2">YOUR GUESS:</label>
                  <input
                    type="text"
                    maxLength={1}
                    value={currentGuess}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d$/.test(val)) {
                        setCurrentGuess(val);
                      }
                    }}
                    onKeyPress={handleKeyPress}
                    disabled={isLoading}
                    className="w-full border-[4px] border-[#333] p-6 font-black text-6xl text-center focus:outline-none focus:border-[#66CCFF] mb-4"
                    placeholder="?"
                    autoFocus
                  />
                  
                  <div className="grid grid-cols-5 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                      <button
                        key={digit}
                        onClick={() => checkGuess(digit.toString())}
                        disabled={isLoading}
                        className="bg-[#66CCFF] border-[3px] border-[#333] py-4 font-black text-xl shadow-[3px_3px_0px_0px_rgba(51,51,51,1)] hover:shadow-[5px_5px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 disabled:opacity-50"
                      >
                        {digit}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Result Screen */
              <div className={`bg-[#ffffff] border-[4px] border-[#333] shadow-[8px_8px_0px_0px_rgba(51,51,51,1)] p-8 text-center ${
                wasCorrect ? 'border-[#90EE90]' : 'border-[#FFB6C1]'
              }`}>
                <div className="mb-6">
                  {/* Mascot */}
                  {wasCorrect && (
                    <div className="flex justify-center mb-6">
                      <div className="relative w-24 h-24 animate-bounce flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#FF99CC] border-[4px] border-[#333] relative flex items-center justify-center">
                          {/* Eyes */}
                          <div className="absolute top-5 left-5 w-2.5 h-2.5 bg-[#333]"></div>
                          <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-[#333]"></div>
                          
                          {/* Happy Mouth */}
                          <div className="absolute bottom-5 w-5 h-[3px] bg-[#333]"></div>
                          
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
                    </div>
                  )}
                  {!wasCorrect && (
                    <div className="flex justify-center mb-6">
                      <div className="relative w-24 h-24 animate-bounce flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#FF99CC] border-[4px] border-[#333] relative flex items-center justify-center">
                          {/* Eyes */}
                          <div className="absolute top-5 left-5 w-2.5 h-2.5 bg-[#333]"></div>
                          <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-[#333]"></div>
                          
                          {/* Sad Mouth */}
                          <div className="absolute bottom-6 w-3 h-2 border-t-[3px] border-[#333]"></div>
                          
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
                    </div>
                  )}
                  <h2 className={`text-4xl font-black mb-4 ${
                    wasCorrect ? 'text-[#90EE90]' : 'text-[#FFB6C1]'
                  }`}>
                    {wasCorrect ? 'CORRECT!' : 'WRONG!'}
                  </h2>
                  
                  <div className="text-lg text-[#666] mb-4">
                    <p className="mb-2">Position: <span className="font-black text-[#66CCFF]">{position}</span></p>
                    <p className="mb-2">Your guess: <span className="font-black text-[#333]">{currentGuess}</span></p>
                    {!wasCorrect && expectedDigit && (
                      <p>Correct answer: <span className="font-black text-[#90EE90]">{expectedDigit}</span></p>
                    )}
                  </div>
                  
                  <p className="text-sm text-[#666] italic">{message}</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetQuiz}
                    className="bg-[#66CCFF] border-[4px] border-[#333] px-8 py-4 font-black text-xl shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100"
                  >
                    TRY AGAIN
                  </button>
                  <Link href="/">
                    <button className="bg-[#FF99CC] border-[4px] border-[#333] px-8 py-4 font-black text-xl shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100">
                      HOME
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
