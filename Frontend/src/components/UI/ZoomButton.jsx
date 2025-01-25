import { Tooltip, IconButton, CircularProgress, useMediaQuery } from "@mui/material";
import { ZoomIn, ZoomOut } from "@mui/icons-material";
import { motion } from "framer-motion";
import useSound from "use-sound";
import click1Sound from "../../assets/click1.wav";
import click2Sound from "../../assets/click2.wav";

const ZoomButton = ({ cameraZoomed, setCameraZoomed, loading }) => {
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  // Load sound effects
  const [playClick1] = useSound(click1Sound, { volume: 0.5 });
  const [playClick2] = useSound(click2Sound, { volume: 0.5 });

  const handleClick = () => {
    if (cameraZoomed) {
      playClick2(); // Play zoom-out sound
    } else {
      playClick1(); // Play zoom-in sound
    }
    setCameraZoomed(!cameraZoomed);
  };

  return (
    <div
      className="fixed pointer-events-auto z-50"
      style={{
        top: "50%",
        right: "16px",
        transform: "translateY(-50%)", // Center the button vertically
      }}
    >
      <Tooltip
        title={cameraZoomed ? "Zoom Out the Camera" : "Zoom In the Camera"}
        arrow
        placement="left"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconButton
            onClick={handleClick}
            sx={{
              width: isSmallScreen ? "48px" : "56px",
              height: isSmallScreen ? "48px" : "56px",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "#fff",
              boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.2)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              "&:hover": {
                background: "linear-gradient(45deg, #1565c0, #1e88e5)",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.25)",
              },
              "&:active": {
                transform: "scale(0.95)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : cameraZoomed ? (
              <ZoomOut sx={{ fontSize: "24px" }} />
            ) : (
              <ZoomIn sx={{ fontSize: "24px" }} />
            )}
          </IconButton>
        </motion.div>
      </Tooltip>
    </div>
  );
};

export default ZoomButton;
