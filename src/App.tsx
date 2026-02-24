import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPost from './pages/BlogPost';
import Projects from './pages/Projects';
import Life from './pages/Life';
import Footer from './components/Footer';
import lifeData from './life.json';
import './App.css';
import { ThemeProvider } from './context/ThemeContext';

function AppContent() {
  return (
    <>
      <div className="app-wrapper container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/page/:pageNumber" element={<HomePage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/post/:slug" element={<BlogPost />} />
          {lifeData.length > 0 && <Route path="/life" element={<Life />} />}
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
