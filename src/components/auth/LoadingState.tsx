import React from 'react';

export const LoadingState = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Initializing authentication...</p>
      </div>
    </div>
  );
};