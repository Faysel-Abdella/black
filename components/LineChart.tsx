import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      borderWidth: number;
      fill: boolean;
    }[];
  };
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");

    if (ctx) {
      const chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: data.labels,
          datasets: data.datasets.map((dataset) => ({
            ...dataset,
            pointHoverRadius: 7, // 호버 시 점의 시각적 크기 설정
            pointHitRadius: 20, // 호버 영역의 크기 설정
          })),
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              type: "category",
              grid: {
                display: false, // Set to false to hide y-axis grid lines
              },
              border: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              border: {
                dash: [2, 4],
                display: false,
              },
            },
          },
        },
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return <canvas ref={chartRef} className="linechart" />;
};

export default LineChart;
