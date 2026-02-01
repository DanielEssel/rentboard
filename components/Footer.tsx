"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

function FooterSection({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-[#FFD166] font-semibold text-sm sm:text-base lg:pointer-events-none"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 lg:hidden transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <ul
        className={`mt-3 space-y-2 text-gray-200 text-sm ${
          open ? "block" : "hidden"
        } lg:block`}
      >
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="block hover:text-[#FFD166] transition"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const regions = [
    { name: "Greater Accra", href: "/explore?region=greater-accra" },
    { name: "Ashanti", href: "/explore?region=ashanti" },
    { name: "Western", href: "/explore?region=western" },
    { name: "Eastern", href: "/explore?region=eastern" },
    { name: "Central", href: "/explore?region=central" },
  ];

  const communities = [
    { name: "East Legon", href: "/explore?community=east-legon" },
    { name: "Tema", href: "/explore?community=tema" },
    { name: "Kumasi", href: "/explore?community=kumasi" },
    { name: "Takoradi", href: "/explore?community=takoradi" },
    { name: "Cape Coast", href: "/explore?community=cape-coast" },
  ];

  const helpLinks = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "FAQs", href: "/faqs" },
    { name: "Contact Us", href: "/contact" },
    { name: "Support", href: "/support" },
  ];

  const legalLinks = [
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
  ];

  return (
    <footer className="bg-[#002a2e] text-white">
      {/* Top */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="text-center lg:text-left">
            <Image
              src="/logos/wrent1.png"
              alt="TownWrent Logo"
              width={140}
              height={50}
              priority
              className="mx-auto lg:mx-0 mb-4"
            />
            <p className="text-gray-200 text-sm max-w-xs mx-auto lg:mx-0">
              Connecting tenants with verified properties across Ghana.
            </p>

            {/* Socials */}
            <div className="flex justify-center lg:justify-start gap-4 mt-6">
              {[
                {
                  href: "https://web.facebook.com/profile.php?id=61585492454084",
                  label: "Facebook",
                  icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12...",
                },
                {
                  href: "https://x.com/TownWrent",
                  label: "X",
                  icon: "M18.244 2.25h3.308l-7.227 8.26...",
                },
                {
                  href: "https://www.instagram.com/townwrent2025/",
                  label: "Instagram",
                  icon: "M12 2.163c3.204 0 3.584...",
                },
                {
                  href: "https://wa.me/233245258015",
                  label: "WhatsApp",
                  icon: "M17.472 14.382c-.297-.149...",
                },
              ].map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  aria-label={s.label}
                  className="hover:text-[#FFD166] transition transform hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={s.icon} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          {/* Sections */}
          <FooterSection title="Regions" links={regions} />
          <FooterSection title="Communities" links={communities} />
          <FooterSection title="Help" links={helpLinks} />
          <FooterSection title="Legal" links={legalLinks} />
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-200 text-center sm:text-left">
            © {new Date().getFullYear()} TownWrent. All rights reserved.
          </p>
          <p className="text-xs text-gray-200 flex items-center gap-2">
            🇬🇭 Proudly serving Ghana
          </p>
        </div>
      </div>
    </footer>
  );
}
