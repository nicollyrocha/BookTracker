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
  Typography,
} from '@mui/material';
import api from '../../services/api';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/system';

export default function ModalAddBook({
  open,
  handleClose,
  title,
  setTitle,
  author,
  setAuthor,
  status,
  setStatus,
  rating,
  setRating,
  dataSave,
  date,
  setDate,
}) {
  const [isError, setIsError] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState(false);
  const [dateEmpty, setDateEmpty] = React.useState(false);

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
        if (date === undefined) {
          setDateEmpty(true);
        } else {
          dataSave = {
            userName: localStorage.getItem('user'),
            title: title,
            author: author,
            status: status,
            rating: rating,
            date: date,
          };
          setDateEmpty(false);
        }
      } else {
        dataSave = {
          userName: localStorage.getItem('user'),
          title: title,
          author: author,
          status: status,
        };
      }
      if (dateEmpty === false) {
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
            setDateEmpty(false);
            window.location.reload();
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      } else {
        setDateEmpty(true);
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

  function onChangeDate(newValue) {
    const dataCompleta = new Date(newValue);
    const ano = dataCompleta.getFullYear();
    let dia = dataCompleta.getDate();
    let mes = dataCompleta.getMonth() + 1;

    if (dia < 10) {
      dia = `0${dia}`;
    }

    if (mes < 10) {
      mes = `0${mes}`;
    }

    const dataFormatada = `${mes}-${dia}-${ano}`;
    setDate(dataFormatada);
    setDateEmpty(false);
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
            <div>
              <div style={{ marginTop: '10px', marginBottom: '5px' }}>
                Avalie o livro:
              </div>
              <Stack spacing={1}>
                <Rating
                  name="simple-controlled"
                  value={rating}
                  style={{ width: '30px' }}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack
                    spacing={3}
                    style={{
                      display: 'flex',
                      width: '40%',
                    }}
                  >
                    <DatePicker
                      label="Custom input"
                      value={date}
                      onChange={(newValue) => {
                        onChangeDate(newValue);
                      }}
                      maxDate={new Date()}
                      renderInput={({ inputRef, inputProps, InputProps }) => (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Typography
                              variant="span"
                              component="span"
                              style={{
                                marginBottom: '5px',
                              }}
                            >
                              Data Finalização
                            </Typography>

                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <input
                                value={date}
                                ref={inputRef}
                                placeholder="mm-dd-yyy"
                                disabled
                              />
                              {InputProps?.endAdornment}
                            </Box>
                          </div>
                        </>
                      )}
                    />
                  </Stack>
                </LocalizationProvider>
                {dateEmpty ? (
                  <div
                    style={{
                      fontSize: '10px',
                      backgroundColor: '#CA2419',
                      borderRadius: '4px',
                      display: 'flex',
                      alignSelf: 'flex-start',
                      padding: '5px',
                      color: 'white',
                    }}
                  >
                    PREENCHA A DATA FIM
                  </div>
                ) : null}
              </Stack>
            </div>
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
