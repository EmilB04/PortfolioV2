import { Routes, Route } from 'react-router-dom';
import Layout from './components/_layout';
import Home from './pages/HomePage';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
}