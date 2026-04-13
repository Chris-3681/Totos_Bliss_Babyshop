// src/components/Footer/Footer.js
import "./Footer.css";
import { FaWhatsapp } from "react-icons/fa";

function Footer() {
  const whatsappLink =
    "https://wa.me/254715197697?text=Hi%2C%20I%27m%20interested%20in%20your%20baby%20products";

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-section">
          <h3 className="footer-title">Totos Bliss</h3>
          <p className="footer-text">
            Your trusted baby shop for essentials, clothing, and accessories.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Customer Care</h4>
          <p className="footer-text">Fast order processing</p>
          <p className="footer-text">Clear VAT pricing</p>
          <p className="footer-text">Reliable delivery updates</p>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Contact</h4>
          <p className="footer-text">Nairobi, Kenya</p>
          <p className="footer-text">0715 197 697</p>
          <p className="footer-text">support@totosbliss.com</p>
          <p>WhatsApp support available</p>
          <p className="footer-text">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="footer-whatsapp"
            >
              <FaWhatsapp className="whatsapp-icon" />
              <span className="whatsapp-text">WhatsApp Us</span>
            </a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© 2026 Totos Bliss. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;