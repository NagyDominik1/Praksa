import React, { useState, useEffect } from 'react';
import './Praksa3.css'; // Import your CSS
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';  // Ha az autoplay-t is használni akarod

// App component
const App = () => {
  const [theme, setTheme] = useState('light-mode');
  const [menuOpen, setMenuOpen] = useState(false);
  const [popupShown, setPopupShown] = useState(false);
  const [hasPopupBeenShown, setHasPopupBeenShown] = useState(false);  // Új állapot

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'dark-mode' ? 'light-mode' : 'dark-mode';
    setTheme(newTheme);
  };

  // Hamburger menu toggle
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Show popup function
  const showPopup = () => {
    if (!hasPopupBeenShown) {  // Csak akkor mutassuk, ha még nem mutattuk
      setPopupShown(true);
      document.body.classList.add('no-scroll'); // Disable scrolling when popup is visible
      setHasPopupBeenShown(true);  // Jelöljük, hogy már megmutattuk
    }
  };

  // Close popup function
  const closePopup = () => {
    setPopupShown(false);  // Állítsd false-ra, hogy bezárja a popupot
    document.body.classList.remove('no-scroll'); // Re-enable scrolling when popup is closed
  };

  // Accept popup action
  const acceptPopup = () => {
    closePopup();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 800 && !hasPopupBeenShown) {
        showPopup();
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup scroll event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasPopupBeenShown]);

  useEffect(() => {
    new Swiper('.testimonial-carousel-mobile', {
      loop: true,
      centeredSlides: true,  // A slide-ok középre igazítása
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      slidesPerView: 1,
      spaceBetween: 30,
      autoplay: {
        delay: 3000,  
        disableOnInteraction: false,
        reverseDirection: true,
      },
    });

    new Swiper('.testimonial-carousel-desktop', {
      loop: true,  
      navigation: {
        nextEl: '.swiper-button-next',  
        prevEl: '.swiper-button-prev',  
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      slidesPerView: 2.5,  // Felemeljük az értéket
      centeredSlides: false,  // Nem központosítjuk a középső slide-ot
      spaceBetween: 30,  
      autoplay: {
        delay: 3000, 
        disableOnInteraction: false,
        reverseDirection: true,  // Balra mozgás
      },
      breakpoints: {
        768: {
          slidesPerView: 2.5,  // Továbbra is részben látható 2-3 slide
          spaceBetween: 30,
        }
      }
    });
    
    
    


  }, []);
  
  
  return (
    <div className={theme}>
      <meta charSet="UTF-8" />
      <link type="text/css" href="Praksa.css" rel="stylesheet" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Elektronikus bevásárló lista</title>

      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <img src="/kepek/logo.png" alt="Logo" className="navbar-logo" />

          <div className="theme-toggle" onClick={toggleTheme}>
            <img src={theme === 'dark-mode' ? '/kepek/switch.png' : '/kepek/off-button.png'} alt="Toggle Light/Dark Mode" id="theme-icon" />
          </div>

          <div className="download-btn">
          <a href="/Letöltött cucc.docx" download>
              <img src="/kepek/pdf.png" alt="PDF Icon" className="pdf-icon" />
              <span>Download</span>
            </a>
          </div>

          {/* Hamburger icon (visible only on mobile) */}
          <div className="hamburger" onClick={toggleMenu}>
            &#9776;
          </div>

          {/* Navigation links */}
          <div className={`navbar-collapse ${menuOpen ? 'active' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#section1">Die metygerei</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#section2">Dry aged</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#section3">Fleischversand</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#section4">Events/Kurse</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#section5">Partyservice</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#section6">Tagesessen</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#section7">Kontakt</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Section 0 */}
      <div id="section0" className="section0">
        <img src="/kepek/clock.svg" alt="Clock Icon" />
        <p>Open 24/7. Never too late to check into our store.</p>
      </div>

      {/* Section 1 */}
      <div id="section1" className="section">
        <div className="mobile-image">
          <img src="/kepek/image14.jpg" alt="Heiko Brath" />
        </div>

        <div className="section1container">
          <div className="container">
            <h1>Heiko Brath Metzgermeister</h1>
            <p>
              German Ipsum Dolor deserunt dissentias <br /> Grimm's Fairy Tales
              et. Tollit argumentum <br /> ius an. Pancakes lobortis elaboraret
              <br /> per ne, nam Aperol Spritz probatus pertinax.
            </p>
          </div>
        </div>
      </div>

      {popupShown && (
        <div id="popup-modal" className="popup visible">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get the latest updates and offers straight to your inbox.</p>
            <button onClick={acceptPopup}>Subscribe</button>
          </div>
        </div>
      )}


      {/* Section 2 */}
      <div id="section2" className="section">
  <div className="container">
    <div className="row">
      <div className="col text-content">
        <h1>Dry aged<br />Alte Wutz, Dry Aged</h1>
        <p>
          Halt amet, consectetur Handtasche elit, sed do eiusmod tempor Stuttgart ut labore et dolore magna 99 Luftballons Ut enim ad minim veniam, Turnbeutel nostrud exercitation ullamco laboris nisi Sprechen Sie deutsch aliquip ex ea commodo consequat. Wiener Schnitzel aute irure dolor in reprehenderit Guten Tag mollit anim Stuttgart. id latine indoctum complectitur HugoClub Mate mea meliore denique nominavi id. Ohrwurm expetenda nam an, his ei Reise euismod assentior.
        </p>
        <div className="button-container">
          <button className="btn btn-primary">Dry aged</button>
          <button className="btn btn-primary">Alte Wutz</button>
        </div>
      </div>

      <div className="col image-gallery">
        <div className="main-image">
          <img src="/kepek/287e4a29fb95622355c7023ec0f765ff@2x 1.svg" alt="Main" />
        </div>
        <div className="thumbnail-gallery">
          <img src="/kepek/Group 629.png" alt="Thumbnail 1" />
        </div>
      </div>
    </div>
  </div>
</div>


      {/* Section 3 */}
      <div id="section3" className="section">
        <div className="container">
          <div className="row">
            <div className="col text-content">
              <h1>Buchen Sie den Grillkurs jetzt</h1>
              <ul>
                <li>professioneller Lehrer</li>
                <li>ausgezeichneter Metzger</li>
                <li>1 Tag</li>
                <li>lernen Sie die Kunst des Grillens</li>
              </ul>
              <div className="button-container">
                <button className="btn btn-white">Grillkurs</button>
              </div>
            </div>

            {/* Desktop image (rejtve mobilon) */}
            <div className="image-content">
              <img src="/kepek/victoria.jpg" alt="Grill1" />
            </div>
          </div>
        </div>

        {/* Mobil kép (csak mobilon jelenik meg) */}
        <div className="mobile-image-section3">
          <img src="/kepek/victoria.jpg" alt="Grill2" />
        </div>
      </div>

      {/* Section 4 */}
      <div id="section4" className="section">
        <h1>Das Handwerk</h1>
        <h3>alles über unsere Hausgemachte Produkte</h3>
        <div className="container">
          <p>
            Halt amet, consectetur Handtasche elit, sed do eiusmod tempor Stuttgart ut labore et dolore magna 99 Luftballons Ut
            enim ad minim veniam, Turnbeutel nostrud exercitation ullamco laboris nisi Sprechen Sie deutsch aliquip ex ea commodo
            consequat. Wiener Schnitzel aute irure dolor in Guten Tag mollit anim Stuttgart.
          </p>
          <div className="button-container">
            <button className="btn btn-white">Das handwerk</button>
          </div>
          <img src="/kepek/vonal 1.png" alt="Separator Line" />

          <div className="thumbnail-gallery2">
            <div className="image-wrapper">
              <img src="/kepek/Group 661@2x.png" alt="Würstchen" />
              <div className="overlay">Würstchen</div>
            </div>
            <div className="image-wrapper">
              <img src="/kepek/Group 660@2x.png" alt="Hähnchen" />
              <div className="overlay">Hähnchen</div>
            </div>
            <div className="image-wrapper">
              <img src="/kepek/Group 659@2x.png" alt="Schwein" />
              <div className="overlay">Schwein</div>
            </div>
            <div className="image-wrapper">
              <img src="/kepek/Group 658@2x.png" alt="Rind" />
              <div className="overlay">Rind</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5 */}
      <div id="section5" className="section">
        <div className="container">
          <div className="row">
            <div className="col text-content">
              <h1>Custome spices for your meat</h1>
              <h3>Turnbeutel nostrud exercitation ullamco<br />Sprechen Sie deutsch</h3>
              <p>Odio principes iracundia Müller Rice pri. Ut vel solum mandamus, Kartoffelkopf natum adversarium ei ius.</p>
            </div>
            <div className="col image-content">
              <img src="/kepek/spicyimage.jpg" alt="Spices1" />
            </div>
          </div>
        </div>

        {/* Kép, ami mobilon jelenik meg a szöveg alatt */}
        <div className="mobile-image">
          <img src="/kepek/spicyimage.jpg" alt="Spices2" />
        </div>
      </div>

      {/* Section 6 */}
      <div id="section6" className="section">
        <h1>Fleischversand</h1>
        <div className="button-container">
          <button className="btn btn-white">Jetzt bestellen</button>
        </div>
      </div>

      {/* Section 7 */}
      <div id="section7" className="section">
        <div className="container">
          <div className="row">
            <div className="col logo-container">
              <img src="/kepek/genussnetz logo 1.png" alt="Genussnetz Logo" />
            </div>
            <div className="col text-container">
              <h1>Metzgerei Brath ist Mitglied im Genussnetzwerk</h1>
              <div className="button-container">
                <button className="btn btn-red">Gehen zu site</button>
              </div>
            </div>
          </div>
        </div>

        <div className="separator-line-container">
          <img src="/kepek/vonal 1.png" alt="Separator Line" />
        </div>

        <div className="thumbnail-gallery3">
          <h2>Auszeichnungen</h2>
          <div className="image-wrapper2">
            <img src="/kepek/nagrada1.svg" alt="Award 1" />
            <div className="overlay2">Tollit argumentum genau Saepe lobortis</div>
          </div>
          <div className="image-wrapper2">
            <img src="/kepek/nagrada2.svg" alt="Award 2" />
            <div className="overlay2">Schneewittchen denique</div>
          </div>
          <div className="image-wrapper2">
            <img src="/kepek/nagrada3.svg" alt="Award 3" />
            <div className="overlay2">Grimms Märchen expetenda</div>
          </div>
          <div className="image-wrapper2">
            <img src="/kepek/nagrada4.svg" alt="Award 4" />
            <div class0Name="overlay2">Mettwurst mei ullum gloriatur.</div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="testimonial-section">
        <h2 className="swiperh2">Was die Leute über uns sagen</h2>

        {/* Mobile Swiper */}
        <div className="swiper-container testimonial-carousel-mobile">
          <div className="swiper-wrapper">
            <div className="swiper-slide testimonial">
              <p>Sprechen Sie deutsch aliquip ex ea commodo consequat...</p>
              <h4>Maria Kartoffeln</h4>
            </div>
            <div className="swiper-slide testimonial">
              <div className="icon">
                <img src="/kepek/grillkurs_icon.svg" alt="Grill Icon" />
                <br />
                <img src="/kepek/zvezdice.svg" alt="stars" />
              </div>
              <p>Wiener Schnitzel amet...</p>
              <h4>Halling Tobias<br /><small>Koch</small></h4>
            </div>
            <div className="swiper-slide testimonial">
              <p>Achtung fur atine indoctum...</p>
              <h4>Rene Weinstein</h4>
            </div>
          </div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>

        {/* Desktop Swiper */}
        <div className="swiper-container testimonial-carousel-desktop">
          <div className="swiper-wrapper">
            <div className="swiper-slide testimonial">
              <p>Sprechen Sie deutsch aliquip...</p>
              <h4>Maria Kartoffeln</h4>
            </div>
            <div className="swiper-slide testimonial">
              <div className="icon">
                <img src="/kepek/grillkurs_icon.svg" alt="Grill Icon" />
                <br />
                <img src="/kepek/zvezdice.svg" alt="stars" />
              </div>
              <p>Wiener Schnitzel amet...</p>
              <h4>Halling Tobias<br /><small>Koch</small></h4>
            </div>
            <div className="swiper-slide testimonial">
              <p>Achtung fur atine indoctum...</p>
              <h4>Rene Weinstein</h4>
            </div>
            <div className="swiper-slide testimonial">
              <p>Das Essen war einfach hervorragend, die Qualität ist unübertroffen...</p>
              <h4>Karl Müller</h4>
            </div>
            <div className="swiper-slide testimonial">
              <p>Eine wahre Geschmacksexplosion, ich komme auf jeden Fall wieder...</p>
              <h4>Anna Schmidt</h4>
            </div>
          </div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-next"></div>
          <div className="swiper-button-prev"></div>
        </div>

        <button className="all-reviews-btn">Alle Berichte</button>
      </div>

      {/* Footer */}
      <footer>
        <div className="footer-container">
          <div className="footer-left">
            <p>
              Klauprechtstraße 25<br />
              76137 Karlsruhe, Germany<br />
              +49 721 358060<br />
              info@partyservice-brath.de
            </p>
          </div>
          <div className="footer-center">
            <img src="/kepek/logo.png" alt="Brath Logo" className="footer-logo" />
          </div>
          <div className="footer-right">
            <p>Besuchen Sie uns auf:</p>
            <div className="social-icons">
              <a href="#top"><img src="/kepek/Group 628 1.png" alt="Twitter" /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2020 by Metzgerei Heiko Brath GmbH, Deutschland</p>
          <p>Code and design by <a href="https://studiopresent.com">StudioPresent</a></p>
        </div>
      </footer>
    </div>
  );
};

export default App;
