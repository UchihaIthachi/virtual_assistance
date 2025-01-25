import React from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Close, Settings, Info, Help } from "@mui/icons-material";

const SettingsDrawer = ({ open, onClose }) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 300, // Set the drawer width
          background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(240,240,240,0.7))",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          Settings
        </Typography>
        <IconButton onClick={onClose} aria-label="Close settings">
          <Close />
        </IconButton>
      </Box>
      <List>
        <ListItem button>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="General Settings" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText primary="Help" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SettingsDrawer;
