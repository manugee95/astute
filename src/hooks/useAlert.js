import { useState } from "react";

function useAlert() {
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: null,
    message: "",
  });

  const showAndHide = (type, message) => {
    setAlertInfo({ show: true, type, message });

    setTimeout(() => {
      setAlertInfo((prev) => ({ ...prev, show: false }));
    }, 5000);
  };

  return { alertInfo, showAndHide };
}

export default useAlert;