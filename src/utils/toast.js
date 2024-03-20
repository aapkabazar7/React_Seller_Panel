import { toast } from "react-toastify";
import React from "react";
import jsPDF from "jspdf";
import moment from "moment";
import "jspdf/dist/polyfills.es.js";
import "react-toastify/dist/ReactToastify.css";
import Barcode from "react-barcode";
import { canvg } from "canvg";

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
  const logoDataUrl = getImageDataUrl(logoImagePath);
  doc.setFontSize(PS.fontSize + 3);
  doc.addImage(logoDataUrl, "PNG", 10, 10, PS.logoSize, PS.logoSize);

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
  const deliveryDate = `Delivery Date: ${moment(data.invoice.deliveryDate.date ? data.invoice.deliveryDate.date : data.invoice.deliveryDate).format("MMM DD, YYYY")}`;
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

function BarcodeGenerator(value) {
  return (
    <div>
      <h1>Barcode Generator</h1>
      <Barcode value={value} format="CODE128" />
    </div>
  );
}
function getImageDataUrl(imagePath) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = function (error) {
      reject(error);
    };
    img.src = imagePath;
    console.log(img);
  });
}
