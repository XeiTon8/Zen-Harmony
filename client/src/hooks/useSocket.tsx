import React from 'react';
import { WebSocketContext, IWebSocketContext } from '../context/socketContext';

export const useWebSocket = (): IWebSocketContext => {
    const context = React.useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};