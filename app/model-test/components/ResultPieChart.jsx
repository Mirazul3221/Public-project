'use client';
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  PieController,
} from 'chart.js';

ChartJS.register(PieController, ArcElement, Tooltip, Legend);

const ResultPieChart = ({ evaluation }) => {
  const { correct = 0, wrong = 0, skipped = 0, negativeMark = 0 } = evaluation || {};
  const canvasRef = useRef(null);

  const total = correct + wrong + skipped;
  const score = correct - wrong * negativeMark;

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');

    const chart = new ChartJS(ctx, {
      type: 'pie',
      data: {
        labels: ['Correct', 'Wrong', 'Skipped', 'Score'],
        datasets: [
          {
            data: [correct, wrong, skipped, Math.max(0, Math.round(score))],
            backgroundColor: ['#4ade80', '#f87171', '#facc15', '#60a5fa'],
            borderColor: '#fff',
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '70%', // ✅ gives some center space (acts like doughnut)
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.parsed}`,
            },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [correct, wrong, skipped, score]);

  return (
    <div className="relative max-w-md mx-auto">
      <h2 className="text-lg font-semibold text-center mb-4">Exam Performance</h2>

      {/* Chart container */}
      <div className="relative md:w-64 md:h-64 mx-auto">
        <canvas ref={canvasRef} className="w-full h-full" />
        
        {/* ✅ Center Score */}
        <div className="absolute z-0 w-fit top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%]">
          <div className="text-center">
            <span className="text-2xl font-bold text-blue-600">{Math.max(0, Math.round(score))}</span>
            <span className="text-gray-500"> / {total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPieChart;
