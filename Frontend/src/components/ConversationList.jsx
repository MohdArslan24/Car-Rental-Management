import { useAppContext } from '../context/AppContext';

const ConversationList = ({ conversations, currentConversation, loading }) => {
    const { setCurrentConversation, fetchConversationMessages, user, markNotificationsReadByChatId } = useAppContext();

    const handleSelectConversation = async (conversation) => {
        setCurrentConversation(conversation);
        await fetchConversationMessages(conversation._id);
        if (markNotificationsReadByChatId) {
            markNotificationsReadByChatId(conversation._id);
        }
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-400">Loading conversations...</div>;
    }

    if (conversations.length === 0) {
        return <div className="p-4 text-center text-gray-400">No conversations yet</div>;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="border-b p-4 font-semibold text-gray-800">Conversations</div>
            <div className="flex-1 overflow-y-auto divide-y">
                {conversations.map((conversation) => {
                    const otherUser = (conversation.buyer && conversation.seller && conversation.buyer._id === user._id)
                        ? conversation.seller
                        : (conversation.buyer && conversation.seller ? conversation.buyer : (conversation.owner?._id === user._id ? conversation.renter : conversation.owner));
                    const isSelected = currentConversation?._id === conversation._id;

                    return (
                        <div
                            key={conversation._id}
                            onClick={() => handleSelectConversation(conversation)}
                            className={`p-4 cursor-pointer transition ${
                                isSelected 
                                    ? 'bg-blue-50 border-l-4 border-blue-500' 
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-2">
                                {otherUser.image && (
                                    <img
                                        src={otherUser.image}
                                        alt={otherUser.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-800 truncate">{otherUser.name}</div>
                                    {/* <div className="text-xs text-gray-500">{otherUser.role === 'owner' ? 'Car Owner' : 'Renter'}</div> */}
                                </div>
                                {otherUser.rating && (
                                    <div className="text-xs font-semibold text-yellow-500">{otherUser.rating.toFixed(1)}⭐</div>
                                )}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                                {conversation.car ? `${conversation.car.brand} ${conversation.car.model}` : conversation.inquiry?.car ? `${conversation.inquiry.car.brand} ${conversation.inquiry.car.model}` : ''}
                            </div>
                            <div className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage || 'No messages yet'}
                            </div>
                            {conversation.lastMessageTime && (
                                <div className="text-xs text-gray-400 mt-1">
                                    {new Date(conversation.lastMessageTime).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ConversationList;
