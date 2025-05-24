// import SimpleTradeInfo from "../_components/trade-card-v3";

import SimpleTradeInfo from "../_components/trade-card-v2";
// import TradeInfoCard from "../_components/trade-card-v2";

// export default function SimpleTradeDemo() {
//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-4xl mx-auto space-y-8">
//         <div className="text-center space-y-4">
//           <h1 className="text-3xl font-bold text-foreground">
//             Simple Trade Info
//           </h1>
//           <p className="text-muted-foreground">
//             Clean, minimal trade information display
//           </p>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Example 1 - Running Trade (Profitable) */}
//           <div className="bg-muted/30 rounded-lg p-6 border-l-4 border-primary">
//             <h3 className="text-lg font-semibold text-foreground mb-4">
//               EUR/USD - Running Trade 🟢
//             </h3>
//             <SimpleTradeInfo
//             //   variant="running"
//               entryPrice={1.085}
//             //   currentPrice={1.0892}
//               stopLoss={1.082}
//               takeProfit={1.095}
//             //   entryTime="08:30 GMT"
//               unrealizedPL={168}
//               unrealizedPLR={1.2}
//               timeElapsed="2 hours 15 minutes"
//               currency="£"
//               risk={2.0}
//             />
//           </div>

//           {/* Example 2 - Running Trade (Loss) */}
//           <div className="bg-muted/30 rounded-lg p-6 border-l-4 border-red-500">
//             <h3 className="text-lg font-semibold text-foreground mb-4">
//               GBP/JPY - Running Trade 🔴
//             </h3>
//             <SimpleTradeInfo
//             //   variant="running"
//               entryPrice={189.45}
//             //   currentPrice={188.92}
//               stopLoss={187.2}
//               takeProfit={194.8}
//               entryTime="14:15 JST"
//               unrealizedPL={-85}
//               unrealizedPLR={-0.6}
//               timeElapsed="45 minutes"
//               currency="$"
//               risk={1.5}
//             />
//           </div>

//           {/* Example 3 - Closed Trade */}
//           <div className="bg-muted/30 rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-foreground mb-4">
//               EUR/USD - Closed Trade
//             </h3>
//             <SimpleTradeInfo
//               variant="closed"
//               entryPrice={1.085}
//               exitPrice={1.092}
//               exitReason="TP1 hit"
//               exitTime="11:45 GMT"
//               profitLoss={275}
//               profitLossR={1.8}
//               duration="3 hours 15 minutes"
//               currency="£"
//               risk={2.0}
//             />
//           </div>

//           {/* Example 4 - Running Stock Trade */}
//           <div className="bg-muted/30 rounded-lg p-6 border-l-4 border-orange-500">
//             <h3 className="text-lg font-semibold text-foreground mb-4">
//               AAPL - Running Trade 🟡
//             </h3>
//             <SimpleTradeInfo
//               variant="running"
//               entryPrice={175.24}
//               currentPrice={176.85}
//               stopLoss={172.0}
//               takeProfit={182.0}
//               entryTime="Market Open"
//               unrealizedPL={161}
//               unrealizedPLR={0.5}
//               timeElapsed="1 hour 30 minutes"
//               currency="$"
//               risk={1.8}
//             />
//           </div>
//         </div>

//         {/* Dark Background Example */}
//         <div className="bg-gray-800 rounded-lg p-6">
//           <h3 className="text-lg font-semibold text-white mb-4">
//             Running Trade - Dark Theme
//           </h3>
//           <div className="text-white">
//             <SimpleTradeInfo
//               variant="running"
//               entryPrice={1.085}
//               currentPrice={1.0892}
//               entryTime="08:30 GMT"
//               unrealizedPL={168}
//               unrealizedPLR={1.2}
//               timeElapsed="2 hours 15 minutes"
//               currency="£"
//               risk={2.0}
//               className="text-white"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function TradeCardsDemoPage() {
//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-6xl mx-auto space-y-8">
//         <div className="text-center space-y-4">
//           <h1 className="text-3xl font-bold text-foreground">
//             Trade Info Cards
//           </h1>
//           <p className="text-muted-foreground">
//             Different variants for displaying trade information
//           </p>
//         </div>

