"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Search, ShoppingCart, User, MenuIcon, Sun, Moon } from "lucide-react";
import SearchForm from "./search-form";
import ShoppingCartPanel from "./shopping-cart-panel";
import UserPanel from "./user-panel";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const { cart } = useCart();
  const { toast } = useToast();

  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [mounted, setMounted] = useState(false);

  const navbarRef = useRef<HTMLElement>(null);

  // Handle theme mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll for fixed navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsNavbarFixed(true);
      } else {
        setIsNavbarFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
        setIsCartOpen(false);
        setIsUserPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
    setIsCartOpen(false);
    setIsUserPanelOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsUserPanelOpen(false);
  };

  const toggleCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to view your cart",
        variant: "destructive",
      });
      setIsUserPanelOpen(true);
      return;
    }

    setIsCartOpen(!isCartOpen);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserPanelOpen(false);
  };

  const toggleUserPanel = () => {
    setIsUserPanelOpen(!isUserPanelOpen);
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsCartOpen(false);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav
      ref={navbarRef}
      className={`w-full py-4 px-4 md:px-8 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isNavbarFixed
          ? "shadow-md dark:bg-black dark:bg-opacity-80 backdrop-blur-sm light:bg-white light:bg-opacity-90"
          : "dark:bg-black dark:bg-opacity-60 light:bg-white/70 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center relative">
        <Link
          href="/"
          className="text-2xl font-bold dark:text-white light:text-amber-800 hover:text-amber-600 transition-colors duration-300"
        >
          &lt;Caffeine/&gt;
        </Link>

        <div
          className={`navbar-nav absolute top-full left-0 w-full py-5 lg:block lg:static lg:bg-transparent lg:max-w-full lg:shadow-none lg:rounded-none lg:py-0 transition-all duration-300 ${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center dark:bg-black dark:bg-opacity-90 light:bg-white light:bg-opacity-90 light:shadow-lg`}
        >
          <Link
            href="#home"
            className="block text-base py-2 mx-8 lg:mx-4 dark:text-white light:text-gray-800 hover:text-amber-600 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            HOME
          </Link>
          <Link
            href="#about"
            className="block text-base py-2 mx-8 lg:mx-4 dark:text-white light:text-gray-800 hover:text-amber-600 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Tentang Kami
          </Link>
          <Link
            href="#menu"
            className="block text-base py-2 mx-8 lg:mx-4 dark:text-white light:text-gray-800 hover:text-amber-600 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu
          </Link>
          <Link
            href="#contact"
            className="block text-base py-2 mx-8 lg:mx-4 dark:text-white light:text-gray-800 hover:text-amber-600 transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>

        <div className="navbar-extra flex items-center">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="px-2 py-2 mx-1 dark:text-white light:text-amber-800 hover:text-amber-600 transition-colors duration-300"
              title="Toggle Dark/Light Mode"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button
            onClick={toggleSearch}
            className="px-2 py-2 mx-1 dark:text-white light:text-amber-800 hover:text-amber-600 transition-colors duration-300"
          >
            <Search size={20} />
          </button>

          <button
            onClick={toggleCart}
            className="px-2 py-2 mx-1 dark:text-white light:text-amber-800 hover:text-amber-600 transition-colors duration-300 relative"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={toggleUserPanel}
            className="px-2 py-2 mx-1 dark:text-white light:text-amber-800 hover:text-amber-600 transition-colors duration-300"
          >
            <User size={20} />
          </button>

          <button
            onClick={toggleMenu}
            className="block lg:hidden px-2 py-2 mx-1 dark:text-white light:text-amber-800 hover:text-amber-600 transition-colors duration-300"
          >
            <MenuIcon size={20} />
          </button>
        </div>

        {/* Search Form */}
        <SearchForm isOpen={isSearchOpen} />

        {/* Shopping Cart */}
        <ShoppingCartPanel isOpen={isCartOpen} />

        {/* User Panel */}
        <UserPanel
          isOpen={isUserPanelOpen}
          showRegisterForm={showRegisterForm}
          setShowRegisterForm={setShowRegisterForm}
        />
      </div>
    </nav>
  );
}
