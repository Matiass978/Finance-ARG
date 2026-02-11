import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSettingsStore } from './store/useSettingsStore';
import Layout from './components/Layout';
import FeedPage from './pages/FeedPage';
import StatsPage from './pages/StatsPage';
import AddMovementPage from './pages/AddMovementPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { theme } = useSettingsStore();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FeedPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="add" element={<AddMovementPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
