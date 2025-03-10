import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setHours, setMinutes, getDay } from "date-fns";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import useAlert from "../../hooks/useAlert";

function Appointment() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { alertInfo, showAndHide } = useAlert();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    appointmentDate: null, // Using Date object
    appointmentTime: null, // Using Date object
  });

  const [loading, setLoading] = useState(false);

  // Disable weekends (Saturday = 6, Sunday = 0)
  const isWeekday = (date) => {
    const day = getDay(date);
    return day !== 0 && day !== 6;
  };

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!executeRecaptcha) {
      console.error("reCAPTCHA not ready");
      showAndHide("error", "Error with reCAPTCHA. Please refresh the page.");
      setLoading(false);
      return;
    }

    // Get reCAPTCHA token
    const token = await executeRecaptcha("submit");

    try {
      const response = await fetch(
        "http://localhost:8000/api/book-appointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            appointmentDate: formData.appointmentDate?.toDateString(),
            appointmentTime: formData.appointmentTime?.toLocaleTimeString(),
            captchaToken: token,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        showAndHide("success", "Appointment booked successfully!");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          appointmentDate: null,
          appointmentTime: null,
        });
      } else {
        showAndHide("error ", "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  return (
    <div>
      <div className="appointmentban">
        <h1>Book an Appointment</h1>
      </div>
      {alertInfo.show && (
        <div
          style={{
            backgroundColor:
              alertInfo.type === "success" ? "#28a745" : "#dc3545",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            textAlign: "center",
            marginBottom: "10px",
            width: "50%",
            margin: "auto",
          }}
        >
          {alertInfo.message}
        </div>
      )}
      <div className="bookform">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          {/* Date Picker - Only Weekdays */}
          <label>Select Date:</label>
          <DatePicker
            selected={formData.appointmentDate}
            onChange={(date) =>
              setFormData({ ...formData, appointmentDate: date })
            }
            filterDate={isWeekday} // Disable weekends
            minDate={new Date()} // Disable past dates
            dateFormat="yyyy-MM-dd"
            required
          />

          {/* Time Picker - 8:00 AM to 5:00 PM */}
          <label>Select Time:</label>
          <DatePicker
            selected={formData.appointmentTime}
            onChange={(time) =>
              setFormData({ ...formData, appointmentTime: time })
            }
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30} // 30-minute intervals
            timeCaption="Time"
            dateFormat="h:mm aa"
            minTime={setHours(setMinutes(new Date(), 0), 8)} // 8:00 AM
            maxTime={setHours(setMinutes(new Date(), 0), 17)} // 5:00 PM
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "BOOK APPOINTMENT"}
          </button>
        </form>
      </div>
    </div>
  );
}

const AppointmentWrapper = () => (
  <GoogleReCaptchaProvider reCaptchaKey="6LcYZOsqAAAAAMOo07TOSBZNQHZ3yOOum84CWB3t">
    <Appointment />
  </GoogleReCaptchaProvider>
);

export default AppointmentWrapper;
