import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Wallet from "./pages/Wallet";
import Statistic from "./pages/Statistic";
import TransactionsDetails from "./pages/TransactionsDetails";
import Onboarding from "./pages/Onboarding";
import Splashscreen from "./pages/SplashScreen";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Add from "./pages/Add";
import EditExpense from "./components/forms/EditExpense";
import EditIncome from "./components/forms/EditIncome";
import AuthRequired from "./components/common/AuthRequired";
import { useAppContext } from "./context/AppContext";
import { IntlContextProvider } from "./context/IntlContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.css";
import EditProfile from "./pages/EditProfile";

function App() {

  const appctx = useAppContext();
  const { token, saveToken } = appctx;

  return (
    <IntlContextProvider>
      <div className="min-h-screen bg-white">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <BrowserRouter>

        <Routes>
          <Route
            path="/"
            element={<Navigate to={token ? "/home" : "/onboarding"} />}
          />
          <Route path="/splash" element={<Splashscreen />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/home"
            element={
              <AuthRequired token={token} setToken={saveToken}>
                <Home />
              </AuthRequired>
            }
          />

          <Route
            path="/wallet"
            element={
              <AuthRequired token={token} setToken={saveToken}>
                <Wallet />
              </AuthRequired>
            }
          />

          <Route
            path="/statistic"
            element={
              <AuthRequired token={token} setToken={saveToken}>
                <Statistic />
              </AuthRequired>
            }
          />

          <Route
            path="/transaction/detail/:id"
            element={
              <AuthRequired token={token} setToken={saveToken}>
                <TransactionsDetails />
              </AuthRequired>
            }
          />

          <Route
            path="/profile"
            element={
              <AuthRequired token={token} setToken={saveToken}>
                <Profile />
              </AuthRequired>
            }
          />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route
            path="/add"
            element={
              <AuthRequired token={token} setToken={saveToken}>
                <Add />
              </AuthRequired>
            }
          />

          <Route
            path="/editExpense/:id"
            element={
              <AuthRequired token={token} setToken={saveToken}>
                <EditExpense />
              </AuthRequired>
            }
          />
          <Route
            path="/editIncome/:id"
            element={
              <AuthRequired token={token} setToken={saveToken}>
                <EditIncome />
              </AuthRequired>
            }
          />
        </Routes>
      </BrowserRouter>
      </div>
    </IntlContextProvider>
  );
}

export default App;
