import * as React from "react"
import Slider from "react-slick"

import "../styles/slick.min.css"
import "../styles/slick-theme.css"

interface SlideProps {
  children: React.ReactNode
  className?: string
}

const Slide = ({ children, className }: SlideProps) => (
  <div
    className={[
      "h-64 flex justify-center place-items-center text-xl xl:text-2xl px-32 py-8 text-center text-white",
      className,
    ].join(" ")}
    style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)" }}
  >
    <span>{children}</span>
  </div>
)

const Carousel = () => (
  <Slider
    autoplay
    autoplaySpeed={5000}
    dots
    className="rounded shadow overflow-hidden my-8"
  >
    <Slide className="bg-primary-600">
      <strong>Chemie verstehen:</strong> Wir versuchen Schüler:innen Chemie als
      Wissenschaft zu vermitteln
    </Slide>
    <Slide className="bg-secondary-600">
      <strong>Unterricht erneuern:</strong> Wir erforschen an der Praxis neue
      Unterrichtskonzepte und orientieren uns an aktuellen Herausforderungen
    </Slide>
    <Slide className="bg-primary-600">
      <strong>Theorie-Praxis Transfer:</strong> Hier erhalten Sie kostenlos neue
      fachdidaktisch erprobte und erforschte Unterrichtskonzepte
    </Slide>
    <Slide className="bg-secondary-600">
      Wir bilden die Chemielehrer:innen von morgen aus
    </Slide>
  </Slider>
)

export default Carousel
