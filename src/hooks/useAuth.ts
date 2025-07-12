import { useMutation } from '@tanstack/react-query';


interface LoginParams {
  email: string;
  password: string;
}

interface SignupParams {
  email: string;
  password: string;
}

async function signupRequest({ email, password }: SignupParams) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message || 'Sign up failed');
  }
  return res.json();
}

async function loginRequest({ email, password }: LoginParams) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data?.message || 'Login failed');
  }
  return res.json();
}


export function useAuth() {


  const loginMutation = useMutation({
    mutationFn: loginRequest,
  });

  const signupMutation = useMutation({
    mutationFn: signupRequest,
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to send reset email');
      }
      return res.json();
    },
  });

  // Logout function
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
  };

  return {
    isLoading:
      loginMutation.isPending || signupMutation.isPending || forgotPasswordMutation.isPending,
    error:
      loginMutation.error
        ? { message: loginMutation.error.message }
        : signupMutation.error
        ? { message: signupMutation.error.message }
        : forgotPasswordMutation.error
        ? { message: (forgotPasswordMutation.error as Error).message }
        : null,
    user: loginMutation.data?.user ?? signupMutation.data?.user ?? null,
    login: loginMutation,
    signup: signupMutation,
    forgotPassword: forgotPasswordMutation,
    logout,
  };
}
