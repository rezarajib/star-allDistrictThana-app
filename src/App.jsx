import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import ThanaList from './components/ThanaList';
import ThanaListChittagong from './components/ThanaListChittagong';
import ThanaListRajshahi from './components/ThanaListRajshahi';
import ThanaListKhulna from './components/ThanaListKhulna';
import ThanaListBarisal from './components/ThanaListBarisal';
import ThanaListSylhet from './components/ThanaListSylhet';
import ThanaListRangpur from './components/ThanaListRangpur';
import ThanaListMymensingh from './components/ThanaListMymensingh';
import ThanaListMetropolitan from './components/ThanaListMetropolitan';

const Home = () => (
  <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
    <div className="bg-blue-50 p-4 rounded-full mb-4">
      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12" />
      </svg>
    </div>
    <h1 className="text-3xl font-extrabold text-slate-800 mb-2">বাংলাদেশ থানা মাস্টার ডাটাবেজ</h1>
    <p className="text-slate-600 max-w-md mb-6">
      সকল রেঞ্জ ও মেট্রোপলিটন এলাকার জেলা ও থানা সমূহের সম্পূর্ণ তালিকা দেখতে নিচের যেকোনো বাটনে ক্লিক করুন।
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <NavLink to="/thanas" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        ঢাকা রেঞ্জ
      </NavLink>
      <NavLink to="/thanas-chittagong" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        চট্টগ্রাম রেঞ্জ
      </NavLink>
      <NavLink to="/thanas-rajshahi" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        রাজশাহী রেঞ্জ
      </NavLink>
      <NavLink to="/thanas-khulna" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        খুলনা রেঞ্জ
      </NavLink>
      <NavLink to="/thanas-barisal" className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        বরিশাল রেঞ্জ
      </NavLink>
      <NavLink to="/thanas-sylhet" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        সিলেট রেঞ্জ
      </NavLink>
      <NavLink to="/thanas-rangpur" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        রংপুর রেঞ্জ
      </NavLink>
      <NavLink to="/thanas-mymensingh" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        ময়মনসিংহ রেঞ্জ
      </NavLink>
      <NavLink to="/thanas-metropolitan" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all">
        মেট্রোপলিটন পুলিশ
      </NavLink>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="font-bold text-lg tracking-wide text-slate-100">Thana Master</span>
            </div>

            <nav className="flex items-center gap-3 overflow-x-auto py-2">
              <NavLink to="/" end className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                হোম
              </NavLink>
              <NavLink to="/thanas" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                ঢাকা
              </NavLink>
              <NavLink to="/thanas-chittagong" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                চট্টগ্রাম
              </NavLink>
              <NavLink to="/thanas-rajshahi" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                রাজশাহী
              </NavLink>
              <NavLink to="/thanas-khulna" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-amber-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                খুলনা
              </NavLink>
              <NavLink to="/thanas-barisal" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-teal-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                বরিশাল
              </NavLink>
              <NavLink to="/thanas-sylhet" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                সিলেট
              </NavLink>
              <NavLink to="/thanas-rangpur" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-red-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                রংপুর
              </NavLink>
              <NavLink to="/thanas-mymensingh" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                ময়মনসিংহ
              </NavLink>
              <NavLink to="/thanas-metropolitan" className={({ isActive }) => `px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                মেট্রোপলিটন
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/thanas" element={<ThanaList />} />
            <Route path="/thanas-chittagong" element={<ThanaListChittagong />} />
            <Route path="/thanas-rajshahi" element={<ThanaListRajshahi />} />
            <Route path="/thanas-khulna" element={<ThanaListKhulna />} />
            <Route path="/thanas-barisal" element={<ThanaListBarisal />} />
            <Route path="/thanas-sylhet" element={<ThanaListSylhet />} />
            <Route path="/thanas-rangpur" element={<ThanaListRangpur />} />
            <Route path="/thanas-mymensingh" element={<ThanaListMymensingh />} />
            <Route path="/thanas-metropolitan" element={<ThanaListMetropolitan />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-4 text-center text-slate-500 text-sm">
          © 2026 Thana Master App. All rights reserved.
        </footer>
      </div>
    </Router>
  );
}

export default App;