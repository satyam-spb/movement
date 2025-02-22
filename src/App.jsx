import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { setTokenGetter } from './api';
import CreateBet from "./components/CreateBet";
import Home from "./components/Home";
import Login from "./components/Login";
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { getAccessToken, authenticated, ready } = usePrivy();

  // Set up token getter
  useEffect(() => {
    setTokenGetter(getAccessToken);
  }, [getAccessToken]);

  // Debug logs
  useEffect(() => {
    console.log('App - Ready:', ready);
    console.log('App - Authenticated:', authenticated);
  }, [ready, authenticated]);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/create-bet" element={<CreateBet />} />
          </Route>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;