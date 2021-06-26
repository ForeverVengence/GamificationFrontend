import { useEffect, useState } from 'react';

function useLocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      if (saved) return saved;
    } catch (err) {
      return initialValue;
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state, initialValue]);

  const clear = () => {
    setState(null);
    localStorage.removeItem(key);
  };

  return [state, setState, clear];
}

export default useLocalStorage;
