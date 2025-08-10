'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthForm, AuthFormData } from '@/components/auth/auth-form';
import { apiService } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async (data: AuthFormData) => {
    if (!data.email || !data.password || !data.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (data.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.signup(data.email, data.password);
      
      if (response.success) {
        router.push('/dashboard');
      } else {
        setError(response.error || 'Signup failed');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-gradient flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Link href="/" className="inline-flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-cineo-gradient flex items-center justify-center">
                <span className="text-lg font-bold text-cineo-black">C</span>
              </div>
              <span className="text-2xl font-space-grotesk font-bold gradient-text">
                Cineo AI
              </span>
            </Link>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-8"
          >
            <h2 className="text-xl text-muted-foreground">
              Start your creative journey with 100 free credits
            </h2>
          </motion.div>

          {/* Auth Form */}
          <AuthForm
            type="signup"
            onSubmit={handleSignup}
            isLoading={isLoading}
            error={error}
          />

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-center space-y-4"
          >
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link 
                href="/auth/login"
                className="text-cineo-blue hover:text-cineo-purple transition-colors font-medium"
              >
                Sign in
              </Link>
            </div>
            
            <div className="text-xs text-muted-foreground px-4">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-cineo-blue hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-cineo-blue hover:underline">
                Privacy Policy
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 blur-3xl opacity-10">
          <div className="w-96 h-96 bg-cineo-blue rounded-full" />
        </div>
        <div className="absolute right-1/4 bottom-1/4 blur-3xl opacity-10">
          <div className="w-96 h-96 bg-cineo-purple rounded-full" />
        </div>
      </div>
    </div>
  );
}