'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PostHogProviderReact } from 'posthog-js/react';
import { useEffect } from 'react';
import PostHogPageView from './PostHogPageView';

export function PostHogProvider({ children }) {
  useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      person_profiles: 'identified_only',
      capture_pageview: false,
    });
  }, []);

  return (
    <PostHogProviderReact client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProviderReact>
  );
}
