'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Mascot from '../components/Mascot';

export default function SequentialMode() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const [mode, setMode] = useState<'standard' | 'custom'>('standard');
  const [customStart, setCustomStart] = useState('1');
  const [startPosition, setStartPosition] = useState(1);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [piDigits, setPiDigits] = useState('');
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const digitsEndRef = useRef<HTMLDivElement>(null);
  // Ref-based lock to prevent concurrent API calls (avoids stale closure issues)
  const processingRef = useRef(false);
  const digitQueueRef = useRef<string[]>([]);
  const gameIdRef = useRef<string | null>(null);
  const inputRef = useRef('');
  const errorRef = useRef(false);

  // Load Pi digits from file on component mount
  useEffect(() => {
    fetch('/pi.txt')
      .then(res => res.text())
      .then(text => {
        // Remove any whitespace, newlines, and the "3." prefix if present
        const digits = text.replace(/\s/g, '').replace(/^3\./, '');
        setPiDigits(digits);
      })
      .catch(err => console.error('Failed to load Pi digits:', err));
  }, []);

  // Update high score in localStorage when score changes
  useEffect(() => {
    if (score > 0) {
      const currentHighScore = parseInt(localStorage.getItem('piHighScore') || '0');
      if (score > currentHighScore) {
        localStorage.setItem('piHighScore', score.toString());
      }
    }
  }, [score]);

  const startGame = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('https://can-you-pi-1041928881529.us-central1.run.app/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: mode === 'standard' ? 1 : 2,
          start_position: mode === 'custom' ? parseInt(customStart) : 1
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.game_id) {
        throw new Error('No game ID received from server');
      }
      
      setGameId(data.game_id);
      gameIdRef.current = data.game_id;
      inputRef.current = '';
      errorRef.current = false;
      processingRef.current = false;
      digitQueueRef.current = [];
      setStartPosition(data.current_position);
      setGameStarted(true);
      setInput('');
      setScore(0);
      setError(false);
      
      console.log('Game started with ID:', data.game_id);
      console.log('Start position:', data.current_position);
      
      setTimeout(() => hiddenInputRef.current?.focus(), 100);
    } catch (error) {
      console.error('Start game error:', error);
      setErrorMessage('Failed to start game. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll digit display to show the latest digit
  useEffect(() => {
    digitsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
  }, [input]);

  // Process one digit at a time from the queue, using refs to avoid stale closures
  const processQueue = useCallback(async () => {
    if (processingRef.current) return;
    if (digitQueueRef.current.length === 0) return;
    if (errorRef.current) return;
    if (!gameIdRef.current) return;

    processingRef.current = true;
    setIsLoading(true);

    const digit = digitQueueRef.current.shift()!;

    try {
      const response = await fetch(`https://can-you-pi-1041928881529.us-central1.run.app/api/game/${gameIdRef.current}/play`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: digit })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.correct) {
        inputRef.current = inputRef.current + digit;
        setInput(inputRef.current);
        setScore(inputRef.current.length);
      } else {
        errorRef.current = true;
        setError(true);
        setErrorMessage(`Wrong! Expected: ${data.expected_digit}`);
        setScore(inputRef.current.length);
        digitQueueRef.current = []; // Clear remaining queued digits
      }
    } catch (err) {
      console.error('Error checking digit:', err);
      errorRef.current = true;
      setErrorMessage('Error checking digit');
      setError(true);
      digitQueueRef.current = [];
    } finally {
      processingRef.current = false;
      setIsLoading(false);
      // Process next digit in queue if any
      if (digitQueueRef.current.length > 0 && !errorRef.current) {
        processQueue();
      }
    }
  }, []);

  const handleDigitPress = useCallback((digit: string) => {
    if (errorRef.current) return;
    if (!/^\d$/.test(digit)) return;
    digitQueueRef.current.push(digit);
    processQueue();
  }, [processQueue]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (errorRef.current) return;
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      handleDigitPress(e.key);
    }
    // Prevent backspace/delete
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
    }
  }, [handleDigitPress]);

  const reset = () => {
    setGameStarted(false);
    setGameId(null);
    setInput('');
    setScore(0);
    setError(false);
    setErrorMessage('');
    // Reset refs
    processingRef.current = false;
    digitQueueRef.current = [];
    gameIdRef.current = null;
    inputRef.current = '';
    errorRef.current = false;
  };

  return (
    <div className="min-h-screen bg-[#ffffff] font-mono relative overflow-x-hidden selection:bg-[#FF99CC] selection:text-white flex flex-col">
      <div className="absolute inset-0 opacity-5" 
           style={{
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>
      <div className="relative container mx-auto px-4 sm:px-8 py-4 sm:py-6 max-w-4xl flex-1 flex flex-col">
        <Link href="/">
          <button className="bg-[#ffffff] border-[4px] border-[#333] px-4 sm:px-6 py-2 sm:py-3 font-black shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 mb-4">
            ← BACK
          </button>
        </Link>
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-2 tracking-tighter">
            <span className="text-[#FF99CC]">SEQUENTIAL</span>{" "}
            <span className="text-[#333]">MODE</span>
          </h1>
          <p className="text-[#666] font-bold text-xs sm:text-sm tracking-wide">Recite digits of Pi in order</p>
        </div>
        <div className="flex flex-col items-center flex-1">
          {!gameStarted ? (
            <div className="bg-[#ffffff] border-[4px] border-[#333] shadow-[8px_8px_0px_0px_rgba(51,51,51,1)] p-4 sm:p-8 max-w-2xl w-full">
              <div className="flex flex-col items-center mb-6">
                <Mascot mood="happy" />
                <h2 className="text-lg font-black text-[#333]">SEQUENTIAL CHALLENGE</h2>
              </div>
              <div className="space-y-4 mb-6">
                <div onClick={() => setMode('standard')} className={`border-[4px] p-4 cursor-pointer transition-all ${mode === 'standard' ? 'border-[#FF99CC] bg-[#FF99CC] bg-opacity-10' : 'border-[#333] hover:border-[#666]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 border-[3px] border-[#333] flex items-center justify-center ${mode === 'standard' ? 'bg-[#FF99CC]' : 'bg-white'}`}>
                      {mode === 'standard' && <span className="text-white text-lg font-black">✓</span>}
                    </div>
                    <div>
                      <div className="font-black text-[#333]">STANDARD</div>
                      <div className="text-sm text-[#666]">Start from position 1</div>
                    </div>
                  </div>
                </div>
                <div onClick={() => setMode('custom')} className={`border-[4px] p-4 cursor-pointer transition-all ${mode === 'custom' ? 'border-[#FF99CC] bg-[#FF99CC] bg-opacity-10' : 'border-[#333] hover:border-[#666]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 border-[3px] border-[#333] flex items-center justify-center ${mode === 'custom' ? 'bg-[#FF99CC]' : 'bg-white'}`}>
                      {mode === 'custom' && <span className="text-white text-lg font-black">✓</span>}
                    </div>
                    <div>
                      <div className="font-black text-[#333]">CUSTOM START</div>
                      <div className="text-sm text-[#666]">Choose your starting position</div>
                    </div>
                  </div>
                </div>
              </div>
              {mode === 'custom' && (
                <div className="mb-6">
                  <label className="block font-black text-[#333] mb-2">START POSITION:</label>
                  <input type="number" min="1" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="w-full border-[4px] border-[#333] p-3 font-black text-2xl text-center focus:outline-none focus:border-[#FF99CC]" placeholder="1" />
                </div>
              )}
              <button onClick={startGame} disabled={isLoading} className="w-full bg-[#FF99CC] border-[4px] border-[#333] py-4 font-black text-xl shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 disabled:opacity-50">
                {isLoading ? 'LOADING...' : 'START RUN'}
              </button>
              {errorMessage && !gameStarted && (
                <div className="mt-4 p-4 bg-[#FFB6C1] border-[3px] border-[#333] font-bold text-sm">{errorMessage}</div>
              )}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center">
              <Mascot mood="sad" />
              <h2 className="text-xl font-black text-[#FF6666] mb-4">SYSTEM ERROR!</h2>
              <div className="bg-white border-[4px] border-[#333] p-8 mb-8 text-center shadow-[4px_4px_0px_0px_rgba(51,51,51,1)]">
                <p className="text-xs font-black mb-2 text-gray-400">SCORE</p>
                <p className="text-5xl font-black text-[#333]">{score}</p>
              </div>
              <p className="text-sm font-bold text-[#666] mb-6">{errorMessage}</p>
              <button onClick={reset} className="bg-[#FF6666] border-[4px] border-[#333] px-12 py-4 font-black text-xl text-white shadow-[4px_4px_0px_0px_rgba(51,51,51,1)] hover:shadow-[6px_6px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100">
                REBOOT RUN
              </button>
            </div>
          ) : (
            <div className="w-full max-w-4xl flex flex-col items-center flex-1" onClick={() => hiddenInputRef.current?.focus()}>
              {/* Hidden input for keyboard capture (desktop) */}
              <input
                ref={hiddenInputRef}
                type="text"
                inputMode="none"
                value=""
                onChange={() => {}}
                onKeyDown={handleKeyDown}
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                aria-hidden="true"
                autoFocus
              />

              <Mascot mood={input.length > 0 ? 'thinking' : 'happy'} />

              {/* Score Counter */}
              <div className="mb-4 sm:mb-6 text-center bg-white border-[4px] border-[#333] p-3 sm:p-6 shadow-[4px_4px_0px_0px_rgba(51,51,51,1)]">
                <span className="text-xs font-black text-[#FF99CC] uppercase block mb-1">LIVE PROGRESS</span>
                <div className="text-4xl sm:text-6xl font-black text-[#333]">{input.length}</div>
              </div>

              {/* Digit Display Area */}
              <div className="w-full bg-[#f8f8f8] border-[4px] border-[#333] p-3 sm:p-6 relative min-h-[100px] sm:min-h-[160px] max-h-[160px] sm:max-h-[220px] overflow-y-auto flex flex-wrap gap-1.5 sm:gap-2 justify-center content-start shadow-[4px_4px_0px_0px_rgba(51,51,51,1)]">
                {/* Fixed "3" and "." prefix */}
                <div className="w-9 h-11 sm:w-12 sm:h-16 bg-[#E5E5E5] border-[3px] sm:border-[4px] border-[#333] flex items-center justify-center text-lg sm:text-2xl font-black text-[#333]">
                  3
                </div>
                <div className="w-9 h-11 sm:w-12 sm:h-16 bg-[#E5E5E5] border-[3px] sm:border-[4px] border-[#333] flex items-center justify-center text-lg sm:text-2xl font-black text-[#333]">
                  .
                </div>
                
                {/* Previous digits (for custom start position) */}
                {startPosition > 1 && piDigits && piDigits.slice(0, startPosition - 1).split('').map((char, i) => (
                  <div key={`prev-${i}`} className="w-9 h-11 sm:w-12 sm:h-16 bg-[#E5E5E5] border-[3px] sm:border-[4px] border-[#333] flex items-center justify-center text-lg sm:text-2xl font-black text-[#999]">
                    {char}
                  </div>
                ))}
                
                {input.split('').map((char, i) => (
                  <div key={i} className="w-9 h-11 sm:w-12 sm:h-16 bg-[#99FF99] border-[3px] sm:border-[4px] border-[#333] flex items-center justify-center text-lg sm:text-2xl font-black">{char}</div>
                ))}
                <div className="w-9 h-11 sm:w-12 sm:h-16 bg-[#FF99CC] border-[3px] sm:border-[4px] border-[#333] flex items-center justify-center text-lg sm:text-2xl font-black animate-pulse text-white">?</div>
                <div ref={digitsEndRef} />
              </div>

              {/* Numpad */}
              <div className="w-full mt-3 sm:mt-4">
                <p className="text-center text-xs text-[#666] font-bold mb-2">TAP A DIGIT (0–9) OR USE YOUR KEYBOARD:</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-xs mx-auto">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                    <button
                      key={digit}
                      onClick={(e) => { e.stopPropagation(); handleDigitPress(digit.toString()); }}
                      disabled={isLoading}
                      className="bg-[#FF99CC] border-[3px] border-[#333] py-3 sm:py-4 font-black text-xl sm:text-2xl shadow-[3px_3px_0px_0px_rgba(51,51,51,1)] hover:shadow-[5px_5px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                    >
                      {digit}
                    </button>
                  ))}
                  <div></div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDigitPress('0'); }}
                    disabled={isLoading}
                    className="bg-[#FF99CC] border-[3px] border-[#333] py-3 sm:py-4 font-black text-xl sm:text-2xl shadow-[3px_3px_0px_0px_rgba(51,51,51,1)] hover:shadow-[5px_5px_0px_0px_rgba(51,51,51,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-100 disabled:opacity-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    0
                  </button>
                  <div></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
