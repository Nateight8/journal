"use client";

import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  BarChart2,
  Percent,
  Plus,
  BookOpen,
  Target,
} from "lucide-react";

interface StickyNoteTemplatesProps {
  onSelectTemplate: (template: string, title: string) => void;
}

const templates = [
  {
    id: "basic-plan",
    title: "Basic Trading Plan",
    description: "A simple template for documenting your trading strategy",
    icon: FileText,
    color: "yellow",
    content: `
      <h1>My Trading Plan</h1>
      <p>Use this document to outline your trading strategy and rules.</p>
      <h2>Market Analysis</h2>
      <p>Current market conditions and outlook:</p>
      <ul>
        <li>Key support levels:</li>
        <li>Key resistance levels:</li>
        <li>Overall trend:</li>
      </ul>
      <h2>Entry Criteria</h2>
      <ul>
        <li>Signal 1:</li>
        <li>Signal 2:</li>
        <li>Confirmation indicator:</li>
      </ul>
      <h2>Risk Management</h2>
      <ul>
        <li>Position size:</li>
        <li>Stop loss placement:</li>
        <li>Take profit targets:</li>
        <li>Risk-reward ratio:</li>
      </ul>
    `,
  },
  {
    id: "journal-entry",
    title: "Daily Journal Entry",
    description: "Reflect on your trading day and lessons learned",
    icon: BookOpen,
    color: "green",
    content: `
      <h1>Trading Journal - ${new Date().toLocaleDateString()}</h1>
      <h2>Market Conditions</h2>
      <p>How was the market today?</p>
      <ul>
        <li>Overall trend:</li>
        <li>Volatility level:</li>
        <li>Key news events:</li>
      </ul>
      
      <h2>Trades Taken</h2>
      <p>Document your trades:</p>
      <ul>
        <li>Entry reason:</li>
        <li>Exit reason:</li>
        <li>Result:</li>
        <li>What went well:</li>
        <li>What could improve:</li>
      </ul>
      
      <h2>Emotional State</h2>
      <p>How did you feel during trading?</p>
      
      <h2>Lessons Learned</h2>
      <p>Key takeaways from today:</p>
    `,
  },
  {
    id: "advanced-strategy",
    title: "Advanced Strategy",
    description: "Detailed template for complex trading strategies",
    icon: BarChart2,
    color: "blue",
    content: `
      <h1>Advanced Trading Strategy</h1>
      <h2>Strategy Overview</h2>
      <p>Brief description of the strategy:</p>
      
      <h2>Market Conditions</h2>
      <ul>
        <li>Best market conditions:</li>
        <li>Avoid when:</li>
        <li>Timeframes:</li>
      </ul>
      
      <h2>Technical Setup</h2>
      <ul>
        <li>Primary indicators:</li>
        <li>Confirmation signals:</li>
        <li>Entry triggers:</li>
      </ul>
      
      <h2>Risk Management</h2>
      <ul>
        <li>Position sizing formula:</li>
        <li>Stop loss rules:</li>
        <li>Take profit strategy:</li>
      </ul>
    `,
  },
  {
    id: "goals",
    title: "Trading Goals",
    description: "Set and track your trading objectives",
    icon: Target,
    color: "purple",
    content: `
      <h1>Trading Goals</h1>
      <h2>Monthly Goals</h2>
      <ul>
        <li>Profit target:</li>
        <li>Maximum drawdown:</li>
        <li>Number of trades:</li>
        <li>Win rate target:</li>
      </ul>
      
      <h2>Skill Development</h2>
      <ul>
        <li>Areas to improve:</li>
        <li>New strategies to learn:</li>
        <li>Books/courses to complete:</li>
      </ul>
      
      <h2>Progress Tracking</h2>
      <p>How will you measure progress?</p>
      
      <h2>Review Schedule</h2>
      <p>When will you review these goals?</p>
    `,
  },
  {
    id: "risk-framework",
    title: "Risk Management",
    description: "Position sizing and risk control framework",
    icon: Percent,
    color: "pink",
    content: `
      <h1>Risk Management Framework</h1>
      <h2>Risk Parameters</h2>
      <ul>
        <li>Account Risk Limit: <strong>2% per trade</strong></li>
        <li>Daily Risk Limit: <strong>6% of account</strong></li>
        <li>Weekly Risk Limit: <strong>10% of account</strong></li>
      </ul>
      
      <h2>Position Sizing</h2>
      <p>Formula: Position Size = (Account × Risk %) ÷ (Entry Price - Stop Loss)</p>
      
      <h2>Emergency Rules</h2>
      <ul>
        <li>5% drawdown: Reduce position size</li>
        <li>10% drawdown: Stop trading</li>
      </ul>
    `,
  },
];

export function StickyNoteTemplates({
  onSelectTemplate,
}: StickyNoteTemplatesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20, rotate: -2 }}
          animate={{
            opacity: 1,
            y: 0,
            rotate: index % 2 === 0 ? 2 : -2,
            transition: { delay: index * 0.1 },
          }}
          whileHover={{
            scale: 1.05,
            rotate: 0,
            zIndex: 10,
            transition: { duration: 0.2 },
          }}
          className="relative"
        >
          <Card
            className={`
              sticky-note sticky-note-${template.color} sticky-note-texture
              border-2 cursor-pointer transition-all duration-200 
              shadow-lg hover:shadow-xl transform-gpu h-64 relative overflow-hidden
            `}
            onClick={() => onSelectTemplate(template.content, template.title)}
          >
            {/* Tape effect */}
            <div className="sticky-note-tape"></div>

            <CardHeader className="pb-2 pt-6">
              <div className="flex items-center justify-between">
                <template.icon className="h-6 w-6 text-gray-600" />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-white/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template.content, template.title);
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg font-bold sticky-note-text">
                {template.title}
              </CardTitle>
              <CardDescription className="text-sm sticky-note-text-muted">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs sticky-note-text-muted line-clamp-4">
                {template.content
                  .replace(/<[^>]*>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .substring(0, 120)}
                ...
              </div>
            </CardContent>

            {/* Corner fold effect */}
            <div className="sticky-note-fold"></div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
