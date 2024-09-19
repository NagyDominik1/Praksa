import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RealTimeData.css';
import DoughnutChart from './DoughnutChart';

const RealTimeDataPage = ({ onBack }) => {
  const [donationData, setDonationData] = useState([]);
  const [totalDonations, setTotalDonations] = useState([0, 0, 0, 0]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [lastRequest, setLastRequest] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  // Use the actual foundation names instead of generic labels
  const foundationNames = [
    "AUTIZMUS ALAPÍTVÁNY", 
    "LÁMPÁS '92 ALAPÍTVÁNY", 
    "NOÉ ÁLLATOTTHON ALAPÍTVÁNY", 
    "SZENT ISTVÁN KIRÁLY ZENEI ALAPÍTVÁNY"
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('https://sheetdb.io/api/v1/6us7yoyv1ieyn')
      .then(response => {
        const data = response.data;
        setDonationData(data);

        const total = [0, 0, 0, 0];
        data.forEach(row => {
          total[0] += Number(row.foundation1);
          total[1] += Number(row.foundation2);
          total[2] += Number(row.foundation3);
          total[3] += Number(row.foundation4);
        });
        setTotalDonations(total);
        setTotalRequests(data.length);

        if (data.length > 0) {
          setLastRequest(data[data.length - 1].date);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  };

  // Delete entry function
  const deleteEntry = (ipAddress) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt az adományt?')) {
      axios.delete(`https://sheetdb.io/api/v1/6us7yoyv1ieyn/ip_address/${ipAddress}`)
        .then(response => {
          if (response.status === 200) {
            alert('Adomány sikeresen törölve!');
            fetchData(); 
          } else {
            alert('Hiba történt az adomány törlése közben.');
          }
        })
        .catch(error => {
          console.error('Hiba történt:', error);
          alert('Nem sikerült az adomány törlése, próbáld újra.');
        });
    }
  };

  const handleSortByDate = () => {
    const sortedData = [...donationData].sort((a, b) => {
      return sortOrder === 'asc'
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });
    setDonationData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = donationData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className="real-time-data-page">
  <button onClick={onBack} className="back-button">Back</button>
  <h1>Real-Time Donation Data</h1>

  <div className="table-chart-container">
    {/* Adatok és diagram egy sorban */}
    <div className="text-background">
      <p>Total Submissions: {totalRequests}</p>
      <p>Last Submission: {lastRequest}</p>
      <div className="total-donations">
        {foundationNames.map((name, index) => (
          <p key={name}>{name}: {totalDonations[index]} Ft</p>
        ))}
      </div>
    </div>

    {/* Chart közvetlenül az adatok mellett */}
    <div className="chart-container">
      <DoughnutChart donations={totalDonations} />
    </div>
  </div>

  {/* Az alsó táblázat itt marad */}
  <div className="table-container">
    <table>
      <thead>
        <tr>
          <th>AUTIZMUS ALAPÍTVÁNY</th>
          <th>LÁMPÁS '92 ALAPÍTVÁNY</th>
          <th>NOÉ ÁLLATOTTHON ALAPÍTVÁNY</th>
          <th>SZENT ISTVÁN KIRÁLY ZENEI ALAPÍTVÁNY</th>
          <th onClick={handleSortByDate}>Date {sortOrder === 'asc' ? '↑' : '↓'}</th>
          <th>IP Address</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {currentRows.map((row, index) => (
          <tr key={index}>
            <td>{row.foundation1}</td>
            <td>{row.foundation2}</td>
            <td>{row.foundation3}</td>
            <td>{row.foundation4}</td>
            <td>{new Date(row.date).toLocaleString()}</td>
            <td>{row.ip_address}</td>
            <td>
              <button onClick={() => deleteEntry(row.ip_address)} className="delete-button">
                Törlés
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="pagination">
    {[...Array(Math.ceil(donationData.length / rowsPerPage)).keys()].map(number => (
      <button key={number + 1} onClick={() => paginate(number + 1)}>
        {number + 1}
      </button>
    ))}
  </div>
</div>
  
  );
};

export default RealTimeDataPage;
