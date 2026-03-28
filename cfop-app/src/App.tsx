import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import BGRPage from './pages/BGRPage';
import F2LPage from './pages/F2LPage';
import OLLPage from './pages/OLLPage';
import PLLPage from './pages/PLLPage';
import IntuitivePage from './pages/IntuitivePage';
import NotationPage from './pages/NotationPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/about" element={<AboutPage />} />
        <Route path="/intuitive" element={<IntuitivePage />} />
        <Route path="/notation" element={<NotationPage />} />
        <Route path="/2lk" element={<BGRPage />} />
        <Route path="/f2l" element={<F2LPage />} />
        <Route path="/oll" element={<OLLPage />} />
        <Route path="/pll" element={<PLLPage />} />
        <Route path="/" element={<Navigate to="/about" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
