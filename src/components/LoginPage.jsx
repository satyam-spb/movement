import { usePrivy } from "@privy-io/react-auth";

const LoginPage = () => {
    const { login, authenticated, logout, user } = usePrivy();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            {!authenticated ? (
                <button onClick={login}>Login with Email</button>
            ) : (
                <div>
                    <p>{user.address}</p>

                    <button onClick={logout}>Logout</button>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
