import React, { useEffect, useRef } from 'react';
import {
  Chart,
  
  registerables
} from 'chart.js';


Chart.register(...registerables);

const PieChart = ({ data, centerText }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const { categories = [], total = 0 } = data;

  useEffect(() => {
    const chartData = {
      labels: categories.map(cat => cat.name),
      datasets: [
        {
          data: categories.map(cat => cat.percentage),
          backgroundColor: [
            '#4CAF50',
            '#2196F3',
            '#FFC107',
            '#FF5722',
            '#9C27B0'
          ],
          borderWidth: 0
        }
      ]
    };

    if (chartRef.current) {
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(chartRef.current, {
        type: 'doughnut',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 12,
                padding: 20,
                font: {
                  size: 12
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  const amount = categories[context.dataIndex]?.amount || '0 ₽';
                  return `${context.label}: ${context.raw}% (${amount})`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [categories]);

  return (
    <div className="pie-chart-container">
      <div className="chart-wrapper" style={{ position: 'relative', height: '300px' }}>
        <canvas ref={chartRef} />
        {centerText && (
          <div className="chart-center-text">
            {total.toLocaleString('ru-RU')} ₽
          </div>
        )}
      </div>
    </div>
  );
};

export default PieChart;
