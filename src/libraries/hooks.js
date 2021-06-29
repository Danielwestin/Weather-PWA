import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export function useDebouncedValue(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value]);
  return debouncedValue;
}

export function useDebounceFn(fn, delay = 500) {}

export function usePreviousValue(value) {
  const [savedValue, setSavedValue] = useState("");

  useEffect(() => {
    if (value !== savedValue) setSavedValue(value);
  }, [value]);

  return savedValue;
}

export function useSearchParam(key) {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);

  const value = searchParams.get(key);
  return value || "";
}
