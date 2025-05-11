"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section id="home" className="hero pt-32 pb-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 dark:from-black/70 dark:to-black/30 light:from-amber-800/40 light:to-amber-700/20 z-0"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 dark:opacity-50 light:opacity-30 z-[-1]"
        style={{ backgroundImage: "url('/img/background.png')" }}
      ></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-opacity duration-500 dark:text-white light:text-amber-900 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            Rasakan Energi{" "}
            <span className="text-amber-600 dark:text-amber-500 light:text-amber-700">&lt;Caffeine/&gt;</span>
          </h1>
          <p
            className={`text-base md:text-lg lg:text-xl mb-8 transition-opacity duration-500 delay-300 dark:text-gray-300 light:text-gray-800 ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            Kopi sekuat semangat ngoding, hidangan lokal & western, dan vibes pas buat debugging. Ngulik stack seperti
            Node.js, Express, React, Next.js, React Native, Spring, Laravel, Django, Go, ASP.NET? Semua bisa dikerjain
            di sini. Desain UI pakai Tailwind, testing pakai Jest, deploy ke Vercel atau Docker—semua sambil ngopi,
            nge-push ke GitHub, dan bikin project impian jadi kenyataan.
          </p>
          <Link
            href="#menu"
            className={`inline-block px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 dark:from-amber-600 dark:to-amber-500 dark:hover:from-amber-700 dark:hover:to-amber-600 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            Beli Sekarang
          </Link>
        </div>
      </div>
    </section>
  )
}
