'use client';
import React from 'react';
import { PostHogProvider } from '../PostHogProvider';
import Sidebar from '@/components/core/Sidebar/Sidebar';
import { GoogleAnalytics } from '@next/third-parties/google';
import './layout.scss';
import TopHeader from '@/components/core/TopHeader/TopHeader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/auth.context';
import { UiProvider } from '@/context/ui.context';
import ModalWrapper from '@/containers/modals/ModalWrapper';

const queryClient = new QueryClient();
export default function layout({ children }) {
  return (
    <div>
      <PostHogProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UiProvider>
              <div className="core-layout">
                <div className="sidebar">
                  <Sidebar />
                </div>
                {children}
              </div>
              <ModalWrapper />
            </UiProvider>
          </AuthProvider>
        </QueryClientProvider>
      </PostHogProvider>
      <GoogleAnalytics gaId="G-BKWJ9FPXTM" />
    </div>
  );
}
