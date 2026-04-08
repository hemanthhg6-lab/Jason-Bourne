import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function SoundtrackPlayer() {
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      // The user has already interacted with the document to reach this component,
      // so we can safely call play() directly.
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="absolute bottom-12 left-6 z-50 pointer-events-auto">
      <button
        onClick={toggleMute}
        className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded border border-white/10 hover:bg-white/20 transition-colors group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-treadstone-red" />
        ) : (
          <Volume2 className="w-4 h-4 text-[#00ff41]" />
        )}
        <span className={`font-mono text-[10px] tracking-widest uppercase ${isMuted ? 'text-treadstone-red' : 'text-[#00ff41]'}`}>
          OST: {isMuted ? 'MUTED' : 'PLAYING'}
        </span>
      </button>

      {/* Direct MP3 audio element for 100% reliable playback */}
      <audio
        ref={audioRef}
        src="https://archive.org/download/tvtunes_10290/The%20Bourne%20Identity.mp3"
        loop
        preload="auto"
      />
    </div>
  );
}
