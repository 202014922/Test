// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from '@mui/material';

const Header = () => {
    return (
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4, mb: 4 }}>
            <Grid item xs={12} textAlign="center">
                <Button component={Link} to="/home" color="inherit">Home</Button>
                <Button component={Link} to="/profile-settings" color="inherit">Profile</Button>
                <Button component={Link} to="/match" color="inherit">Match</Button>
                <Button component={Link} to="/chats" color="inherit">Chats</Button>
                <Button component={Link} to="/notifications" color="inherit">Notifications</Button>
            </Grid>
        </Grid>
    );
};

export default Header;
