import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// toast.configure()

const options = {
  autoClose: 2000,
  className: "",
  position: "right",
};

export const toastSuccess = (message) => {
  console.log("Hello0 success toast");
  toast.success(message, options);
};

export const toastError = (message) => {
  toast.error(message, options);
};

export const toastWarning = (message) => {
  toast.warn(message, options);
};

export const toastInformation = (message) => {
  toast.info(message, options);
};

export const toastDark = (message) => {
  toast.dark(message, options);
};

export const toastDefault = (message) => {
  toast(message, options);
};

export const formatIndian = (str) => {
  if (str?.toString()) return str.toString().replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",");
  else return str;
};
export function convertTo24Hour(time12h) {
  let hours, minutes, modifier;

  // Check if the time string includes "AM" or "PM"
  if (time12h.includes("AM") || time12h.includes("PM")) {
    // Split the time and modifier
    const timeParts = time12h.match(/^(\d+):(\d+)([AP]M)$/);
    if (!timeParts) {
      // Invalid time format
      return "Invalid time format";
    }
    hours = parseInt(timeParts[1]);
    minutes = timeParts[2];
    modifier = timeParts[3];
  } else {
    // If the modifier is not provided, assume it's AM
    hours = parseInt(time12h.substring(0, 2));
    minutes = time12h.substring(3, 5);
    modifier = "AM";
  }

  if (hours === 12 && modifier === "AM") {
    hours = "00";
  } else if (modifier === "PM") {
    hours = (hours === 12 ? 12 : hours + 12).toString().padStart(2, "0");
  } else {
    hours = hours.toString().padStart(2, "0");
  }

  return `${hours}:${minutes}`;
}

export function convertToAMPM(time24h) {
  let [hours, minutes] = time24h.split(":");
  hours = parseInt(hours, 10);
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${modifier}`;
}

export function decodeMinutesToTime(minutes) {
  const hours = Math.floor(minutes / 60) % 24; // Calculate hours (and handle overflow for the next day)
  const minutesRemaining = minutes % 60; // Calculate remaining minutes

  // Format hours to ensure leading zero if necessary
  const formattedHours = (hours < 10 ? "0" : "") + hours;

  // Format minutes to ensure leading zero if necessary
  const formattedMinutes = (minutesRemaining < 10 ? "0" : "") + minutesRemaining;

  return `${formattedHours}:${formattedMinutes}`;
}
