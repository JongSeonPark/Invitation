import { useState } from 'react';
import Version1 from './pages/Version1';
import Version2 from './pages/Version2';

function App() {
  // Check URL for ?mode=classic
  const getInitialVersion = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'classic' ? 1 : 2;
  };

  const [version, setVersion] = useState(getInitialVersion);

  const handleVersionChange = (newVersion) => {
    setVersion(newVersion);
    // Optional: Update URL without reloading
    const newUrl = new URL(window.location);
    if (newVersion === 1) {
      newUrl.searchParams.set('mode', 'classic');
    } else {
      newUrl.searchParams.delete('mode');
    }
    window.history.pushState({}, '', newUrl);
  };

  return (
    <>
      {version === 1 ? (
        <Version1 />
      ) : (
        <Version2 onSwitchToV1={() => handleVersionChange(1)} />
      )}

      {/* Dev Toggle Button */}
      <div style={{ position: 'fixed', bottom: '10px', left: '10px', zIndex: 9999, opacity: 0.3 }}>
        <button onClick={() => handleVersionChange(1)} style={{ marginRight: '5px' }}>V1</button>
        <button onClick={() => handleVersionChange(2)}>V2</button>
      </div>
    </>
  )
}

export default App
