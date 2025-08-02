import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { getCurrentUser } from "../services/userService";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const [userData, setUserData] = useState()
  const [userInitials, setUserInitials] = useState("")
  const navigate = useNavigate();


  const getInitials = (name) => {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };
  console.log(userInitials,"userInitials");
  


  const getUserData = async () => {
    try {
      const response = await getCurrentUser()
      if (response.data.success == true) {
        setUserData(response.data.userData)

        const initials = getInitials(response.data.userData.name);
        
        setUserInitials(initials);
      }

    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong.");
      } else {
        toast.error("Internal server error.");
      }
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  const handleLogout = () => {
    localStorage.clear();
    toast.success('Signed out successfully');
    navigate('/'); 
  };

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(to bottom, #db2777, #ef4444, #f97316)", }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>

        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: '24px' }}>
          Expense Tracker
        </Typography>

        {/* Profile Avatar */}
        <Box>
          <IconButton onClick={handleMenuOpen}>


            <Avatar
              sx={{
                width: 40,
                height: 40,
                border: "2px solid white",
                backgroundColor: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  background: "linear-gradient(to right, #f43f5e, #db2777, #ef4444)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {userInitials}
              </Typography>
            </Avatar>


          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 180,
                borderRadius: 2,
              },
            }}
          >
            <Box px={2} pt={1}>
              <Typography fontWeight="bold">{userData?.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {userData?.email}
              </Typography>
            </Box>
            <MenuItem sx={{ mt: 1 }} onClick={()=> handleLogout()}>Sign Out</MenuItem>
          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar