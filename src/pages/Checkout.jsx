import React from "react";
import { useCart } from "../context/UseCart";

function Checkout() {
  const { cart } = useCart();

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0
  );


  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed to load");
      return;
    }

    const orderRes = await fetch("http://localhost:5000/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: subtotal }),
    });

    const order = await orderRes.json();



    // 2️⃣ Razorpay options
    const options = {
      key: "rzp_test_SAaR4i5T0MYaYY", // ONLY test key_id
      amount: order.amount,
      currency: "INR",
      name: "Fashion Hunt",
      description: "Order Payment",
      order_id: order.id,

      handler: async function (response) {

        const verifyRes = await fetch("http://localhost:5000/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.status === "success") {
          alert("Payment Successful 🎉");
        } else {
          alert("Payment Failed ❌");
        }
      },


      theme: {
        color: "#2b1d0e",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-10 px-4 py-10">

        {/* LEFT */}
        <div className="bg-white rounded-xl p-6 sm:p-10">
          <h2 className="text-2xl font-semibold mb-6">Checkout</h2>

          <button
            onClick={handlePayment}
            className="w-full mt-8 bg-[#2b1d0e] text-white py-4 rounded-full text-lg hover:bg-[#3c2e14] cursor-pointer"
          >
            Pay Now
          </button>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="bg-white rounded-xl p-6 sm:p-8 h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          {cart.map((item) => (
            <div key={item._id + item.size} className="flex gap-4 mb-4">
              <img src={item.image} className="w-16 h-20 rounded-lg object-cover object-top" />
              <div className="flex-1">
                <p>{item.title}</p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
              </div>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}

          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Checkout;
