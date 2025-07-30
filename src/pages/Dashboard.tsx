import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Loader2, Store, Users, Package, MessageSquare, BarChart3, DollarSign, LogOut, Settings, Bot, Folder, Tag } from 'lucide-react';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import ProductsTab from '@/components/dashboard/ProductsTab';
import CategoriesTab from '@/components/dashboard/CategoriesTab';
import AttributesTab from '@/components/dashboard/AttributesTab';
import OrdersTab from '@/components/dashboard/OrdersTab';
import ChatTab from '@/components/dashboard/ChatTab';
import BusinessSettings from '@/components/dashboard/BusinessSettings';
import AdminPanel from '@/components/dashboard/AdminPanel';
import DebugInfo from '@/components/DebugInfo';
import BusinessSetup from '@/components/BusinessSetup';

const Dashboard = () => {
  const { user, profile, business, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || !profile) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user needs to set up business
  if (profile.role === 'saas_user' && !business) {
    return <BusinessSetup />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const getSubscriptionColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'secondary';
      case 'starter': return 'outline';
      case 'pro': return 'default';
      case 'enterprise': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-primary">SetUpOnce</h1>
            {business && (
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{business.name}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{profile.full_name}</p>
              <div className="flex items-center gap-2">
                <Badge variant={getSubscriptionColor(profile.subscription_plan)}>
                  {profile.subscription_plan}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {profile.role.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">

        
        {profile.role === 'admin' ? (
          <AdminPanel />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-9">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="attributes" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Attributes
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <DashboardOverview />
            </TabsContent>

            <TabsContent value="products">
              <ProductsTab />
            </TabsContent>

            <TabsContent value="categories">
              <CategoriesTab />
            </TabsContent>

            <TabsContent value="attributes">
              <AttributesTab />
            </TabsContent>

            <TabsContent value="orders">
              <OrdersTab />
            </TabsContent>

            <TabsContent value="chat">
              <ChatTab />
            </TabsContent>

            <TabsContent value="ai-assistant">
              <Card>
                <CardHeader>
                  <CardTitle>AI Assistant</CardTitle>
                  <CardDescription>
                    Chat with your business AI assistant to manage inventory, get insights, and update data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">AI Assistant feature coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Management</CardTitle>
                  <CardDescription>
                    Manage your team members, roles, and permissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Team management feature coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <BusinessSettings />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Dashboard;