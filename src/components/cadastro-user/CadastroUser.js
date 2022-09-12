import * as React from 'react';
import {
  Alert,
  Button,
  Card,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export default function CadastroUser() {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');

  const history = useNavigate();

  function onChangeUser(e) {
    setUserName(e.target.value);
  }

  function onChangePassword(e) {
    setPassword(e.target.value);
  }

  async function handleClick() {
    const dados = { userName: userName, password: password };
    if (userName !== '' && password !== '') {
      try {
        setIsLoading(true);
        setIsError(false);
        await api.post(`/user`, dados);
        setTimeout(() => {
          setIsLoading(false);
          setUserName('');
          setPassword('');

          setErrorMsg('');
          history('/');
        }, '3000');
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        if (error.message === 'Request failed with status code 400')
          setErrorMsg('Usuário já existente');
        else {
          setErrorMsg(error.message);
        }
      }
    } else {
      setIsError(true);
      setErrorMsg('PREENCHA TODOS OS CAMPOS');
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
      className="div"
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '15%',
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="userName"
            label="Usuário"
            variant="outlined"
            style={{ width: '250px' }}
            onChange={(e) => onChangeUser(e)}
            value={userName}
            color="info"
          />
          <TextField
            margin="dense"
            id="senha"
            label="Senha"
            type={'password'}
            variant="outlined"
            style={{ width: '250px' }}
            onChange={(e) => onChangePassword(e)}
            value={password}
          />
        </div>
        {isError ? (
          <Alert severity="error" style={{ marginTop: '15px' }}>
            {errorMsg}
          </Alert>
        ) : null}

        {isLoading ? (
          <CircularProgress size={'30px'} style={{ paddingBottom: '10px' }} />
        ) : null}

        <div style={{ marginTop: '10px' }}>
          <Button onClick={handleClick}>Cadastrar-se</Button>
        </div>
      </Card>
    </div>
  );
}
