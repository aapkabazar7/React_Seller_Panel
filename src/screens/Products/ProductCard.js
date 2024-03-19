import { toast } from "react-toastify";
import { updateProductInfo } from "../../Apis/Products";
import { baseURL, liveURL } from "../../config/config";
import PinCodeModal from "./PinCodeModal";
import { useState, useEffect } from "react";
export const ProductCard = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [blacklistedPinCodes, setBlacklistedPinCodes] = useState("");
  const [productName, setProductName] = useState("");
  const [sellerProductId, setSellerProductId] = useState("");
  const [statevar, setStateVar] = useState(false);
  const [infoVar, setInfoVar] = useState({
    sellerProductId: "",
    quantity: 0,
    perUserOrderQuantity: 0,
    price: 0,
    sellPrice: 0,
    minSellPrice: 0,
    storeMinQuantity: 0,
    purchasePrice: 0,
    dotd_from_time: 0,
    dotd_to_time: 0,
  });
  const openModal = (data) => {
    console.log(data);
    if (!statevar) {
      if (data === undefined) {
        setBlacklistedPinCodes("");
      } else {
        setBlacklistedPinCodes(data);
      }
    }
    setIsOpen(true);
  };

  const updateInfo = async () => {
    try {
      const res = await updateProductInfo(infoVar);
      if (res && res.success) toast.success("Updated " + item.name);
    } catch (error) {
      console.log(error, "Product Card:26.js");
    }
  };

  const [checker, setChecker] = useState(false);
  const [disableSave, setDisableSave] = useState(true);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  useEffect(() => {
    setInfoVar({
      sellerProductId: item.sellerProductId,
      quantity: item.quantity,
      perUserOrderQuantity: item.perUserOrderQuantity,
      price: item.price,
      sellPrice: item.sellPrice,
      minSellPrice: item.minSellPrice,
      storeMinQuantity: item.storeMinQuantity,
      purchasePrice: item.purchasePrice,
      dotd_from_time: item.dotd_from_time,
      dotd_to_time: item.dotd_to_time,
    });
    setChecker(true);
  }, []);

  useEffect(() => {
    if (checker) setDisableSave(false);
  }, [checker, infoVar]);

  const closeModal = () => {
    setStateVar(true);
    setIsOpen(false);
  };
  return (
    <>
      {isOpen && <PinCodeModal onClose={closeModal} blacklistedPinCodes={blacklistedPinCodes} productName={productName} sellerProductId={sellerProductId} setBlacklistedPinCodes={setBlacklistedPinCodes} />}
      <tr key={index}>
        <td>
          <div style={{ justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column", gap: 5 }}>
            <p className="blacktext">SKU</p>
            <p className="greytext">{item.sku}</p>
            <p className="blacktext">GSTIN</p>
            <p className="greytext">{item.hsnCode}</p>
          </div>
        </td>
        <td>
          <div style={{ display: "flex", gap: 10 }}>
            <div>
              <img alt="ProductImage" src={`${liveURL}/public/product/${item.id}/${item.images[0]}`} className="productImage" />
            </div>
            <div>
              <p className="blacktext">{item.name}</p>
              <p className="greytext">{item.recommendedAttribute}</p>
            </div>
          </div>
        </td>
        <td>
          <input type="text" style={{ width: "60%", textAlign: "center", borderRadius: 8, backgroundColor: "#f2f2f2" }} value={infoVar.price} onChange={(e) => setInfoVar((prevState) => ({ ...prevState, price: e.target.value }))} />
        </td>
        <td>
          <input type="text" style={{ width: "60%", textAlign: "center", borderRadius: 8, backgroundColor: "#f2f2f2" }} value={infoVar.sellPrice} onChange={(e) => setInfoVar((prevState) => ({ ...prevState, sellPrice: e.target.value }))} />
        </td>
        <td>
          <input type="text" style={{ width: "60%", textAlign: "center", borderRadius: 8, backgroundColor: "#f2f2f2" }} value={infoVar.quantity} onChange={(e) => setInfoVar((prevState) => ({ ...prevState, quantity: e.target.value }))} />
        </td>
        <td>
          <input type="text" style={{ width: "60%", textAlign: "center", borderRadius: 8, backgroundColor: "#f2f2f2" }} value={infoVar.perUserOrderQuantity} onChange={(e) => setInfoVar((prevState) => ({ ...prevState, perUserOrderQuantity: e.target.value }))} />
        </td>
        <td>
          <input type="text" style={{ width: "60%", textAlign: "center", borderRadius: 8, backgroundColor: "#f2f2f2" }} value={infoVar.minSellPrice} onChange={(e) => setInfoVar((prevState) => ({ ...prevState, minSellPrice: e.target.value }))} />
        </td>
        <td>
          <input type="text" style={{ width: "60%", textAlign: "center", borderRadius: 8, backgroundColor: "#f2f2f2" }} value={infoVar.storeMinQuantity} onChange={(e) => setInfoVar((prevState) => ({ ...prevState, storeMinQuantity: e.target.value }))} />
        </td>
        <td>
          <button
            onClick={() => {
              setProductName(item.name);
              setSellerProductId(item.sellerProductId);
              openModal(item.blacklistedPinCodes);
            }}
            className="DisablePinModal">
            Show
          </button>
        </td>
        <td>
          <button
            disabled={setDisableSave}
            style={{ backgroundColor: disableSave ? "#eee" : "#0d9e67", border: disableSave ? "1px solid #aaa" : "none", color: disableSave ? "#aaa" : "white" }}
            onClick={() => {
              updateInfo();
            }}
            className="SaveBtn">
            Save
          </button>
        </td>
      </tr>
    </>
  );
};
