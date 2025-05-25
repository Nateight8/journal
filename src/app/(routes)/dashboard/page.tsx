"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Target, DollarSign } from "lucide-react";
import DashboardWithTemplateDrawer from "@/components/journaling/templat-drawer";
// import DashboardWithTemplateDrawer from "@/components/journaling/templat-drawer";

export default function DashboardTemplateDemo() {
  return (
    <DashboardWithTemplateDrawer
      hasTemplate={true} // Set to true to see the success state
      onTemplateCreated={(content) => {
        console.log("Template created with content:", content);
      }}
    >
      {/* Sample Dashboard Content */}
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <span className="text-2xl font-bold text-primary">+$2,847</span>
              </div>
              <Badge
                variant="default"
                className="mt-2 bg-primary/10 text-primary"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.4%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Win Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-2xl font-bold text-foreground">
                  68.2%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                15 of 22 trades
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Risk/Reward
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-orange-600" />
                <span className="text-2xl font-bold text-foreground">
                  1:2.4
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Above target</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-foreground">3</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">2 profitable</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-medium">EUR/USD Long</span>
                    <Badge variant="outline">Closed</Badge>
                  </div>
                  <span className="text-primary font-semibold">+$124</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardWithTemplateDrawer>
  );
}
