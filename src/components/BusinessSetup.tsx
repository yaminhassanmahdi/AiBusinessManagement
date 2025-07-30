import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Store, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const BusinessSetup = () => {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_subdomain: '',
    business_context: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert({
          owner_id: profile?.id,
          name: formData.name,
          description: formData.description,
          website_subdomain: formData.website_subdomain || null,
          business_context: formData.business_context || null,
        })
        .select()
        .single();

      if (businessError) {
        throw businessError;
      }

      // Refresh profile to get the business data
      await refreshProfile();

      // Force a small delay to ensure state updates
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsSuccess(true);
      toast({
        title: "Business Created!",
        description: "Your business has been set up successfully.",
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);

    } catch (error: any) {
      console.error('Error creating business:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create business. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Business Created!</h2>
            <p className="text-muted-foreground mb-4">
              Your business has been set up successfully. Redirecting to dashboard...
            </p>
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Store className="h-12 w-12 text-primary mx-auto mb-4" />
          <CardTitle className="text-2xl">Set Up Your Business</CardTitle>
          <CardDescription>
            Welcome to SetUpOnce! Let's get your business started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your business name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell us about your business"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website_subdomain">Website Subdomain (Optional)</Label>
              <Input
                id="website_subdomain"
                type="text"
                placeholder="your-business"
                value={formData.website_subdomain}
                onChange={(e) => setFormData({ ...formData, website_subdomain: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                This will create: your-business.setuponce.com
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_context">Business Context (Optional)</Label>
              <Textarea
                id="business_context"
                placeholder="What type of business do you run? (e.g., E-commerce, Restaurant, Service Business)"
                value={formData.business_context}
                onChange={(e) => setFormData({ ...formData, business_context: e.target.value })}
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Business...
                </>
              ) : (
                'Create Business'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSetup; 