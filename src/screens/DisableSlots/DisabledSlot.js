import React, { useEffect, useState } from "react";
import "./DisabledSlot.css";
import axios from "axios";
import { bulkUpdateTimeSlots, getAreaDetailsApi, getServeAreasApi } from "../../Apis/Delivery";
import AlertDialogSlide from "./SlotPopup";
import { Button, DialogActions, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { convertTo24Hour, convertToAMPM, decodeMinutesToTime, encodeTimeToMinutes } from "../../utils/toast";
import { toast } from "react-toastify";
import { deleteDisableSlots, disabledSlots, getDisabledSlots } from "../../Apis/DisableSlot";
import { calendarFormat } from "moment";
import { formatDate } from "../../utils/DateHandler";

const DisableSlot = () => {
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

  //   //{
  //     "success": true,
  //     "message": "slots found",
  //     "slots": [
  //         {
  //             "_id": "65feb3acf7dd2c35d18c3696",
  //             "isCancelled": false,
  //             "sellerId": "617d2982bd68c94d0bcb9200",
  //             "areaId": "61c6d9b1885924407c391feb",
  //             "message": "holi festival",
  //             "startdate": "2024-03-25T00:00:00.000Z",
  //             "enddate": "2024-03-25T00:00:00.000Z",
  //             "startHr": "0",
  //             "endHr": "23",
  //             "startSlot": "12:01AM",
  //             "endSlot": "11:59PM",
  //             "__v": 0
  //         }
  //     ]
  // }

  const getAreaDetail = async () => {
    try {
      setBulkAreaEdit([]);
      setAreaDetails(null);
      const res = await getDisabledSlots(selectedArea);
      if (res && res.success) {
        setAreaDetails(res.slots);
        setBulkAreaEdit(res.slots);
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
    console.log(arrayOfObjects, arrayOfPincodes);
    const result = await disabledSlots({
      pincodes: arrayOfPincodes,
      ...arrayOfObjects,
    });
    getServeAreas().then();
    getAreaDetail().then();
    if (arrayOfPincodes.length > 1) setSelectedArea(null);
    toast.success(result.message);
  };

  React.useEffect(() => {
    if (tempChanges) setOpenPopup(true);
  }, [tempChanges]);

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", backgroundColor: "#f3f9f7", flexDirection: "column", padding: 20, gap: 20 }}>
      <div style={{ flex: 1, display: "flex", overflow: "hidden", flexDirection: "row-reverse", gap: 20 }}>
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            padding: "15px",
            gap: 10,
            flex: 0.3,
            overflow: "hidden",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px #0000001A",
            display: "flex",
            flexDirection: "column",
            height: "83vh",
          }}>
          <div style={{ display: "flex", overflow: "hidden", flex: 1, justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 18, fontWeight: "bold" }}>Serving Areas {"(" + filteredAreas?.length + ")"}</span>
          </div>
          <input
            autoComplete="false"
            autoCorrect="false"
            autoFocus
            style={{ padding: 12, margin: 0, display: "flex" }}
            defaultValue={searchPincode ? searchPincode : ""}
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
            flex: 0.7,
            height: "83vh",
            overflow: "hidden",
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
                      <th style={{ fontWeight: "normal" }}>Sr No</th>
                      <th style={{ fontWeight: "normal" }}>Start Date</th>
                      <th style={{ fontWeight: "normal" }}>Start Time</th>
                      <th style={{ fontWeight: "normal" }}>End Date</th>
                      <th style={{ fontWeight: "normal" }}>End Time</th>
                      <th style={{ fontWeight: "normal" }}>Message</th>
                      <th style={{ fontWeight: "normal" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody style={{ overflowX: "hidden" }}>
                    {bulkAreaEdit.map((item, index) => {
                      return (
                        <tr style={{ boxShadow: "none" }} key={index}>
                          <td>{index + 1}</td>
                          <td>{formatDate(new Date(item.startdate))}</td>
                          <td>{item.startSlot}</td>
                          <td>{formatDate(new Date(item.enddate))}</td>
                          <td>{item.endSlot}</td>
                          <td style={{ textTransform: "capitalize" }}>{item.message}</td>
                          <td>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", gap: 10 }}>
                              {/* <button
                                onClick={() => {
                                  setModifySlot(index);
                                  setTempChanges(item);
                                }}
                                style={{ borderRadius: 8, fontWeight: "bold", border: "1px solid grey", cursor: "pointer" }}>
                                Modify
                              </button> */}
                              <button
                                onClick={async () => {
                                  var confirmDelete = window.confirm(`Delete this slot?`);
                                  if (confirmDelete) {
                                    try {
                                      toast.loading("Deleting Slot");
                                      const res = await deleteDisableSlots(item._id);
                                      toast.dismiss();
                                      if (res) {
                                        toast.success("Slot Deleted");
                                        getAreaDetail().then();
                                      } else {
                                        toast.error("Error Deleting Slot");
                                      }
                                    } catch (error) {}
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
                <div style={{ display: "flex", flexDirection: "row", flex: 1, gap: 20, marginTop: 10 }}>
                  <button
                    onClick={async () => {
                      setTempChanges({
                        message: "",
                        startdate: new Date().toISOString(),
                        enddate: new Date().toISOString(),
                        startSlot: "12:00AM",
                        endSlot: "11:59PM",
                      });
                    }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: "#ffef03",
                      color: "#000",
                      borderWidth: 1,
                      padding: 10,
                      fontSize: 14,
                      flex: 1,
                      borderRadius: 10,
                      borderStyle: "solid",
                      borderColor: "#e3d400",
                    }}>
                    Create New Slot ➕
                  </button>
                  {/* <button
                    onClick={async (e) => {
                      e.stopPropagation();
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
                  </button> */}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: "red", fontStyle: "italic", textAlign: "center" }}>Select a pincode to view details. </div>
          )}
        </div>
      </div>
      {modifySlot !== null && (
        <AlertDialogSlide open={openPopup} heading={`Slot modification `} setOpen={setOpenPopup}>
          <div>
            <div style={{ display: "flex", flexDirection: "row", gap: 20, justifyContent: "center", alignItems: "center" }}>
              <table style={{ alignItems: "center" }}>
                <tr>
                  <td>
                    <span>Start Date</span>
                  </td>
                  <td>
                    <input
                      onChange={(e) => {
                        setTempChanges((prev) => ({ ...prev, startdate: e.target.value }));
                        // alert(e.target.value);
                      }}
                      type="date"
                      defaultValue={formatDate(new Date(tempChanges?.startdate))}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Start Time</span>
                  </td>
                  <td>
                    <input
                      type="time"
                      onChange={(e) => {
                        setTempChanges((prev) => ({ ...prev, startSlot: convertToAMPM(e.target.value) }));
                      }}
                      defaultValue={convertTo24Hour(tempChanges.startSlot)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>End Date</span>
                  </td>
                  <td>
                    <input
                      onChange={(e) => {
                        setTempChanges((prev) => ({ ...prev, enddate: e.target.value }));
                        // alert(e.target.value);
                      }}
                      type="date"
                      defaultValue={formatDate(new Date(tempChanges?.enddate))}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>End Time</span>
                  </td>
                  <td>
                    <input
                      onChange={(e) => {
                        setTempChanges((prev) => ({ ...prev, endSlot: convertToAMPM(e.target.value) }));
                      }}
                      type="time"
                      defaultValue={convertTo24Hour(tempChanges.endSlot)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Message</span>
                  </td>
                  <td>
                    <input
                      onChange={(e) => {
                        setTempChanges((prev) => ({ ...prev, message: e.target.value }));
                      }}
                      defaultValue={tempChanges.message}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span>Additional Pincodes:</span>
                  </td>
                  <td>
                    <textarea
                      rows={10}
                      cols={50}
                      style={{
                        border: "none",
                        outline: "1px solid #aaa",
                        resize: "none",
                        padding: 10,
                        borderRadius: 12,
                        color: "#696969",
                      }}
                      placeholder="Optional"
                    />
                  </td>
                </tr>
              </table>
            </div>
          </div>
          <DialogActions style={{ alignItems: "center" }}>
            <Button
              sx={{ alignItems: "center" }}
              color="primary"
              onClick={() => {
                // alert(JSON.stringify(bulkAreaEdit[modifySlot]));
                const newArray = [...bulkAreaEdit];
                newArray[modifySlot] = tempChanges;
                setBulkAreaEdit(newArray);
                bulkUpdate([filteredAreas.find((a) => a._id === selectedArea)?.areaName.substring(0, 6)], tempChanges);
                setOpenPopup(false);
              }}>
              Save Changes
            </Button>
          </DialogActions>
        </AlertDialogSlide>
      )}
    </div>
  );
};

export default DisableSlot;
