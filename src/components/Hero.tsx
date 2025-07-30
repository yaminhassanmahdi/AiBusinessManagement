import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Bot, BarChart3, Users } from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2">
                🚀 All-in-One Business Automation Platform
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Setup Your Business
                <span className="bg-gradient-hero bg-clip-text text-transparent block">
                  Once and Forever
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Transform your business with AI-powered customer service automation, 
                complete business management tools, and intelligent chat systems across 
                Facebook, WhatsApp, and your website.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Start Free Trial
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Watch Demo
              </Button>
            </div>

            {/* Key Features Pills */}
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">AI Chat Automation</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full">
                <BarChart3 className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">Business Analytics</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full">
                <Users className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Team Management</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative lg:h-[600px] animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl"></div>
            <img
              src={heroImage}
              alt="SetUpOnce Dashboard Interface"
              className="w-full h-full object-cover rounded-2xl shadow-strong hover:shadow-xl transition-all duration-500 hover:scale-105"
            />
            
            {/* Floating stats cards */}
            <div className="absolute -bottom-6 -left-6 bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-medium border border-border">
              <div className="text-sm text-muted-foreground">Active Businesses</div>
              <div className="text-2xl font-bold text-primary">2,500+</div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-background/95 backdrop-blur-sm p-4 rounded-xl shadow-medium border border-border">
              <div className="text-sm text-muted-foreground">AI Responses</div>
              <div className="text-2xl font-bold text-success">1M+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;