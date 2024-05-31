'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import axios from 'axios';

const authSettings = ['Profile', 'Dashboard', 'Logout'];
const guestSettings = ['Login'];

function Header() {
    const router = useRouter();
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showMyEvent, setShowMyEvent] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUserType = localStorage.getItem('role'); // Assuming user_type is stored in local storage
        setIsAuthenticated(!!token);
        setUserType(storedUserType);

        if (storedUserType !== '2') {
            setShowMyEvent(true);
        }
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page) => {
        setAnchorElNav(null);
        if (page) {
            router.push(`/${page.toLowerCase().replace(' ', '')}`); // This will redirect to the route based on the page name
        }
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleMenuClick = (setting) => {
        handleCloseUserMenu();
        switch (setting) {
            case 'Dashboard':
                router.push('/dashboard');
                break;
            case 'Profile':
                router.push('/profile');
                break;
            case 'Logout':
                handleLogout();
                break;
            case 'Login': // Handling login click
                router.push('/login');
                break;
            default:
                break;
        }
    };

    const handleLogout = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            axios.post('http://13.50.187.28/api/v1/users/logout/', { token }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    alert('Logout successful', response.data.message);
                    localStorage.clear();
                    setIsAuthenticated(false);
                    router.push('/login');
                })
                .catch(error => {
                    console.error('Logout failed', error);
                    // Handling error more gracefully
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                    } else if (error.request) {
                        console.log(error.request);
                    } else {
                        console.log('Error', error.message);
                    }
                    console.log(error.config);
                });
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#272727', color: '#fff' }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/dashboard"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        CANDYPAINT
                    </Typography>

                    {userType !== '2' && (
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
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {showMyEvent && (
                                    <MenuItem onClick={() => handleCloseNavMenu('My Event')}>
                                        <Typography textAlign="center">My Event</Typography>
                                    </MenuItem>
                                )}
                            </Menu>
                        </Box>
                    )}
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="#"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        CANDYPAINT
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {showMyEvent && (
                            <Button
                                key="My Event"
                                onClick={() => handleCloseNavMenu('My Event')}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                My Event
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User Avatar" src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fprofile_3135823&psig=AOvVaw0og32xHoR5FDKZmTlGfV63&ust=1717227528884000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCNjXv-Kwt4YDFQAAAAAdAAAAABAR" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {(isAuthenticated ? authSettings : guestSettings).map((setting) => (
                                <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
