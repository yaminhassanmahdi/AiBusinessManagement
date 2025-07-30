import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Facebook, Phone, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ChatConversation {
  id: string;
  customer_name?: string;
  customer_phone?: string;
  channel: string;
  is_active: boolean;
  last_message_at: string;
  unread_count?: number;
}

interface ChatMessage {
  id: string;
  sender_type: string;
  sender_name?: string;
  content: string;
  created_at: string;
}

const ChatTab = () => {
  const { business } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (business?.id) {
      fetchConversations();
    }
  }, [business]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    if (!business?.id) return;

    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('last_message_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch messages",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !business?.id) return;

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            conversation_id: selectedConversation.id,
            business_id: business.id,
            sender_type: 'human',
            sender_name: 'You',
            content: newMessage.trim(),
          }
        ]);

      if (error) throw error;

      setNewMessage('');
      fetchMessages(selectedConversation.id);
      
      // Update conversation last_message_at
      await supabase
        .from('chat_conversations')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', selectedConversation.id);

      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'facebook': return <Facebook className="h-4 w-4" />;
      case 'whatsapp': return <Phone className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'facebook': return 'default';
      case 'whatsapp': return 'secondary';
      case 'website': return 'outline';
      default: return 'outline';
    }
  };

  const getSenderColor = (senderType: string) => {
    switch (senderType) {
      case 'customer': return 'bg-secondary text-secondary-foreground';
      case 'ai': return 'bg-primary text-primary-foreground';
      case 'human': return 'bg-accent text-accent-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (loading) {
    return <div>Loading conversations...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>Active customer chats</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {conversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No active conversations</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 cursor-pointer hover:bg-accent transition-colors border-b ${
                      selectedConversation?.id === conversation.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(conversation.channel)}
                        <span className="font-medium">
                          {conversation.customer_name || 'Unknown Customer'}
                        </span>
                      </div>
                      <Badge variant={getChannelColor(conversation.channel)}>
                        {conversation.channel}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {conversation.customer_phone || 'No phone number'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(conversation.last_message_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedConversation ? (
              <div className="flex items-center gap-2">
                {getChannelIcon(selectedConversation.channel)}
                <span>{selectedConversation.customer_name || 'Unknown Customer'}</span>
                <Badge variant={getChannelColor(selectedConversation.channel)}>
                  {selectedConversation.channel}
                </Badge>
              </div>
            ) : (
              'Select a conversation'
            )}
          </CardTitle>
          {selectedConversation?.customer_phone && (
            <CardDescription>{selectedConversation.customer_phone}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {selectedConversation ? (
            <div className="flex flex-col h-[500px]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {message.sender_name || message.sender_type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                      <div
                        className={`inline-block p-3 rounded-lg max-w-xs ${getSenderColor(message.sender_type)} ${
                          message.sender_type === 'human' ? 'ml-auto' : ''
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px]">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatTab;