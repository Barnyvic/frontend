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
import "./App.css";

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
            <Navbar />
            <main className="container mx-auto px-8 py-6">
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
            </main>
          </div>
        </Router>
        <Toaster position="top-right" />
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
