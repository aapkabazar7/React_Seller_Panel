import axios from "axios";
import { baseURL } from "../config/config";
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxN2QyOTgyYmQ2OGM5NGQwYmNiOTIwMCIsInBob25lTm8iOjg3ODc4Nzg3ODcsImVtYWlsIjoiYWFwa2FiYXphcnNlbGxlckBnbWFpbC5jb20iLCJpYXQiOjE3MDc0ODkwMzN9.NziQ8vjNz5y42pFtsq6739vo7GwOVuOzVsX0hcFrq0Q'

const getOrders = async (type, startDate, EndDate, PhoneNumber, start = 0, end = 10) => {

    var url = `${baseURL}/order/v2/getOrders?start=${start}&end=${end}`;

    try {
        const response = await axios.post(
            url,
            {
                EndDate: EndDate,
                number: PhoneNumber,
                sort: { id: -1 },
                startDate: startDate,
                // state: type === 'new' ? 'new' : 'active',
                status: type
            },
            {
                headers: {
                    'x-access-token': token
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error; // Re-throwing the error for handling in the calling code
    }
}

const getOrdersWithoutLimit = async (type) => {

    var url;
    if (type === 'all') {
        url = `${baseURL}/order/allorderseller`
    } else {
        url = `${baseURL}/orders`;
    }

    try {
        const response = await axios.post(
            url,
            {
                number: '',
                sort: { id: -1 },
                state: type === 'new' ? 'new' : 'active',
                status: type === 'new' ? 'pending' : type
            },
            {
                headers: {
                    'x-access-token': token
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching orders:', error);

    }
}

const confirmPendingOrder = async (orderId) => {

    const url = `${baseURL}/order/confirmed`;
    const pendingOrderDetail = {
        orderId: orderId,
        state: 'active',
        status: 'confirmed'
    }
    const response = await axios.post(url, pendingOrderDetail, {
        headers: {
            'x-access-token': token
        }
    })

    console.log(response.data)
    return response.data;

}
const processConfirmedOrder = async (orderId) => {

    const url = `${baseURL}/order/processed`;
    const confirmedOrderDetail = {
        orderId: orderId,
        state: 'active',
        status: 'processed'
    }
    const response = await axios.post(url, confirmedOrderDetail, {
        headers: {
            'x-access-token': token
        }
    })

    console.log(response.data)
    return response.data;

}
const dispatchProcessedOrder = async (orderId) => {

    const url = `${baseURL}/order/dispatched`;
    const processedOrderDetail = {
        orderId: orderId,
        state: 'active',
        status: 'dispatched'
    }
    const response = await axios.post(url, processedOrderDetail, {
        headers: {
            'x-access-token': token
        }
    })

    console.log(response.data)
    return response.data;

}
const cancelOrder = async (orderId) => {

    const url = `${baseURL}/order/canceledorderbyid`;
    const processedOrderDetail = {
        orderId: orderId,
        state: 'refund',
        status: 'cancelled'
    }
    const response = await axios.post(url, processedOrderDetail, {
        headers: {
            'x-access-token': token
        }
    })

    console.log(response.data)
    return response.data;

}
const deliverOrderApi = async (orderId, otp) => {

    const url = `${baseURL}/order/dilevered`;
    const processedOrderDetail = {
        orderId: orderId,
        otp: otp,
        state: 'active',
        status: 'delivered'
    }
    const response = await axios.post(url, processedOrderDetail, {
        headers: {
            'x-access-token': token
        }
    })

    console.log(response.data)
    return response.data;

}
const restoreOrderApi = async (orderId) => {

    const url = `${baseURL}/order/restoreOrder`;
    const OrderDetail = {
        orderId: orderId,
        state: 'new',
        status: 'pending'
    }
    const response = await axios.post(url, OrderDetail, {
        headers: {
            'x-access-token': token
        }
    })

    console.log(response.data)
    return response.data;

}

const orderDetailsApi = async (orderId) => {
    const url = `${baseURL}/order/details?id=${orderId}`;
    try {

        const response = await axios.get(url, {
            headers: {
                'x-access-token': token
            }
        })

        return response.data;
    } catch (err) {
        console.log("error in fetching order details", err)
    }
}



export { getOrders, getOrdersWithoutLimit, confirmPendingOrder, processConfirmedOrder, dispatchProcessedOrder, cancelOrder, deliverOrderApi, restoreOrderApi, orderDetailsApi }