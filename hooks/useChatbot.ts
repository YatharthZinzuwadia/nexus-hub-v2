import { useState, useEffect, useCallback } from "react";
import { chatbotAPI, Message } from "../lib/chatbot-api";

interface UseChatbotOptions {
  onConversationChange?: (conversationId: string) => void;
  onError?: (error: Error) => void;
}

interface ChatMessage extends Message {
  isLoading?: boolean;
}

export const useChatbot = (options: UseChatbotOptions = {}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize with welcome messages
  useEffect(() => {
    const welcomeMessages: ChatMessage[] = [
      {
        id: "1",
        role: "system",
        content:
          "NexusAI v0.2.0 initialized. Neural pathways online. Quantum cores synchronized.",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "Hello, Developer. I'm NexusAI, your advanced coding companion powered by neural networks and quantum algorithms. I'm here to help you build, debug, optimize, and innovate. What legendary code shall we craft today?",
        timestamp: new Date().toISOString(),
      },
    ];
    setMessages(welcomeMessages);
  }, []);

  // Load conversation from localStorage on mount
  useEffect(() => {
    const savedConversationId = localStorage.getItem("nexusai_conversation_id");
    if (savedConversationId) {
      setConversationId(savedConversationId);
      loadConversationHistory(savedConversationId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save conversationId to localStorage when it changes
  useEffect(() => {
    if (conversationId) {
      localStorage.setItem("nexusai_conversation_id", conversationId);
      options.onConversationChange?.(conversationId);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, options.onConversationChange]);

  const loadConversationHistory = useCallback(
    async (sessionId: string) => {
      try {
        setIsLoading(true);
        const response = await chatbotAPI.getConversationHistory(
          sessionId,
          50,
          true,
        );

        if (response.success && response.data.messages.length > 0) {
          const formattedMessages: ChatMessage[] = response.data.messages.map(
            (msg) => ({
              ...msg,
              timestamp: msg.timestamp,
            }),
          );
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Failed to load conversation history:", err);
        setError(err as Error);
        options.onError?.(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [options.onError],
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: message,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Add loading indicator
      const loadingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      try {
        const response = await chatbotAPI.sendMessage(
          message,
          conversationId || undefined,
        );

        if (response.success) {
          const { response: aiResponse, conversationId: newConversationId } =
            response.data;

          // Update conversation ID if it's new
          if (newConversationId !== conversationId) {
            setConversationId(newConversationId);
          }

          // Replace loading message with actual response
          const aiMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: aiResponse,
            timestamp: new Date().toISOString(),
            metadata: {
              tokens: response.data.metadata.tokens,
              processingTime: response.data.metadata.processingTime,
              model: "nexusai",
            },
          };

          setMessages((prev) =>
            prev.map((msg) => (msg.id === loadingMessage.id ? aiMessage : msg)),
          );
        } else {
          throw new Error("API request failed");
        }
      } catch (err) {
        console.error("Failed to send message:", err);
        setError(err as Error);
        options.onError?.(err as Error);

        // Remove loading message and show error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessage.id),
        );

        const errorMessage: ChatMessage = {
          id: (Date.now() + 3).toString(),
          role: "assistant",
          content:
            "I apologize, but I encountered an error while processing your request. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [conversationId, isLoading, options.onError],
  );

  const sendUniversalMessage = useCallback(
    async (
      userInput: string,
      context?: {
        files?: string[];
        repos?: string[];
        urls?: string[];
        metadata?: Record<string, unknown>;
      },
      tools?: Array<{
        name: string;
        description: string;
        inputSchema: Record<string, unknown>;
      }>,
    ) => {
      if (!userInput.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: userInput,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Add loading indicator
      const loadingMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date().toISOString(),
        isLoading: true,
      };
      setMessages((prev) => [...prev, loadingMessage]);

      try {
        const response = await chatbotAPI.sendUniversalMessage(
          userInput,
          context,
          tools,
          conversationId || undefined,
        );

        if (response.success) {
          const { response: aiResponse, conversationId: newConversationId } =
            response.data;

          // Update conversation ID if it's new
          if (newConversationId !== conversationId) {
            setConversationId(newConversationId);
          }

          // Replace loading message with actual response
          const aiMessage: ChatMessage = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content: aiResponse,
            timestamp: new Date().toISOString(),
            metadata: {
              tokens: response.data.metadata.tokens,
              processingTime: response.data.metadata.processingTime,
              model: "nexusai-universal",
              toolsUsed: response.data.metadata.toolsUsed,
            },
          };

          setMessages((prev) =>
            prev.map((msg) => (msg.id === loadingMessage.id ? aiMessage : msg)),
          );
        } else {
          throw new Error("API request failed");
        }
      } catch (err) {
        console.error("Failed to send universal message:", err);
        setError(err as Error);
        options.onError?.(err as Error);

        // Remove loading message and show error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== loadingMessage.id),
        );

        const errorMessage: ChatMessage = {
          id: (Date.now() + 3).toString(),
          role: "assistant",
          content:
            "I apologize, but I encountered an error while processing your request. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
    [conversationId, isLoading, options.onError],
  );

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: "1",
        role: "system",
        content:
          "NexusAI v0.2.0 initialized. Neural pathways online. Quantum cores synchronized.",
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        role: "assistant",
        content:
          "Hello, Developer. I'm NexusAI, your advanced coding companion powered by neural networks and quantum algorithms. I'm here to help you build, debug, optimize, and innovate. What legendary code shall we craft today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    setConversationId(null);
    localStorage.removeItem("nexusai_conversation_id");
    setError(null);
  }, []);

  const deleteSession = useCallback(async () => {
    if (!conversationId) return;

    try {
      await chatbotAPI.deleteSession(conversationId);
      clearConversation();
    } catch (err) {
      console.error("Failed to delete session:", err);
      setError(err as Error);
      options.onError?.(err as Error);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, clearConversation, options.onError]);

  return {
    messages,
    conversationId,
    isLoading,
    error,
    sendMessage,
    sendUniversalMessage,
    clearConversation,
    deleteSession,
    loadConversationHistory,
  };
};
