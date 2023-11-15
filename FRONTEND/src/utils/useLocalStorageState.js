import { useState, useEffect } from "react";

export function useLocalStorageState(localStorageKey, defaultValue) {
  const initialValue =
    JSON.parse(localStorage.getItem(localStorageKey)) || defaultValue;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
} 