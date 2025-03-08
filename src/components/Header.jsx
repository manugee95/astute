import { FaPhone } from "react-icons/fa6";
import { FaClock, FaTimes } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { useEffect, useState } from "react";

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Scroll threshold
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <div className="header">
        <div className="logo">
          <a href="/">
            <img src="/Astute_logo.png" alt="" />
          </a>
        </div>
        <div className="contInfo">
          <div className="contPhone">
            <FaPhone className="contIcon" />
            <p>713-300-4643</p>
          </div>
          <div className="contClock">
            <FaClock className="contIcon" />
            <p>Monday - Friday - 8am - 5pm</p>
          </div>
        </div>
      </div>
      <div className={`nav ${isScrolled ? "scrolled" : ""}`}>
        <div className="logoNav">
          <a href="/">
            <img src="/Astute_logo_mobile.png" alt="" />
          </a>
        </div>
        <div onClick={toggleMenu}>
          {menuOpen ? (
            <FaTimes className="menu" />
          ) : (
            <FiMenu className="menu" />
          )}
        </div>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/services">Our Services</a>
          </li>
          <li>
            <a href="/appointment">Book Appointment</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Header;
