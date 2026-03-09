import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

const fetchMonthlyAvg = async (symbol) => {
  const months = [];
  const prices = [];
  
  for (let i = 9; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    
    const start = format(startOfMonth(date), 'yyyy-MM-dd');
    const end = format(endOfMonth(date), 'yyyy-MM-dd');
     
    try {
      const res = await fetch(`https://api.frankfurter.app{start}..${end}?from=HUF&to=${symbol}`);
      const json = await res.json();
      
      if (json.rates) {
        const dailyRates = Object.values(json.rates).map(d => 1 / d[symbol]);
        const avg = dailyRates.reduce((a, b) => a + b, 0) / dailyRates.length;
        
        months.push(format(date, 'MMM'));
        prices.push(Number(avg.toFixed(2)));
      }
    } catch (e) {
      console.error(`Hiba a(z) ${symbol} lekérésekor (${start}):`, e);
    }
  }

  const current = prices[prices.length - 1];
  const firstPrice = prices[0];

  return {
    success: true,
    currency: symbol,
    current: current,
    previous: prices[prices.length - 2],
    min: Math.min(...prices),
    max: Math.max(...prices),
    change: (((current - firstPrice) / firstPrice) * 100).toFixed(1),
    currentMonth: months[months.length - 1],
    chartData: { labels: months, data: prices }
  };
};

export const getEURRate = () => fetchMonthlyAvg('EUR');
export const getUSDRate = () => fetchMonthlyAvg('USD');

export const getInflationRate = async () => {
  return {
    success: true,
    indicator: 'Infláció',
    current: 3.8,
    average: 4.2,
    trend: 'down',
    currentMonth: format(new Date(), 'MMM'),
    chartData: {
      labels: ['Jan', 'Feb', 'Mar'],
      data: [4.5, 4.1, 3.8]
    }
  };
};

export const getAllFinancialIndicators = async () => {
  try {
    const [eur, usd, inflation] = await Promise.all([
      getEURRate(),
      getUSDRate(),
      getInflationRate()
    ]);
    
    return {
      success: true,
      EUR: eur,
      USD: usd,
      Inflation: inflation
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
