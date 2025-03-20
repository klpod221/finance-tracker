"use client";

import { createContext, useContext } from "react";
import { App } from "antd";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const { message, modal, notification } = App.useApp();

  return (
    <MessageContext.Provider value={{ message, modal, notification }}>
      {children}
    </MessageContext.Provider>
  );
};

export function useMessage() {
  return useContext(MessageContext);
}
