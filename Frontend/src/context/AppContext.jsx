    import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY || "₹";

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cars, setCars] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const currentConversationRef = useRef(null);
    const [socketConnected, setSocketConnected] = useState(false);
    
    // Wishlist API
    const addToWishlist = async (carId) => {
        try {
            const userToken = token || localStorage.getItem('token');
            const { data } = await axios.post('/api/user/wishlist/add', { carId }, {
                headers: { Authorization: userToken }
            });
            if (data.success) {
                setUser((prev) => ({ ...prev, wishlist: data.wishlist }));
                setWishlist(data.wishlist || []);
                toast.success('Added to wishlist');
                console.log(" added to wishlist")
            } else {
                toast.error(data.message);
                console.log("not added to wishlist")
            }
        } catch (err) {
            toast.error('Failed to add to wishlist');
            console.log(err)
        }
    };

    const removeFromWishlist = async (carId) => {
        try {
            const userToken = token || localStorage.getItem('token');
            const { data } = await axios.post('/api/user/wishlist/remove', { carId }, {
                headers: { Authorization: userToken }
            });
            if (data.success) {
                setUser((prev) => ({ ...prev, wishlist: data.wishlist }));
                setWishlist(data.wishlist || []);
                toast.success('Removed from wishlist');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to remove from wishlist');
        }
    };


    const fetchWishlist = async () => {
        try {
            const { data } = await axios.get('/api/user/wishlist');
            if (data.success) {
                setWishlist(data.wishlist || []);
            }
        } catch (err) {
            console.error('fetchWishlist', err);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('/api/user/data');
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
                await fetchWishlist();
            } else {
                navigate('/');
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const fetchCars = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/user/cars');
            if (data.success) {
                setCars(data.cars);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const updateUnreadCount = (notifs) => {
        const count = notifs.filter((item) => !item.isRead).length;
        setUnreadNotificationCount(count);
    };

    const fetchNotifications = async () => {
        try {
            if (!user?._id) return;
            const { data } = await axios.get('/api/notifications');
            if (data.success) {
                setNotifications(data.notifications);
                updateUnreadCount(data.notifications);
            }
        } catch (err) {
            console.error('fetchNotifications', err);
        }
    };

    const markNotificationRead = async (notificationId) => {
        try {
            const { data } = await axios.patch(`/api/notifications/${notificationId}/read`);
            if (data.success) {
                setNotifications((prev) => {
                    const updated = prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n));
                    updateUnreadCount(updated);
                    return updated;
                });
            }
        } catch (err) {
            console.error('markNotificationRead', err);
        }
    };

    const markNotificationsReadByChatId = async (chatId) => {
        const unreadForChat = notifications.filter((n) => {
            const nChatId = n.chatId?._id ? n.chatId._id.toString() : n.chatId?.toString();
            return nChatId === chatId?.toString() && !n.isRead;
        });
        await Promise.all(unreadForChat.map((notif) => markNotificationRead(notif._id)));
    };

    const markAllNotificationsRead = async () => {
        const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
        await Promise.all(unreadIds.map((id) => markNotificationRead(id)));
    };

    const fetchConversations = async () => {
        try {
            if (!user?._id) return;
            setLoading(true);
            const { data } = await axios.get(`/api/chat/${user._id}`);
            if (data.success) {
                setConversations(data.chats);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error('fetchConversations', err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchConversationMessages = async (chatId) => {
        try {
            if (!chatId) return;
            const { data } = await axios.get(`/api/message/${chatId}`);
            if (data.success) {
                setMessages(data.messages);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.error('fetchConversationMessages', err);
            toast.error(err.message);
        }
    };

    const createOrGetChat = async (carId) => {
        try {
            if (!carId) throw new Error('Car id missing');

            const { data } = await axios.post('/api/chat', { carId });
            if (!data.success) {
                toast.error(data.message);
                return null;
            }

            const chat = data.chat;
            await fetchConversations();

            // automatically send first message for new chat
            if (chat && !chat.lastMessage) {
                const firstText = "Hi, I’m interested in this car";
                await sendMessage(chat._id, firstText);
            }

            return chat;
        } catch (err) {
            console.error('createOrGetChat', err);
            toast.error(err.message);
            return null;
        }
    };

    const sendMessage = async (chatId, text) => {
        try {
            if (!chatId || !text) return null;

            const { data } = await axios.post('/api/message/send', { chatId, text });
            if (data.success) {
                const message = data.data;
                setMessages(prev => [...prev, message]);

                // socket emit is now done in backend API
                // socket?.emit('sendMessage', {
                //     chatId,
                //     senderId: user._id,
                //     receiverId: (currentConversation?.buyer?._id === user._id ? currentConversation.seller._id : currentConversation.buyer._id),
                //     text,
                // });

                await fetchConversations();
                return message;
            }

            toast.error(data.message);
            return null;
        } catch (err) {
            console.error('sendMessage error', err);
            toast.error(err.message);
            return null;
        }
    };

    const setupSocket = () => {
        if (!token || !user || socket) return;

        const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:5001';
        const client = io(socketUrl, {
            // allow polling fallback so connection can establish in environments
            // where websocket upgrade may be blocked (dev proxies, firewalls)
            transports: ['polling', 'websocket'],
            auth: { token },
            autoConnect: true,
        });

        client.on('connect', () => {
            client.emit('join', user._id);
            setSocketConnected(true);
            console.log('Socket connected', client.id);
        });


        client.on('newMessage', (message) => {
            console.log('Received message:', message);
            if (!message) return;

            const senderId = message.sender?._id ? message.sender._id : message.sender;
            if (String(senderId) === String(user?._id)) {
                // don't re-add your own message (already appended in sendMessage)
                return;
            }

            const currentChatId = currentConversationRef.current?._id?.toString();
            const messageChatId =
                message.chat?._id?.toString() ||
                message.chat?.toString() ||
                message.chatId?._id?.toString() ||
                message.chatId?.toString();

            if (currentChatId && messageChatId && currentChatId === messageChatId) {
                setMessages(prev => {
                    const exists = prev.some(msg => {
                        const left = msg._id ? msg._id.toString() : msg._id;
                        const right = message._id ? message._id.toString() : message._id;
                        return left === right;
                    });
                    if (exists) return prev;
                    return [...prev, message];
                });
            } else {
                // Show toast for new message in other chat
                toast.custom((t) => (
                    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                        <div className="font-semibold">New message from {message.sender?.name || 'Someone'}</div>
                        <div className="text-sm text-gray-600">{message.text || message.message || ''}</div>
                    </div>
                ));
            }

            // always refresh conversation list so lastMessage is updated
            fetchConversations();
        });

        client.on('newNotification', (notification) => {
            if (!notification) return;
            setNotifications((prev) => {
                const existing = prev.some((item) => item._id === notification._id);
                const updated = existing ? prev.map((item) => item._id === notification._id ? { ...item, ...notification } : item) : [notification, ...prev];
                updateUnreadCount(updated);
                return updated;
            });
            toast.custom((t) => (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                    <div className="font-semibold">New message from {notification.senderId?.name || 'Someone'}</div>
                    <div className="text-sm text-gray-600">{notification.text}</div>
                </div>
            ));
        });

        client.on('disconnect', () => {
            setSocketConnected(false);
            console.log('Socket disconnected');
        });

        setSocket(client);

        return () => {
            client.disconnect();
        };
    };

    const refetchCars = async () => {
        await fetchCars();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common['Authorization'] = '';
        setConversations([]);
        setMessages([]);
        socket?.disconnect();
        fetchCars();
        toast.success("Successfully Logout");
    };

    useEffect(() => {
        const userToken = localStorage.getItem('token');

        if (userToken) {
            setToken(userToken);
            axios.defaults.headers.common['Authorization'] = `${userToken}`;
            fetchUser();
            fetchCars();
        } else {
            fetchCars();
        }
    }, []);

    useEffect(() => {
        if (!token || !user || socket) return;

        fetchConversations();
        fetchNotifications();

        const cleanup = setupSocket();
        return cleanup;
    }, [token, user, socket]);

    useEffect(() => {
        currentConversationRef.current = currentConversation;
        if (currentConversation?._id) {
            fetchConversationMessages(currentConversation._id);
            socket?.emit('join_chat', currentConversation._id);
            return () => socket?.emit('leave_chat', currentConversation._id);
        }
    }, [currentConversation, socket]);

    useEffect(() => {
        if (socket && conversations.length > 0) {
            conversations.forEach(conv => {
                socket.emit('join_chat', conv._id.toString());
            });
        }
    }, [socket, conversations]);

    const value = {
            addToWishlist,
            removeFromWishlist,
            fetchWishlist,
            wishlist,
        navigate,
        currency,
        axios,
        user,
        setUser,
        token,
        setToken,
        isOwner,
        setIsOwner,
        fetchUser,
        showLogin,
        setShowLogin,
        logout,
        fetchCars,
        refetchCars,
        cars,
        setCars,
        loading,
        setLoading,
        socket,
        conversations,
        setConversations,
        currentConversation,
        setCurrentConversation,
        messages,
        setMessages,
        fetchConversations,
        fetchConversationMessages,
        createOrGetChat,
        sendMessage,
        socketConnected,
        notifications,
        unreadNotificationCount,
        fetchNotifications,
        markNotificationRead,
        markNotificationsReadByChatId,
        markAllNotificationsRead,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};

