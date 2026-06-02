
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import DashboardContent from './DashboardContent';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface DashboardContentWrapperProps {
  initialSection?: string;
}

const DashboardContentWrapper: React.FC<DashboardContentWrapperProps> = ({ initialSection = 'messages' }) => {
  const [showContent, setShowContent] = useState(true);
  const { toast } = useToast();

  const handleReload = () => {
    setShowContent(false);
    setTimeout(() => {
      setShowContent(true);
      toast({
        title: "Dashboard refreshed",
        description: "All content has been reloaded",
      });
    }, 500);
  };

  return (
    <div className="container mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6 min-h-[90vh]">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm hidden sm:block">
            Access and manage all your Buzzer features
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReload}
          className="flex items-center gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Reload Dashboard</span>
        </Button>
      </div>
      
      <div className="transition-all duration-300 ease-in-out">
        {showContent ? (
          <DashboardContent activeSection={initialSection} />
        ) : (
          <Card className="w-full h-64 flex items-center justify-center border border-border animate-pulse">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />
              <p className="text-muted-foreground mt-4">Loading dashboard content...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardContentWrapper;
