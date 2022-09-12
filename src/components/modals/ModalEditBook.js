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
  Typography,
} from '@mui/material';
import api from '../../services/api';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box } from '@mui/system';

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
  const [date, setDate] = React.useState();
  const [dateEmpty, setDateEmpty] = React.useState(false);
  let dados;

  function onChangeStatus(e) {
    setStatus(e.target.value);
  }

  async function onClickSave(e) {
    if (status !== 0) {
      setIsError(false);
      if (status === 'lido') {
        if (date === undefined) {
          setDateEmpty(true);
        } else {
          dados = {
            userName: localStorage.getItem('user'),
            book_id: rowSelected.book_id,
            status: status,
            rating: rating,
            date: date,
          };
          setDateEmpty(false);
        }
      } else {
        dados = {
          userName: localStorage.getItem('user'),
          book_id: rowSelected.book_id,
          status: status,
        };
      }
      if (dateEmpty === false) {
        try {
          await api.put(`/book/${localStorage.getItem('user')}`, dados);
          try {
            const books = await api.get(
              `/books/${localStorage.getItem('user')}`
            );
            rows = books.data;
            window.location.reload();
          } catch (e) {
            console.log(e);
          }

          handleCloseEdit();
          setStatus('');
          setRating('');
          dados = {};
          setDateEmpty(false);
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
    handleCloseEdit();
    setStatus('');
    setRating('');
    dados = {};
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
    <Dialog open={openEdit} onClose={handleCloseEdit} style={{}} fullWidth>
      <DialogTitle>Editar Livro</DialogTitle>
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
            defaultValue={rowSelected !== undefined ? rowSelected.status : ''}
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
                  style={{ width: '30px' }}
                  onChange={(event, newValue) => {
                    setRating(newValue);
                  }}
                  defaultValue={`${rowSelected.rating}`}
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
                                ref={inputRef}
                                placeholder={`${rowSelected.date_finished.substring(
                                  0,
                                  10
                                )}`}
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
