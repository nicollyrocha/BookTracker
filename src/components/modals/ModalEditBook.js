import * as React from 'react';
import Button from '@mui/material/Button';
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

export default function ModalEditBook({
  openEdit,
  handleCloseEdit,
  rowSelected,
  rows,
}) {
  const [status, setStatus] = React.useState(0);
  const [rating, setRating] = React.useState();
  const [isError, setIsError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(false);
  let dados;

  function onChangeStatus(e) {
    setStatus(e.target.value);
  }

  async function onClickSave(e) {
    if (status !== 0) {
      setIsError(false);
      if (status === 'lido') {
        dados = {
          userName: localStorage.getItem('user'),
          book_id: rowSelected.book_id,
          status: status,
          rating: rating,
        };
      } else {
        dados = {
          userName: localStorage.getItem('user'),
          book_id: rowSelected.book_id,
          status: status,
        };
      }
      try {
        await api.put(`/book/${localStorage.getItem('user')}`, dados);
        try {
          const books = await api.get(`/books/${localStorage.getItem('user')}`);
          rows = books.data;
          window.location.reload();
        } catch (e) {
          console.log(e);
        }

        handleCloseEdit();
        setStatus('');
        setRating('');
        dados = {};
      } catch (e) {
        console.log(e);
      }
    } else {
      setIsError(true);
      setErrorMsg('Preencha os campos.');
    }
  }

  function onClickClose(e) {
    handleCloseEdit();
    setStatus('');
    setRating('');
    dados = {};
  }

  return (
    <Dialog open={openEdit} onClose={handleCloseEdit} style={{}} fullWidth>
      <DialogTitle>Edit book</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Preencha os campos abaixo para editar
        </DialogContentText>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
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
