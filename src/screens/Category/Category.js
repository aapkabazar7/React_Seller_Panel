import React, { useEffect, useState } from "react";
import "./Category.css";
import { activateCategory, deleteCategory, getCategoriesApi } from "../../Apis/Category";
import { toastError, toastSuccess } from "../../utils/toast";
import { toast } from "react-toastify";

const Category = () => {
  const [tree, setTree] = useState(null);
  const [selectedCategoryID, setSelectedCategoryID] = useState(null);
  const [selectedSubCategoryID, setSelectedSubCategoryID] = useState(null);

  const [categoryItem, setCategoryItem] = useState(null);
  const [subCategoryItem, setSubCategoryItem] = useState(null);

  const getCategories = async () => {
    const result = await getCategoriesApi();
    if (result.success) {
      console.log(result);
      setTree(result.category);
      setSelectedCategoryID(0);
      setCategoryItem(result.category[0]);
      //   setSelectedSubCategoryID(result.category[0].children[0]._id);
      //   setSubCategoryItem(result.category[0].children[0]);
    } else {
      console.log("cannot fetch categories", result.message);
    }
  };
  useEffect(() => {
    getCategories().then();
  }, []);

  const handleCategoryId = (item) => {
    setSelectedCategoryID(item);
  };
  const getLatestCategories = async () => {
    setSubCategoryItem(null);
    setCategoryItem(null);
    const result = await getCategoriesApi();
    setCategoryItem(result.category[selectedCategoryID]);
    if (selectedSubCategoryID === null) {
      setSelectedSubCategoryID(0);
      setSubCategoryItem(result.category[selectedCategoryID].children[0]);
    } else {
      setSubCategoryItem(result.category[selectedCategoryID].children[selectedSubCategoryID]);
    }
  };
  const getLatestSubCategories = async () => {
    const result = await getCategoriesApi();
    setSubCategoryItem(result.category[selectedCategoryID].children[selectedSubCategoryID]);
    // setLeafCategoryItem(result.category[selectedCategoryID].children[selectedSubCategoryID].children);
    console.log("leafCategoryItem", result.category[selectedCategoryID].children[selectedSubCategoryID].children, selectedCategoryID, selectedSubCategoryID);
  };
  React.useEffect(() => {
    if (selectedCategoryID !== null) getLatestCategories();
  }, [selectedCategoryID]);
  React.useEffect(() => {
    if (selectedSubCategoryID !== null) getLatestSubCategories();
  }, [selectedSubCategoryID]);
  const handleSubCategoryId = (item) => {
    setSelectedSubCategoryID(item);
  };

  const renderCategories = () => {
    return (
      <div className="buttonContainer">
        {tree.map((item, index) => {
          return (
            <button className={`categoryProductButton ${index === selectedCategoryID ? "active" : ""}`} onClick={() => handleCategoryId(index)} key={index}>
              {item.name}
            </button>
          );
        })}
      </div>
    );
  };
  const renderSubCategories = () => {
    return categoryItem.children.map((item, index) => {
      return (
        <button className={`subCategoryProductButton ${index === selectedSubCategoryID ? "active" : ""}`} onClick={() => handleSubCategoryId(index)} key={index}>
          {item.name}
        </button>
      );
    });
  };

  const renderLeafCategories = () => {
    return (
      <div className="leafCategoryContainer">
        {subCategoryItem.children.map((item, index) => {
          return (
            <div key={index} className="leafCategoryItem">
              <label>{item.name}</label>
              <input
                type="checkbox"
                defaultChecked={item.isActive}
                onClick={() => {
                  handleCheckBoxChange(item);
                  setSelectedSubCategoryID(selectedSubCategoryID);
                }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const handleCheckBoxChange = async (item) => {
    if (item.isActive) {
      const result = await deleteCategory(item._id);
      if (result.success) {
        toast.success("Deactivated Category: " + item.name);
      } else {
        toast.error(result.message);
      }
    } else {
      const result = await activateCategory(item._id);
      if (result.success) {
        toast.success("Activated Category: " + item.name);
      } else {
        toast.error(result.message);
      }
    }
    getLatestCategories().then();
    getLatestSubCategories().then();
  };

  return (
    <div>
      <div id="categoryRootContainer">
        <div>
          <h2>Select Category</h2>
        </div>
        <span></span>
        <div>
          {tree !== null ? renderCategories() : <></>}
          <div style={{ gap: 20, marginTop: 20, display: "flex" }}>
            <span>Root Category: </span>
            <label className="switch">
              <input
                type="checkbox"
                defaultChecked={categoryItem?.isActive}
                onClick={() => {
                  handleCheckBoxChange(categoryItem);
                }}
              />
              <span className="slider"></span>
            </label>
            <span className="blacktext">{categoryItem?.name}</span>
          </div>
        </div>
        <div id="subCategoryContainer">
          <div id="subCategoryList">{categoryItem ? renderSubCategories() : <></>}</div>
          <div id="leafCategoryList">
            <div style={{ justifyContent: "space-between", display: "flex", width: "30%" }}>
              <span>{subCategoryItem?.name}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  defaultChecked={subCategoryItem?.isActive}
                  onClick={() => {
                    handleCheckBoxChange(subCategoryItem);
                  }}
                />
                <span className="slider"></span>
              </label>
            </div>
            {subCategoryItem ? renderLeafCategories() : <></>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
