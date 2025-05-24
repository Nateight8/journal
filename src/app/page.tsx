"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  BarChart3,
  Target,
  Shield,
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Award,
  PieChart,
  Activity,
  Calendar,
  Eye,
  Brain,
  Lightbulb,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export default function Page() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const features: Feature[] = [
    {
      icon: BookOpen,
      title: "Advanced Trade Logging",
      description:
        "Detailed entry/exit recording with planned vs. actual execution tracking",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Symbol-specific charts and comprehensive win/loss analysis",
      color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
    {
      icon: Target,
      title: "Risk Management",
      description:
        "Stop-loss and take-profit tracking with risk-reward visualization",
      color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    },
    {
      icon: Brain,
      title: "Smart Analytics",
      description: "AI-powered insights and trade execution quality metrics",
      color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Day Trader",
      content:
        "Tradz transformed how I analyze my trades. The execution quality metrics helped me identify patterns I never noticed before.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Trading Educator",
      content:
        "I use Tradz with all my students. The journaling features and performance tracking are unmatched in the industry.",
      rating: 5,
    },
    {
      name: "Jennifer Kim",
      role: "Swing Trader",
      content:
        "The risk-reward visualization finally made my trading strategy clear. My win rate improved 40% in just 3 months.",
      rating: 5,
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Traders" },
    { value: "2M+", label: "Trades Logged" },
    { value: "94%", label: "User Satisfaction" },
    { value: "35%", label: "Avg. Performance Boost" },
  ];

  useEffect(() => {
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => {
      clearInterval(featureInterval);
      clearInterval(testimonialInterval);
    };
  }, [features.length, testimonials.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-primary p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">Tradz</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#analytics"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Analytics
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Just kidding..its free for now 😉</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Link href="/authenticate">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/authenticate">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t border-border">
              <Link
                href="#features"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Link
                href="#analytics"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Analytics
              </Link>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className="block text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Pricing
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Just kidding..its free for now 😉</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/authenticate">
                  <Button variant="outline" size="sm" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/authenticate">
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 w-full"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/10 text-primary"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  Advanced Trading Analytics
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Master Your Trading
                  <span className="text-primary block">Performance</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  The most advanced trading journal and analytics platform.
                  Track every trade, analyze performance patterns, and unlock
                  your trading potential with data-driven insights.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Start Trading Smarter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-border">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="bg-background/60 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      Trading Dashboard
                    </h3>
                    <Badge
                      variant="default"
                      className="bg-primary/10 text-primary"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +24.5%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Win Rate</span>
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          78.4%
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-blue-500/5 border-blue-500/20">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            Profit Factor
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          2.34
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Recent Trade: AAPL
                      </span>
                      <Badge
                        variant="default"
                        className="bg-primary/10 text-primary"
                      >
                        LONG
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-muted-foreground">Entry</div>
                        <div className="font-semibold">$175.24</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Current</div>
                        <div className="font-semibold text-primary">
                          $178.90
                        </div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">P&L</div>
                        <div className="font-semibold text-primary">+$366</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Live Analytics
                  </span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Risk Managed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              Core Features
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Everything You Need to
              <span className="text-primary block">Excel in Trading</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From detailed trade logging to advanced analytics, Tradz provides
              professional-grade tools that adapt to your trading style and help
              you make data-driven decisions.
            </p>
          </div>

          {/* Feature Showcase */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-300 cursor-pointer ${
                    currentFeature === index
                      ? "border-primary/50 bg-primary/5 shadow-lg scale-105"
                      : "border-border hover:border-primary/30"
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg border ${feature.color}`}>
                        {feature.icon && <feature.icon className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-5 h-5 text-muted-foreground transition-transform ${
                          currentFeature === index ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="relative">
              <Card className="bg-background/60 backdrop-blur-sm border border-border shadow-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {React.createElement(features[currentFeature].icon, {
                      className: "w-5 h-5 text-primary",
                    })}
                    <span>{features[currentFeature].title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Total Trades
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          1,247
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          Success Rate
                        </div>
                        <div className="text-2xl font-bold text-primary">
                          76.8%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium">
                            Trade Analysis #{i}
                          </span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {i === 1 ? "Completed" : "In Progress"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: PieChart,
                title: "Portfolio Analytics",
                description:
                  "Comprehensive portfolio performance tracking with detailed breakdowns by symbol, strategy, and timeframe.",
              },
              {
                icon: Calendar,
                title: "Trade Scheduling",
                description:
                  "Plan and schedule your trades with advanced calendar integration and reminder systems.",
              },
              {
                icon: Eye,
                title: "Real-time Monitoring",
                description:
                  "Live trade monitoring with instant alerts and performance notifications.",
              },
              {
                icon: Lightbulb,
                title: "Smart Insights",
                description:
                  "AI-powered trading insights that help identify patterns and improvement opportunities.",
              },
              {
                icon: Shield,
                title: "Risk Management",
                description:
                  "Advanced risk assessment tools with position sizing and exposure management.",
              },
              {
                icon: Users,
                title: "Community Features",
                description:
                  "Connect with other traders, share strategies, and learn from the community.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="bg-primary/10 p-3 rounded-lg w-fit">
                    {feature.icon && (
                      <feature.icon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              Built For Traders
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Trusted by Trading
              <span className="text-primary block">Professionals</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Active Traders",
                description:
                  "Day traders and scalpers who need real-time performance tracking and quick trade analysis.",
                color: "bg-primary/10 text-primary border-primary/20",
              },
              {
                icon: BookOpen,
                title: "Trading Educators",
                description:
                  "Instructors and mentors who teach trading strategies and need comprehensive student tracking.",
                color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
              },
              {
                icon: Award,
                title: "Professional Investors",
                description:
                  "Portfolio managers and institutional traders requiring detailed performance analytics.",
                color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
              },
              {
                icon: Users,
                title: "Trading Communities",
                description:
                  "Groups and forums that want to track collective performance and share insights.",
                color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
              },
            ].map((audience, index) => (
              <Card
                key={index}
                className="border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg text-center"
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`p-4 rounded-lg border ${audience.color} mx-auto w-fit`}
                  >
                    {audience.icon && <audience.icon className="w-8 h-8" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {audience.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {audience.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/10 text-primary"
            >
              Testimonials
            </Badge>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              What Traders Say
              <span className="text-primary block">About Tradz</span>
            </h2>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <Card className="bg-background/60 backdrop-blur-sm border border-border shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-500 fill-current"
                      />
                    )
                  )}
                </div>
                <blockquote className="text-xl text-foreground mb-6 leading-relaxed">
                  &quot;{testimonials[currentTestimonial].content}&quot;
                </blockquote>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-muted-foreground">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial Navigation */}
            <div className="flex justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
              Ready to Transform Your
              <span className="text-primary block">Trading Performance?</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of traders who have already improved their
              performance with Tradz. Start your free trial today and experience
              the difference data-driven trading makes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/authenticate">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-border">
              Schedule Demo
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground pt-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-primary p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">Tradz</span>
              </div>
              <p className="text-muted-foreground text-sm">
                The most advanced trading journal and analytics platform for
                serious traders.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  API
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Integrations
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Careers
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Community
                </Link>
                <Link
                  href="#"
                  className="block text-muted-foreground hover:text-foreground transition-colors"
                >
                  Status
                </Link>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div>© 2024 Tradz. All rights reserved.</div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.1) 1px,
            transparent 1px
          );
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}
