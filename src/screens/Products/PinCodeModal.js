import React, { useEffect, useState } from 'react';
import { blacklistPinCodesApi, fetchPinCodesApi } from '../../Apis/Products';

const PinCodeModal = ({ onClose, blacklistedPinCodes, productName, sellerProductId, setBlacklistedPinCodes }) => {
  const [allPinCodes, setAllPinCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [blackcodes, setBlackcodes] = useState([]);

  const selectAll = () => {
    const updatedPinCodes = allPinCodes.map((item) => ({
      ...item,
      selected: true,
    }));
    alert(updatedPinCodes);
    setAllPinCodes(updatedPinCodes);
  };

  const deSelectAll = () => {
    const updatedPinCodes = allPinCodes.map((item) => ({
      ...item,
      selected: false,
    }));
    setAllPinCodes(updatedPinCodes);
  };

  const savePinCodes = async () => {
    const result = await blacklistPinCodesApi(sellerProductId, blackcodes.join(","));
    if (result.success) {
        setBlacklistedPinCodes(blackcodes.join(','))
      fetchPinCodesApi().then();
      onClose();
    }
  };
  useEffect(() => {
    const fetchPinCodes = async () => {
      try {
        const result = await fetchPinCodesApi();
        if (result.success) {
          let tempArr = result.areas.map((item) => ({ code: item.areaName.slice(0, 6), selected: false }));

          const parsedCodes = blacklistedPinCodes.split(",").map((pinCode) => pinCode.trim());

          const updatedPinCodes = tempArr.map((item) => ({
            ...item,
            selected: parsedCodes.includes(item.code), // Set selected to true if code exists in parsedCodes
          }));

          console.log("Parsed Codes:", parsedCodes);
          console.log("Updated Pin codes", updatedPinCodes);

          setBlackcodes(parsedCodes);
          setAllPinCodes(updatedPinCodes);
          setLoading(false);
        } else {
          console.log(result.message);
        }
      } catch (err) {
        console.log("error fetching pin codes", err);
      }
    };
    fetchPinCodes().then();
  }, []);

  const handleCheckboxChange = (index) => {
    const updatedPinCodes = [...allPinCodes];
    updatedPinCodes[index].selected = !updatedPinCodes[index].selected;

    setAllPinCodes(updatedPinCodes);

    if (updatedPinCodes[index].selected) {
      setBlackcodes([...blackcodes, updatedPinCodes[index].code]);
    } else {
      setBlackcodes(blackcodes.filter((code) => code !== updatedPinCodes[index].code));
    }
  };

  React.useEffect(() => {
    console.log(blackcodes);
  }, [blackcodes]);

  const renderPinCodes = () => {
    return allPinCodes.map((item, index) => {
      return (
        <div className="pinCheckBox" key={index}>
          <label>{item.code}</label>
          <input type="checkbox" checked={item.selected} onChange={() => handleCheckboxChange(index)} />
        </div>
      );
    });
  };

  return (
    <div className="modal">
      <div style={{ backgroundColor: "#fefefe", margin: "", padding: "20px", borderRadius: 20, border: "1px solid #888", width: "80%", height: "80%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Disable Pincode</h3>
          <p>Product : {productName}</p>
          <div>
            <button className="selectBtn" onClick={selectAll}>
              Select All
            </button>
            <button className="selectBtn" onClick={deSelectAll}>
              Deselect All
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "", overflowY: "scroll", height: "60vh", padding: "0 10px" }}>{!loading ? renderPinCodes() : <></>}</div>
        <div style={{ flexDirection: "row", display: "flex", justifyContent: "space-between", marginTop: 20 }}>
          <span>Total Pincodes: {allPinCodes.length}</span>
          <div style={{ flexDirection: "row", display: "flex", gap: 30 }}>
            <button
              style={{ cursor: "pointer" }}
              className="DisablePinModal"
              onClick={() => {
                fetchPinCodesApi().then(() => {
                  onClose();
                });
              }}>
              Close
            </button>
            <button style={{ cursor: "pointer" }} className="SaveBtn" onClick={savePinCodes}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinCodeModal;
