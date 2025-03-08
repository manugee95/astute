import Header from "./components/Header";
import Banner from "./components/Banner";
import About from "./components/About";
import WhyUs from "./components/WhyUs";
import Footer from "./components/Footer";
import Services from "./components/pages/Services";
import Welcome from "./components/pages/Welcome";
import AppointmentWrapper from "./components/pages/Appointment";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <About />
              <WhyUs />
            </>
          }
        />
        <Route path="/services" element={<Services />} />
        <Route path="/appointment" element={<AppointmentWrapper />} />
        <Route path="/about" element={<Welcome />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
