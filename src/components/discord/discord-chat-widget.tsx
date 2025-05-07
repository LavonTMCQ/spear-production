"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PaperAirplaneIcon, XMarkIcon, MinusIcon } from "@heroicons/react/24/outline";

// Mock chat messages
const initialMessages = [
  {
    id: "1",
    content: "👋 Welcome to SPEAR support! How can we help you today?",
    sender: "SPEAR Support",
    avatar: "/images/avatars/support.jpg",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    isBot: false
  }
];

interface DiscordChatWidgetProps {
  userName?: string;
  userAvatar?: string;
}

export function DiscordChatWidget({ userName = "Guest User", userAvatar }: DiscordChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: (messages.length + 1).toString(),
      content: newMessage,
      sender: userName,
      avatar: userAvatar,
      timestamp: new Date().toISOString(),
      isBot: false
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulate bot typing
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      let botResponse;

      // Simple keyword-based responses
      if (newMessage.toLowerCase().includes("hello") || newMessage.toLowerCase().includes("hi")) {
        botResponse = "👋 Hello! How can I help you today?";
      } else if (newMessage.toLowerCase().includes("teamviewer")) {
        botResponse = "For TeamViewer issues, please check our integration guide or visit the TeamViewer admin page. Would you like me to share a link?";
      } else if (newMessage.toLowerCase().includes("help") || newMessage.toLowerCase().includes("support")) {
        botResponse = "I'm here to help! Please describe your issue in detail, and I'll do my best to assist you or connect you with our support team.";
      } else {
        botResponse = "Thank you for your message. Our support team will review it and get back to you soon. Is there anything else I can help with?";
      }

      const botMessage = {
        id: (messages.length + 2).toString(),
        content: botResponse,
        sender: "SPEAR Support",
        avatar: "/images/avatars/support.jpg",
        timestamp: new Date().toISOString(),
        isBot: true
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }, 1500);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </Button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className={`fixed bottom-4 right-4 w-80 rounded-lg shadow-xl bg-card border z-50 transition-all duration-200 ${isMinimized ? 'h-14' : 'h-96'}`}>
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <h3 className="font-medium text-sm">SPEAR Discord Support</h3>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <MinusIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4 h-[calc(100%-110px)]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot === false ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex ${message.isBot === false ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src={message.avatar} alt={message.sender} />
                        <AvatarFallback>{message.sender.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className={`mx-2 ${message.isBot === false ? 'text-right' : 'text-left'}`}>
                        <div className={`px-3 py-2 rounded-lg ${message.isBot === false ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex flex-row max-w-[80%]">
                      <Avatar className="h-8 w-8 mt-1">
                        <AvatarImage src="/images/avatars/support.jpg" alt="SPEAR Support" />
                        <AvatarFallback>SS</AvatarFallback>
                      </Avatar>
                      <div className="mx-2">
                        <div className="px-3 py-2 rounded-lg bg-muted">
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <PaperAirplaneIcon className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
