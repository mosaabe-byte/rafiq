import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import Roadmap from './pages/Roadmap';
import Glossary from './pages/Glossary';
import Profile from './pages/Profile';
import './pages/pages.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="new" element={<NewProject />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}