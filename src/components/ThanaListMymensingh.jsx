import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ThanaListMymensingh = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/mymensinghList.json')
      .then((response) => {
        if (typeof response.data === 'string') {
          throw new Error("JSON file pawa jayni!");
        }
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch Error: ", err);
        setError('Data load korte somossa hoyeche!');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="flex items-center gap-3 bg-white p-6 rounded-xl shadow-md border border-slate-100">
          <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-semibold text-slate-700">Mymensingh Range Data load hocche...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold">{error}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-800 to-purple-700 text-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {data?.Range_Name_Bn} ({data?.Range_Name_En})
            </h1>
            <p className="text-indigo-100 mt-1 text-sm sm:text-base font-medium">
              রেঞ্জ আইডি: <span className="font-bold underline">{data?.Range_ID}</span>
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl text-center border border-white/20">
            <span className="text-xs uppercase text-indigo-100 font-semibold block">Total Districts</span>
            <span className="text-2xl font-black text-white">{data?.Districts?.length || 0}</span>
          </div>
        </div>

        {/* Districts Tables */}
        {data?.Districts && data.Districts.map((district, dIndex) => (
          <div 
            key={dIndex} 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-shadow hover:shadow-md"
          >
            {/* District Header */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
                জেলা: {district.District_Name_Bn} ({district.District_Name_En})
              </h2>
              <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
                জেলা আইডি: {district.District_ID}
              </span>
            </div>

            {/* Table Area */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    <th className="py-3.5 px-6 border-r border-slate-200 w-24 text-center">থানা নম্বর</th>
                    <th className="py-3.5 px-6 border-r border-slate-200">থানার নাম (বাংলা)</th>
                    <th className="py-3.5 px-6 border-r border-slate-200">Thana Name (English)</th>
                    <th className="py-3.5 px-6">Thana ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm">
                  {district.Thanas && district.Thanas.map((thana, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-indigo-50/40 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 border-r border-slate-200 text-center font-bold text-slate-500">
                        {thana.Thana_Number}
                      </td>
                      <td className="py-4 px-6 border-r border-slate-200 font-medium text-slate-800">
                        {thana.Thana_Name_Bn}
                      </td>
                      <td className="py-4 px-6 border-r border-slate-200 font-medium text-slate-700">
                        {thana.Thana_Name_En}
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-indigo-700">
                        {thana.Thana_ID}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThanaListMymensingh;