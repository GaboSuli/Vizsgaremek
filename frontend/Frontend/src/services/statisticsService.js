/**
 * Statistics Service - Statisztikai adatok feldolgozása
 */

// Adatok közvetlenül az objektumokba ágyazva
const alkategoriaHaviData = {
  "2025-05": {
    "Mikor": "2025-05",
    "AtlagAr": 50
  },
  "2025-06": {
    "Mikor": "2025-06",
    "AtlagAr": 60
  },
  "2025-07": {
    "Mikor": "2025-07",
    "AtlagAr": 70
  },
  "Jelen": {
    "Mikor": "Jelen",
    "AtlagAr": 1000000000000000000
  }
};

const osszesAlkategoriasData = {
  "Alk1": {
    "Megnevezes": "Víz",
    "AtlagAr": 5001515515522515,
    "Mertekegyseg": "Liter"
  },
  "Alk2": {
    "Megnevezes": "Olaj",
    "AtlagAr": 2500000000000000,
    "Mertekegyseg": "Liter"
  },
  "Alk3": {
    "Megnevezes": "Liszt",
    "AtlagAr": 1500000000000000,
    "Mertekegyseg": "kg"
  },
  "Alk4": {
    "Megnevezes": "Cukor",
    "AtlagAr": 2000000000000000,
    "Mertekegyseg": "kg"
  }
};

/**
 * Alkategória havi átlagár-változásának lekérése
 */
export const getAlkategoriaMonthlyStats = async () => {
  try {
    const allData = alkategoriaHaviData;

    const monthlyData = [];
    for (const key in allData) {
      const entry = allData[key];
      if (entry.Mikor && entry.AtlagAr !== undefined) {
        monthlyData.push({
          month: entry.Mikor,
          price: entry.AtlagAr
        });
      }
    }

    monthlyData.sort((a, b) => {
      if (a.month === 'Jelen') return 1;
      if (b.month === 'Jelen') return -1;
      return a.month.localeCompare(b.month);
    });

    const chartData = {
      labels: monthlyData.map(e => e.month),
      datasets: [
        {
          label: 'Átlagár (Ft)',
          data: monthlyData.map(e => e.price),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }
      ]
    };

    const prices = monthlyData.map(e => e.price);
    const statistics = {
      min: Math.min(...prices),
      max: Math.max(...prices),
      average: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      current: prices[prices.length - 1]
    };

    return {
      success: true,
      chartData,
      statistics,
      rawData: monthlyData
    };
  } catch (error) {
    console.error('Hiba a havi statisztikák lekérdezésekor:', error);
    return {
      success: false,
      error: error.message,
      chartData: { labels: [], datasets: [] }
    };
  }
};

/**
 * Összes alkategória aktuális átlagárának lekérése
 */
export const getAllAlkategoriasStats = async () => {
  try {
    const allData = osszesAlkategoriasData;

    const transformedData = [];
    const chartColors = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)'
    ];

    for (const id in allData) {
      const data = allData[id];
      transformedData.push({
        id,
        megnevezes: data.Megnevezes || 'Ismeretlen',
        atlagAr: data.AtlagAr || 0,
        mertekegyseg: data.Mertekegyseg || ''
      });
    }

    transformedData.sort((a, b) => b.atlagAr - a.atlagAr);

    const chartData = {
      labels: transformedData.map(d => d.megnevezes),
      datasets: [
        {
          label: 'Átlagár (Ft)',
          data: transformedData.map(d => d.atlagAr),
          backgroundColor: chartColors.slice(0, transformedData.length),
          borderColor: chartColors.slice(0, transformedData.length),
          borderWidth: 1
        }
      ]
    };

    const allPrices = transformedData.map(d => d.atlagAr);
    const statistics = {
      totalCategories: transformedData.length,
      minPrice: Math.min(...allPrices),
      maxPrice: Math.max(...allPrices),
      averagePrice: Math.round(allPrices.reduce((a, b) => a + b, 0) / allPrices.length)
    };

    return {
      success: true,
      data: transformedData,
      chartData,
      statistics,
      totalCount: transformedData.length
    };
  } catch (error) {
    console.error('Hiba az összes alkategória lekérdezésekor:', error);
    return {
      success: false,
      error: error.message,
      data: [],
      chartData: { labels: [], datasets: [] }
    };
  }
};

/**
 * Keresés alkategóriák között
 */
export const searchAlkategorias = async (searchTerm) => {
  try {
    const result = await getAllAlkategoriasStats();
    if (!result.success) return [];

    return result.data.filter(item =>
      item.megnevezes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Hiba a keresés során:', error);
    return [];
  }
};
