import { useState } from "react";

export function useProductFormState() {
  const [currentStep, setCurrentStep] =
    useState(0);

  function goToPreviousStep() {
    setCurrentStep((prev) => prev - 1);
  }

  function goToNextStep() {
    setCurrentStep((prev) => prev + 1);
  }

  return {
    goToPreviousStep,
    goToNextStep,
    currentStep,
  };
}
