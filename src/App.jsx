import { useState, useEffect } from 'react';
import Version1 from './pages/Version1';
import Version2 from './pages/Version2';
import SelectionPage from './pages/SelectionPage';
import GlobalToast from './components/GlobalToast';

function App() {
  const [view, setView] = useState('selection'); // 'selection', 'v1', 'v2'

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes('classic.html')) {
      setView('v1');
    } else if (path.includes('game.html')) {
      // Explicitly check for game mode query param as fallback/legacy
      // or just rely on the html file
      setView('v2');
    } else if (new URLSearchParams(window.location.search).get('mode') === 'classic') {
      // Legacy support
      setView('v1');
    } else if (new URLSearchParams(window.location.search).get('mode') === 'game') {
      setView('v2');
    } else {
      setView('selection');
    }
  }, []);

  return (
    <>
      {view === 'selection' && <SelectionPage />}
      {view === 'v1' && <Version1 />}
      {view === 'v2' && <Version2 onSwitchToV1={() => window.location.href = 'classic.html'} />}
      <GlobalToast />
    </>
  )
}

export default App
