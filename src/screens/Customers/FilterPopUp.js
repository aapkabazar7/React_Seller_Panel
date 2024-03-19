import React, { useState } from "react";

const PopupComponent = ({ showPop, hidePopup, setSortFilterBody }) => {
    const [filterData, setFilterData] = useState({
        lastActive: {
            min: null,
            max: null,
        },
        latestOrderDate: {
            min: null,
            max: null,
        },
        latestOrderAmount: {
            min: null,
            max: null,
        },
        totalOrders: {
            min: null,
            max: null,
        },
        avgOrderAmount: {
            min: null,
            max: null,
        },
        totalAmount: {
            min: null,
            max: null,
        },
    });

    const handleInputChange = (field, type, value) => {
        setFilterData((prevFilterData) => ({
            ...prevFilterData,
            [field]: {
                ...prevFilterData[field],
                [type]: value,
            },
        }));
    };

    const applyHandler = () => {
        let range = {};
        for (const [x, { min, max }] of Object.entries(filterData)) {
            if (min && max) {
                if (min.includes("-"))
                    range = { ...range, [x]: { min, max } };
                else
                    range = { ...range, [x]: { min: parseInt(min), max: parseInt(max) } };
            }
        }
        setSortFilterBody((e) => ({ ...e, range: { ...range } }))
        hidePopup()
    };

    return (
        <div className={`popup`} style={{ display: showPop ? "flex" : "none" }}>
            <div className="popup-content">
                <div className="filter-heading">Filters</div>
                <table className="filter-table">
                    <tbody>
                        <tr>
                            <td className="filter-label">Last Active</td>
                            <td className="filter-input">
                                <input
                                    type="date"
                                    className="date-picker-input"
                                    value={filterData.lastActive.min || ''}
                                    onChange={(e) => handleInputChange("lastActive", "min", e.target.value)}
                                />
                            </td>
                            <td className="filter-input">
                                <input
                                    type="date"
                                    className="date-picker-input"
                                    value={filterData.lastActive.max || ''}
                                    onChange={(e) => handleInputChange("lastActive", "max", e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="filter-label">Last Order Date</td>
                            <td className="filter-input">
                                <input
                                    type="date"
                                    className="date-picker-input"
                                    value={filterData.latestOrderDate.min || ''}
                                    onChange={(e) => handleInputChange("latestOrderDate", "min", e.target.value)}
                                />
                            </td>
                            <td className="filter-input">
                                <input
                                    type="date"
                                    className="date-picker-input"
                                    value={filterData.latestOrderDate.max || ''}
                                    onChange={(e) => handleInputChange("latestOrderDate", "max", e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="filter-label">Last Amount</td>
                            <td className="filter-input">
                                <input
                                    type="number"
                                    className="date-picker-input"
                                    value={filterData.latestOrderAmount.min || ''}
                                    onChange={(e) => handleInputChange("latestOrderAmount", "min", e.target.value)}
                                />
                            </td>
                            <td className="filter-input">
                                <input
                                    type="number"
                                    className="date-picker-input"
                                    value={filterData.latestOrderAmount.max || ''}
                                    onChange={(e) => handleInputChange("latestOrderAmount", "max", e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="filter-label">Total Orders</td>
                            <td className="filter-input">
                                <input
                                    type="number"
                                    className="date-picker-input"
                                    value={filterData.totalOrders.min || ''}
                                    onChange={(e) => handleInputChange("totalOrders", "min", e.target.value)}
                                />
                            </td>
                            <td className="filter-input">
                                <input
                                    type="number"
                                    className="date-picker-input"
                                    value={filterData.totalOrders.max || ''}
                                    onChange={(e) => handleInputChange("totalOrders", "max", e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="filter-label">Average Order Amount</td>
                            <td className="filter-input">
                                <input
                                    type="number"
                                    className="date-picker-input"
                                    value={filterData.avgOrderAmount.min || ''}
                                    onChange={(e) => handleInputChange("avgOrderAmount", "min", e.target.value)}
                                />
                            </td>
                            <td className="filter-input">
                                <input
                                    type="number"
                                    className="date-picker-input"
                                    value={filterData.avgOrderAmount.max || ''}
                                    onChange={(e) => handleInputChange("avgOrderAmount", "max", e.target.value)}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="filter-label">Total Spends</td>
                            <td className="filter-input">
                                <input
                                    type="number"
                                    className="date-picker-input"
                                    value={filterData.totalAmount.min || ''}
                                    onChange={(e) => handleInputChange("totalAmount", "min", e.target.value)}
                                />
                            </td>
                            <td className="filter-input">
                                <input
                                    type="number"
                                    className="date-picker-input"
                                    value={filterData.totalAmount.max || ''}
                                    onChange={(e) => handleInputChange("totalAmount", "max", e.target.value)}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="action-buttons">
                    <div>
                        <button className="apply-button" onClick={applyHandler}>
                            Apply
                        </button>
                    </div>
                    <div>
                        <button className="cancel-button" onClick={hidePopup}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopupComponent;
