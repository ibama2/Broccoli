import Head from 'next/head'
import React, { useState } from 'react';
import { Modal, Box, FormControl, InputLabel, Input, FormHelperText } from '@mui/material';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

import styles from '@/pages/index.module.css'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const emailValidRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const url = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth';

export default function Home() {
  // modal props
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  const reset = () => {
    setFullName('');
    setEmail('');
    setConfirmEmail('');

    setErrorFullName(false);
    setErrorEmail(false);
    setErrorConfirmEmail(false);

    setSuccess(false);
    setErrorStatusText('');
    setIsLoading(false);
  }

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  // modal validation states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');

  const [errorFullName, setErrorFullName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorConfirmEmail, setErrorConfirmEmail] = useState(false);

  // modal response states
  const [errorStatusText, setErrorStatusText] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // input handlers
  const handleFullNameChange = (e: any) => {
    setFullName(e.target.value);
    setErrorFullName(e.target.value.length < 4);
  }

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
    setErrorEmail(!e.target.value.match(emailValidRegex))
    setErrorConfirmEmail(confirmEmail !== '' && e.target.value !== confirmEmail)
  }

  const handleConfirmEmail = (e: any) => {
    setConfirmEmail(e.target.value);
    setErrorConfirmEmail(e.target.value !== email)
  }

  // request
  const handleSend = () => {
    // validation
    if (fullName.length < 4) {
      setErrorFullName(true);
      return;
    }
    if (!email.match(emailValidRegex)) {
      setErrorEmail(true);
      return;
    }
    if (email !== confirmEmail) {
      setErrorConfirmEmail(true);
      return;
    }

    // send the request
    setIsLoading(true);
    axios.post(url, {
      name: fullName,
      email
    })
      .then(({ status, data = {} }) => {
        setIsLoading(false);
        if (status == 200) {
          setSuccess(true);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        if (error?.response?.status == 400) {
          setErrorStatusText(error?.response?.data?.errorMessage || 'request error');
        }
      });

  }

  const ModalContent = () => success ? (
    <div className={styles.flexColumn}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        All done!
      </Typography>
      <div className={styles.shortLine}></div>
      <p>You will be one of the first to experience Broccoli & Co. when we launch.</p>
      <button className={styles.button} onClick={handleClose}>Ok</button>
    </div>
  ) : (
    <div className={styles.flexColumn}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Request an invite
      </Typography>
      <div className={styles.shortLine}></div>
      <FormControl error={errorFullName} variant="standard">
        <InputLabel htmlFor="full-name">Full Name</InputLabel>
        <Input
          id="full-name"
          aria-describedby="full-name-error-text"
          onBlur={handleFullNameChange}
        />
        {errorFullName ? <FormHelperText id="full-name-error-text">At least 3 characters</FormHelperText> : null}
      </FormControl>

      <FormControl error={errorEmail} variant="standard">
        <InputLabel htmlFor="email">Email</InputLabel>
        <Input
          id="email"
          aria-describedby="email-error-text"
          onBlur={handleEmailChange}
        />
        {errorEmail ? <FormHelperText id="email-error-text">Invalid Email Format</FormHelperText> : null}
      </FormControl>

      <FormControl error={errorConfirmEmail} variant="standard">
        <InputLabel htmlFor="confirm-email">Confirm Email</InputLabel>
        <Input
          id="confirm-email"
          aria-describedby="confirm-email-error-text"
          onBlur={handleConfirmEmail}
        />
        {errorConfirmEmail ? <FormHelperText id="confirm-email-error-text">Email doesn't match</FormHelperText> : null}
      </FormControl>

      <button disabled={isLoading} className={styles.button} onClick={handleSend}>{isLoading ? 'Sending, please wait..' : 'Send'}</button>

      {errorStatusText.length > 0 ? errorStatusText : null}
    </div>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>BROCOLI & Co.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        Broccoli & Co.
      </header>

      <main>
        <div className={styles.title}>
          A better way
        </div>
        <div className={styles.title}>
          to enjoy every day.
        </div>

        <p className={styles.description}>
          Be the first to know when we launch.
        </p>

        <button className={styles.button} onClick={handleOpen}>Request an invite</button>
      </main>

      <footer>
        <div>Made with <FavoriteIcon sx={{ fontSize: 10 }} /> in Melbourne </div>
        <div>@ 2016 Broccoli & Co. All rights reserved.</div>
      </footer>

      <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                {ModalContent()}
            </Box>
        </Modal>
    </div>
  )
}
