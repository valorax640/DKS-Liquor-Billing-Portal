import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// material-ui
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { SiWine } from "react-icons/si";

// project imports
import MainCard from 'components/cards/MainCard';

// assets
import Logo from 'assets/images/logo-dks.png';
import LoginImage from '../../assets/images/champagne.png';
const img = 'https://images.pexels.com/photos/2796105/pexels-photo-2796105.jpeg'

// ==============================|| COMMON AUTH LAYOUT ||============================== //

export default function CommonAuthLayout({ title, subHeading, footerLink, children }) {
  const MotionTypography = motion(Typography);
  const MotionBox = motion(Box);
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        position: 'relative',
        height: 1,
        minHeight: '100vh',
        overflow: 'hidden',
        zIndex: 1,

        // blurred background layer
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px)',
          zIndex: -1,
        },
      }}
    >
      <Grid size={{ xs: 11, sm: 7, md: 6, lg: 8 }} >
        <MainCard
          sx={{
            overflow: 'visible',
            display: 'flex',
            position: 'relative',
            '& .MuiCardContent-root': { flexGrow: 1, flexBasis: '50%', width: '50%' },
            maxWidth: "100%",
            margin: '24px auto',
            boxShadow: `
      0px 8px 30px rgba(0, 0, 0, 0.25),
      0px 16px 40px rgba(0, 0, 0, 0.15)
    `,
          }}
          contentSX={{ flexGrow: 1, flexBasis: '50%', width: '50%', px: 4, pt: 5 }}
        >
          <Box display='flex' justifyContent='space-between'>
            <Stack
              direction="column"
              alignItems='center'
              sx={{
                mb: 2,
                width: '50%',
                border: 1,
                display: { xs: 'none', lg: 'flex', md: 'flex' },
                py: 2,
                borderRadius: 6,
                borderColor: 'lightgrey',
                background: 'linear-gradient(to right, rgba(14, 26, 116, 1) 0%, rgba(188, 5, 5, 1) 50%, rgba(80, 17, 62, 1) 100%)'
              }}
            >
              {/* <CardMedia component="img" sx={{ width: 60, height: 50 }} image={LoginImage} alt="logo" /> */}
              <Box
                sx={{
                  width: '90%',
                  maxWidth: 500,
                  py: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <MotionTypography variant="h4" color="white" sx={{ mt: 3, fontWeight: 'bold' }} initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}>
                  Welcome!
                </MotionTypography>
                <MotionTypography
                  variant="h3"
                  color="white"
                  sx={{ mt: 3, fontWeight: '800' }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  DKS Liquor Billing Portal
                </MotionTypography>
                <MotionBox
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <SiWine size={80} color='white' style={{ marginTop: 60 }} />
                </MotionBox>
              </Box>
            </Stack>
            <Divider orientation="vertical" flexItem />
            <Stack direction="column" sx={{ mb: 2, gap: 4, justifyContent: 'center' }}>
              <Stack
                direction={{ xs: 'column-reverse', sm: 'row' }}
                sx={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: { xs: 2, sm: 1 } }}
              >
                <Box>
                  <Typography color="text.primary" gutterBottom variant="h2">
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontSize={13}>
                    {subHeading}
                  </Typography>
                </Box>
                <Link to="/">
                  <Box sx={{ borderRadius: 10, p: 2, background: 'linear-gradient(to right, rgba(14, 26, 116, 1) 0%, rgba(188, 5, 5, 1) 50%, rgba(80, 17, 62, 1) 100%)' }}>
                    <CardMedia component="img" sx={{ width: 150, height: 'auto' }} image={Logo} alt="logo" />
                  </Box>
                </Link>
              </Stack>

              {children}
            </Stack>
          </Box>
          {/* {footerLink && (
            <Typography variant="subtitle2" color="text.secondary" component={Link} to={footerLink.link} sx={{ textDecoration: 'none' }}>
              {footerLink.title}
            </Typography>
          )} */}
        </MainCard>
      </Grid>
    </Grid>
  );
}

CommonAuthLayout.propTypes = {
  title: PropTypes.string,
  subHeading: PropTypes.string,
  footerLink: PropTypes.object,
  children: PropTypes.node
};
