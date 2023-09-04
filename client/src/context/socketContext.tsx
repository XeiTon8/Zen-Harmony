import React from 'react'

export interface IWebSocketContext {
    socketRef: React.MutableRefObject<WebSocket | null>;
};

export const WebSocketContext = React.createContext<IWebSocketContext | undefined>(undefined);

export const WebSocketProvider: React.FC<{children: any}> = ({ children }) => {
    const socketRef = React.useRef<WebSocket | null>(null);

    React.useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8081'); 
        socketRef.current = newSocket;

        socketRef.current.addEventListener("open", (event) => {
            console.log("WebSocket connection is open", event);
        });
        socketRef.current.addEventListener("message", (event) => {
        });
        socketRef.current.addEventListener("close", (event) => {
            console.log("WebSocket connection is closed", event);
        });
        socketRef.current.addEventListener("error", (event) => {
            console.error("WebSocket error:", event);
        });
        console.log("Socket: ", socketRef.current);
        
        return () => {
            socketRef.current?.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ socketRef }}>
            {children}
        </WebSocketContext.Provider>
    );
};