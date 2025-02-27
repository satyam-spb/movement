import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { setTokenGetter } from './api';
import CreateBet from "./components/CreateBet";
import Home from "./components/Home";
import Login from "./components/Login";
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import { Buffer } from 'buffer';
import { PrivyProvider } from '@privy-io/react-auth';

window.Buffer = Buffer;

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
    <PrivyProvider
      appId="cm7b9ly1800ocj4cjh8awayjj"
      config={{
        loginMethods:[
          'email',
          'google',
          'apple',
          'github',
          'twitter',
          'discord',
          'linkedin',
          'facebook',
          'wallet'
        ],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF'
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets'
        },
        // Required for social logins
        oauthOptions: {
          providers: [
            'google',
            'apple',
            'github',
            'twitter', 
            'discord',
            'linkedin',
            'facebook'
          ]
        }
      }}
    >
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
    </PrivyProvider>
  );
}

export default App;