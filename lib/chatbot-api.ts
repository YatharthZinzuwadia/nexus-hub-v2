const BASE_URL = "https://universal-chatbot-v58z.onrender.com";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  metadata?: {
    tokens?: number;
    processingTime?: number;
    model?: string;
    toolsUsed?: string[];
    intent?: string;
    knowledgeEntries?: number;
    fallbackApplied?: boolean;
  };
}

interface ConversationInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  metadata?: {
    userId?: string;
    title?: string;
    source?: string;
  };
}

interface ChatResponse {
  response: string;
  conversationId: string;
  metadata: {
    tokens: number;
    processingTime: number;
    intent: string;
    toolsUsed: string[];
    knowledgeEntries: number;
    fallbackApplied?: boolean;
  };
}

interface ConversationHistory {
  conversationId: string;
  conversationInfo: ConversationInfo;
  messages: Message[];
  totalMessages: number;
}

interface SessionInfo {
  id: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  metadata?: {
    userId?: string;
    source?: string;
    title?: string;
  };
  duration: string;
}

interface ToolsResponse {
  availableTools: string[];
  toolDetails: {
    name: string;
    description: string;
  }[];
  totalTools: number;
}

interface StatsResponse {
  totalRequests: number;
  activeSessions: number;
  averageResponseTime: number;
  successRate: number;
  modelProvider: string;
  uptime: string;
}

interface HealthResponse {
  status: string;
  timestamp: string;
  services: {
    name: string;
    status: string;
    responseTime: number;
  }[];
}

interface DetailedHealthResponse {
  status: string;
  timestamp: string;
  uptime: string;
  version: string;
  services: {
    name: string;
    status: string;
    responseTime: number;
    details?: Record<string, unknown>;
  }[];
  system: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    cpu: {
      usage: number;
    };
  };
}

interface ReadinessResponse {
  ready: boolean;
  checks: {
    database: boolean;
    external_apis: boolean;
    memory: boolean;
    disk_space: boolean;
  };
  timestamp: string;
}

interface LivenessResponse {
  alive: boolean;
  timestamp: string;
  last_check: string;
}

interface ApiDocumentation {
  title: string;
  version: string;
  description?: string;
  endpoints: {
    path: string;
    method: string;
    description?: string;
    parameters?: Record<string, unknown>;
    responses?: Record<string, unknown>;
  }[];
  baseUrl?: string;
}

interface MessageContext {
  userId?: string;
  sessionId?: string;
  source?: string;
  metadata?: Record<string, unknown>;
  tools?: string[];
  intent?: string;
}

class ChatbotAPI {
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      "X-Request-ID": this.generateRequestId(),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Simple chat endpoint
  async sendMessage(
    message: string,
    conversationId?: string,
    context?: MessageContext,
  ): Promise<ApiResponse<ChatResponse>> {
    return this.makeRequest<ChatResponse>("/api/copilot/run", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversationId,
        context,
      }),
    });
  }

  // Universal AI execution endpoint
  async sendUniversalMessage(
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
    conversationId?: string,
  ): Promise<ApiResponse<ChatResponse>> {
    return this.makeRequest<ChatResponse>("/api/copilot/universal", {
      method: "POST",
      body: JSON.stringify({
        userInput,
        context,
        tools,
        conversationId,
      }),
    });
  }

  // Get conversation history
  async getConversationHistory(
    sessionId: string,
    limit?: number,
    includeMetadata?: boolean,
  ): Promise<ApiResponse<ConversationHistory>> {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    if (includeMetadata) params.append("includeMetadata", "true");

    return this.makeRequest<ConversationHistory>(
      `/api/copilot/history/${sessionId}?${params.toString()}`,
    );
  }

  // Get session information
  async getSessionInfo(sessionId: string): Promise<ApiResponse<SessionInfo>> {
    return this.makeRequest<SessionInfo>(`/api/copilot/session/${sessionId}`);
  }

  // Delete session
  async deleteSession(sessionId: string): Promise<
    ApiResponse<{
      conversationId: string;
      deletedMessagesCount: number;
      conversationDeleted: boolean;
    }>
  > {
    return this.makeRequest(`/api/copilot/session/${sessionId}`, {
      method: "DELETE",
    });
  }

  // Get available tools
  async getAvailableTools(): Promise<ApiResponse<ToolsResponse>> {
    return this.makeRequest<ToolsResponse>("/api/copilot/tools");
  }

  // Get orchestrator statistics
  async getStats(): Promise<ApiResponse<StatsResponse>> {
    return this.makeRequest<StatsResponse>("/api/copilot/stats");
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<HealthResponse>> {
    return this.makeRequest<HealthResponse>("/api/health");
  }

  // Detailed health check
  async detailedHealthCheck(): Promise<ApiResponse<DetailedHealthResponse>> {
    return this.makeRequest<DetailedHealthResponse>("/api/health/detailed");
  }

  // Readiness check
  async readinessCheck(): Promise<ApiResponse<ReadinessResponse>> {
    return this.makeRequest<ReadinessResponse>("/api/health/ready");
  }

  // Liveness check
  async livenessCheck(): Promise<ApiResponse<LivenessResponse>> {
    return this.makeRequest<LivenessResponse>("/api/health/live");
  }

  // Get API documentation
  async getApiDocumentation(): Promise<ApiResponse<ApiDocumentation>> {
    return this.makeRequest<ApiDocumentation>("/api/docs");
  }
}

export const chatbotAPI = new ChatbotAPI();
export type {
  Message,
  ConversationInfo,
  ChatResponse,
  ConversationHistory,
  SessionInfo,
  ToolsResponse,
  StatsResponse,
  HealthResponse,
  MessageContext,
  ApiDocumentation,
};
