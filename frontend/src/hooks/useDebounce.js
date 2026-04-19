import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after `delay` ms of
 * inactivity.  Use for search inputs so expensive filter memos don't fire on
 * every keystroke.
 *
 * @param {*}      value - The value to debounce.
 * @param {number} delay - Debounce delay in milliseconds (default 250).
 * @returns The debounced value.
 */
export function useDebounce(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
