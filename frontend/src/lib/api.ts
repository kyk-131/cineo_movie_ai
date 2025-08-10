const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface User {
  id: string;
  email: string;
  credits: number;
  plan: string;
  created_at: string;
}

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

interface Generation {
  id: string;
  prompt: string;
  model_id: string;
  result_url: string;
  type: 'image' | 'video';
  created_at: string;
  credits_used: number;
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: 'replicate' | 'huggingface' | 'local';
  credits_per_generation: number;
  type: 'image' | 'video';
  preview_url?: string;
}

interface DashboardData {
  user: User;
  recent_generations: Generation[];
  usage_stats: {
    total_generations: number;
    credits_used_this_month: number;
    images_generated: number;
    videos_generated: number;
  };
}

interface GenerationRequest {
  prompt: string;
  model_id: string;
  resolution?: string;
  aspect_ratio?: string;
  seed?: number;
  reference_image_url?: string;
  duration?: number;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || `HTTP error! status: ${response.status}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Auth endpoints
  async signup(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<null>> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    return this.request<null>('/auth/logout', { method: 'POST' });
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me');
  }

  // Dashboard
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return this.request<DashboardData>('/dashboard');
  }

  // Generation endpoints
  async generateImage(request: GenerationRequest): Promise<ApiResponse<Generation>> {
    return this.request<Generation>('/generate/image', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async generateVideo(request: GenerationRequest): Promise<ApiResponse<Generation>> {
    return this.request<Generation>('/generate/video', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Models
  async getModels(): Promise<ApiResponse<AIModel[]>> {
    return this.request<AIModel[]>('/models');
  }

  // History
  async getHistory(): Promise<ApiResponse<Generation[]>> {
    return this.request<Generation[]>('/history');
  }

  // Credits
  async getCredits(): Promise<ApiResponse<{ credits: number }>> {
    return this.request<{ credits: number }>('/credits');
  }

  // Coupon
  async redeemCoupon(code: string): Promise<ApiResponse<{ credits_added: number }>> {
    return this.request<{ credits_added: number }>('/coupon/redeem', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Plans
  async getPlans(): Promise<ApiResponse<Plan[]>> {
    return this.request<Plan[]>('/plans');
  }
}

export const apiService = new ApiService();
export type { User, Generation, AIModel, DashboardData, GenerationRequest };