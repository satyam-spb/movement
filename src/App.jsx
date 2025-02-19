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
  );
}

export default App;
