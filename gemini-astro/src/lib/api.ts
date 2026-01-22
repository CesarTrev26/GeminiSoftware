// API Configuration
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3001/api';

// Types
export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  client?: string;
  description: string;
  longDescription?: string;
  thumbnail?: string;
  images: ProjectImage[];
  tags: string[];
  results?: ProjectResult[];
  year?: string;
  duration?: string;
  website?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface ProjectImage {
  id: string;
  url: string;
  alt?: string;
  caption?: string;
}

export interface ProjectResult {
  label: string;
  value: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: 'Error de conexión con el servidor',
    };
  }
}

// Projects API
export const projectsAPI = {
  // Get all projects
  getAll: async (params?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    page?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured) searchParams.set('featured', 'true');
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.page) searchParams.set('page', params.page.toString());
    
    const query = searchParams.toString();
    return apiCall<Project[]>(`/projects${query ? `?${query}` : ''}`);
  },

  // Get single project by slug
  getBySlug: async (slug: string) => {
    return apiCall<Project>(`/projects/${slug}`);
  },

  // Get categories
  getCategories: async () => {
    return apiCall<string[]>('/projects/categories');
  },
};

// Contact API
export const contactAPI = {
  // Submit contact form
  submit: async (data: ContactForm) => {
    return apiCall<void>('/contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Auth API (for admin panel)
export const authAPI = {
  // Login
  login: async (email: string, password: string) => {
    return apiCall<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get current user
  me: async (token: string) => {
    return apiCall<any>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
