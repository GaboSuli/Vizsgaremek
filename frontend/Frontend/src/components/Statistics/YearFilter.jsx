import React from 'react';

const CUR_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => CUR_YEAR - i);

export default function YearFilter({ value, onChange }) {
  return (
    <div className="year-filter">
      <label className="year-filter-label">Év szűrő</label>
      <select
        className="form-control year-filter-select"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
      >
        {YEARS.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
