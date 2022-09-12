import * as React from 'react';
import { Alert, Button, Card, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function Login() {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const history = useNavigate();

  function onChangeUser(e) {
    setUser(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  const handleClick = () => {
    history('/cadastrarse');
  };

  async function onClickLogin() {
    try {
      const login = await api.post(`/userLogin/${user}/${password}`);

      localStorage.setItem('user', user);
      localStorage.setItem('token', login.data.token);
      localStorage.setItem('auth', login.data.auth);

      window.location.reload();
      history('/home');
    } catch (error) {
      console.log(error.message);
      setIsError(true);
      setErrorMsg(
        'Erro ao logar: ' +
          `${
            error.message === 'Request failed with status code 401'
              ? 'Não autorizado. Verifique suas credenciais'
              : error.message
          }`
      );
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '40%',
        height: '60%',
      }}
    >
      <Card
        style={{
          backgroundColor: '#F7F9F9',
          borderRadius: 20,
          width: '90%',
          height: '90%',
        }}
      >
        <div
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '15%',
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="user"
            label="Usuário"
            variant="outlined"
            style={{ width: '70%' }}
            onChange={(e) => onChangeUser(e)}
            value={user}
            color="info"
          />
          <TextField
            margin="dense"
            id="senha"
            label="Senha"
            type={'password'}
            variant="outlined"
            style={{ width: '70%' }}
            onChange={(e) => onChangePassword(e)}
            value={password}
          />
        </div>
        {isError ? (
          <Alert severity="error" style={{ marginTop: '10px' }}>
            {errorMsg}
          </Alert>
        ) : null}
        <div style={{ marginTop: '15px' }}>
          <Button onClick={onClickLogin}>Login</Button>
          <Button onClick={handleClick}>Cadastrar-se</Button>
        </div>
      </Card>
    </div>
  );
}
