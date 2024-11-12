import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Graph({ basePrice, price }) {
  // 쉼표가 포함된 문자열을 숫자로 변환하는 함수
  const parsePrice = (price) => Number(price.replace(/,/g, ''));

  const prices = [parsePrice(basePrice), parsePrice(price)];
  const labels = ['2024-11-05', '2024-11-12'];

  const maxPrice = Math.max(...prices); // 가장 높은 가격
  const minPrice = Math.min(...prices); // 가장 낮은 가격
  const maxIndex = prices.indexOf(maxPrice); // 최고가 인덱스
  const minIndex = prices.indexOf(minPrice); // 최저가 인덱스

  // 차트 데이터 설정
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Price',
        data: prices,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.3,
        pointStyle: 'circle',
        pointRadius: prices.map(price => (price === maxPrice || price === minPrice ? 8 : 5)),
        pointBackgroundColor: prices.map(price => (price === maxPrice ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)')),
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBorderWidth: 0,
      },
    ],
  };

  // 커스텀 플러그인: 최고가와 최저가를 그래프에 표시
  const maxMinLabelPlugin = {
    id: 'maxMinLabelPlugin',
    afterDatasetsDraw: (chart) => {
      const { ctx, scales: { x, y } } = chart;
      const padding = 10; // 텍스트가 경계를 벗어나지 않도록 패딩 설정

      ctx.save();
      ctx.font = 'bold 12px Arial';

      // 최고가 표시
      const maxX = x.getPixelForValue(maxIndex);
      const maxY = y.getPixelForValue(maxPrice);
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${maxPrice}원`, maxX, maxY - padding);

      // 최저가 표시
      const minX = x.getPixelForValue(minIndex);
      const minY = y.getPixelForValue(minPrice);
      ctx.fillStyle = 'blue';
      ctx.textBaseline = 'top';
      ctx.fillText(`${minPrice}원`, minX, minY + padding);

      ctx.restore();
    },
  };

  // 차트 옵션 설정
  const options = {
    responsive: false,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        left: 30,
        right: 30,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: minPrice - minPrice / 3,
        max: maxPrice + minPrice / 3,
        ticks: {
          display: false,
        },
        grid: {
          drawTicks: false,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          drawBorder: false,
        },
      },
    },
  };

  return <Line data={data} options={options} plugins={[maxMinLabelPlugin]} />;
}

export default Graph;
