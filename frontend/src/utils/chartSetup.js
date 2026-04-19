/**
 * Central Chart.js registration.
 *
 * Import this file once (e.g. in main.jsx or each chart component) instead of
 * calling ChartJS.register() repeatedly in every component.  Chart.js's
 * register() is idempotent, but doing it once at startup is faster and keeps
 * all chart components consistent.
 */
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
);

export default ChartJS;
