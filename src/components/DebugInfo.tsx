import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DebugInfo = () => {
  const { user, profile, business, loading } = useAuth();

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Loading State:</h3>
          <Badge variant={loading ? "destructive" : "default"}>
            {loading ? "Loading..." : "Loaded"}
          </Badge>
        </div>
        
        <div>
          <h3 className="font-semibold">User:</h3>
          <pre className="bg-muted p-2 rounded text-sm overflow-auto">
            {user ? JSON.stringify(user, null, 2) : "No user"}
          </pre>
        </div>
        
        <div>
          <h3 className="font-semibold">Profile:</h3>
          <pre className="bg-muted p-2 rounded text-sm overflow-auto">
            {profile ? JSON.stringify(profile, null, 2) : "No profile"}
          </pre>
        </div>
        
        <div>
          <h3 className="font-semibold">Business:</h3>
          <pre className="bg-muted p-2 rounded text-sm overflow-auto">
            {business ? JSON.stringify(business, null, 2) : "No business"}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfo; 