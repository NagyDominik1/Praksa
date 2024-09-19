import React, { useState, useEffect, useRef } from 'react';
import Draggable from 'react-draggable'; 
import Modal from './modal.js';
import RealTimeDataPage from './RealTimeDataPage'; 
import axios from 'axios';
import './Mikulas.css'; 
import './modal.css';

const tracks = [
  { foundation: "AUTIZMUS ALAPÍTVÁNY", donation: 0, link: "https://www.autizmus.hu/" },
  { foundation: "LÁMPÁS '92 ALAPÍTVÁNY", donation: 0, link: "https://lampas92.hu/" },
  { foundation: "NOÉ ÁLLATOTTHON ALAPÍTVÁNY", donation: 0, link: "http://www.noeallatotthon.hu/" },
  { foundation: "SZENT ISTVÁN KIRÁLY ZENEI ALAPÍTVÁNY", donation: 0, link: "https://www.szentistvanzene.hu/szent-istvan-kiraly-zenei-alapitvany/" },
];

function App() {
  const [sleighPositions, setSleighPositions] = useState([0, 0, 0, 0]); 
  const [draggablePositions, setDraggablePositions] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 }
  ]); 
  const maxDonation = 3000000;
  const donationPerStation = 250000;
  const [trackWidth, setTrackWidth] = useState(1200); 
  const trackRef = useRef(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isMaxReached, setIsMaxReached] = useState(false);
  const [showRealTimeData, setShowRealTimeData] = useState(false); 
  const [passwordError, setPasswordError] = useState(false); 
  const [clickCount, setClickCount] = useState(0);
