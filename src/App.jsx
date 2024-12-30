import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import NavBar from './components/NavBar';
import SignIn from './components/SignIn';
import TaskList from './components/TaskList';
import Dashboard from './components/Dashboard';

const App = () => {
  const [page, setPage] = useState('');
  const [token, setToken] = useState(null);

  return (
    <BrowserRouter>
      <NavBar page={page} setPage={setPage} token={token} />
      <Routes>
        <Route path="/" Component={SignIn} token={token} />
        <Route path="/dashboard" Component={Dashboard} token={token} />
        <Route path="/task-list" Component={TaskList} token={token} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
