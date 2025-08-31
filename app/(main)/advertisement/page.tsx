import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";


export default function AdSubmissionForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [placement, setPlacement] = useState("native");
  const [packageType, setPackageType] = useState("basic");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, imageUrl, link, placement }),
      });
      
      if (res.ok) {
        const ad = await res.json();
        console.log("Ad Created:", ad);
        // handlePayment(ad._id); // Initiate payment
      } else {
        console.error("Failed to create ad");
      }
    } catch (error) {
      console.error("Error creating ad:", error);
    }
  };

//   const handlePayment = async (adId) => {
//     const res = await fetch("/api/payments", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ adId, packageType }),
//     });
    
//     if (res.ok) {
//       const { orderId } = await res.json();
//       const options = {
//         key: "YOUR_RAZORPAY_KEY", // Replace with actual Razorpay key
//         amount: packageType === "basic" ? 10000 : packageType === "premium" ? 20000 : 50000,
//         currency: "INR",
//         name: "Forum Ad Payment",
//         description: "Payment for Ad Subscription",
//         order_id: orderId,
//         handler: async function (response) {
//           console.log("Payment successful:", response);
//           router.push("/");
//         },
//       };
      
//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     }
//   };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-semibold mb-4">Submit an Advertisement</h2>
      <form onSubmit={handleSubmit}>
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} required className="w-full p-2 border rounded mt-2" />
        <Input placeholder="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <Input placeholder="Link" value={link} onChange={(e) => setLink(e.target.value)} required />
        <select value={placement} onChange={(e) => setPlacement(e.target.value)} className="w-full p-2 border rounded mt-2">
          <option value="native">Native</option>
          <option value="sidebar">Sidebar</option>
        </select>
        <select value={packageType} onChange={(e) => setPackageType(e.target.value)} className="w-full p-2 border rounded mt-2">
          <option value="basic">Basic - ₹100</option>
          <option value="premium">Premium - ₹200</option>
          <option value="enterprise">Enterprise - ₹500</option>
        </select>
        <Button type="submit" className="mt-4">Submit Ad</Button>
      </form>
    </div>
  );
}
