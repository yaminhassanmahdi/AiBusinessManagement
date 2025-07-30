import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  MessageSquare, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  CreditCard, 
  Globe, 
  Smartphone,
  Shield,
  Zap,
  Database,
  Settings
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Chatbots",
      description: "Intelligent automation across Facebook, WhatsApp, and websites with context-aware responses.",
      badge: "Core Feature",
      color: "text-primary"
    },
    {
      icon: MessageSquare,
      title: "Multi-Channel Support",
      description: "Seamless customer communication across all major platforms with unified management.",
      badge: "Popular",
      color: "text-success"
    },
    {
      icon: BarChart3,
      title: "Business Analytics",
      description: "Real-time dashboards, sales tracking, and performance insights for data-driven decisions.",
      badge: "Analytics",
      color: "text-warning"
    },
    {
      icon: ShoppingCart,
      title: "Order Management",
      description: "Complete e-commerce system with inventory tracking, automated order processing.",
      badge: "E-commerce",
      color: "text-accent"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "HR tools, payroll processing, task assignment, and project collaboration.",
      badge: "HR",
      color: "text-primary"
    },
    {
      icon: CreditCard,
      title: "Financial Tracking",
      description: "Invoice generation, expense tracking, profit/loss reports, and payment processing.",
      badge: "Finance",
      color: "text-success"
    },
    {
      icon: Globe,
      title: "Website Builder",
      description: "Professional websites with custom domains, SEO optimization, and e-commerce integration.",
      badge: "Web",
      color: "text-warning"
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Full-featured mobile apps for iOS and Android with real-time notifications.",
      badge: "Mobile",
      color: "text-accent"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Role-based access, 2FA, audit trails, and GDPR compliance for data protection.",
      badge: "Security",
      color: "text-destructive"
    },
    {
      icon: Database,
      title: "Data Integration",
      description: "REST APIs, webhooks, Zapier integration, and custom app connections.",
      badge: "API",
      color: "text-primary"
    },
    {
      icon: Zap,
      title: "Automation Workflows",
      description: "Custom triggers, automated responses, and smart business process automation.",
      badge: "Automation",
      color: "text-success"
    },
    {
      icon: Settings,
      title: "Admin Dashboard",
      description: "Comprehensive platform management with subscription control and user oversight.",
      badge: "Admin",
      color: "text-warning"
    }
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-2">
            ⚡ Platform Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything You Need to 
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Scale Your Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From AI automation to complete business management - all the tools you need 
            integrated into one powerful platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-0"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-background shadow-soft ${feature.color}`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;