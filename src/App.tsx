import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/_layout';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Home = lazy(() => import('./pages/HomePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const SpesificProjectPage = lazy(() => import('./pages/SpesificProjectPage'));

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<SpesificProjectPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}