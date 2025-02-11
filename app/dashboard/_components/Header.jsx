"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import img1 from '../../../public/logo2.svg'
import Link from "next/link";

function Header() {
  const path = usePathname();
  useEffect(() => {
    console.log(path);
  }, []);

  return (
    <header className="flex items-center justify-between p-4 bg-secondary shadow-md">
      {/* Logo */}
      <Link href="/">
        <Image src="/logo.svg" width={140} height={40} alt="Logo" className="cursor-pointer" />
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex gap-6">
        <Link
          href="/dashboard"
          className={`text-lg font-medium transition-colors ${
            path === "/dashboard" ? "text-primary font-bold" : "text-gray-700 hover:text-primary"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/"
          className={`text-lg font-medium transition-colors ${
            path === "/" ? "text-primary font-bold" : "text-gray-700 hover:text-primary"
          }`}
        >
          Home
        </Link>
      </nav>

      {/* User Profile */}
      <UserButton />
    </header>
  );
}

export default Header;
