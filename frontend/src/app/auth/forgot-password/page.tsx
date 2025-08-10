'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AuthForm, AuthFormData } from '@/components/auth/auth-form';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (data: AuthFormData) => {
    if (!data.email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setEmail(data.email);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEmailSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-dark-gradient flex flex-col">
        {/* Header */}
        <div className="p-6">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </Link>
        </div>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-center"
          >
            <div className="glass-card p-8 glow-effect">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-cineo-gradient/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-cineo-blue" />
              </div>
              
              <h1 className="text-2xl font-bold gradient-text mb-4">
                Check Your Email
              </h1>
              
              <p className="text-muted-foreground mb-6">
                We&apos;ve sent a password reset link to{' '}
                <span className="text-foreground font-medium">{email}</span>
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                                     Didn&apos;t receive the email? Check your spam folder or{' '}
                   <button
                     onClick={() => setIsEmailSent(false)}
                     className="text-cineo-blue hover:text-cineo-purple transition-colors font-medium"
                   >
                     try again
                   </button>
                </p>
                
                <Link href="/auth/login">
                  <Button variant="glass" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
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

  return (
    <div className="min-h-screen bg-dark-gradient flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
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

          {/* Auth Form */}
          <AuthForm
            type="forgot-password"
            onSubmit={handleForgotPassword}
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
              Remember your password?{' '}
              <Link 
                href="/auth/login"
                className="text-cineo-blue hover:text-cineo-purple transition-colors font-medium"
              >
                Sign in
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