const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    const updateTrackWidth = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', updateTrackWidth);
    updateTrackWidth();

    return () => {
      window.removeEventListener('resize', updateTrackWidth);
    };
  }, []);

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
      return null; 
    }
  
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-button" onClick={onClose}>
            &times;
          </button>
          {children}
        </div>
      </div>
    );
  };

  
  const handleReset = () => {
    setSleighPositions([0, 0, 0, 0]); 
    setDraggablePositions([
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 }
    ]); 
    setIsMaxReached(false); 
    setClickCount(prev => prev + 1); 
  };
  const handleOpenModal = () => {
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const gridSize = trackWidth / 14.2;

  const calculateDonations = () => {
    return sleighPositions.map((position) => position * donationPerStation);
  };

  const totalDonation = calculateDonations().reduce((a, b) => a + b, 0);

  const handleDrag = (index, position) => {
    const newPositions = [...sleighPositions];
    const currentTotal = newPositions.reduce((a, b) => a + b, 0) * donationPerStation;
  
    if (currentTotal + position * donationPerStation - sleighPositions[index] * donationPerStation <= maxDonation) {
      newPositions[index] = position;
      setSleighPositions(newPositions);
  
      const newDraggablePositions = [...draggablePositions];
      newDraggablePositions[index] = { x: position * gridSize, y: 0 };
      setDraggablePositions(newDraggablePositions);
    }
  };

  async function getIPAddress() {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch (error) {
      console.error('IP lekérési hiba:', error);
      return null;
    }
  }
  
  async function handleSubmit() {
    if (totalDonation !== maxDonation) {
      alert(`Az össz adomány összege pontosan 3 millió forint kell legyen! Jelenleg: ${totalDonation} Ft.`);
      return;
    }
  
    const ip = await getIPAddress();
    const currentTime = new Date(); 
  
    // Get the most recent donation by IP address
    const recentDonation = await axios.get(`https://sheetdb.io/api/v1/6us7yoyv1ieyn/search?ip_address=${ip}`);
    
    if (recentDonation.data.length > 0) {
      console.log('Last donation time from API:', recentDonation.data[0].date); 
      const lastDonationTime = new Date(recentDonation.data[0].date); 
      console.log('Parsed last donation time:', lastDonationTime);
    
      const timeDifference = (currentTime.getTime() - lastDonationTime.getTime()) / (1000 * 60); 
      console.log('Time difference in minutes:', timeDifference);
  
      if (timeDifference < 10) {
        alert('10 percen belül csak egyszer lehet adományozni.');
        return; 
      }
    }
  
    // If more than 10 minutes have passed or no recent donation exists, proceed with the submission
    const donationData = [
      {
        foundation1: sleighPositions[0] * donationPerStation,
        foundation2: sleighPositions[1] * donationPerStation,
        foundation3: sleighPositions[2] * donationPerStation,
        foundation4: sleighPositions[3] * donationPerStation,
        date: currentTime.toISOString(),
        ip_address: ip,
      }
    ];
  
    fetch('https://sheetdb.io/api/v1/6us7yoyv1ieyn', { 
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: donationData }),
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Hiba történt az adatok küldésekor');
    })
    .then(data => {
      console.log('Siker:', data);
      alert('Az adatok sikeresen el lettek küldve!');
      setIsModalOpen(true); 
    })
    .catch(error => {
      console.error('Hiba történt:', error);
      alert('Nem sikerült az adatok küldése, próbáld újra.');
    });
  }
  
  const handleRealTimeDataAccess = () => {
    const password = prompt('Please enter the password:');
    
    const correctPassword = "mikulas"; 

    if (password === correctPassword) {
      setShowRealTimeData(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div>
      {!showRealTimeData ? (
        <div>
          <div id="section1" className="section">
            <div className="section1container1">
              <div>
                <h1 className='h11'>AZ AJÁNDÉK KÖZÖS</h1>
              </div>
            </div>
          </div>
          
          <div id='sectionmiddle' className='section'>
            <div>
              <div className="section1container2">
              <button className="h12" onClick={handleRealTimeDataAccess}>
                Döntsünk róla eggyüt
              </button>
                <p>
                  A szánkópályán minden beosztás 250 ezer forintot jelent. Húzza a
                  szánkókat aszerint<br />
                  ahogy Ön osztaná el az adományt az alapitványok között. A
                  kiválasztott arányokat<br />
                  végül egyesitjük, s ennek mefelelően osztjuk szét a felajánlott
                  összeget a négy<br />
                  szervezet között. Miután végzett, az "Elküldöm" gombra kattintva
                  véglegesitse döntését.
                </p>
              </div>
            </div>
          </div>
          
          <div id="section2" className="section">
            <div className="section2container">
              {tracks.map((track, index) => (
                <div className="sled-track" key={track.foundation} ref={trackRef}>
                  <img
                    src={`/kepek/VectorAlso${index + 1}.png`}
                    alt={`Track ${index + 1}`}
                    className="track-image"
                  />
                  <div className="lines-container">
                    {[...Array(13)].map((_, lineIndex) => (
                      <img
                        key={lineIndex}
                        src="/kepek/vector.png"
                        alt="Line"
                        className="line-image"
                      />
                    ))}
                  </div>
                  <Draggable
                    axis="x"
                    bounds={{ left: 0, right: gridSize * 12 }}
                    grid={[gridSize, 100]}
                    position={draggablePositions[index]}
                    onStart={() => {
                      if (totalDonation >= maxDonation) return false; 
                    }}
                    onDrag={(e, data) => {
                      const position = Math.min(12, Math.max(0, Math.round(data.x / gridSize)));
                      handleDrag(index, position); 
                    }}
                  >
                  <img
                    src="/kepek/Szánkó_csúszkák.png"
                    alt={`Sled ${index + 1}`}
                    className="sled-image"
                    style={{ cursor: 'grab' }}
                  />
                </Draggable>

                  <img
                    src="/kepek/Info_gombok_és_nevek.png"
                    alt="Info and buttons"
                    className="info-image"
                    onClick={() => window.open(tracks[index].link, '_blank')} 
                  />
                  <div className="track-label">
                    {track.foundation.toUpperCase()}
                  </div>
                  <div className="amount-label fredoka-text">
                    {sleighPositions[index] * donationPerStation} Ft
                  </div>
                </div>
              ))}
            </div>

            <div className="submit-reset-container">
              <div className="button-container left-button" onClick={handleReset}>
                <span className="button-text">Visszaállítás</span>
              </div>
              <div className="button-container right-button" onClick={handleSubmit}>
                <span className="button-text">
                <button
                 disabled={totalDonation !== maxDonation} 
                >
                 Elküldöm
                </button>
                </span>
              </div>

              
              
              
            </div>
            

            <Modal
              isOpen={isModalOpen} 
              onClose={handleCloseModal}
            >
              {/*X button */}
              <button className="modal-close-button" onClick={handleCloseModal}>
                &times;
              </button>
              <h1 className='h11'>További jó szánkózást!</h1>
              <p className='comment'>A döntésed alapján a felajánlott összeget elutaljuk az alapitványoknak köszönjük hogy résztvett az adományozásban!</p>
            </Modal>
          </div>
        </div>
      ) : (
        <RealTimeDataPage onBack={() => setShowRealTimeData(false)} />
      )}
    </div>
  );
}

export default App;
