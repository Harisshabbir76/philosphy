import "../Styles/LegalPage.css";
import GettingStartedBottom from "../components/GettingStartedbottom";
const policies = [
  {
    title: "SHIPPING & DELIVERY",
    html: (
      <>
        <p>AT PHILOSOPHY, WE ENSURE THAT EVERY ORDER IS HANDLED WITH CARE AND DELIVERED TO YOU SAFELY.</p>
        
        <h3>PROCESSING TIME</h3>
        <p>ALL ORDERS ARE PROCESSED WITHIN 1-3 BUSINESS DAYS (EXCLUDING WEEKENDS AND PUBLIC HOLIDAYS). ONCE YOUR ORDER IS CONFIRMED, YOU WILL RECEIVE A CONFIRMATION EMAIL.</p>
        
        <h3>SHIPPING TIME</h3>
        <p>DELIVERY TIMELINES MAY VARY DEPENDING ON YOUR LOCATION:</p>
        <ul>
          <li>UAE: 1-3 BUSINESS DAYS</li>
          <li>INTERNATIONAL: 5-10 BUSINESS DAYS</li>
        </ul>
        <p>PLEASE NOTE THAT DELIVERY TIMES ARE ESTIMATES AND MAY VARY DUE TO EXTERNAL FACTORS.</p>
        
        <h3>SHIPPING FEES</h3>
        <p>SHIPPING COSTS ARE CALCULATED AT CHECKOUT BASED ON YOUR LOCATION.</p>
        
        <h3>ORDER TRACKING</h3>
        <p>ONCE YOUR ORDER HAS BEEN SHIPPED, YOU WILL RECEIVE A TRACKING NUMBER VIA EMAIL TO MONITOR YOUR DELIVERY.</p>
        
        <h3>CUSTOMS & DUTIES</h3>
        <p>FOR INTERNATIONAL ORDERS, CUSTOMS DUTIES AND TAXES (IF APPLICABLE) ARE THE RESPONSIBILITY OF THE CUSTOMER.</p>
      </>
    )
  },
  {
    title: "RETURNS & EXCHANGES POLICY",
    html: (
      <>
        <p>At philosophy, we take pride in the quality and craftsmanship of our jewelry boxes and accessories. Please read our policy carefully before making a purchase.</p>
        
        <h3>Returns</h3>
        <p>We accept returns within 7 days of receiving your order, provided that:</p>
        <ul>
          <li>The item is unused and in its original condition</li>
          <li>The original packaging is intact</li>
          <li>Proof of purchase is provided</li>
        </ul>
        <p>To request a return, please contact us at philosophy@gmail.com with your order number and reason for return.</p>
        
        <h3>Exchanges</h3>
        <p>Exchanges are accepted for damaged or defective items only. If your item arrives damaged, please contact us within 48 hours of delivery with clear photos of the product and packaging.</p>
        
        <h3>Non-Returnable Items</h3>
        <p>The following items are non-refundable and non-exchangeable:</p>
        <ul>
          <li>Customized or personalized products</li>
          <li>Sale or promotional items</li>
          <li>Gift cards</li>
        </ul>
        
        <h3>Refunds</h3>
        <p>Once your returned item is received and inspected, we will notify you regarding the approval of your refund. Approved refunds will be processed to the original payment method within 7-14 business days.</p>
        
        <h3>Shipping Costs</h3>
        <p>Shipping fees are non-refundable unless the return is due to an error on our side.</p>
      </>
    )
  },
  {
    title: "PRIVACY POLICY",
    html: (
      <>
        <p>At philosophy, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.</p>
        
        <h3>Information We Collect</h3>
        <p>We may collect the following information when you use our website:</p>
        <ul>
          <li>Name</li>
          <li>Contact information including email and phone number</li>
          <li>Shipping and billing address</li>
          <li>Payment details</li>
          <li>Website usage data through cookies and analytics</li>
        </ul>
        
        <h3>How We Use Your Information</h3>
        <p>Your information may be used to:</p>
        <ul>
          <li>Process and deliver your orders</li>
          <li>Communicate with you regarding purchases or inquiries</li>
          <li>Improve our website and customer experience</li>
          <li>Send promotional updates (only if you opt in)</li>
        </ul>
        
        <h3>Payment Security</h3>
        <p>All payments are processed through secure third-party payment gateways. We do not store your credit card information.</p>
        
        <h3>Cookies</h3>
        <p>Our website may use cookies to improve browsing experience, analyze traffic, and personalize content.</p>
        
        <h3>Third-Party Services</h3>
        <p>We may share necessary information with trusted third-party partners such as delivery providers and payment processors strictly for order fulfillment purposes.</p>
        
        <h3>Your Rights</h3>
        <p>You may request access, correction, or deletion of your personal information at any time by contacting us at philosophyskev@gmail.com.</p>
      </>
    )
  },
  {
    title: "TERMS & CONDITIONS",
    html: (
      <>
        <p>By using this website, you agree to the following terms and conditions.</p>
        
        <h3>General</h3>
        <p>By accessing this website, you confirm that you are at least 18 years old or using the website under parental supervision.</p>
        
        <h3>Products & Availability</h3>
        <p>We strive to ensure all product details, descriptions, and prices are accurate. However, errors may occasionally occur. We reserve the right to correct errors and update information without prior notice.</p>
        
        <h3>Orders</h3>
        <p>Once an order is placed, you will receive an order confirmation email. We reserve the right to cancel or refuse orders at our discretion.</p>
        
        <h3>Pricing & Payments</h3>
        <p>All prices are listed in AED and include VAT where applicable. Payments must be completed before orders are processed.</p>
        
        <h3>Shipping & Delivery</h3>
        <p>Delivery timelines are estimates and may vary due to external factors. We are not responsible for delays caused by courier services or customs clearance.</p>
        
        <h3>Intellectual Property</h3>
        <p>All content on this website including logos, images, designs, and text is the property of philosophy and may not be copied or used without written permission.</p>
        
        <h3>Limitation of Liability</h3>
        <p>philosophy shall not be held liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>
        
        <h3>Governing Law</h3>
        <p>These Terms & Conditions shall be governed by the laws of the United Arab Emirates.</p>
      </>
    )
  }
];

export default function LegalPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <h1 className="legal-page__title">OUR POLICIES</h1>
        <div className="legal-page__content">
          {policies.map((policy, index) => (
            <details className="legal-accordion" name="legal-policies" open={index === 0} key={policy.title}>
              <summary>
                <span>{policy.title}</span>
                <span className="legal-accordion__mark" aria-hidden="true" />
              </summary>
              <div className="legal-accordion__content">
                {policy.html}
              </div>
            </details>
          ))}
        </div>
      </div>
      <GettingStartedBottom />
    </main>
  );
}
