import { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ConversationList from '../components/ConversationList';
import ChatWindow from '../components/ChatWindow';

const Messages = () => {
    const { token, user, conversations, messages, currentConversation, setCurrentConversation, fetchConversations, fetchConversationMessages, loading } = useAppContext();
    const [searchParams] = useSearchParams();
    const selectedConversationId = searchParams.get('conversation');

    useEffect(() => {
        if (token && user) {
            fetchConversations();
        }
    }, [token, user]);

    useEffect(() => {
        if (selectedConversationId) {
            const conversation = conversations.find(c => c._id === selectedConversationId);
            if (conversation) {
                setCurrentConversation(conversation);
                fetchConversationMessages(selectedConversationId);
            }
        }
    }, [selectedConversationId, conversations]);

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-xl">Please login to view messages.</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Messages</h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '600px' }}>
                        {/* Conversation List */}
                        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
                            <ConversationList 
                                conversations={conversations}
                                currentConversation={currentConversation}
                                loading={loading}
                            />
                        </div>
                        
                        {/* Chat Window */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
                            {currentConversation ? (
                                <ChatWindow 
                                    conversation={currentConversation}
                                    messages={messages}
                                />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-400">
                                    <p>Select a conversation to start chatting</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Messages;
