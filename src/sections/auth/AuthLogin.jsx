import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// material-ui
import {
  Box, Button, FormControl, FormHelperText, InputAdornment,
  InputLabel, Link, OutlinedInput, Stack, TextField
} from '@mui/material';

// third party
import { useForm } from 'react-hook-form';

// project imports
import { emptySchema } from 'utils/validationSchema';
import apiService from 'services/apiService'
import { SUCCESS_STATUS } from '../../utils/constant';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthLogin({ inputSx }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = JSON.stringify(data);
      const result = await apiService.post('users/login', payload);
      if (result.message === SUCCESS_STATUS) {
        localStorage.setItem('dks_liquor_token' , result.response.token);
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to create item:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{ gap: 3 }}>
        <Box>
          <TextField
            id="username"
            variant="outlined"
            {...register('username', emptySchema)}
            placeholder="Username"
            fullWidth
            label="Username"
            error={Boolean(errors.username)}
            sx={inputSx}
          />
          {errors.username?.message && <FormHelperText error>{errors.username.message}</FormHelperText>}
        </Box>

        <Box>
          <FormControl fullWidth error={Boolean(errors.password)}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              {...register('password', emptySchema)}
              id="password"
              type={isPasswordVisible ? 'text' : 'password'}
              label="Password"
              placeholder="Password"
              endAdornment={
                <InputAdornment position="end" sx={{ cursor: 'pointer' }} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
                  {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                </InputAdornment>
              }
              sx={inputSx}
            />
          </FormControl>

          <Stack
            direction="row"
            sx={{
              alignItems: 'flex-start',
              justifyContent: errors.password ? 'space-between' : 'flex-end',
              width: 1,
              gap: 1
            }}
          >
            {errors.password?.message && <FormHelperText error>{errors.password.message}</FormHelperText>}
            <Link
              component={RouterLink}
              underline="hover"
              variant="subtitle2"
              to="/forgot-password"
              textAlign="right"
              sx={{ '&:hover': { color: 'primary.dark' }, mt: 0.375, whiteSpace: 'nowrap' }}
            >
              Forgot Password?
            </Link>
          </Stack>
        </Box>
      </Stack>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          background: 'linear-gradient(to right, rgba(14, 26, 116, 1) 0%, rgba(188, 5, 5, 1) 50%, rgba(80, 17, 62, 1) 100%)',
          minWidth: 120,
          mt: { xs: 2, sm: 3 },
          '& .MuiButton-endIcon': { ml: 1 }
        }}
      >
        Sign In
      </Button>
    </form>
  );
}

AuthLogin.propTypes = {
  inputSx: PropTypes.any
};
