"use client";

import type React from "react";
import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { UIMessage } from "ai";
import { Textarea } from "./ui/textarea";
import Markdown from "./markdown";
import { Avatar, AvatarFallback } from "./ui/avatar";

// Utility function to format relative time
const formatRelativeTime = (date: Date | undefined): string => {
  if (!date) return "";
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hr ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};
const initialMessages: UIMessage[] = [
  {
    id: "welcome-message",
    role: "assistant",
    parts: [
      {
        type: "text",
        text: "I'm your notes assistant. I can find and summarize any information that you saved.",
      },
    ],
    content:
      "I'm your notes assistant. I can find and summarize any information that you saved.",
    createdAt: new Date(),
  },
];
export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    initialMessages,
  });
  const isProcessing = status === "submitted" || status === "streaming";
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, messages]);
  const handleOpenChat = () => setIsOpen(true);
  const handleCloseChat = () => setIsOpen(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Panel */}
      {isOpen && (
        <Card className="mb-4 py-0 w-80 h-96 shadow-2xl border-0  backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300 gap-0">
          {/* Header */}
          <ChatHeader onClose={handleCloseChat} />

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 h-64">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <CardFooter className="p-4 border-t rounded-b-lg">
            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything about your notes..."
                required
                autoFocus
                className="flex-1 resize-none overflow-y-scroll h-16"
              />
              <Button
                type="submit"
                disabled={isProcessing || input.trim() === ""}
                className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}

      {/* Chat Toggle Button - Only show when closed */}
      <ChatToggleButton onOpen={handleOpenChat} isOpen={isOpen} />
    </div>
  );
}

type ChatToggleButtonProps = {
  onOpen: () => void;
  isOpen: boolean;
};
const ChatToggleButton = ({ onOpen, isOpen }: ChatToggleButtonProps) => {
  if (isOpen) {
    return null;
  }
  return (
    <div className="relative">
      <Button
        onClick={onOpen}
        className="w-16 h-16 rounded-full shadow-xl bg-white hover:bg-gray-50 border-2 border-gray-200 transition-all duration-300 group scale-100 hover:scale-110 cursor-pointer"
      >
        <div className="relative">
          <MessageCircle className="w-7 h-7 text-blue-600 group-hover:text-blue-700" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>
      </Button>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Chat with AI Assistant
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

type ChatHeaderProps = {
  onClose: () => void;
};

const ChatHeader = ({ onClose }: ChatHeaderProps) => {
  return (
    <CardHeader className="flex items-center justify-between p-4 border-b rounded-t-lg">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-500" />
        <CardTitle className="text-sm">AI Assistant</CardTitle>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="text-white hover:bg-white/20 h-8 w-8 p-0"
      >
        <X className="w-4 h-4" />
      </Button>
    </CardHeader>
  );
};

type ChatMessageProps = {
  message: UIMessage;
};
const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
      key={message.id}
      className={`flex prose dark:prose-invert ${
        message.role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] ${
          message.role === "user" ? "order-2" : "order-1"
        }`}
      >
        <div
          className={`px-3 py-0.5 rounded-lg text-sm ${
            message.role === "user"
              ? "bg-blue-600 dark:text-white text-primary-foreground ml-auto"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return <Markdown key={i}>{part.text}</Markdown>;
            }
          })}
        </div>
        <div
          className={`text-xs text-gray-500 mt-1 ${
            message.role === "user" ? "text-right" : "text-left"
          }`}
        >
          {formatRelativeTime(message.createdAt)}
        </div>
      </div>
      {message.role === "assistant" && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback className="bg-blue-100 text-blue-600">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
