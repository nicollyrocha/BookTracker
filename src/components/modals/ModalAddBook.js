import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  Rating,
  Stack,
} from '@mui/material';
import api from '../../services/api';

export default function ModalAddBook({ open, handleClose }) {
  const [title, setTitle] = React.useState('');
  const [author, setAuthor] = React.useState('');
  const [status, setStatus] = React.useState(0);
  const [rating, setRating] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(false);
  let dataSave;

  function onChangeTitle(e) {
    setTitle(e.target.value);
  }

  function onChangeAuthor(e) {
    setAuthor(e.target.value);
  }

  function onChangeStatus(e) {
    setStatus(e.target.value);
  }

  async function onClickSave(e) {
    if (title !== '' && author !== '' && status !== 0) {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;
      setIsError(false);
      if (status === 'lido') {
        dataSave = {
          userName: localStorage.getItem('user'),
          title: title,
          author: author,
          status: status,
          rating: rating,
          date: today,
        };
      } else {
        dataSave = {
          userName: localStorage.getItem('user'),
          title: title,
          author: author,
          status: status,
        };
      }
      try {
        await api.post(`/book`, dataSave);
        try {
          await api.get(`/books/${localStorage.getItem('user')}`);
          handleClose();
          setTitle('');
          setAuthor('');
          setStatus('');
          setRating('');
          dataSave = {};
          window.location.reload();
        } catch (e) {
          console.log(e);
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsError(true);
      setErrorMsg('Preencha os campos.');
    }
  }

  function onClickClose(e) {
    handleClose();
    setTitle('');
    setAuthor('');
    setStatus('');
    setRating('');
    dataSave = {};
  }

  return (
    <Dialog open={open} onClose={handleClose} style={{}} fullWidth>
      <DialogTitle>Add a book</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Preencha os campos abaixo para adicionar um livro
        </DialogContentText>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <TextField
              autoFocus
              margin="dense"
              id="titulo"
              label="Título"
              variant="standard"
              style={{ width: '250px' }}
              onChange={(e) => onChangeTitle(e)}
              value={title}
            />
            <TextField
              margin="dense"
              id="autor"
              label="Autor"
              variant="standard"
              style={{ width: '250px' }}
              onChange={(e) => onChangeAuthor(e)}
              value={author}
            />
          </div>

          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={(e) => onChangeStatus(e)}
          >
            <FormControlLabel
              value={'quero ler'}
              control={<Radio />}
              label="Quero Ler"
            />
            <FormControlLabel
              value={'lendo'}
              control={<Radio />}
              label="Lendo"
            />
            <FormControlLabel value={'lido'} control={<Radio />} label="Lido" />
          </RadioGroup>
        </div>
        {status === 'lido' ? (
          <>
            <div style={{ marginBottom: '5px', marginTop: '10px' }}>
              Avalie o livro:
            </div>
            <Stack spacing={1}>
              <Rating
                name="simple-controlled"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                }}
              />
            </Stack>
          </>
        ) : null}
        {isError ? <Alert severity="error">{errorMsg}</Alert> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickClose}>Cancelar</Button>
        <Button onClick={onClickSave}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
