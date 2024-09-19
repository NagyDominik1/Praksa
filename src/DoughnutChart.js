import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ donations }) => {
  // Calculate total donations sum
  const totalDonationsSum = donations.reduce((a, b) => a + b, 0);

  // Data for the Doughnut chart, transforming amounts into percentages
  const data = {
    labels: ["AUTIZMUS ALAPÍTVÁNY", 
    "LÁMPÁS '92 ALAPÍTVÁNY", 
    "NOÉ ÁLLATOTTHON ALAPÍTVÁNY", 
    "SZENT ISTVÁN KIRÁLY ZENEI ALAPÍTVÁNY"],
    datasets: [
      {
        label: 'Donation Percentage',
        data: totalDonationsSum > 0 
          ? donations.map(donation => (donation / totalDonationsSum) * 100) 
          : [0, 0, 0, 0], 
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options to display percentage in tooltip
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2) + '%';
          },
        },
      },
    },
  };

  return (
    <div 
      style={{ 
        width: '383px', 
        height: '383px', 
        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
        padding: '20px', 
        marginBottom: '40px',
        marginLeft:"108%",
        borderRadius: '10px', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center', 
      }}
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
