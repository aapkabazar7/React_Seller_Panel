import { toast } from "react-toastify";
import { updateProductInfo } from "../../Apis/Products";
import { baseURL, liveURL } from "../../config/config";
import { useState, useEffect } from "react";
export const ProductCardModified = ({ item, index }) => {
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

  return (
    <>
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
          <div style={{ display: "flex", gap: 10, justifyContent: "center", alignItems: "center" }}>
            <div>
              <img alt="" src={`${liveURL}/public/product/${item.id}/${item.images[0]}`} className="productImage" />
            </div>
          </div>
        </td>
        <td>
          <div>
            <p style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }} className="blacktext">
              {item.name}
            </p>
            <p style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }} className="greytext">
              {item.recommendedAttribute}
            </p>
          </div>
        </td>
        <td>
          <p className="blacktext" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            ₹ {item.price}
          </p>
        </td>
        <td>
          <p className="blacktext" style={{ justifyContent: "center", alignItems: "center", textAlign: "center" }}>
            ₹ {item.sellPrice}
          </p>
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
