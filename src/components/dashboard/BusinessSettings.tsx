import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

const BusinessSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Settings</CardTitle>
        <CardDescription>
          Configure your business information and integrations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Settings className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Business settings feature coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessSettings;