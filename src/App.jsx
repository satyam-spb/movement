import CreateBet from "./components/CreateBet";
import Home from "./components/Home";
import LoginPage from "./components/LoginPage";
import WalletConnectButton from "./components/WalletConnectButton";


function App() {
  return (
    <div>
      {/* <Home />
      <h1 style={{ textAlign: "center" }}>welcome page or login page</h1>
      <LoginPage />
      <WalletConnectButton /> */}
      <CreateBet />
    </div>
  );
}

export default App;
