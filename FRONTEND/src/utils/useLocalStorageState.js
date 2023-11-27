import { useState, useEffect } from "react";

export function useLocalStorageState(localStorageKey, defaultValue) {
  const storedValue = localStorage.getItem(localStorageKey);

  let parsedValue;
  try {
    parsedValue = JSON.parse(storedValue);
  } catch (error) {
    parsedValue = null;
  }

  const initialValue = parsedValue !== null ? parsedValue : defaultValue;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [localStorageKey, value]);

  return [value, setValue];
}
