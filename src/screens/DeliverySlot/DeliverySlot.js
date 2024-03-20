import React, { useEffect, useState } from "react";
import "./DeliverySlot.css";
import axios from "axios";
import { bulkUpdateTimeSlots, getAreaDetailsApi, getServeAreasApi } from "../../Apis/Delivery";
import AlertDialogSlide from "./SlotPopup";
import { Button, DialogActions, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { convertTo24Hour, convertToAMPM, decodeMinutesToTime, encodeTimeToMinutes } from "../../utils/toast";
import { toast } from "react-toastify";

const DeliverySlot = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaDetails, setAreaDetails] = useState(null);
  const [searchPincode, setSearchPincode] = useState(null);
  const [filteredAreas, setFilteredAreas] = useState(null);
  const [totalArea, setTotalArea] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [modifySlot, setModifySlot] = useState(null);
  const [pincode, setPincodes] = useState(null);
  const [bulkAreaEdit, setBulkAreaEdit] = useState([]);
  const [showSave, setShowSave] = useState(false);
  const [bulkPincodes, setBulkPincodes] = useState("");
  const [tempChanges, setTempChanges] = useState(null);
  const getAreaDetail = async () => {
    try {
      setBulkAreaEdit([]);
      setAreaDetails(null);
      const res = await getAreaDetailsApi(selectedArea);
      if (res) {
        setAreaDetails(res.data);
        setBulkAreaEdit(res.data.timeSlot);
      }
    } catch (error) {
      console.log(error, "DeliverySLot.js line 16");
    }
  };
  const getServeAreas = async () => {
    try {
      const res = await getServeAreasApi();
      if (res) {
        setTotalArea(res.areas);
        setFilteredAreas(res.areas);
      }
    } catch (error) {
      console.log(error, " deliveryslot line 25");
    }
  };
  React.useEffect(() => {
    getServeAreas().then();
  }, []);

  React.useEffect(() => {
    if (selectedArea) getAreaDetail().then();
  }, [selectedArea]);

  React.useEffect(() => {
    if (searchPincode) {
      const filtered = totalArea.filter((area) => area.areaName.includes(searchPincode));
      setFilteredAreas(filtered);
    } else {
      setFilteredAreas(totalArea);
    }
  }, [searchPincode]);

  const bulkUpdate = async (arrayOfPincodes, arrayOfObjects) => {
    const result = await bulkUpdateTimeSlots({
      pincodes: arrayOfPincodes,
      timeSlot: arrayOfObjects,
    });
    getServeAreas().then();
    getAreaDetail().then();
    if (arrayOfPincodes.length > 1) setSelectedArea(null);
    toast.success(result.message);
  };
  return (
    <div style={{ flex: 1, display: "flex", backgroundColor: "#f3f9f7", flexDirection: "column", padding: 20, gap: 20 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "row-reverse", gap: 20 }}>
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            padding: "15px",
            gap: 10,
            flex: 1,
            overflow: "hidden",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px #0000001A",
            display: "flex",
            flexDirection: "column",
            height: "85vh",
          }}>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>Serving Areas {"(" + filteredAreas?.length + ")"}</span>
          <input
            autoComplete="false"
            autoCorrect="false"
            autoFocus
            style={{ padding: 12, margin: 0, display: "flex" }}
            value={searchPincode}
            onChange={(e) => {
              setSearchPincode(e.target.value);
            }}
            type="text"
            placeholder="Search pincode"
          />
          <div
            style={{
              overflowX: "hidden",
              overflowY: "scroll",
              height: "70vh",
              padding: 10,
            }}>
            <table>
              <thead>
                <tr style={{ backgroundColor: "1px solid #eee" }}>
                  <th>Sr No</th>
                  <th>Area Name</th>
                  <th>Total Slots</th>
                </tr>
              </thead>
              <tbody>
                {filteredAreas &&
                  filteredAreas.map((area, index) => (
                    <tr
                      style={{ cursor: "pointer", boxShadow: selectedArea === area._id ? "0px 0px 10px 1px #ccc" : "none" }}
                      onClick={() => {
                        if (selectedArea === area._id) {
                          //Deselection of selected card
                          setSelectedArea(null);
                          setAreaDetails(null);
                        } else {
                          setAreaDetails(null);
                          setSelectedArea(area._id);
                        }
                        setSearchPincode("");
                      }}
                      key={area._id}>
                      <td>{index + 1}</td>
                      <td>{area.areaName}</td>
                      <td>{area.totalSlot}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            padding: "15px",
            gap: 10,
            flex: 1,
            height: "85vh",
            overflowX: "hidden",
            overflowY: "hidden",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px #0000001A",
            display: "flex",
            flexDirection: "column",
          }}>
          {selectedArea !== null ? (
            <div style={{ border: "0px solid red", display: "flex", justifyContent: "space-between", flexDirection: "column" }}>
              <span style={{ textDecoration: "underline", fontWeight: "bold", textAlign: "center", paddingBottom: 10 }}>
                {filteredAreas.find((a) => a._id === selectedArea)?.areaName}
              </span>
              <div style={{ overflowY: "auto", maxHeight: "50vh", minHeight: "50vh", flex: 4 }}>
                <table style={{ fontSize: 14 }}>
                  <thead style={{ fontWeight: "normal" }}>
                    <tr>
                      <th style={{ fontWeight: "normal" }}>Slot Time</th>
                      <th style={{ fontWeight: "normal" }}>Status</th>
                      <th style={{ fontWeight: "normal" }}>Day</th>
                      <th style={{ fontWeight: "normal" }}>Order Count</th>
                      <th style={{ fontWeight: "normal" }}>Closing time</th>
                      <th style={{ fontWeight: "normal" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody style={{ overflowX: "hidden" }}>
                    {bulkAreaEdit.map((item, index) => {
                      return (
                        <tr style={{ boxShadow: "none" }} key={index}>
                          <td>{item.slot}</td>
                          <td style={{ fontWeight: "bold", color: item.isDisabled ? "red" : "green", textTransform: "capitalize" }}>{`${
                            item.isDisabled ? "Disabled" : "Enabled"
                          }`}</td>
                          <td>{item.day !== null ? item.day : "n/a"}</td>
                          <td>{item.orderCount}</td>
                          <td>{decodeMinutesToTime(item.value.minutes)}</td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "row" }}>
                              <button
                                onClick={() => {
                                  setModifySlot(index);
                                  setTempChanges(item);
                                  setOpenPopup(true);
                                }}
                                style={{ borderRadius: 8, fontWeight: "bold", border: "1px solid grey", cursor: "pointer" }}>
                                Modify
                              </button>
                              <button
                                onClick={() => {
                                  var confirmDelete = window.confirm(`Delete ${item.slot} slot?`);
                                  if (confirmDelete) {
                                    var temp = bulkAreaEdit.filter((_, i) => i !== index);
                                    bulkUpdate([Number(areaDetails.area)], temp);
                                  }
                                }}
                                style={{
                                  backgroundColor: "#fce8e8",
                                  borderRadius: 8,
                                  border: "1px solid #e8b3b3",
                                  cursor: "pointer",
                                  color: "#e21b1b",
                                  fontWeight: "bold",
                                }}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: 20 }}>
                <div
                  onClick={async () => {
                    var initialTimeSlot = { slot: "10:00AM - 08:00PM", isDisabled: true, day: 0, orderCount: 0, value: { minutes: 0 } };
                    await bulkUpdate([Number(areaDetails.area)], [...bulkAreaEdit, initialTimeSlot]);
                  }}
                  style={{ display: "flex", flexDirection: "row", flex: 1, gap: 20, marginTop: 10 }}>
                  <button
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#ffef03",
                      color: "#000",
                      borderWidth: 1,
                      padding: 10,
                      fontSize: 14,
                      width: "50%",
                      borderRadius: 10,
                      borderStyle: "solid",
                      borderColor: "#e3d400",
                    }}>
                    Create New Slot ➕
                  </button>
                  <button
                    onClick={async () => {
                      bulkUpdate(bulkPincodes.split(","), bulkAreaEdit);
                      setBulkPincodes("");
                    }}
                    style={{
                      cursor: bulkPincodes.length >= 6 ? "pointer" : "default",
                      backgroundColor: bulkPincodes.length < 6 ? "#ddd" : "#ffef03",
                      color: bulkPincodes.length < 6 ? "#aaa" : "#000",
                      borderWidth: bulkPincodes.length < 6 ? 0 : 1,
                      padding: 10,
                      fontSize: 14,
                      width: "50%",
                      borderRadius: 10,
                      borderStyle: "solid",
                      borderColor: "#e3d400",
                    }}>
                    Bulk Save
                  </button>
                </div>
                <div>
                  <span style={{ fontSize: 18, fontWeight: "bold" }}> Apply to additional Pincodes:</span>
                </div>
                <textarea
                  style={{ height: 70, resize: "none", borderRadius: 10, padding: 10, color: "#696969" }}
                  value={bulkPincodes}
                  onChange={(e) => {
                    setBulkPincodes(e.target.value);
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{ color: "red", fontStyle: "italic", textAlign: "center" }}>Select a pincode to view details. </div>
          )}
        </div>
      </div>
      {modifySlot !== null && (
        <AlertDialogSlide open={openPopup} heading={`Slot modification (${areaDetails?.areaName})`} setOpen={setOpenPopup}>
          <div>
            <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
              <table>
                <tbody>
                  <tr>
                    <td>Start Time (24 hour format)</td>
                    <td>
                      <input
                        type="time"
                        value={convertTo24Hour(tempChanges.slot.toString().split(" - ")[0])}
                        onChange={(e) => {
                          setTempChanges((prev) => ({
                            ...prev,
                            slot: `${convertToAMPM(e.target.value)} - ${tempChanges.slot.toString().split(" - ")[1]}`,
                          }));
                          setShowSave(true);
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>End Time (24 hour format)</td>
                    <td>
                      <input
                        type="time"
                        value={convertTo24Hour(tempChanges.slot.toString().split(" - ")[1])}
                        onChange={(e) => {
                          setTempChanges((prev) => ({
                            ...prev,
                            slot: `${tempChanges.slot.toString().split(" - ")[0]} - ${convertToAMPM(e.target.value)}`,
                          }));
                          setShowSave(true);
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Day</td>
                    <td>
                      <input
                        type="number"
                        style={{ textAlign: "center" }}
                        onChange={(e) => {
                          setTempChanges((prev) => ({ ...prev, day: e.target.value }));
                          setShowSave(true);
                        }}
                        defaultValue={tempChanges.day}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td>
                      <FormControl>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          onChange={(e, b) => {
                            setTempChanges((prev) => ({ ...prev, isDisabled: b === "true" ? true : false }));
                            setShowSave(true);
                          }}
                          value={tempChanges?.isDisabled.toString()}
                          name="radio-buttons-group">
                          <FormControlLabel value="true" control={<Radio />} label="Disabled" />
                          <FormControlLabel value="false" control={<Radio />} label="Enabled" />
                        </RadioGroup>
                      </FormControl>
                    </td>
                  </tr>
                  <tr>
                    <td>Closing Time</td>
                    <td>
                      <input
                        type="time"
                        value={decodeMinutesToTime(tempChanges.value.minutes)}
                        onChange={(e) => {
                          setTempChanges((prev) => ({ ...prev, value: { minutes: encodeTimeToMinutes(e.target.value) } }));
                          setShowSave(true);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {true && (
            <DialogActions>
              <Button
                color="primary"
                onClick={() => {
                  const newArray = [...bulkAreaEdit];
                  newArray[modifySlot] = tempChanges;
                  setBulkAreaEdit(newArray);
                  bulkUpdate([Number(areaDetails.area)], newArray);
                  setOpenPopup(false);
                }}>
                Save Changes
              </Button>
            </DialogActions>
          )}
        </AlertDialogSlide>
      )}
    </div>
  );
};

export default DeliverySlot;
