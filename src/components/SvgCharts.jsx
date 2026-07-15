import React from 'react';

// 1. Line Chart Component
export const LineChart = ({ data = [], height = 150, strokeColor = '#2563EB', fillColor = 'rgba(37, 99, 235, 0.1)' }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-400">No Data</div>;

  const padding = 20;
  const width = 300;
  const maxVal = 100;
  const minVal = 70; // Hardcoded baseline to make changes visible

  // Compute coordinates
  const points = data.map((val, idx) => {
    const x = padding + (idx * (width - 2 * padding)) / (data.length - 1);
    const y = height - padding - ((val - minVal) / (maxVal - minVal)) * (height - 2 * padding);
    return { x, y, val };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0 
    ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        {/* Gradients */}
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3,3" />
        <line x1={padding} y1={height/2} x2={width - padding} y2={height/2} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="3,3" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />

        {/* Area */}
        {areaD && <path d={areaD} fill="url(#lineGrad)" />}

        {/* Line */}
        {pathD && <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-sm" />}

        {/* Points */}
        {points.map((p, idx) => (
          <g key={idx} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke={strokeColor} strokeWidth="2" className="transition-transform group-hover:scale-150" />
            <title>{`Month ${idx + 1}: ${p.val}%`}</title>
          </g>
        ))}
      </svg>
    </div>
  );
};

// 2. Bar Chart Component
export const BarChart = ({ data = [], height = 150, barColor = '#3B82F6' }) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-slate-400">No Data</div>;

  const padding = 25;
  const width = 350;
  const maxVal = Math.max(...data.map(d => d.value), 5);
  
  const chartHeight = height - 2 * padding;
  const barWidth = Math.min(30, (width - 2 * padding) / data.length - 10);
  const gap = ((width - 2 * padding) - (barWidth * data.length)) / (data.length - 1);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full overflow-visible">
        {/* Y Axis line */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />
        {/* X Axis line */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-700" />

        {/* Bars */}
        {data.map((item, idx) => {
          const x = padding + idx * (barWidth + gap) + gap/2;
          const barHeight = (item.value / maxVal) * chartHeight;
          const y = height - padding - barHeight;

          return (
            <g key={idx} className="group cursor-pointer">
              {/* Rounded Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={barColor}
                className="opacity-85 hover:opacity-100 transition-opacity"
              />
              {/* X Axis Label */}
              <text
                x={x + barWidth / 2}
                y={height - padding + 15}
                textAnchor="middle"
                fontSize="10"
                className="fill-slate-500 dark:fill-slate-400 font-sans"
              >
                {item.label}
              </text>
              {/* Tooltip text on hover */}
              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                className="fill-slate-700 dark:fill-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {item.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 3. Mini Progress Ring (Donut)
export const ProgressRing = ({ percentage = 75, size = 60, strokeWidth = 5, color = '#2563EB' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Track circle */}
        <circle
          className="text-slate-100 dark:text-slate-800"
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress circle */}
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="absolute text-xs font-semibold font-mono text-slate-700 dark:text-slate-200">
        {Math.round(percentage)}%
      </span>
    </div>
  );
};
