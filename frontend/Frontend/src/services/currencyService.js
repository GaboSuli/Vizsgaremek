import { format, startOfMonth, endOfMonth } from 'date-fns';

const MAX_MONTHS = 10;

export const fetchMonthlyAvg = async (symbol, existingMonths = [], existingPrices = []) => {
  const months = [...existingMonths];
  const prices = [...existingPrices];

  // Aktuális hónap
  const date = new Date();
  const start = format(startOfMonth(date), 'yyyy-MM-dd');
  const end = format(endOfMonth(date), 'yyyy-MM-dd');

  try {
    const res = await fetch(`https://api.frankfurter.app/${start}..${end}?from=HUF&to=${symbol}`);
    if (!res.ok) throw new Error(`HTTP hiba: ${res.status}`);
    const json = await res.json();

    if (json.rates) {
      const dailyRates = Object.values(json.rates).map(d => 1 / d[symbol]);
      const avg = dailyRates.reduce((a, b) => a + b, 0) / dailyRates.length;

      const monthName = format(date, 'MMM');

      // Ha az utolsó hónap már megvan, ne duplikáljuk
      if (months[months.length - 1] !== monthName) {
        months.push(monthName);
        prices.push(Number(avg.toFixed(2)));

        // Ha már több mint MAX_MONTHS van, töröljük a legrégebbit
        while (months.length > MAX_MONTHS) {
          months.shift();
          prices.shift();
        }
      }
    }
  } catch (e) {
    console.error(`Hiba a(z) ${symbol} lekérésekor (${start}):`, e);
  }

  const current = prices[prices.length - 1] || null;
  const firstPrice = prices[0] || null;

  return {
    success: true,
    currency: symbol,
    current,
    previous: prices.length > 1 ? prices[prices.length - 2] : null,
    min: prices.length ? Math.min(...prices) : null,
    max: prices.length ? Math.max(...prices) : null,
    change: firstPrice ? (((current - firstPrice) / firstPrice) * 100).toFixed(1) : null,
    currentMonth: months[months.length - 1] || null,
    chartData: { labels: months, data: prices },
    months,
    prices
  };
};

export const getEURRate = (months = [], prices = []) => fetchMonthlyAvg('EUR', months, prices);
export const getUSDRate = (months = [], prices = []) => fetchMonthlyAvg('USD', months, prices);
export const getGBPRate = (months = [], prices = []) => fetchMonthlyAvg('GBP', months, prices);
export const getCHFRate = (months = [], prices = []) => fetchMonthlyAvg('CHF', months, prices);
export const getPLNRate = (months = [], prices = []) => fetchMonthlyAvg('PLN', months, prices);

export const getInflationRate = async () => ({
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
});

export const getAllFinancialIndicators = async (eurMonths = [], eurPrices = [], usdMonths = [], usdPrices = [], gbpMonths = [], gbpPrices = [], chfMonths = [], chfPrices = [], plnMonths = [], plnPrices = []) => {
  try {
    const [eur, usd, gbp, chf, pln,inflation] = await Promise.all([
      getEURRate(eurMonths, eurPrices),
      getUSDRate(usdMonths, usdPrices),
      getGBPRate(gbpMonths, gbpPrices),
      getCHFRate(chfMonths, chfPrices),
      getPLNRate(plnMonths, plnPrices),
      getInflationRate()
    ]);

    return { success: true, EUR: eur, USD: usd,GBP: gbp,CHF: chf,PLN: pln,Inflation: inflation };
  } catch (error) {
    return { success: false, error: error.message };
  }
};