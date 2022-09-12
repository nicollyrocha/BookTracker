import { Route, Routes } from 'react-router-dom';
import './App.css';
import CadastroUser from './components/cadastro-user/CadastroUser';
import LandingPage from './components/landing-page/LandingPage';
import ListaLivros from './components/lista-livros/ListaLivros';
import Login from './components/login/Login';
import NavbarTracker from './components/navbar/NavbarTracker';
import api from './services/api';
import { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    buscarUsers();
  }, []);

  async function buscarUsers() {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <NavbarTracker />
      <div className="App">
        <Routes>
          <Route path="/home" element={<LandingPage />} />
          <Route path="/lista" element={<ListaLivros />} />
          <Route
            path="/"
            element={
              !localStorage.getItem('auth') ? (
                <Login users={users} />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path="/cadastrarse" element={<CadastroUser />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
