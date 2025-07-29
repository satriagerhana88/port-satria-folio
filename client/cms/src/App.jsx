import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Setting from './pages/Setting';
import Biodata from './pages/Biodata';
import Education from './pages/Education';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Route yang butuh proteksi */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="biodata" element={<Biodata />} />
          <Route path="education" element={<Education />} />
          <Route path="setting" element={<Setting />} />
        </Route>

        {/* redirect default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
