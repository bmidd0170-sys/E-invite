'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface RSVPFormProps {
  onSuccess?: () => void;
}

export function RSVPForm({ onSuccess }: RSVPFormProps) {
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
        localStorage.setItem('rsvp_sent', 'true');

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('rsvp_success'));

        // Callback after 3 seconds
        setTimeout(() => {
          setStatus('idle');
          onSuccess?.();
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

  if (status === 'success') {
    return (
      <div className="flex items-center gap-3 text-[#C41E3A] animate-pulse">
        <CheckCircle size={24} className="flex-shrink-0" />
        <div>
          <p className="font-serif font-semibold text-foreground">{message}</p>
          <p className="text-sm text-muted-foreground">We look forward to seeing you!</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-3 text-[#DC143C]">
        <AlertCircle size={24} className="flex-shrink-0" />
        <div>
          <p className="font-serif font-semibold text-foreground">Error</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
    );
  }

  return (
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
        className="w-full bg-[#C41E3A] border border-[#C41E3A] hover:bg-[#A01830] disabled:opacity-50 disabled:cursor-not-allowed font-serif font-semibold py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#C41E3A]/30 text-white"
      >
        {isLoading ? 'Sending...' : 'Confirm RSVP'}
      </button>
    </form>
  );
}
