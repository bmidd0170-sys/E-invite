import { useState, useEffect } from 'react';

export function useRsvpState() {
  const [rsvpSent, setRsvpSent] = useState(false);

  useEffect(() => {
    // Check initial state
    const rsvpStatus = localStorage.getItem('rsvp_sent');
    if (rsvpStatus === 'true') {
      setRsvpSent(true);
    }

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rsvp_sent' && e.newValue === 'true') {
        setRsvpSent(true);
      }
    };

    // Listen for custom event (from same tab)
    const handleRsvpSuccess = () => {
      setRsvpSent(true);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rsvp_success', handleRsvpSuccess);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rsvp_success', handleRsvpSuccess);
    };
  }, []);

  return rsvpSent;
}
