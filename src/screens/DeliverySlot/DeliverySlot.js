import React, { useState } from "react";
import "./DeliverySlot.css";
import axios from "axios";
import { getAreaDetailsApi, getServeAreasApi } from "../../Apis/Delivery";
import AlertDialogSlide from "./SlotPopup";
import { Button, DialogActions, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
import { convertTo24Hour, convertToAMPM, decodeMinutesToTime } from "../../utils/toast";

const DeliverySlot = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaDetails, setAreaDetails] = useState(null);
  const [searchPincode, setSearchPincode] = useState(null);
  const [filteredAreas, setFilteredAreas] = useState(null);
  const [totalArea, setTotalArea] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [modifySlot, setModifySlot] = useState(null);

  const getAreaDetail = async () => {
    try {
      const res = await getAreaDetailsApi(selectedArea);
      if (res) setAreaDetails(res.data);
    } catch (error) {
      console.log(error, "DeliverySLot.js line 16");
    }
  };
  const getServeAreas = async () => {
    try {
      const res = await getServeAreasApi();
      if (res) {
        setTotalArea(res.areas);
        setSelectedArea(res.areas[0]._id);
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
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", backgroundColor: "#f3f9f7", flexDirection: "column", padding: 20, gap: 20 }}>
      <div
        style={{
          backgroundColor: "rgb(255, 255, 255)",
          padding: "15px",
          gap: 10,
          flex: 0.05,
          borderRadius: "10px",
          boxShadow: "0px 0px 10px 0px #0000001A",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}>
        <div style={{ flex: 1, display: "flex" }}>
          <span style={{ fontSize: 18, fontWeight: "bold" }}>Serving Areas {"(" + filteredAreas?.length + ")"}</span>
        </div>
        <input
          autoComplete="false"
          autoCorrect="false"
          autoFocus
          style={{ padding: 10, margin: 0, flex: 1, display: "flex" }}
          value={searchPincode}
          onChange={(e) => {
            setSearchPincode(e.target.value);
          }}
          type="text"
          placeholder="Search pincode"
        />
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: 20 }}>
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            padding: "15px",
            gap: 10,
            flex: 1,
            height: "65vh",
            overflowX: "hidden",
            overflowY: "scroll",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px #0000001A",
            display: "flex",
            flexDirection: "column",
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
                        setSelectedArea(null);
                        setAreaDetails(null);
                      } else {
                        setAreaDetails(null);
                        setSelectedArea(area._id);
                      }
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
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            padding: "15px",
            gap: 10,
            flex: 1,
            height: "65vh",
            overflowX: "hidden",
            overflowY: "scroll",
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px #0000001A",
            display: "flex",
            flexDirection: "column",
          }}>
          {areaDetails ? (
            <div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Slot Time</th>
                      <th>Status</th>
                      <th>Day</th>
                      <th>Order Count</th>
                      <th>Closing time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody style={{ overflowX: "hidden" }}>
                    {areaDetails.timeSlot.map((item, index) => {
                      return (
                        <tr style={{ boxShadow: "none" }} key={index}>
                          <td>{item.slot}</td>
                          <td style={{ fontWeight: "bold", color: item.isDisabled ? "red" : "green", textTransform: "capitalize" }}>{`${item.isDisabled ? "Disabled" : "Enabled"}`}</td>
                          <td>{item.day ? item.day : "n/a"}</td>
                          <td>{item.orderCount}</td>
                          <td>{decodeMinutesToTime(item.value.minutes)}</td>
                          <td>
                            <button
                              onClick={() => {
                                setOpenPopup(true);
                                setModifySlot(item);
                              }}
                              style={{ borderRadius: 8, border: "1px solid grey", cursor: "pointer" }}>
                              Modify
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <div style={{ display: "flex", flexDirection: "row", flex: 1, gap: 20, marginTop: 10, marginBottom: 10 }}>
                  <button>Add Slot</button>
                </div>
                <div></div>
              </div>
            </div>
          ) : (
            <div style={{ color: "red", fontStyle: "italic" }}>Select a pincode to view details. </div>
          )}
        </div>
      </div>
      {modifySlot && (
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
                        value={modifySlot && convertTo24Hour(modifySlot.slot.split(" - ")[0])}
                        onChange={(e) => {
                          if (modifySlot) setModifySlot({ ...modifySlot, slot: `${convertTo24Hour(e.target.value)} - ${modifySlot.slot.split(" - ")[1]}` });
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>End Time (24 hour format)</td>
                    <td>
                      <input
                        type="time"
                        value={modifySlot && convertTo24Hour(modifySlot.slot.split(" - ")[1])}
                        onChange={(e) => {
                          if (modifySlot) setModifySlot({ ...modifySlot, slot: `${modifySlot.slot.split(" - ")[0]} - ${convertTo24Hour(e.target.value)}` });
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
                          if (modifySlot.day !== 0) setModifySlot({ ...modifySlot, day: e.target.value });
                        }}
                        defaultValue={modifySlot.day}
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
                            setModifySlot({ ...modifySlot, isDisabled: b === "Disabled" });
                          }}
                          value={modifySlot.isDisabled ? "Disabled" : "Enabled"}
                          name="radio-buttons-group">
                          <FormControlLabel value="Disabled" control={<Radio />} label="Disabled" />
                          <FormControlLabel value="Enabled" control={<Radio />} label="Enabled" />
                        </RadioGroup>
                      </FormControl>
                    </td>
                  </tr>
                  <tr>
                    <td>Closing Time</td>
                    <td>
                      <input
                        type="time"
                        value={convertTo24Hour(modifySlot.slot.split(" - ")[1])}
                        onChange={(e) => {
                          setModifySlot({ ...modifySlot, slot: `${modifySlot.slot.split(" - ")[0]} - ${convertTo24Hour(e.target.value)}` });
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                setOpenPopup(false);
              }}>
              Save
            </Button>
            <Button
              color="warning"
              onClick={() => {
                setOpenPopup(false);
              }}>
              Cancel
            </Button>
          </DialogActions>
        </AlertDialogSlide>
      )}
    </div>
  );
};

export default DeliverySlot;
