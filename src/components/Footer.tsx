import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  ArrowRight
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border">
      {/* Newsletter Section */}
      <div className="bg-gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-primary-foreground">
                Stay Updated with SetUpOnce
              </h3>
              <p className="text-primary-foreground/90">
                Get the latest updates on new features, business automation tips, and success stories.
              </p>
            </div>
            <div className="flex gap-4">
              <Input 
                placeholder="Enter your email address" 
                className="bg-background/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button variant="secondary" size="lg">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SetUpOnce
              </h2>
              <p className="text-muted-foreground mt-2">
                The complete business automation platform that helps you setup once and scale forever.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-primary" />
                <span>support@setuponce.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-primary" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Product</h3>
            <div className="space-y-3">
              <a href="#features" className="block text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="block text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#integrations" className="block text-muted-foreground hover:text-foreground transition-colors">
                Integrations
              </a>
              <a href="#api" className="block text-muted-foreground hover:text-foreground transition-colors">
                API Documentation
              </a>
              <div className="flex items-center gap-2">
                <a href="#mobile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Mobile Apps
                </a>
                <Badge variant="secondary" className="text-xs">New</Badge>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Company</h3>
            <div className="space-y-3">
              <a href="#about" className="block text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </a>
              <a href="#careers" className="block text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </a>
              <a href="#blog" className="block text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </a>
              <a href="#press" className="block text-muted-foreground hover:text-foreground transition-colors">
                Press Kit
              </a>
              <a href="#partners" className="block text-muted-foreground hover:text-foreground transition-colors">
                Partners
              </a>
            </div>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="font-semibold text-lg">Support</h3>
            <div className="space-y-3">
              <a href="#help" className="block text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </a>
              <a href="#contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                Contact Support
              </a>
              <a href="#community" className="block text-muted-foreground hover:text-foreground transition-colors">
                Community
              </a>
              <a href="#tutorials" className="block text-muted-foreground hover:text-foreground transition-colors">
                Tutorials
              </a>
              <a href="#status" className="block text-muted-foreground hover:text-foreground transition-colors">
                System Status
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <a href="#privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-foreground transition-colors">
                Cookie Policy
              </a>
              <a href="#security" className="hover:text-foreground transition-colors">
                Security
              </a>
            </div>
            
            <div className="text-sm text-muted-foreground">
              © {currentYear} SetUpOnce. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;