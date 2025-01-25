import { useRef } from "react";
import { useChat } from "../hooks/useChat";
import { motion } from "framer-motion";
import UIHeader from "./UI/UIHeader";
import ZoomButton from "./UI/ZoomButton";
import MessageInput from "./UI/MessageInput";

export const UI = ({ hidden, ...props }) => {
  const input = useRef();
  const { chat, loading, cameraZoomed, setCameraZoomed, message } = useChat();

  const sendMessage = () => {
    const text = input.current.value;
    if (!loading && !message) {
      chat(text);
      input.current.value = "";
    }
  };

  if (hidden) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none"
    >
      {/* Header */}
      <UIHeader />

      {/* Zoom Button */}
      <ZoomButton
        cameraZoomed={cameraZoomed}
        setCameraZoomed={setCameraZoomed}
      />

      {/* Input Section */}
      <MessageInput
        inputRef={input}
        sendMessage={sendMessage}
        loading={loading}
        message={message}
      />
    </motion.div>
  );
};
