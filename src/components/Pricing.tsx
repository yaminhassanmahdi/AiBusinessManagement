import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Rocket } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with basic automation",
      icon: Star,
      popular: false,
      features: [
        "100 AI chat responses/month",
        "Facebook integration only",
        "Basic CRM",
        "Simple inventory tracking",
        "1-page website",
        "Email support"
      ],
      limitations: [
        "No WhatsApp integration",
        "No custom domain",
        "Basic analytics only"
      ]
    },
    {
      name: "Starter",
      price: "$19",
      period: "per month",
      description: "Ideal for small businesses scaling their operations",
      icon: Rocket,
      popular: true,
      features: [
        "1,000 AI chat responses/month",
        "Facebook + Website integration",
        "Complete order management",
        "Up to 50 products",
        "Multi-page website",
        "Basic analytics dashboard",
        "Priority email support"
      ],
      limitations: [
        "No WhatsApp integration",
        "No custom domain"
      ]
    },
    {
      name: "Professional",
      price: "$49",
      period: "per month",
      description: "For growing businesses needing advanced features",
      icon: Crown,
      popular: false,
      features: [
        "5,000 AI chat responses/month",
        "Facebook + WhatsApp + Website",
        "Complete business management",
        "Unlimited products",
        "Custom domain support",
        "Advanced analytics",
        "Team management (up to 10)",
        "API access",
        "Priority support"
      ],
      limitations: [
        "Limited API calls"
      ]
    },
    {
      name: "Enterprise",
      price: "$149",
      period: "per month",
      description: "Complete solution for established businesses",
      icon: Crown,
      popular: false,
      features: [
        "Unlimited AI chat responses",
        "All platform integrations",
        "White-label option",
        "Custom domains",
        "Advanced automation",
        "Unlimited team members",
        "Full API access",
        "Custom integrations",
        "24/7 phone support",
        "Dedicated account manager"
      ],
      limitations: []
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <Badge variant="outline" className="px-4 py-2">
            💰 Simple Pricing
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Choose the Perfect Plan for
            <span className="bg-gradient-hero bg-clip-text text-transparent"> Your Business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include core features with no hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-strong hover:-translate-y-2 ${
                plan.popular 
                  ? 'ring-2 ring-primary scale-105 bg-gradient-card' 
                  : 'hover:shadow-medium bg-gradient-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-primary text-primary-foreground text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <CardHeader className={plan.popular ? "pt-12" : ""}>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg bg-background shadow-soft ${
                    plan.popular ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    <plan.icon className="w-6 h-6" />
                  </div>
                  {plan.name === "Enterprise" && (
                    <Badge variant="secondary">Enterprise</Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Button 
                  variant={plan.popular ? "hero" : "outline"} 
                  className="w-full"
                  size="lg"
                >
                  {plan.price === "$0" ? "Start Free" : "Start Trial"}
                </Button>

                <div className="space-y-3">
                  <h4 className="font-semibold text-sm uppercase tracking-wide">
                    What's Included:
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="pt-3">
                      <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                        Limitations:
                      </h4>
                      <ul className="space-y-1 mt-2">
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom solution? Enterprise features can be tailored to your needs.
          </p>
          <Button variant="outline" size="lg">
            Contact Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;