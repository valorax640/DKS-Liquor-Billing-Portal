import React, { useRef, useState, useEffect } from 'react';
import {
  Checkbox,
  FormControlLabel,
  TextField,
  Box,
  Autocomplete,
  Snackbar,
  Alert
} from '@mui/material';

const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

export default function LockedFocusFormWithSnackbar() {
  const [lockFocus, setLockFocus] = useState(false);
  const [fieldAValue, setFieldAValue] = useState('');
  const [autoValue, setAutoValue] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const lockedFieldRef = useRef();
  const hasScannerTriggered = useRef(false);

  // 👇 Set focus to Field A when locked
  useEffect(() => {
    if (lockFocus) {
      lockedFieldRef.current?.focus();
    }
  }, [lockFocus]);

  // 👇 Detect first scanner input
  useEffect(() => {
    const handleScannerInput = (e) => {
      if (!hasScannerTriggered.current) {
        hasScannerTriggered.current = true;
        setLockFocus(true);
      }
    };

    window.addEventListener('keydown', handleScannerInput);
    return () => window.removeEventListener('keydown', handleScannerInput);
  }, []);

  // 👇 Handle focus loss: if not focusing a known input, re-lock
  const handleFieldABlur = (e) => {
    // Wait one tick to see what element is next focused
    requestAnimationFrame(() => {
      const active = document.activeElement;
      if (
        lockFocus &&
        active !== lockedFieldRef.current &&
        active?.tagName !== 'INPUT' &&
        active?.tagName !== 'TEXTAREA' &&
        active?.getAttribute('role') !== 'combobox'
      ) {
        // Clicked outside → refocus Field A
        lockedFieldRef.current?.focus();
      }
    });
  };

  // 👇 Unlock if user focuses another input
  const handleManualFocus = (e) => {
    if (lockFocus && e.target !== lockedFieldRef.current) {
      setLockFocus(false);
      hasScannerTriggered.current = false;
    }
  };

  const handleFieldAChange = (e) => {
    const value = e.target.value;
    setFieldAValue(value);

    if (lockFocus && value.trim().toLowerCase() === 'scan a') {
      setShowSnackbar(true);
    }
  };

  return (
    <Box sx={{ p: 2, maxWidth: 400 }}>
      <FormControlLabel
        control={<Checkbox checked={lockFocus} />}
        label="Lock focus to Field A"
      />

      <TextField
        inputRef={lockedFieldRef}
        label="Field A (Locked Focus)"
        value={fieldAValue}
        onChange={handleFieldAChange}
        onBlur={handleFieldABlur}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Field B"
        fullWidth
        margin="normal"
        onFocus={handleManualFocus}
      />

      <Autocomplete
        disableClearable
        options={options}
        value={autoValue}
        onChange={(event, newValue) => setAutoValue(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Fruits (Autocomplete)"
            onFocus={handleManualFocus}
          />
        )}
      />
{/* warning: in the working copy of 'yarn.lock', LF will be replaced by CRLF the next time Git touches it */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSnackbar(false)} severity="info" variant="filled">
          Value changed to "Scan A"
        </Alert>
      </Snackbar>
    </Box>
  );
}
