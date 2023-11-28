import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Routes and Components
import NotFound from './components/NotFound';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import NavBar from './components/NavBar';

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<UserDashboard />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
