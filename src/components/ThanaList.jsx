import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './ThanaList.css';

const ThanaMap = lazy(() => import('./ThanaMap.jsx'));

function Icon({ name, size = 18 }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>,
    list: <><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>,
    map: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" /><path d="M9 3v15m6-12v15" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    external: <><path d="M14 3h7v7m0-7L10 14" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>,
    station: <><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" /><path d="M9 10h.01M15 10h.01" /></>,
    refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.5 9A7 7 0 0 1 17 6l3 6M4 12l3 6a7 7 0 0 0 11.5-3" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function normalizeDhakaData(responseData) {
  if (Array.isArray(responseData)) {
    const isStationArray = responseData.length === 50
      && responseData.every((station) => (
        Number.isInteger(station?.id)
        && typeof station.name === 'string'
        && Number.isFinite(station.latitude)
        && Number.isFinite(station.longitude)
      ));

    if (!isStationArray) {
      throw new Error('The Dhaka DMP data must contain 50 valid police stations.');
    }

    return {
      Range_Name_Bn: 'ঢাকা মেট্রোপলিটন পুলিশ',
      Range_Name_En: 'Dhaka Metropolitan Police',
      Range_ID: 'BPMPDK',
      Districts: [{
        District_Name_Bn: 'ঢাকা মেট্রোপলিটন পুলিশ',
        District_Name_En: 'Dhaka Metropolitan Police',
        District_ID: 'BPMPDK',
        Thanas: responseData.map((station) => ({
          Thana_Number: station.id,
          Thana_Name_Bn: '',
          Thana_Name_En: station.name,
          Thana_ID: station.id,
          Latitude: station.latitude,
          Longitude: station.longitude,
        })),
      }],
    };
  }

  const isRangeData = responseData
    && Array.isArray(responseData.Districts)
    && responseData.Districts.every((district) => (
      Array.isArray(district.Thanas)
      && district.Thanas.every((thana) => (
        typeof thana.Thana_Name_En === 'string'
        && typeof thana.Thana_ID === 'string'
        && Number.isFinite(thana.Thana_Number)
        && Number.isFinite(thana.Latitude)
        && Number.isFinite(thana.Longitude)
      ))
    ));

  if (!isRangeData) {
    throw new Error('The Dhaka data file has an invalid format.');
  }

  return responseData;
}

function ThanaCard({ thana, district, onCopy, copied }) {
  const mapsUrl = `https://www.google.com/maps?q=${thana.Latitude},${thana.Longitude}`;
  const displayNameBn = thana.Thana_Name_Bn || thana.Thana_Name_En;
  const hasSeparateEnglishName = thana.Thana_Name_Bn
    && thana.Thana_Name_Bn !== thana.Thana_Name_En;

  return (
    <article className="thana-card">
      <div className="thana-card-top">
        <span className="thana-number">#{String(thana.Thana_Number).padStart(2, '0')}</span>
        <span className="thana-id">{thana.Thana_ID}</span>
      </div>
      <div className="thana-card-names">
        <h3 lang={thana.Thana_Name_Bn ? 'bn' : 'en'}>{displayNameBn}</h3>
        {hasSeparateEnglishName && <p>{thana.Thana_Name_En}</p>}
      </div>
      <div className="thana-card-details">
        <div className="thana-detail">
          <span className="detail-icon"><Icon name="station" size={16} /></span>
          <span>
            <small>District · জেলা</small>
            <strong>{district.District_Name_En}</strong>
            <span lang="bn">{district.District_Name_Bn}</span>
          </span>
        </div>
        <div className="thana-detail">
          <span className="detail-icon"><Icon name="pin" size={16} /></span>
          <div className="coordinate-pair">
            <span className="coordinate-axis">
              <small>Latitude</small>
              <strong className="coordinate-value">{thana.Latitude.toFixed(4)}</strong>
            </span>
            <span className="coordinate-axis">
              <small>Longitude</small>
              <strong className="coordinate-value">{thana.Longitude.toFixed(4)}</strong>
            </span>
          </div>
        </div>
      </div>
      <div className="thana-card-actions">
        <button className="button button-secondary" type="button" onClick={() => onCopy(thana)}>
          <Icon name="copy" size={16} />
          {copied ? 'Copied!' : 'Copy ID / coords'}
        </button>
        <a className="button button-map-link" href={mapsUrl} target="_blank" rel="noreferrer">
          <Icon name="external" size={15} />
          Google Maps
        </a>
      </div>
    </article>
  );
}

