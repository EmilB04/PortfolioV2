import { Routes, Route } from 'react-router-dom';
import Layout from './components/_layout';
import Home from './pages/HomePage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Layout>
  );
}