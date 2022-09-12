import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import api from '../../services/api';

export default function ModalDeleteBook({
  openDelete,
  handleCloseDelete,
  rowSelected,
  rows,
}) {
  let dados;

  async function onClickDelete(e) {
    dados = { book_id: rowSelected.book_id, userName: rowSelected.username };
    try {
      await api.delete(`/book/`, { data: dados });
      try {
        const books = await api.get(`/books/${localStorage.getItem('user')}`);
        rows = books.data;
        dados = {};
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function onClickClose(e) {
    handleCloseDelete();
    dados = {};
  }

  return (
    <Dialog open={openDelete} onClose={handleCloseDelete} style={{}} fullWidth>
      <DialogTitle>Deletar Livro</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Certeza que deseja excluir o livro da lista?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickClose}>Cancelar</Button>
        <Button onClick={onClickDelete}>Excluir</Button>
      </DialogActions>
    </Dialog>
  );
}
