import * as React from 'react';
import './landing-page.css';
import Book from '../../images/book.png';

export default function LandingPage() {
  return (
    <>
      {localStorage.getItem('auth') ? (
        <div className="main-div">
          <div className="div-image">
            <img
              sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
              src={Book}
              alt="Book"
              className="image"
            />
          </div>

          <div className="landing-page-1">
            Seja bem vindo(a) ao Book Tracker!
          </div>
          <div className="landing-page-2">
            Aplicação Web criada para você organizar seus livros
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', fontSize: '24px' }}>
            Acesso bloqueado. Faça login ou cadastre-se.
          </div>
        </>
      )}
    </>
  );
}
