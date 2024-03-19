import React, { useEffect, useState } from "react"
import './Category.css'
import { activateCategory, deleteCategory, getCategoriesApi } from "../../Apis/Category";
import { toastError, toastSuccess } from "../../utils/toast";
import { toast } from "react-toastify";

const Category = () => {
    const [tree, setTree] = useState(null);
    const [selectedCategoryID, setSelectedCategoryID] = useState(null);
    const [selectedSubCategoryID, setSelectedSubCategoryID] = useState(null);

    const [categoryItem, setCategoryItem] = useState(null);
    const [subCategoryItem, setSubCategoryItem] = useState(null);
    const [leafCategoryItem, setLeafCategoryItem] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            const result = await getCategoriesApi();
            if (result.success) {
                setTree(result.category)
                setSelectedCategoryID(result.category[0]._id)
                setSelectedSubCategoryID(result.category[0].children[0]._id)
                setCategoryItem(result.category[0])
                setSubCategoryItem(result.category[0].children[0])
                setLeafCategoryItem(result.category[0].children[0].children[0])
            } else {
                console.log("cannot fetch categories", result.message)
            }
        }
        getCategories();
    }, [])

    const handleCategoryId = (item) => {
        setSelectedCategoryID(item._id);
        setSelectedSubCategoryID(item.children[0]._id);
        setCategoryItem(item);
        setSubCategoryItem(item.children[0]);
        setLeafCategoryItem(item.children[0].children[0])
    }
    const handleSubCategoryId = (item) => {
        setSelectedSubCategoryID(item._id);
        setSubCategoryItem(item);
    }
    const handleLeafCategoryId = (item) => {
        setLeafCategoryItem(item);
    }

    const renderCategories = () => {
        return (
            <div className="buttonContainer">
                {
                    tree.map((item, index) => {
                        return <button className={`categoryProductButton ${item._id === selectedCategoryID ? 'active' : ''}`} onClick={() => handleCategoryId(item)} key={index}>{item.name}</button>
                    })
                }
            </div>
        )
    }
    const renderSubCategories = () => {
        return (
            categoryItem.children.map((item, index) => {
                return <button className={`subCategoryProductButton ${item._id === selectedSubCategoryID ? 'active' : ''}`} onClick={() => handleSubCategoryId(item)} key={index}>{item.name}</button>
            })
        )
    }

    const renderLeafCategories = () => {
        return (
            <div className="leafCategoryContainer">
                {subCategoryItem.children.map((item, index) => {
                    console.log(item);
                    console.log(item.isActive);
                    return <div key={index} className="leafCategoryItem">
                        <label>{item.name}</label>
                        <input type="checkbox" checked={item.isActive} onChange={() => handleCheckBoxChange(item)} />
                    </div>
                })}
            </div>
        )
    }

    const handleCheckBoxChange = async(item) =>{
        if(item.isActive)
        {
            const result = await deleteCategory(item._id);
            if(result.success){
                toast.success("Deactivated Category")
            }else{
                toastError(result.message);
            }
        }
        else{
            const result = await activateCategory(item._id);
            if(result.success){
                toast.success("Activated Category")
            }else{
                toastError(result.message);
            }
        }
    }

    return (
        <div>
            <div id="categoryRootContainer">
                <div>
                    <h2>Select Category</h2>
                </div>
                <div >
                    {tree !== null ? renderCategories() : <></>}
                    <div style={{ gap: 20, marginTop: 20, display: 'flex' }}>
                        <span>Root Category: </span>
                        <label className="switch">
                            <input type="checkbox" defaultChecked={categoryItem?.isActive} onChange={() => handleCheckBoxChange(categoryItem)} />
                            <span className="slider"></span>
                        </label>
                        <span className="blacktext">{categoryItem?.name}</span>
                    </div>
                </div>
                <div id="subCategoryContainer">
                    <div id="subCategoryList">
                        {categoryItem ? renderSubCategories() : <></>}
                    </div>
                    <div id="leafCategoryList">
                        <div style={{ justifyContent: "space-between", display: 'flex', width: '30%' }}>
                            <span>{subCategoryItem?.name}</span>
                            <label className="switch">
                                <input type="checkbox" defaultChecked={subCategoryItem?.isActive} onChange={() => handleCheckBoxChange(subCategoryItem)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        {leafCategoryItem ? renderLeafCategories() : <></>}
                        <div className="SaveBtnDiv" >
                            <button className="SaveBtn">Save </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Category