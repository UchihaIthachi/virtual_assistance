import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { motion } from "framer-motion";
import SettingsDrawer from "./SettingsDrawer";

const UIHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <Box
        className="pointer-events-auto"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          borderRadius: "16px",
          background: "linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))",
          backdropFilter: "blur(10px)",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: "10",
        }}
      >
        {/* Left-Aligned Icon */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: "#f3f4f6",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease, transform 0.3s ease",
              "&:hover": {
                backgroundColor: "#e5e7eb",
                transform: "scale(1.1)",
              },
            }}
            aria-label="Open settings"
          >
            <Menu sx={{ color: "#1976d2", fontSize: "1.5rem" }} />
          </IconButton>
        </motion.div>

        {/* Center-Aligned Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            fontSize: "1.25rem",
            color: "#1f2937",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          AI Harshana
          <Typography
            variant="caption"
            component="span"
            sx={{
              backgroundColor: "#f59e0b",
              color: "#fff",
              padding: "2px 8px",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: "0.75rem",
              textTransform: "uppercase",
            }}
          >
            Beta
          </Typography>
        </Typography>
      </Box>

      {/* Settings Drawer */}
      <SettingsDrawer open={isDrawerOpen} onClose={handleDrawerToggle} />
    </>
  );
};

export default UIHeader;
