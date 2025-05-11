"use client"
import Image from "next/image"
import { Coffee } from "lucide-react"
import { useInView } from "react-intersection-observer"

export default function About() {
  const [titleRef, titleInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [imageRef, imageInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [contentRef, contentInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section id="about" className="about py-16 dark:bg-black light:bg-gray-50">
      <div className="container mx-auto px-4">
        <h2
          ref={titleRef}
          className={`text-3xl md:text-4xl font-bold text-center mb-10 transition-opacity duration-500 dark:text-white light:text-gray-900 ${
            titleInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="text-amber-600 dark:text-amber-500 light:text-amber-700">&lt;Tentang </span>Kami/&gt;
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div
            ref={imageRef}
            className={`about-img relative h-[300px] md:h-[400px] rounded-lg overflow-hidden transition-all duration-500 shadow-xl ${
              imageInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <Image src="/img/background.png" alt="Tentang Kami" fill className="object-cover" />
          </div>

          <div
            ref={contentRef}
            className={`content transition-all duration-500 delay-300 ${
              contentInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            }`}
          >
            <h3 className="text-2xl font-bold mb-4 flex items-center dark:text-white light:text-amber-900">
              <Coffee className="text-amber-600 dark:text-amber-500 light:text-amber-700 mr-2" />
              Kenapa Memilih &lt;Caffeine/&gt;
            </h3>

            <div className="space-y-4">
              <p className="dark:text-gray-300 light:text-gray-700">
                &lt;Caffeine/&gt; bukan sekadar tempat ngopi—ini adalah basecamp-nya para developer. Suasana cozy, aroma
                kopi mengalun, playlist coding lo-fi, dan WiFi stabil. Cocok buat kamu yang lagi maraton ngoding,
                debugging error, atau sprint bareng tim.
              </p>

              <p className="dark:text-gray-300 light:text-gray-700">
                Mau ngulik <strong className="dark:text-amber-500 light:text-amber-700">Node.js</strong>,{" "}
                <strong className="dark:text-amber-500 light:text-amber-700">Express</strong>,
                <strong className="dark:text-amber-500 light:text-amber-700"> React</strong>,{" "}
                <strong className="dark:text-amber-500 light:text-amber-700"> Next.js</strong>,
                <strong className="dark:text-amber-500 light:text-amber-700"> React Native</strong>, atau backend pakai{" "}
                <strong className="dark:text-amber-500 light:text-amber-700"> Spring Framework</strong>,
                <strong className="dark:text-amber-500 light:text-amber-700"> Laravel</strong>,{" "}
                <strong className="dark:text-amber-500 light:text-amber-700"> Django</strong>,
                <strong className="dark:text-amber-500 light:text-amber-700"> Go</strong>, sampai{" "}
                <strong className="dark:text-amber-500 light:text-amber-700"> ASP.NET</strong>? Semua stack nyaman
                dikerjain di sini.
              </p>

              <p className="dark:text-gray-300 light:text-gray-700">
                Bikin API, desain UI pakai{" "}
                <strong className="dark:text-amber-500 light:text-amber-700">Tailwind</strong>, testing pakai{" "}
                <strong className="dark:text-amber-500 light:text-amber-700">Jest</strong>, deploy ke{" "}
                <strong className="dark:text-amber-500 light:text-amber-700">Vercel</strong> atau{" "}
                <strong className="dark:text-amber-500 light:text-amber-700">Docker</strong>—semua bisa kamu lakukan
                sambil ngopi dan nge-push ke GitHub.
              </p>

              <p className="dark:text-gray-300 light:text-gray-700">
                Dan tenang aja, kami nggak cuma punya kopi. Ada juga <em>non-coffee drinks</em> kayak matcha dan coklat,
                <em> snack ringan</em> buat nemenin bug fixing, <em>makanan berat</em> mulai dari western food seperti
                pizza & spaghetti, makanan khas Indonesia seperti nasi goreng & ayam geprek, sampai{" "}
                <em>instant food</em>
                favorit para coder: Indomie!
              </p>

              <p className="dark:text-gray-300 light:text-gray-700">
                Di &lt;Caffeine/&gt;, setiap baris kode punya cerita. Tempat ini bukan cuma ngasih koneksi internet,
                tapi juga koneksi ide dan semangat. Yuk, bikin project impianmu jadi kenyataan—satu kopi, satu commit,
                satu inovasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
