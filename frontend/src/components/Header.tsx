import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅ Import context

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isAuthenticated } = useAuth(); // ✅ Grab auth status

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: "Home", path: "/dashboard" },
    { label: "Properties", path: "/properties" },
    { label: "Expenses", path: "/expenses" },
    { label: "Bookings", path: "/bookings" },
    ...(isAuthenticated
      ? [{ label: "Logout", path: "/logout" }]
      : [
          { label: "Login", path: "/login" },
          { label: "Register", path: "/register" },
        ]),
  ];

  return (
    <AppBar
      position="sticky"
      sx={{
        background: "linear-gradient(90deg, #d83b4c 0%, #fd5c63 100%)",
        color: "white",
        boxShadow: 3,
        fontFamily: "'Nunito Sans', sans-serif",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
          BnBudget
        </Typography>

        {/* Desktop Nav */}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.label}
              color="inherit"
              component={Link}
              to={item.path}
              sx={{
                fontWeight: "bold",
                color: "white",
                fontFamily: "'Nunito Sans', sans-serif",
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Mobile Nav */}
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            {navItems.map((item) => (
              <MenuItem
                key={item.label}
                component={Link}
                to={item.path}
                onClick={handleMenuClose}
                sx={{ fontFamily: "'Nunito Sans', sans-serif" }}
              >
                {item.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
