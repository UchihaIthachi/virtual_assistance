export const formatConversation = (history) => {
    const contextWindow = history.slice(-5);
    return contextWindow.map((m) => `${m.role}: ${m.text}`).join("\n");
  };
  