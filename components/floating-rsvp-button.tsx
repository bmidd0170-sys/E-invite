'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, X } from 'lucide-react';

export function FloatingRsvpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/send-rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for your RSVP!');
        setEmail('');
        setName('');
        
        // Auto-close after 3 seconds
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
        setMessage('Failed to send RSVP. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          {status === 'success' ? (
            <div className="flex items-center gap-3 text-[#C41E3A] animate-pulse">
              <CheckCircle size={24} className="flex-shrink-0" />
              <div>
                <p className="font-serif font-semibold text-foreground">{message}</p>
                <p className="text-sm text-muted-foreground">We look forward to seeing you!</p>
              </div>
            </div>
          ) : status === 'error' ? (
            <div className="flex items-center gap-3 text-[#DC143C]">
              <AlertCircle size={24} className="flex-shrink-0" />
              <div>
                <p className="font-serif font-semibold text-foreground">Error</p>
                <p className="text-sm text-muted-foreground">{message}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif text-lg font-semibold text-foreground">RSVP for Event</h3>
              
              <div>
                <label className="block text-sm font-serif font-medium text-muted-foreground mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-foreground placeholder-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-serif font-medium text-muted-foreground mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] text-foreground placeholder-muted-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent transition"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#C41E3A] to-[#8B0000] hover:from-[#8B0000] hover:to-[#C41E3A] disabled:opacity-50 disabled:cursor-not-allowed text-white font-serif font-semibold py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#C41E3A]/20"
              >
                {isLoading ? 'Sending...' : 'Confirm RSVP'}
              </button>
            </form>
          )}

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
