import { JournalEntry } from "@/graphql/journal-operationsl";

export interface Trade {
  id: string;
  date: string;
  symbol: string;
  direction: 'Long' | 'Short';
  projectedEntry: number;
  projectedSL: number | null;
  projectedTP: number | null;
  actualEntry: number | null;
  actualExit: number | null;
  didHitTP: boolean | null;
  actualPL: number | null;
  maxPossiblePL: number | null;
  efficiency: number | null;
  notes: string | null;
  accountId: string;
}

export const transformToTrade = (journal: JournalEntry): Trade => {
  // Extract values with null checks
  const exitPrice = journal.exitPrice;
  const entryPrice = journal.executedEntryPrice;
  const takeProfit = journal.plannedTakeProfit;
  const stopLoss = journal.plannedStopLoss;
  const side = journal.side;
  const isLong = side === 'buy';
  
  // Calculate efficiency - only if we have all required values
  let efficiency: number | null = null;
  
  // Only calculate efficiency for closed trades with valid values
  if (exitPrice !== undefined && entryPrice !== undefined && takeProfit !== undefined) {
    const priceDifference = isLong 
      ? exitPrice - entryPrice 
      : entryPrice - exitPrice;
      
    // Calculate potential profit and risk based on trade direction
    const potentialProfit = isLong 
      ? takeProfit - entryPrice 
      : entryPrice - takeProfit;
      
    const potentialLoss = stopLoss !== undefined
      ? (isLong ? entryPrice - stopLoss : stopLoss - entryPrice)
      : 0;
    
    // Only calculate if we have a valid potential profit and loss
    if (Math.abs(potentialProfit) > 0.0001) { // Small epsilon to avoid floating point issues
      // Calculate risk-reward based efficiency
      if (potentialLoss > 0) {
        // If we have a stop loss, calculate efficiency based on risk-reward
        const riskRewardRatio = potentialProfit / potentialLoss;
        const achievedPL = priceDifference;
        efficiency = (achievedPL / potentialLoss) * 100 / riskRewardRatio;
      } else {
        // Fallback to simple percentage of target if no stop loss
        efficiency = (priceDifference / potentialProfit) * 100;
      }
      
      // Cap efficiency at 100% for display purposes
      if (efficiency > 100) efficiency = 100;
      if (efficiency < -100) efficiency = -100;
      
      // Round to 2 decimal places for consistency
      efficiency = Math.round(efficiency * 100) / 100;
    }
  }

  // Calculate actual P/L
  let actualPL: number | null = null;
  if (exitPrice !== undefined && entryPrice !== undefined) {
    const priceDifference = isLong 
      ? exitPrice - entryPrice 
      : entryPrice - exitPrice;
    actualPL = priceDifference * journal.size;
  }

  // Calculate max possible P/L
  let maxPossiblePL: number | null = null;
  if (takeProfit !== undefined && entryPrice !== undefined) {
    const potentialProfit = isLong 
      ? takeProfit - entryPrice 
      : entryPrice - takeProfit;
    maxPossiblePL = potentialProfit * journal.size;
  }

  // Debug log with detailed efficiency calculation info
  console.log('Trade transformation details:', {
    id: journal.id,
    symbol: journal.instrument,
    side: side,
    entryPrice: entryPrice,
    exitPrice: exitPrice,
    takeProfit: takeProfit,
    stopLoss: stopLoss,
    size: journal.size,
    priceDifference: exitPrice !== undefined && entryPrice !== undefined 
      ? (isLong ? exitPrice - entryPrice : entryPrice - exitPrice)
      : null,
    potentialProfit: takeProfit !== undefined && entryPrice !== undefined
      ? (isLong ? takeProfit - entryPrice : entryPrice - takeProfit)
      : null,
    potentialLoss: stopLoss !== undefined && entryPrice !== undefined
      ? (isLong ? entryPrice - stopLoss : stopLoss - entryPrice)
      : null,
    calculatedEfficiency: efficiency,
    actualPL: actualPL,
    maxPossiblePL: maxPossiblePL,
    efficiencyCalculation: efficiency !== null ? {
      riskRewardRatio: stopLoss !== undefined && takeProfit !== undefined && entryPrice !== undefined
        ? ((isLong ? takeProfit - entryPrice : entryPrice - takeProfit) / 
           (isLong ? entryPrice - (stopLoss || entryPrice) : (stopLoss || entryPrice) - entryPrice)).toFixed(2)
        : 'N/A',
      achievedVsRisk: stopLoss !== undefined && entryPrice !== undefined && exitPrice !== undefined
        ? ((isLong ? exitPrice - entryPrice : entryPrice - exitPrice) / 
           (isLong ? entryPrice - (stopLoss || entryPrice) : (stopLoss || entryPrice) - entryPrice)).toFixed(2)
        : 'N/A'
    } : 'Not calculated'
  });

  return {
    id: journal.id,
    date: journal.createdAt,
    symbol: journal.instrument,
    direction: (journal.side === 'buy' ? 'Long' : 'Short') as 'Long' | 'Short',
    projectedEntry: journal.plannedEntryPrice,
    projectedSL: journal.plannedStopLoss || 0,
    projectedTP: journal.plannedTakeProfit || 0,
    actualEntry: journal.executedEntryPrice || null,
    actualExit: journal.exitPrice || null,
    didHitTP: journal.targetHit || null,
    actualPL,
    maxPossiblePL,
    efficiency,
    notes: journal.note || null,
    accountId: journal.accountId,
  };
};
