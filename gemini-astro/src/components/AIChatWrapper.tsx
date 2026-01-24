import { lazy, Suspense } from 'react';

// Lazy load the AIChat component to avoid SSR issues
const AIChat = lazy(() => import('./AIChat'));

export default function AIChatWrapper() {
  return (
    <Suspense fallback={null}>
      <AIChat />
    </Suspense>
  );
}
