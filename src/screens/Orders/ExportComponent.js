import React, { useState } from 'react';
import { saveAs } from 'file-saver'; // Assuming you're using file-saver library for saving the CSV file
import { getallOrdersWithoutLimit, getOrdersWithoutLimit } from '../../Apis/orders'; // Adjust the import path as per your API structure

const ExportComponent = ({ orderType }) => {
    const [ordersAll, setOrdersAll] = useState([]);

    const generateCSV = async () => {
        let ordersObservable;

            ordersObservable = getOrdersWithoutLimit(orderType);

        try {
            const orderResponse = await ordersObservable;
            if (orderResponse.success) {
                let ordersData = orderResponse.orders.map(order => ({
                    id: order.id,
                    name: order.address.name,
                    line1: order.address.line1,
                    line2: order.address.line2,
                    fullAddress: order.address.fullAddress,
                    mobileNo: order.address.mobileNo,
                    date: order.date,
                    deliveryDate: order.deliveryDate,
                    slot: order.deliveryTime.slot,
                    Total_Item: order.totalProduct,
                    Total_Price: order.amount,
                    status: order.status
                }));

                setOrdersAll(ordersData);

                // Generate CSV
                const replacer = (key, value) => value === null ? '' : value;
                const header = Object.keys(ordersData[0]);
                let csv = ordersData.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
                csv.unshift(header.join(','));
                let csvArray = csv.join('\r\n');

                var blob = new Blob([csvArray], { type: 'text/csv' });
                saveAs(blob, `SellerOrders.csv`);
            } else {
                console.warn(orderResponse.message);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div>
            <button className="ExportButton" onClick={generateCSV}>EXPORT</button>
        </div>
    );
};

export default ExportComponent;
