'use client';

import { PropsWithChildren } from 'react';
import { StepperProvider } from '@/shared/hooks/use-stepper';
import { TooltipProvider } from '@/shared/shadcn/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const Providers = (props: PropsWithChildren) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <StepperProvider totalSteps={3}>
        <TooltipProvider>
          {props.children}
        </TooltipProvider>
      </StepperProvider>
    </QueryClientProvider>
  );
};