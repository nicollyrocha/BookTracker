import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import './navbar-tracker.css';
import { Link, useNavigate } from 'react-router-dom';

const pages = ['home', 'lista'];

const NavbarTracker = () => {
  const history = useNavigate();

  function onClickLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('auth');

    history('/');
    window.location.reload();
  }

  function onClickLogin() {
    history('/');
  }

  return (
    <AppBar position="static" id="app-bar">
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            noWrap
            component="a"
            style={{
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Book Tracker
          </Typography>
          <Box
            id="user"
            style={{ justifyContent: 'space-between', display: 'flex' }}
          >
            {localStorage.getItem('auth')
              ? pages.map((page) => (
                  <Button
                    key={page}
                    sx={{ color: 'white' }}
                    style={{ justifyContent: 'space-between', display: 'flex' }}
                  >
                    <Link
                      style={{ textDecoration: 'none', color: 'white' }}
                      to={`/${page === 'login' ? '' : page}`}
                      className="page"
                    >
                      {page.toUpperCase()}
                    </Link>
                  </Button>
                ))
              : null}
          </Box>
          <div
            style={{
              justifyContent: 'flex-end',
            }}
          >
            {localStorage.getItem('auth') ? (
              <>
                <div
                  style={{
                    justifyContent: 'space-between',
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      alignSelf: 'center',
                      marginRight: '5px',
                    }}
                  >
                    Usuário logado: {localStorage.getItem('user')}
                  </div>

                  <Button
                    key={'logout'}
                    sx={{ color: 'white' }}
                    style={{
                      justifyContent: 'space-between',
                      display: 'flex',
                    }}
                    onClick={onClickLogout}
                  >
                    {'Logout'}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button
                  key={'login'}
                  sx={{ color: 'white' }}
                  style={{
                    justifyContent: 'space-between',
                    display: 'flex',
                  }}
                  onClick={onClickLogin}
                >
                  {'Login'}
                </Button>
              </>
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default NavbarTracker;
