import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

export function useLocksSocket({ token, serverUrl }) {
    const socketRef = useRef(null);
    const [locks, setLocks] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        if (!token || !serverUrl) return;

        const socket = io(serverUrl, {
            auth: { token },
        });
        socketRef.current = socket;

        const handleConnect = () => setConnected(true);
        const handleDisconnect = () => setConnected(false);
        const handleCurrentLocks = (locksData) => setLocks(locksData);
        const handleLockAdded = ({ claimId, userId }) =>
            setLocks((prev) => [...prev, claimId]);
        const handleLockRemoved = ({ claimId }) =>
            setLocks((prev) => prev.filter((lock) => lock !== claimId));

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("currentLocks", handleCurrentLocks);
        socket.on("lockAdded", handleLockAdded);
        socket.on("lockRemoved", handleLockRemoved);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("currentLocks", handleCurrentLocks);
            socket.off("lockAdded", handleLockAdded);
            socket.off("lockRemoved", handleLockRemoved);
            socket.disconnect();
        };
    }, [token, serverUrl]);

    const addLock = useCallback((claimId) => {
        socketRef.current?.emit("addLock", claimId);
    }, []);

    const removeLock = useCallback((claimId) => {
        socketRef.current?.emit("removeLock", claimId);
    }, []);

    return {
        connected,
        locks,
        addLock,
        removeLock,
    };
}
