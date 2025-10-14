import { useEffect } from "react";
import { UseFormWatch, FieldValues } from "react-hook-form";

export function useFormPersistence<T extends FieldValues>(
  key: string | undefined,
  watch: UseFormWatch<T>,
  defaultValues?: T
) {
  // Load saved form data on mount
  useEffect(() => {
    if (!key) return;

    const savedData = localStorage.getItem(key);
    if (savedData && defaultValues) {
      try {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach((fieldKey) => {
          if (parsed[fieldKey] !== undefined) {
            // Form will be initialized with these values via defaultValues
          }
        });
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }
  }, [key, defaultValues]);

  // Save form data on change
  useEffect(() => {
    if (!key) return;

    const subscription = watch((value) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch, key]);

  // Clear saved data
  const clearSavedData = () => {
    if (key) {
      localStorage.removeItem(key);
    }
  };

  // Get saved data
  const getSavedData = (): T | null => {
    if (!key) return null;

    const savedData = localStorage.getItem(key);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  return { clearSavedData, getSavedData };
}
