import { useState, useEffect } from "react";

export function useLocalStorageState(localStorageKey, defaultValue) {
  const storedValue = localStorage.getItem(localStorageKey);
  let parsedValue;
  try {
    parsedValue = JSON.parse(storedValue);
  } catch (error) {
    parsedValue = defaultValue;
  }
  const initialValue = Array.isArray(parsedValue) ? parsedValue : defaultValue;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}
