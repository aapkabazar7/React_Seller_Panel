import { toast } from "react-toastify";
import React from "react";
import jsPDF from "jspdf";
import moment from "moment";
import "jspdf/dist/polyfills.es.js";
import "react-toastify/dist/ReactToastify.css";
import Barcode from "react-barcode";

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
export const convertTo24Hour = (time) => {
  let hours, minutes, modifier;
  if (time.includes("AM") || time.includes("PM")) {
    const timeParts = time.match(/^(\d+):(\d+)([AP]M)$/);
    if (!timeParts) {
      return "Invalid time format" + time;
    }
    hours = parseInt(timeParts[1]);
    minutes = timeParts[2];
    modifier = timeParts[3];
  } else {
    // If the modifier is not provided, assume it's AM
    hours = parseInt(time.substring(0, 2));
    minutes = time.substring(3, 5);
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
};

export function convertToAMPM(time24h) {
  let [hours, minutes] = time24h.split(":");
  hours = parseInt(hours, 10);
  const modifier = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes}${modifier}`;
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

export function encodeTimeToMinutes(timeString) {
  // Split the time string into hours and minutes
  const [hoursStr, minutesStr] = timeString.split(":");

  // Parse hours and minutes as integers
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Calculate total minutes
  const totalMinutes = hours * 60 + minutes;

  return totalMinutes;
}

// Dummy data

export function printInvoice(data) {
  const doc = new jsPDF();
  const PS = {
    fontSize: 12,
    logoSize: 24,
    margin: 10,
  };
  const logoImagePath = "/src/assets/bluelogo.png"; // Modify this line with the correct path to your image file
  let verticalOffset = 10; // Define verticalOffset variable
  const logoDataUrl =
    "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";
  doc.setFontSize(PS.fontSize + 3);
  doc.addImage(logoDataUrl, "PNG", 10, 10, PS.logoSize * 2, PS.logoSize);

  doc.setFontSize(PS.fontSize + 3);
  doc.text(100, verticalOffset, "SELLER ADDRESS:");
  doc.text(155, verticalOffset, "BILLING ADDRESS:");
  doc.setFontSize(PS.fontSize - 2);
  const sellPhone = data.invoice.seller.phoneNo;
  const sell = data.invoice.seller.sellerInformation;
  const sellerAddress = `${sell.name}, ${sell.fullAddress}, Phone No:${sellPhone}`;
  const sellerLines = doc.splitTextToSize(sellerAddress.toUpperCase(), 50);
  verticalOffset += 5; // Increase vertical offset
  doc.text(100, verticalOffset, sellerLines);
  const bill = data.invoice.orderAddress;
  const billingAddress = `${bill.name}, ${bill.line1}, ${bill.line2} , ${bill.fullAddress},\nphone no. ${bill.mobileNo}`;
  const billing = doc.splitTextToSize(billingAddress.toUpperCase(), 50);
  doc.text(155, verticalOffset, billing);

  verticalOffset += 30; // Increase vertical offset

  doc.setLineWidth(0.5);
  doc.line(80, verticalOffset, 205, verticalOffset);
  verticalOffset += 2; // Increase vertical offset
  const barcodeValue = "123456789"; // Example barcode value
  const barcodeScale = 2; // Scale factor for the barcode
  const barcodeMargin = 10; // Margin around the barcode
  const barcodeY = 150; // Y position of the barcode
  const barcodeX = doc.internal.pageSize.width / 2 - (barcodeValue.length * 10 * barcodeScale) / 2; // Center the barcode horizontally
  const barcodeSvg = <Barcode value={barcodeValue} format="CODE128" width={barcodeValue.length * 10 * barcodeScale} height={30 * barcodeScale} />;
  const svgString = barcodeSvg.props.children;
  const canvas = document.createElement("canvas");
  //canvg(canvas, svgString);
  //const barcodeDataUrl = canvas.toDataURL("image/png");
  //doc.addImage(barcodeDataUrl, "PNG", barcodeX, barcodeY, barcodeValue.length * 10 * barcodeScale, 30 * barcodeScale);
  doc.setFontSize(PS.fontSize + 3);
  doc.text(140, verticalOffset + 5, "ORDER DETAILS");
  doc.setFontSize(PS.fontSize - 2);
  let invoiceId = data.invoice.invoiceId ? data.invoice.invoiceId : "";
  const invoiceNumber = `Invoice Number: ` + invoiceId;
  doc.text(140, verticalOffset + 10, invoiceNumber);
  const invoiceDate = `Invoice Date: ${moment(data.invoice.date).format("MMM DD, YYYY")}`;
  doc.text(140, verticalOffset + 15, invoiceDate);
  const deliveryDate = `Delivery Date: ${moment(data.invoice.deliveryDate.date ? data.invoice.deliveryDate.date : data.invoice.deliveryDate).format(
    "MMM DD, YYYY"
  )}`;
  doc.text(140, verticalOffset + 20, deliveryDate);
  const deliverySlot = `Delivery Slot: ${data.invoice.deliveryTime.slot}`;
  doc.text(140, verticalOffset + 25, deliverySlot);
  let paymentMode = data.invoice.paymentMode ? data.invoice.paymentMode : "prepaid";
  doc.text(140, verticalOffset + 30, `Payment Mode: ${paymentMode.toUpperCase()}`);
  verticalOffset += 15; // Increase vertical offset
  verticalOffset += 5; // Increase vertical offset
  verticalOffset += 5; // Increase vertical offset
  verticalOffset += 5; // Increase vertical offset
  verticalOffset += 6; // Increase vertical offset
  doc.setLineWidth(0.5);
  doc.line(PS.margin, verticalOffset, 200, verticalOffset + 1);
  let width1Percentage = 1.5;
  const table = {
    snoSize: 10,
    descSize: 20,
    unitSize: 45,
    hsnSize: 20,
    skuSize: 10,
    particularSize: 24,
    gstSize: 12,
    rateSize: 10,
    qunatitySize: 7,
  };
  const snoX = 10,
    hsnX = snoX + width1Percentage * table.snoSize,
    descripX = hsnX + width1Percentage * table.descSize,
    unitX = descripX + width1Percentage * table.unitSize,
    unitPriceX = unitX + width1Percentage * table.hsnSize,
    qtyX = unitPriceX + width1Percentage * table.gstSize,
    totalX = qtyX + width1Percentage * table.qunatitySize;
  verticalOffset += 5; // Increase vertical offset
  doc.text(snoX, verticalOffset, "S.No");
  doc.text(descripX, verticalOffset, "Product Name");
  doc.text(hsnX, verticalOffset, "Item Code");
  doc.text(unitX, verticalOffset, "Unit");
  doc.text(unitPriceX, verticalOffset, "Sell Price");
  doc.text(qtyX, verticalOffset, "Qty");
  doc.text(totalX, verticalOffset, "Total Amt.");
  verticalOffset += 2; // Increase vertical offset
  doc.line(PS.margin, verticalOffset, 200, verticalOffset);
  let products = data.invoice.products;
  let Tqty = 0;
  let Tvalue = 0;
  verticalOffset += 4; // Increase vertical offset
  verticalOffset += 1; // Increase vertical offset
  doc.setLineWidth(0.1);

  for (let i = 0; i < products.length; i++) {
    doc.text(snoX, verticalOffset, i + 1 + ".");
    doc.text(hsnX, verticalOffset, Math.round(products[i].hsnCode).toString());
    // unit
    doc.text(unitX, verticalOffset, products[i].recommendedAttribute.toString());
    doc.text(unitPriceX, verticalOffset, products[i].sellPrice.toString());
    doc.text(qtyX, verticalOffset, products[i].quantity.toString());
    doc.text(totalX, verticalOffset, (products[i].sellPrice * products[i].quantity).toFixed(2).toString());
    const lines = products[i].name.match(/.{1,30}/g);
    for (let j = 0; j < lines.length; j++) {
      doc.text(descripX, verticalOffset, lines[j].toUpperCase());
      verticalOffset += 5; // Increase vertical offset
    }

    Tqty += products[i].quantity;
    Tvalue += products[i].sellPrice * products[i].quantity;

    doc.line(PS.margin, verticalOffset, 200, verticalOffset);
    verticalOffset += 5; // Increase vertical offset
  }
  // doc.line(PS.margin, verticalOffset, 200, verticalOffset);
  verticalOffset += 5; // Increase vertical offset
  const discount = data.invoice.discount;
  let discountValue = 0;
  let discountRatio = discountValue / Tvalue;
  doc.setFontSize(PS.fontSize + 1);
  verticalOffset += 5; // Increase vertical offset
  doc.setLineWidth(0.5);

  doc.line(PS.margin, verticalOffset, 200, verticalOffset);
  verticalOffset += 5; // Increase vertical offset
  doc.setFont(undefined, "bold");
  doc.text(10, verticalOffset, "Total Qty :");
  doc.text(35, verticalOffset, Tqty.toString());
  doc.text(70, verticalOffset, "Delivery Charge :");
  doc.text(110, verticalOffset, Math.round(data.invoice.deliveryCharge).toString());
  doc.setFontSize(PS.fontSize + 1);
  doc.setFont(undefined, "bold");
  doc.text(135, verticalOffset, "Total Amount :");
  doc.text(170, verticalOffset, Math.round(data.invoice.amount).toString());
  doc.setFont(undefined, "normal");
  verticalOffset += 2; // Increase vertical offset
  doc.line(PS.margin, verticalOffset, 200, verticalOffset);
  width1Percentage = 2;
  const taxTable = {
    gstNoSize: 15,
    taxableAmtSize: 20,
    tax: 12,
    cgstSize: 12,
    sgstSize: 12,
    cessSize: 12,
    totalAmtSize: 15,
  };
  const gstNoX = 10,
    taxableAmtX = gstNoX + width1Percentage * taxTable.gstNoSize,
    taxX = taxableAmtX + width1Percentage * taxTable.taxableAmtSize,
    cgstX = taxX + width1Percentage * taxTable.tax,
    sgstX = cgstX + width1Percentage * taxTable.cgstSize,
    cessX = sgstX + width1Percentage * taxTable.sgstSize,
    totalAmtX = cessX + width1Percentage * taxTable.cessSize;
  verticalOffset += 5; // Increase vertical offset
  // doc.setFontType("normal");
  verticalOffset += 2; // Increase vertical offset
  // doc.line(PS.margin, verticalOffset, 200, verticalOffset);
  // doc.setFontType("normal");
  doc.setFontSize(PS.fontSize);

  doc.setFontSize(13);
  doc.text(PS.margin, verticalOffset, "");
  verticalOffset += 6; // Increase vertical offset
  doc.text(PS.margin, verticalOffset + 30, "");
  const bill1 = data.invoice.orderAddress;
  doc.setFontSize(PS.fontSize - 1);
  const billingAddress1 = `${bill1.name} \n${bill1.line1}, ${bill1.line2}, ${bill1.fullAddress}\nPhone: ${bill1.mobileNo}`;
  const billing1 = doc.splitTextToSize(billingAddress1.toUpperCase(), 50);
  doc.text(10, verticalOffset, billing1);
  verticalOffset += 2; // Increase vertical offset
  const bill2 = data.invoice.orderAddress;
  doc.setFontSize(PS.fontSize - 1);
  const billingAddress2 = `${bill1.name} \n${bill2.line1}, ${bill2.line2}, ${bill2.fullAddress}\nPhone: ${bill2.mobileNo}`;
  const billing2 = doc.splitTextToSize(billingAddress2.toUpperCase(), 50);
  doc.text(80, verticalOffset, billing2);
  verticalOffset += 2; // Increase vertical offset
  const bill3 = data.invoice.orderAddress;
  doc.setFontSize(PS.fontSize - 1);
  const billingAddress3 = `${bill3.name} \n${bill3.line1}, ${bill3.line2}, ${bill3.fullAddress}\nPhone: ${bill3.mobileNo}`;
  const billing3 = doc.splitTextToSize(billingAddress3.toUpperCase(), 50);
  doc.text(150, verticalOffset, billing3);
  verticalOffset += 2; // Increase vertical offset
  doc.save(`${data.invoice.id}.pdf`);
}

function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
}
