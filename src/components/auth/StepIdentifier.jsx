import React, { useState } from 'react';

export default function StepIdentifier({ onNext }) {
  const [identifier, setIdentifier] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    let type = 'username';
    if (identifier.includes('@') && identifier.includes('.')) {
      type = 'email';
    } else if (/^\d+$/.test(identifier)) {
      type = 'phone';
    }

    onNext(identifier, type);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-slate-800 text-center">লগইন / রেজিস্ট্রেশন</h3>
      <input
        type="text"
        placeholder="ইমেইল, ফোন নম্বর বা ইউজারনেম দিন"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
        required
      />
      <button 
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        এগিয়ে যান
      </button>
    </form>
  );
}