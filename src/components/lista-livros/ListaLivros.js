import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import ModalAddBook from '../modals/ModalAddBook';
import { useEffect } from 'react';
import api from '../../services/api';
import ModalEditBook from '../modals/ModalEditBook';
import ModalDeleteBook from '../modals/ModalDeleteBook';

let rows = [];

export default function ListaLivros() {
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [rowSelected, setRowSelected] = React.useState();
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [status, setStatus] = React.useState(0);
  const [rating, setRating] = React.useState();
  const [date, setDate] = React.useState();
  let dataSave;

  useEffect(() => {
    buscaLivrosPorUser();
  }, []);

  async function buscaLivrosPorUser() {
    try {
      const books = await api.get(`/books/${localStorage.getItem('user')}`);
      rows = books.data;
    } catch (error) {
      console.log(error);
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    dataSave = {};
    setTitle('');
    setAuthor('');
    setRating();
    setStatus(0);
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  function onClickEdit(row) {
    setRowSelected(row);
    setOpenEdit(true);
  }

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  function onClickDelete(row) {
    setRowSelected(row);
    setOpenDelete(true);
  }

  return (
    <>
      {localStorage.getItem('auth') ? (
        <>
          <ModalAddBook
            open={open}
            handleClose={handleClose}
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            status={status}
            setStatus={setStatus}
            rating={rating}
            setRating={setRating}
            dataSave={dataSave}
            date={date}
            setDate={setDate}
          />
          <ModalEditBook
            openEdit={openEdit}
            handleCloseEdit={handleCloseEdit}
            rowSelected={rowSelected}
            rows={rows}
          />
          <ModalDeleteBook
            openDelete={openDelete}
            handleCloseDelete={handleCloseDelete}
            rowSelected={rowSelected}
            rows={rows}
          />
          <TableContainer component={Paper} style={{ height: '90%' }}>
            <div
              style={{
                fontSize: '25px',
                marginTop: '20px',
                marginBottom: '30px',
              }}
            >
              Book Tracker
            </div>
            <div style={{ textAlign: 'right' }}>
              <IconButton onClick={() => handleClickOpen()}>
                <Add fontSize="large" />
              </IconButton>
            </div>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center" style={{ fontWeight: '600' }}>
                    Título
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: '600' }}>
                    Autor
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: '600' }}>
                    Status
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: '600' }}>
                    Nota
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: '600' }}>
                    Criado Em
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: '600' }}>
                    Terminado Em
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: '600' }}>
                    Opções
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell align="center">{row.title}</TableCell>
                    <TableCell align="center">{row.author}</TableCell>
                    <TableCell align="center">
                      {row.status === 'quero ler'
                        ? 'Quero ler'
                        : row.status === 'lendo'
                        ? 'Lendo'
                        : row.status === 'lido'
                        ? 'Lido'
                        : null}
                    </TableCell>
                    <TableCell align="center">{row.rating}</TableCell>
                    <TableCell align="center">
                      {row.created_at.substring(0, 10)}
                    </TableCell>
                    <TableCell align="center">
                      {row.date_finished !== null &&
                      row.date_finished !== '' &&
                      row.date_finished !== undefined
                        ? row.date_finished.substring(0, 10)
                        : ''}
                    </TableCell>
                    <TableCell align="center">
                      {
                        <div>
                          <IconButton onClick={() => onClickEdit(row)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => onClickDelete(row)}>
                            <Delete />
                          </IconButton>
                        </div>
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
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