//         {/* Default Variant */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold text-foreground">
//             Default Variant
//           </h2>
//           <div className="grid md:grid-cols-2 gap-6">
//             <TradeInfoCard
//             //   symbol="AAPL"
//               direction="LONG"
//               entryPrice={175.24}
//               stopLoss={172.0}
//               takeProfit={182.0}
//               risk={2.0}
//               quantity={100}
//             />
//             <TradeInfoCard
//               symbol="TSLA"
//               direction="SHORT"
//               entryPrice={245.8}
//               stopLoss={252.0}
//               takeProfit={235.0}
//               risk={1.5}
//               quantity={50}
//             />
//           </div>
//         </div>

//         {/* Compact Variant */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold text-foreground">
//             Compact Variant
//           </h2>
//           <div className="grid md:grid-cols-3 gap-4">
//             <TradeInfoCard
//               variant="compact"
//               symbol="NVDA"
//               direction="LONG"
//               entryPrice={485.2}
//               stopLoss={475.0}
//               takeProfit={505.0}
//               risk={1.0}
//             />
//             <TradeInfoCard
//               variant="compact"
//               symbol="MSFT"
//               direction="LONG"
//               entryPrice={378.5}
//               stopLoss={370.0}
//               takeProfit={395.0}
//               risk={2.5}
//             />
//             <TradeInfoCard
//               variant="compact"
//               symbol="GOOGL"
//               direction="SHORT"
//               entryPrice={142.3}
//               stopLoss={148.0}
//               takeProfit={135.0}
//               risk={1.8}
//             />
//           </div>
//         </div>

//         {/* Detailed Variant */}
//         <div className="space-y-4">
//           <h2 className="text-xl font-semibold text-foreground">
//             Detailed Variant
//           </h2>
//           <div className="grid lg:grid-cols-1 gap-6">
//             <TradeInfoCard
//               variant="detailed"
//               symbol="SPY"
//               direction="LONG"
//               entryPrice={445.75}
//               stopLoss={440.0}
//               takeProfit={458.0}
//               risk={2.0}
//               quantity={200}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function SimpleTradeDemo() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Simple Trade Info
          </h1>
          <p className="text-muted-foreground">
            Clean, minimal trade information display
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Example 1 - Closed Trade */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              EUR/USD - Closed Trade
            </h3>
            <SimpleTradeInfo
              entryPrice={1.085}
              exitPrice={1.092}
              exitReason="TP1 hit"
              exitTime="11:45 GMT"
              profitLoss={275}
              profitLossR={1.8}
              duration="3 hours 15 minutes"
              currency="£"
              risk={2.0}
            />
          </div>

          {/* Example 2 - Open Trade */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              GBP/JPY - Open Trade
            </h3>
            <SimpleTradeInfo
              entryPrice={189.45}
              stopLoss={187.2}
              takeProfit={194.8}
              risk={1.5}
              currency="$"
            />
          </div>

          {/* Example 3 - Loss Trade */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              USD/CAD - Stopped Out
            </h3>
            <SimpleTradeInfo
              entryPrice={1.352}
              exitPrice={1.348}
              exitReason="SL hit"
              exitTime="09:30 EST"
              profitLoss={-120}
              profitLossR={-1.0}
              duration="45 minutes"
              currency="$"
              risk={2.5}
            />
          </div>

          {/* Example 4 - Stock Trade */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              AAPL - Swing Trade
            </h3>
            <SimpleTradeInfo
              entryPrice={175.24}
              exitPrice={182.15}
              exitReason="Target reached"
              exitTime="Market Close"
              profitLoss={691}
              profitLossR={2.1}
              duration="5 days 2 hours"
              currency="$"
              risk={1.8}
            />
          </div>
        </div>

        {/* Dark Background Example */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Dark Theme Example
          </h3>
          <div className="text-white">
            <SimpleTradeInfo
              exitPrice={1.092}
              exitReason="TP1 hit"
              exitTime="11:45 GMT"
              profitLoss={275}
              profitLossR={1.8}
              duration="3 hours 15 minutes"
              currency="£"
              className="text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
