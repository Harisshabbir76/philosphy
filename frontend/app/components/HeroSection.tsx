"use client";

import React from "react";
import Link from "next/link";
import "../Styles/HeroSection.css";

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="hero-section">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        {/* Main Heading */}
        <h1 className="hero-heading">
          IT&apos;S NOT JUST WHAT YOU WEAR
        </h1>

        {/* Script Subheading */}
        <h2 className="hero-script">
          It&apos;s how you match it and how you make it yours.
        </h2>

        {/* Paragraph Text */}
        <p className="hero-paragraph">
          Styled to reflect not just your look, but your identity and expression.
        </p>

        {/* CTA Button */}
        <Link href="/shop" className="hero-cta">
          LEARN MORE
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;