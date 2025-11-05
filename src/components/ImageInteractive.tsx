

import { useEffect, useState } from "react";

import '../styles/ImageInteractive.css'

import { images } from "../utils/importImage";

interface ImageInteractiveProps {
  logo: string,
  category: string,
}

function ImageInteractive({ logo, category }: ImageInteractiveProps) {
  const [ currentSrc, setCurrentSrc ] = useState<string>(images[logo + "_" + category] || images[logo + "_Default"]);
  const [ slideState, setSlideState ] = useState<"exit" | "enter" | "idle">("idle");

  useEffect(() => {
    const newSrc = images[logo + "_" + category] || images[logo + "_Default"]
    if ( newSrc === currentSrc ) return

    setSlideState("exit")

    const tim1 = setTimeout(() => {
      setCurrentSrc(newSrc)
      setSlideState("enter")
    }, 300)

    const tim2 = setTimeout(() => {
      setSlideState("idle")
    }, 600)

    return () => {
      clearTimeout(tim1)
      clearTimeout(tim2)
    }

  }, [logo, category])

  return (
    <img
      className={`img-logo-${logo} slide-${slideState}`}
      src={currentSrc}
      alt={category}
    />
  )
}

export default ImageInteractive;