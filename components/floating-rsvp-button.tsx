'use client';

import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { useRsvpState } from '@/hooks/use-rsvp-state';
import { RSVPForm } from './rsvp-form';

export function FloatingRsvpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const rsvpSent = useRsvpState();

  if (rsvpSent) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-br from-[#C41E3A] to-[#8B0000] hover:from-[#8B0000] hover:to-[#C41E3A] text-white rounded-full px-6 py-3 font-serif font-semibold shadow-lg shadow-[#C41E3A]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#C41E3A]/50"
        aria-label="RSVP"
      >
        <Mail size={20} />
        <span>RSVP</span>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-[#111111] rounded-lg shadow-2xl shadow-[#C41E3A]/30 p-6 border border-[#2a2a2a]">
          <RSVPForm
            onSuccess={() => {
              setIsOpen(false);
            }}
          />

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
