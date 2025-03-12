import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChangePassword from "./pages/Changepassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
    return (
        <Router>
            <Routes>
              
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Routes>
        </Router>
    );
}

export default App;
