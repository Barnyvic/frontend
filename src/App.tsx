import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphql/client";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Departments from "./pages/Departments";
import DepartmentDetails from "./pages/DepartmentDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Toaster position="top-right" />
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <Navbar />
            <div className="w-full px-6 py-8">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Departments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department/:id"
                  element={
                    <ProtectedRoute>
                      <DepartmentDetails />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
