import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import StudentLogin from './components/studentlogin';
import Dashboard from './components/studentdashboard';
import Register from './components/Register';
import ForgetPassword from './components/Forgetpassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
