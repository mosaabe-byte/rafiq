import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import Roadmap from './pages/Roadmap';
import Glossary from './pages/Glossary';
import Profile from './pages/Profile';
import './pages/pages.css';
import Chat from "./pages/Chat";
import LearningPath from './pages/LearningPath';
import SessionDetail from './pages/SessionDetail';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; // ينتظر التحقق من الجلسة قبل أي قرار
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="new" element={<NewProject />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<Chat />} />
          <Route path="learn" element={<LearningPath />} />
          <Route path="learn/:id" element={<SessionDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}