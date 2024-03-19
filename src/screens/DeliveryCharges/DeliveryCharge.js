import { Divider } from '@mui/material'
import React from 'react'

function DeliveryCharge() {
    return (
      <div style={{ display: "flex", flexDirection: "column", flex: 1, margin: "20px 20px", gap: 10 }}>
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            padding: "15px",
            gap: 10,
            display: "flex",
            flex: 1,
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px #0000001A",
            flexDirection: "column",
          }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: "bold" }}>Cart Value/Pin Code Wise Offers </div>
            <div>
              <button
                style={{
                  backgroundColor: "#eee",
                  padding: "10px 30px",
                  fontSize: 14,
                  width: "fit-content",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#aaa",
                }}>
                Add New
              </button>
            </div>
          </div>
          <Divider />
          <div style={{ flex: 1, display: "flex" }}>
            <div style={{ backgroundColor: "#eee", padding: 10, borderRadius: 10, width: "100%", alignItems: "center" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "row", marginBottom: 10 }}>
                <div style={{ flex: 0.8 }}>
                  <input type="text" placeholder="Search by Product" style={{ border: "none", backgroundColor: "white", width: "100%", paddingLeft: 5, borderRadius: 8 }} />
                </div>
                <div style={{ flex: 0.1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ justifyContent: "center", alignItems: "center" }}>Order Value</div>
                </div>
                <div style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                  <input type="text" placeholder="orderValue" style={{ border: "none", backgroundColor: "white", width: "100%", paddingLeft: 5, borderRadius: 8 }} />
                </div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
                <div style={{ flex: 0.8 }}>
                  <textarea placeholder="Pincodes" style={{ border: "none", backgroundColor: "white", color: "#696969", width: "100%", minHeight: 100, maxHeight: "auto", padding: 10, borderRadius: 8, resize: "none", "&onFocus": { backgroundColor: "red" } }} />
                </div>
                <div style={{ flex: 0.1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                  <div style={{ justifyContent: "center", alignItems: "center" }}>
                    {" "}
                    <label className="switch">
                      <input type="checkbox" defaultChecked={true} onChange={() => console.log("hi")} />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
                <div style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                  <button
                    style={{
                      backgroundColor: "#0d9e67",
                      padding: "10px 30px",
                      fontSize: 14,
                      color: "#fff",
                      width: "fit-content",
                      borderRadius: 10,
                      border: "none",
                      maxHeight: 40,
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: "rgb(255, 255, 255)",
            padding: "15px",
            gap: 10,
            borderRadius: "10px",
            boxShadow: "0px 0px 10px 0px #0000001A",
            display: "flex",
            flexDirection: "column",
          }}>
          <div style={{ flex: 1, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: "bold" }}>Pin Code Wise Delivery Charges </div>
            <div>
              <button
                style={{
                  backgroundColor: "#eee",
                  padding: "10px 30px",
                  fontSize: 14,
                  width: "fit-content",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "#aaa",
                }}>
                Add New
              </button>
            </div>
          </div>
          <Divider />
          {[0, 1, 2].map((a, b) => {
            return (
              <div style={{ backgroundColor: "#eee", padding: 10, borderRadius: 10, width: "100%", alignItems: "center" }}>
                <div style={{ flex: 1, display: "flex", flexDirection: "row", marginBottom: 10 }}>
                  <div style={{ flex: 0.8, flexDirection: "row", display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
                      <div style={{ justifyContent: "center", alignItems: "center" }}>Delivery Charge</div>
                      <div style={{ justifyContent: "center", alignItems: "center" }}>
                        {" "}
                        <input type="text" placeholder="₹ 0" style={{ border: "none", backgroundColor: "white", width: "20%", paddingLeft: 5, borderRadius: 8,textAlign:'center' }} />
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
                      <div style={{ justifyContent: "center", alignItems: "center" }}>Order Value</div>
                      <div style={{ justifyContent: "center", alignItems: "center" }}>
                        {" "}
                        <input type="text" placeholder="₹ 0" style={{ border: "none", backgroundColor: "white", width: "20%", paddingLeft: 5, borderRadius: 8 ,textAlign:'center'}} />
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 0.1, display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ justifyContent: "center", alignItems: "center" }}>
                      {" "}
                      <label className="switch">
                        <input type="checkbox" defaultChecked={true} onChange={() => console.log("hi")} />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>
                  <div style={{ flex: 0.1, display: "flex", flexDirection: "row" }}>
                    <button
                      style={{
                        backgroundColor: "#0d9e67",
                        padding: "10px 30px",
                        fontSize: 14,
                        color: "#fff",
                        width: "fit-content",
                        borderRadius: 10,
                        border: "none",
                        maxHeight: 40,
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                      }}>
                      Save
                    </button>
                  </div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
                  <div style={{ flex: 1 }}>
                    <textarea placeholder="Pincodes" style={{ backgroundColor: "white", color: "#696969", minHeight: 100, border: "none", maxHeight: "auto", width: "100%", padding: 10, borderRadius: 8, resize: "none", "&onFocus": { backgroundColor: "red" } }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default DeliveryCharge