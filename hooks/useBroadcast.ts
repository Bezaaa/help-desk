/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useCallback } from "react";

export const useBroadcast = (channelName: string, onMessage?: (data: any) => void) => {
  const sendMessage = useCallback((data: any) => {
    const bc = new BroadcastChannel(channelName);
    bc.postMessage(data);
    bc.close();
  }, [channelName]);

  useEffect(() => {
    if (!onMessage) return;
    const bc = new BroadcastChannel(channelName);
    bc.onmessage = (event) => onMessage(event.data);
    return () => bc.close(); 
  }, [channelName, onMessage]);

  return { sendMessage };
};