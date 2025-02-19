<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateBet from "./components/CreateBet";
import Home from "./components/Home";
import Login from "./components/Login";
import WalletConnectButton from "./components/WalletConnectButton";
import LoginPage from "./components/LoginPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
        <Route path="/home" element={<Home />} /> {/* Home page after login */}
        <Route path="/create-bet" element={<CreateBet />} />

      </Routes>
    </Router>
=======
import CreateBet from "./components/CreateBet";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import WalletConnectButton from "./components/WalletConnectButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


function App() {
  return (
    <div>
      {/* <Home />
      <h1 style={{ textAlign: "center" }}>welcome page or login page</h1>
      <LoginPage />
      <WalletConnectButton /> */}
      <CreateBet />
    </div>
>>>>>>> 3f8fae7eeeb8928daaf508437b53b2806baec909
  );
}

export default App;
