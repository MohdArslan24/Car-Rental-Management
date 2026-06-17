import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';

const ChatWindow = ({ conversation, messages }) => {
    const { user, sendMessage, socket, currency } = useAppContext();
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const otherUser = conversation.buyer && conversation.seller
        ? (conversation.buyer._id === user?._id ? conversation.seller : conversation.buyer)
        : (conversation.owner._id === user?._id ? conversation.renter : conversation.owner);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (socket && conversation) {
            socket.emit('join_chat', conversation._id);
            return () => {
                socket.emit('leave_chat', conversation._id);
            };
        }
    }, [socket, conversation]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageText.trim()) return;

        setIsSending(true);
        try {
            const newMessage = await sendMessage(conversation._id, messageText);
            if (newMessage) {
                setMessageText('');
            }
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b p-4 bg-gray-50 flex items-center gap-3">
                {otherUser.image && (
                    <img
                        src={otherUser.image}
                        alt={otherUser.name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                )}
                <div className="flex-1">
                    <div className="font-semibold text-gray-800">{otherUser.name}</div>
                    {/* <div className="text-sm text-gray-500">{otherUser.role === 'owner' ? 'Car Owner' : 'Renter'}</div> */}
                </div>
                {otherUser.rating && (
                    <div className="text-sm font-semibold text-yellow-500">{otherUser.rating.toFixed(1)}⭐</div>
                )}
            </div>

            {/* Car details if available */}
            {(conversation.car || conversation.inquiry?.car) && (
                <div className="bg-blue-50 p-3 border-b text-sm text-gray-700 flex items-center gap-3">
                    <img
                        src={conversation.car?.image || conversation.inquiry?.car?.image}
                        alt="car"
                        className="w-16 h-12 object-cover rounded"
                    />
                    <div>
                        <div className="font-medium text-gray-800">
                            {conversation.car?.brand || conversation.inquiry?.car?.brand} {conversation.car?.model || conversation.inquiry?.car?.model}
                        </div>
                        <div className="text-xs text-gray-600">
                            {currency}{conversation.car?.dailyRate || conversation.car?.pricePerDay || conversation.inquiry?.car?.dailyRate || conversation.inquiry?.car?.pricePerDay} /day
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        <p>Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const senderId = msg.sender?._id ? msg.sender._id : msg.sender;
                        const isOwnMessage = String(senderId) === String(user?._id);
                        const messageText = msg.text || msg.message || '';
                        return (
                            <div
                                key={msg._id || idx}
                                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-lg ${
                                        isOwnMessage
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}
                                >
                                    <p className="break-words">{messageText}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className={`text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </p>
                                        {isOwnMessage && (
                                            <span className="text-xs flex items-center gap-1">
                                                {msg.seen ? (
                                                    <>
                                                        <span className="text-green-400">✓✓</span> <span>Read</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-gray-300">✓</span> <span>Delivered</span>
                                                    </>
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-white">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        disabled={isSending || !messageText.trim()}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isSending ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
