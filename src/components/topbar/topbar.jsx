import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Lottie from "lottie-react";
import logo from "../../assets/logo.png"

import profile from "../../assets/profile.json";



const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{background:"linear-gradient(90deg,rgb(8, 67, 131) 56%, rgba(240, 245, 245, 1) 100%);",padding:"none"}}
>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon  />
          image */}
  





          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <img src={logo} alt="Logo" style={{ width: 50,height:50 ,marginLeft:"0"}} /> 
          <span
            style={{
              fontFamily: "'Satisfy', cursive",
              fontSize: "1.5rem",
              color: "white",
            }}
          >
            Student Sphere
          </span>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex',} ,marginLeft:"3rem",gap:"1.5rem"}}>
            {/* {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{
                      my: 2,
                      color: "white",
                      display: "block",
                      outline: "none",
                      fontWeight: 600,
                      fontFamily: "Poppins, sans-serif",
                      letterSpacing: "2px",
                      borderBottom: "2px solid transparent",
                      "&:hover": {
                        borderBottom: "2px solid white",
                      },
                    }}
                style={{outline:"none"}}
              >
                {page}
              </Button>
            ))} */}
          </Box>
          <Box sx={{ padding: 0}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} style={{width:"5.5rem" ,outline:"none"}}>
         <Lottie animationData={profile} loop={true}  />
              </IconButton>
            </Tooltip>

          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;