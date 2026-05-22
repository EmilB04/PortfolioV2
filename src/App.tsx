import { Routes, Route } from 'react-router-dom';
import Layout from './components/_layout';
import Home from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ProjectsPage from './pages/ProjectsPage';
import SpesificProjectPage from './pages/SpesificProjectPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<SpesificProjectPage />} />
      </Routes>
    </Layout>
  );
}