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
  const [pincode,setPincodes] = useState(null);
  const [bulkAreaEdit, setBulkAreaEdit] = useState([]);
  const [showSave,setShowSave]=useState(false);
  const [bulkPincodes,setBulkPincodes]=useState("");
  const [tempChanges,setTempChanges]=useState(null);
  const getAreaDetail = async () => {
    try {
      const res = await getAreaDetailsApi(selectedArea);
      if (res) {setAreaDetails(res.data);setBulkAreaEdit(res.data.timeSlot);}
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

  useEffect(()=>{
    console.log(modifySlot);
  },[modifySlot])

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

  const bulkUpdate = async (arrayOfPincodes,arrayOfObjects) => {
    const result = await bulkUpdateTimeSlots({
      pincodes : arrayOfPincodes,
      timeSlot: arrayOfObjects,
    })
    toast.success(result.message);
  }
  return (
    <div style={{ height: "100%", width: "100%", display: "flex", backgroundColor: "#f3f9f7", flexDirection: "column", padding: 20, gap: 20 }}>


      <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: 20 }}>
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            padding: "15px",
            gap: 10,
            flex: 1,
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px #0000001A",
            display: "flex",
            flexDirection: "column",
            height: "75vh",
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
          <div style={{
            overflowX: "hidden",
            overflowY: "scroll",
           height: '70vh',
           padding: 10
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
          {bulkAreaEdit.length>0 ? (
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
                    {bulkAreaEdit.map((item, index) => {
                      return (
                        <tr style={{ boxShadow: "none" }} key={index}>
                          <td>{item.slot}</td>
                          <td style={{ fontWeight: "bold", color: item.isDisabled ? "red" : "green", textTransform: "capitalize" }}>{`${item.isDisabled ? "Disabled" : "Enabled"}`}</td>
                          <td>{item.day!==null ? item.day : "n/a"}</td>
                          <td>{item.orderCount}</td>
                          <td>{decodeMinutesToTime(item.value.minutes)}</td>
                          <td>
                            <button
                              onClick={() => {
                                setModifySlot(index);
                                setTempChanges(item)
                                setOpenPopup(true);
                              }}
                              style={{ borderRadius: 8, border: "1px solid grey", cursor: "pointer" }}>
                              Modify
                            </button>
                          </td></tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div>
                <div onClick={()=>{
                  var initialTimeSlot={slot:"00:00 - 00:00",isDisabled:false,day:0,orderCount:0,value:{minutes:0}};
                  setBulkAreaEdit([...bulkAreaEdit,initialTimeSlot]);
                  setModifySlot(bulkAreaEdit.length-1);
                  setTempChanges(initialTimeSlot)
                  setOpenPopup(true);
                }} style={{ display: "flex", flexDirection: "row", flex: 1, gap: 20, marginTop: 10, marginBottom: 10 }}>
                  <button>Add Slot</button>
                </div>
                <div></div>
              </div>
            </div>
          ) : (
            <div style={{ color: "red", fontStyle: "italic" }}>Select a pincode to view details. </div>
          )}
          <span style={{ fontSize: 18, fontWeight: "bold" }}> Apply to Other Pincodes</span>
          <textarea style={{minHeight:150}} rows={5} value={bulkPincodes} onChange={(e)=>{setBulkPincodes(e.target.value)}}/>
          <button
          style={{
                cursor: bulkPincodes.length >=6 ? "pointer" : "default",
                backgroundColor: bulkPincodes.length<6? "#ddd" : "#ffef03",
                color: bulkPincodes.length <6 ? "#aaa" : "#000",
                borderWidth: bulkPincodes.length <6 ? 0 : 1,
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
      </div>
      {modifySlot!==null && (
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
                          console.log( "Server's need:"+tempChanges.slot,"Input's need:"+convertTo24Hour(tempChanges.slot),"Input's out:"+e.target.value,"Sending to server:"+convertToAMPM(e.target.value));
                          setTempChanges((prev)=>({...prev,slot:convertToAMPM(e.target.value)}));
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
                          setTempChanges((prev)=>({...prev,slot:convertToAMPM(e.target.value)}));
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
                            setTempChanges((prev)=>({...prev,day:e.target.value}));
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
                            setTempChanges((prev)=>({...prev,isDisabled:b==="true"?true:false}));
                            setShowSave(true);
                          }}
                          defaultValue={tempChanges.isDisabled}
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
                         setTempChanges((prev)=>({...prev,value:{minutes:encodeTimeToMinutes(e.target.value)}}));
                          setShowSave(true);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
         {showSave &&  <DialogActions>
            <Button
              color="primary"
              onClick={() => {
                const newArray = [...bulkAreaEdit];
                newArray[modifySlot] = tempChanges;
                setBulkAreaEdit(newArray);
                setOpenPopup(false);
                bulkUpdate([Number(areaDetails.area)],newArray)
                toast.success("Slot modified successfully");
              }}>
              Save Changes
            </Button>
          </DialogActions>}
        </AlertDialogSlide>
      )}
    </div>
  );
};

export default DeliverySlot;

function insertAtIndex(array, index, object) {
  // If index is less than 0, insert at the beginning
  if (index <= 0) {
      array.unshift(object);
  } 
  // If index is greater than array length, insert at the end
  else if (index >= array.length) {
      array.push(object);
  } 
  // Otherwise, insert at the specified index
  else {
      array.splice(index, 0, object);
  }
  return array;
}
