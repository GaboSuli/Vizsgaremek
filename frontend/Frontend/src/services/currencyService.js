// Árfolyam és inflációs adatok

const currencyData = {
  EUR: {
    months: [
      { month: 'Május', year: 2025 },
      { month: 'június', year: 2025 },
      { month: 'Július', year: 2025 },
      { month: 'Augusztus', year: 2025 },
      { month: 'Szeptember', year: 2025 },
      { month: 'Október', year: 2025 },
      { month: 'November', year: 2025 },
      { month: 'December', year: 2025 },
      { month: 'Január', year: 2026 },
      { month: 'február', year: 2026 },
      { month: 'március', year: 2026 },
      { month: 'Április', year: 2026 },
      { month: 'Jelen', year: 2026 }
    ],
    prices: [380, 385, 390, 388, 392, 395, 400, 398, 405, 410, 412, 408, 415],
    current: 415,
    min: 380,
    max: 415
  },
  USD: {
    months: [
      { month: 'Május', year: 2025 },
      { month: 'június', year: 2025 },
      { month: 'Július', year: 2025 },
      { month: 'Augusztus', year: 2025 },
      { month: 'Szeptember', year: 2025 },
      { month: 'Október', year: 2025 },
      { month: 'November', year: 2025 },
      { month: 'December', year: 2025 },
      { month: 'Január', year: 2026 },
      { month: 'február', year: 2026 },
      { month: 'március', year: 2026 },
      { month: 'Április', year: 2026 },
      { month: 'Jelen', year: 2026 }
    ],
    prices: [340, 342, 345, 343, 348, 350, 355, 352, 358, 362, 365, 361, 368],
    current: 368,
    min: 340,
    max: 368
  },
  Inflation: {
    months: [
      { month: 'Május', year: 2025 },
      { month: 'június', year: 2025 },
      { month: 'Július', year: 2025 },
      { month: 'Augusztus', year: 2025 },
      { month: 'Szeptember', year: 2025 },
      { month: 'Október', year: 2025 },
      { month: 'November', year: 2025 },
      { month: 'December', year: 2025 },
      { month: 'Január', year: 2026 },
      { month: 'február', year: 2026 },
      { month: 'március', year: 2026 },
      { month: 'Április', year: 2026 },
      { month: 'Jelen', year: 2026 }
    ],
    rates: [4.2, 4.1, 3.9, 3.7, 3.5, 3.2, 3.0, 2.8, 2.9, 3.1, 3.3, 3.5, 3.7],
    current: 3.7,
    average: 3.4
  }
};

// EUR/HUF árfolyam adatok
export const getEURRate = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = currencyData.EUR;
      const change = (((data.current - data.prices[0]) / data.prices[0]) * 100).toFixed(1);
      const currentMonth = data.months[data.months.length - 1];
      resolve({
        success: true,
        currency: 'EUR',
        current: data.current,
        previous: data.prices[data.prices.length - 2],
        min: data.min,
        max: data.max,
        change: change,
        currentMonth: currentMonth,
        chartData: {
          labels: data.months,
          data: data.prices
        }
      });
    }, 200);
  });
};

// USD/HUF árfolyam adatok
export const getUSDRate = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = currencyData.USD;
      const change = (((data.current - data.prices[0]) / data.prices[0]) * 100).toFixed(1);
      const currentMonth = data.months[data.months.length - 1];
      resolve({
        success: true,
        currency: 'USD',
        current: data.current,
        previous: data.prices[data.prices.length - 2],
        min: data.min,
        max: data.max,
        change: change,
        currentMonth: currentMonth,
        chartData: {
          labels: data.months,
          data: data.prices
        }
      });
    }, 200);
  });
};

// Magyar infláció adatok
export const getInflationRate = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = currencyData.Inflation;
      const currentMonth = data.months[data.months.length - 1];
      resolve({
        success: true,
        indicator: 'Infláció',
        current: data.current,
        average: data.average,
        trend: data.current > data.average ? 'up' : 'down',
        currentMonth: currentMonth,
        chartData: {
          labels: data.months,
          data: data.rates
        }
      });
    }, 200);
  });
};

// Összes pénzügyi indikátor
export const getAllFinancialIndicators = async () => {
  return new Promise(async (resolve) => {
    try {
      const eurResult = await getEURRate();
      const usdResult = await getUSDRate();
      const inflationResult = await getInflationRate();

      resolve({
        success: true,
        EUR: eurResult,
        USD: usdResult,
        Inflation: inflationResult
      });
    } catch (error) {
      resolve({
        success: false,
        error: error.message
      });
    }
  });
};
