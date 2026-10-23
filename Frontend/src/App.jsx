import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
};

export default App;
