import { useEffect, useState } from 'react';
import axios from 'axios';
import { dhakaMetroStations } from '../data/dhakaMetroStations';

const DhakaMetroStations = () => (
  <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
    <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-cyan-600 inline-block" />
        ইউনিট: ঢাকা মেট্রোপলিটন পুলিশ (Dhaka Metropolitan Police)
      </h2>
      <span className="text-xs font-semibold bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full border border-cyan-200">
        50 police stations
      </span>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <th className="py-3.5 px-6 border-r border-slate-200 w-24 text-center">ID</th>
            <th className="py-3.5 px-6 border-r border-slate-200">Police station</th>
            <th className="py-3.5 px-6 border-r border-slate-200">Latitude</th>
            <th className="py-3.5 px-6 border-r border-slate-200">Longitude</th>
            <th className="py-3.5 px-6">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-sm">
          {dhakaMetroStations.map(({ id, name, latitude, longitude }) => (
            <tr key={id} className="hover:bg-cyan-50/40 transition-colors duration-150">
              <td className="py-4 px-6 border-r border-slate-200 text-center font-bold text-slate-500">
                {id}
              </td>
              <td className="py-4 px-6 border-r border-slate-200 font-semibold text-slate-800">
                {name}
              </td>
              <td className="py-4 px-6 border-r border-slate-200 font-mono font-semibold text-slate-800">
                {latitude}
              </td>
              <td className="py-4 px-6 border-r border-slate-200 font-mono font-semibold text-slate-800">
                {longitude}
              </td>
              <td className="py-4 px-6">
                <a
                  className="text-sm font-medium text-cyan-700 underline-offset-2 hover:underline"
                  href={`https://www.google.com/maps?q=${latitude},${longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Google Maps
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

const ThanaListMetropolitan = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    axios.get('/metropolitanList.json', { signal: controller.signal })
      .then(({ data: responseData }) => {
        if (!Array.isArray(responseData?.Districts)) {
          throw new Error('Metropolitan data has an invalid format.');
        }
        setData(responseData);
      })
      .catch((requestError) => {
        if (axios.isCancel(requestError)) return;
        console.error('Metropolitan Fetch Error:', requestError);
        setError('Other metropolitan police data could not be loaded.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const otherDistricts = data?.Districts.filter(
    (district) => district.District_ID !== 'BPMPDK',
  ) ?? [];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-800 to-blue-700 text-white p-6 sm:p-8 rounded-2xl shadow-lg mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Metropolitan Police (মেট্রোপলিটন পুলিশ)
            </h1>
            <p className="text-cyan-100 mt-1 text-sm sm:text-base font-medium">
              Range ID: <span className="font-bold underline">BPMP</span>
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl text-center border border-white/20">
            <span className="text-xs uppercase text-cyan-100 font-semibold block">Total Units</span>
            <span className="text-2xl font-black text-white">8</span>
          </div>
        </div>

        <DhakaMetroStations />

        {loading && (
          <div className="flex justify-center items-center min-h-40 bg-white p-6 rounded-xl border border-slate-200 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-base font-semibold text-slate-700">
                Loading other metropolitan police data…
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-6 py-4 rounded-xl mb-8" role="alert">
            <p className="font-semibold">{error}</p>
            <p className="mt-1 text-sm">The Dhaka Metropolitan Police station list above is available.</p>
          </div>
        )}

        {otherDistricts.map((district) => (
          <section
            key={district.District_ID}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 transition-shadow hover:shadow-md"
          >
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-cyan-600 inline-block" />
                ইউনিট: {district.District_Name_Bn} ({district.District_Name_En})
              </h2>
              <span className="text-xs font-semibold bg-cyan-50 text-cyan-700 px-3 py-1 rounded-full border border-cyan-200">
                ইউনিট আইডি: {district.District_ID}
              </span>
            </div>

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
                  {district.Thanas?.map((thana) => (
                    <tr key={thana.Thana_ID} className="hover:bg-cyan-50/40 transition-colors duration-150">
                      <td className="py-4 px-6 border-r border-slate-200 text-center font-bold text-slate-500">
                        {thana.Thana_Number}
                      </td>
                      <td className="py-4 px-6 border-r border-slate-200 font-medium text-slate-800">
                        {thana.Thana_Name_Bn}
                      </td>
                      <td className="py-4 px-6 border-r border-slate-200 font-medium text-slate-700">
                        {thana.Thana_Name_En}
                      </td>
                      <td className="py-4 px-6 font-mono font-semibold text-cyan-700">
                        {thana.Thana_ID}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ThanaListMetropolitan;
