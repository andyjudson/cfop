import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import BGRPage from './pages/BGRPage';
import F2LPage from './pages/F2LPage';
import OLLPage from './pages/OLLPage';
import PLLPage from './pages/PLLPage';
import IntuitivePage from './pages/IntuitivePage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/intuitive" element={<IntuitivePage />} />
        <Route path="/2lk" element={<BGRPage />} />
        <Route path="/f2l" element={<F2LPage />} />
        <Route path="/oll" element={<OLLPage />} />
        <Route path="/pll" element={<PLLPage />} />
        <Route path="/" element={<Navigate to="/intuitive" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
