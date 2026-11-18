import React, { useState } from 'react';
import StepIdentifier from './StepIdentifier';
import StepLogin from './StepLogin';
import StepRegister from './StepRegister';

export default function AuthModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [inputType, setInputType] = useState('');

  // Jodi modal open na hoi to kain render nahi thaay
  if (!isOpen) return null;

  const handleNext = (inputVal, type) => {
    setIdentifier(inputVal);
    setInputType(type);
    
    // Demo user check: true hoy to Login, false hoy to Register
    const isUserExists = false; 
    setStep(isUserExists ? 2 : 3);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl"
        >
          ✕
        </button>

        {/* Steps rendering */}
        {step === 1 && <StepIdentifier onNext={handleNext} />}
        {step === 2 && <StepLogin identifier={identifier} onClose={onClose} />}
        {step === 3 && <StepRegister identifier={identifier} type={inputType} onClose={onClose} />}
      </div>
    </div>
  );
}