function ThanaList() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [view, setView] = useState('grid');
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );
  const [copiedId, setCopiedId] = useState('');
  const [copyError, setCopyError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    axios.get('/dhakaList.json', { signal: controller.signal })
      .then(({ data: responseData }) => {
        setData(normalizeDhakaData(responseData));
      })
      .catch((requestError) => {
        if (axios.isCancel(requestError)) return;
        console.error('Unable to load Dhaka range data:', requestError);
        setError('We couldn’t load the Dhaka Range data. Please try again.');
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [retry]);

  const allThanas = useMemo(
    () => data?.Districts.flatMap((district) => (
      district.Thanas.map((thana) => ({ ...thana, district }))
    )) ?? [],
    [data],
  );

  const filteredThanas = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return allThanas.filter(({ district, ...thana }) => {
      const matchesDistrict = !districtFilter || district.District_ID === districtFilter;
      const matchesSearch = !query || [
        thana.Thana_Name_Bn,
        thana.Thana_Name_En,
        thana.Thana_ID,
      ].some((value) => String(value ?? '').toLocaleLowerCase().includes(query));
      return matchesDistrict && matchesSearch;
    });
  }, [allThanas, districtFilter, search]);

  async function copyThanaDetails(thana) {
    const value = `${thana.Thana_ID} · ${thana.Latitude}, ${thana.Longitude}`;
    setCopyError('');
    try {
      await navigator.clipboard.writeText(value);
      setCopiedId(thana.Thana_ID);
      window.setTimeout(() => setCopiedId(''), 1800);
    } catch (clipboardError) {
      console.error('Unable to copy thana details:', clipboardError);
      setCopyError('Clipboard access is unavailable. Please copy the ID and coordinates manually.');
    }
  }

  if (loading) {
    return (
      <div className="dhaka-dashboard" data-theme={darkMode ? 'dark' : 'light'}>
        <div className="dashboard-state">
          <span className="loading-spinner" />
          <span>Loading Dhaka Range data…</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="dhaka-dashboard" data-theme={darkMode ? 'dark' : 'light'}>
        <div className="dashboard-state error-state" role="alert">
          <strong>{error || 'Dhaka Range data is unavailable.'}</strong>
          <button className="button button-primary" type="button" onClick={() => {
            setLoading(true);
            setError('');
            setRetry((value) => value + 1);
          }}>
            <Icon name="refresh" size={16} /> Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dhaka-dashboard" data-theme={darkMode ? 'dark' : 'light'}>
      <div className="dashboard-shell">
        <header className="range-hero">
          <div className="range-hero-content">
            <div className="hero-eyebrow"><span className="eyebrow-dot" /> Bangladesh Police · Administrative directory</div>
            <h1 lang="bn">{data.Range_Name_Bn}</h1>
            <p className="hero-subtitle">{data.Range_Name_En}</p>
            <div className="hero-meta">
              <span className="hero-id-label">RANGE ID</span>
              <span className="hero-id">{data.Range_ID}</span>
              <span className="hero-meta-divider" />
              <span className="hero-description">A complete directory of police stations across the Dhaka Range.</span>
            </div>
          </div>
          <div className="hero-mark" aria-hidden="true">
            <div className="hero-mark-ring"><Icon name="station" size={40} /></div>
            <span>ঢাকা</span>
          </div>
          <span className="hero-orb hero-orb-one" aria-hidden="true" />
          <span className="hero-orb hero-orb-two" aria-hidden="true" />
        </header>

        <section className="summary-grid" aria-label="Range summary">
          <article className="summary-card">
            <span className="summary-icon summary-icon-green"><Icon name="station" size={19} /></span>
            <span className="summary-label">Districts <span lang="bn">জেলা</span></span>
            <strong>{data.Districts.length}</strong>
            <span className="summary-note">Across the range</span>
          </article>
          <article className="summary-card">
            <span className="summary-icon summary-icon-blue"><Icon name="pin" size={19} /></span>
            <span className="summary-label">Police stations <span lang="bn">থানা</span></span>
            <strong>{allThanas.length}</strong>
            <span className="summary-note">With location coordinates</span>
          </article>
          <article className="summary-card summary-code-card">
            <span className="summary-icon summary-icon-amber"><Icon name="copy" size={18} /></span>
            <span className="summary-label">Range identifier</span>
            <strong className="summary-code">{data.Range_ID}</strong>
            <span className="summary-note">Bangladesh Police · Dhaka</span>
          </article>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            <span className="theme-toggle-icon"><Icon name={darkMode ? 'sun' : 'moon'} size={18} /></span>
            <span><strong>{darkMode ? 'Light mode' : 'Dark mode'}</strong><small>Change appearance</small></span>
            <span className={`theme-switch ${darkMode ? 'is-on' : ''}`} aria-hidden="true"><i /></span>
          </button>
        </section>

        <section className="directory-section" aria-label="Police station directory">
          <div className="directory-heading">
            <div>
              <span className="section-kicker">EXPLORE THE RANGE</span>
              <h2>Police station directory</h2>
              <p lang="bn">থানার তালিকা · Search, filter, and explore locations</p>
            </div>
            <span className="results-count">
              <strong>{filteredThanas.length}</strong> of {allThanas.length} stations
            </span>
          </div>

          <div className="directory-toolbar">
            <label className="search-field">
              <Icon name="search" size={19} />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search in Bangla, English, or Thana ID…"
                aria-label="Search by Bangla name, English name, or Thana ID"
              />
              {search && (
                <button type="button" className="clear-search" onClick={() => setSearch('')} aria-label="Clear search">×</button>
              )}
            </label>
            <label className="district-select-wrap">
              <span className="select-label">District</span>
              <select
                value={districtFilter}
                onChange={(event) => setDistrictFilter(event.target.value)}
                aria-label="Filter by district"
              >
                <option value="">All districts</option>
                {data.Districts.map((district) => (
                  <option value={district.District_ID} key={district.District_ID}>
                    {district.District_Name_En} · {district.District_Name_Bn}
                  </option>
                ))}
              </select>
            </label>
            <div className="view-switcher" role="group" aria-label="Choose directory view">
              <button
                type="button"
                className={view === 'grid' ? 'view-option is-active' : 'view-option'}
                onClick={() => setView('grid')}
                aria-pressed={view === 'grid'}
              >
                <Icon name="grid" size={16} /><span>Cards</span>
              </button>
              <button
                type="button"
                className={view === 'table' ? 'view-option is-active' : 'view-option'}
                onClick={() => setView('table')}
                aria-pressed={view === 'table'}
              >
                <Icon name="list" size={17} /><span>Table</span>
              </button>
              <button
                type="button"
                className={view === 'map' ? 'view-option is-active' : 'view-option'}
                onClick={() => setView('map')}
                aria-pressed={view === 'map'}
              >
                <Icon name="map" size={16} /><span>Map</span>
              </button>
            </div>
          </div>

          {copyError && <p className="copy-error" role="alert">{copyError}</p>}

          {filteredThanas.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon"><Icon name="search" size={24} /></span>
              <h3>No stations found</h3>
              <p>Try a different search term or select another district.</p>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => { setSearch(''); setDistrictFilter(''); }}
              >
                Clear filters
              </button>
            </div>
          ) : view === 'map' ? (
            <div className="map-panel">
              <div className="map-panel-heading">
                <span className="map-live-dot" />
                Showing {filteredThanas.length} station{filteredThanas.length === 1 ? '' : 's'} on the map
                <span>OpenStreetMap</span>
              </div>
              <Suspense fallback={<div className="map-loading">Loading interactive map…</div>}>
                <ThanaMap thanas={filteredThanas} />
              </Suspense>
            </div>
          ) : view === 'table' ? (
            <div className="table-wrap">
              <table className="thana-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Thana / থানা</th>
                    <th>District / জেলা</th>
                    <th>Thana ID</th>
                    <th>Coordinates</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredThanas.map(({ district, ...thana }) => (
                    <tr key={thana.Thana_ID}>
                      <td><span className="table-number">{String(thana.Thana_Number).padStart(2, '0')}</span></td>
                      <td className="table-name">
                        <strong lang={thana.Thana_Name_Bn ? 'bn' : 'en'}>
                          {thana.Thana_Name_Bn || thana.Thana_Name_En}
                        </strong>
                        {thana.Thana_Name_Bn && thana.Thana_Name_Bn !== thana.Thana_Name_En && (
                          <span>{thana.Thana_Name_En}</span>
                        )}
                      </td>
                      <td className="table-district">{district.District_Name_En}<span lang="bn">{district.District_Name_Bn}</span></td>
                      <td><span className="thana-id">{thana.Thana_ID}</span></td>
                      <td>
                        <div className="table-coordinates">
                          <span><small>Lat</small><strong className="coordinate-value">{thana.Latitude.toFixed(4)}</strong></span>
                          <span><small>Long</small><strong className="coordinate-value">{thana.Longitude.toFixed(4)}</strong></span>
                        </div>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button type="button" className="icon-button" onClick={() => copyThanaDetails(thana)} aria-label={`Copy ${thana.Thana_Name_En} ID and coordinates`} title="Copy ID and coordinates">
                            <Icon name="copy" size={16} />
                          </button>
                          <a className="icon-button" href={`https://www.google.com/maps?q=${thana.Latitude},${thana.Longitude}`} target="_blank" rel="noreferrer" aria-label={`View ${thana.Thana_Name_En} on Google Maps`} title="View on Google Maps">
                            <Icon name="external" size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="thana-grid">
              {filteredThanas.map(({ district, ...thana }) => (
                <ThanaCard
                  key={thana.Thana_ID}
                  thana={thana}
                  district={district}
                  onCopy={copyThanaDetails}
                  copied={copiedId === thana.Thana_ID}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="directory-footer">
          <span><span className="footer-dot" /> Data sourced from Dhaka Range directory</span>
          <span>বাংলাদেশ পুলিশ · {data.Range_ID}</span>
        </footer>
      </div>
    </div>
  );
}

export default ThanaList;
