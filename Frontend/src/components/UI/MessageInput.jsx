import { Button, CircularProgress, TextField, InputAdornment, IconButton } from "@mui/material";
import { Send, Clear } from "@mui/icons-material";

const MessageInput = ({ inputRef, sendMessage, loading, message }) => {
  const handleClearInput = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      className="flex items-center gap-4 pointer-events-auto max-w-screen-sm w-full mx-auto"
      style={{
        display: "flex",
        gap: "12px",
        padding: "10px",
        borderRadius: "12px",
      }}
    >
      {/* Input Field */}
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Ask anything to AI Harshana..."
        inputRef={inputRef}
        disabled={loading}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          borderRadius: "8px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2)",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.1)",
            },
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
              boxShadow: "0px 0px 8px rgba(25, 118, 210, 0.5)",
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <>
              {/* Show Loader if Loading */}
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearInput} edge="end">
                    <Clear />
                  </IconButton>
                </InputAdornment>
              )}
            </>
          ),
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
      />

      {/* Send Button */}
      <Button
        variant="contained"
        color="success"
        disabled={loading || message}
        onClick={sendMessage}
        startIcon={<Send />}
        sx={{
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: "8px",
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
          color: "#fff",
          boxShadow: "0px 6px 12px rgba(67, 160, 71, 0.3)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            background: "linear-gradient(45deg, #1565c0, #1e88e5)",
            transform: "scale(1.05)",
            boxShadow: "0px 8px 16px rgba(56, 142, 60, 0.4)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
