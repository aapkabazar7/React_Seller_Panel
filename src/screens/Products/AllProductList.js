import { useEffect, useState } from "react"
import { fetchPinCodesApi, fetchProducts } from "../../Apis/Products"
import { ProductCard } from "./ProductCard";

const AllProductList = ({page,setPage,loadingProducts,products,noMoreProducts}) => {

   

    useEffect(() => {
        function handleScroll() {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200 && !loadingProducts)
            setPage(prevPage => prevPage + 1);
            return;
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadingProducts]);


    const renderProduct = () => {

        return (
            products.map((item, index) => {
                return (
                    <ProductCard item={item} index={index} />)
            })
        )
    }

    return (
        <div id="ProductListContainer">

            <div style={{ display: "flex", justifyContent: "space-between", flex: 1, height: 50 }}>
                <h3>All Products</h3>
                <p>Total Products: <span>10000</span></p>
            </div>
            <div id="productList">
                <table  style={{fontSize:16}} >
                    <thead className="headerRow">
                        <tr>
                            <th>Item/SKU Code</th>
                            <th>Product Name</th>
                            <th>MRP(₹)</th>
                            <th>Sell Price(₹)</th>
                            <th>Total Qty</th>
                            <th>Per User Order quantity</th>
                            <th>Offer Price(₹)</th>
                            <th>Offer Qty</th>
                            <th>Disabled Pin Codes</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderProduct()}
                    </tbody>
                </table>
                {noMoreProducts && <p style={{ textAlign: 'center' }}>❌No More Orders</p>}
                {loadingProducts && <div className="loader"></div>}
            </div>
        </div>
    )
}
export default AllProductList