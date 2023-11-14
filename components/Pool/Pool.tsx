"use client"
import { useRef, useState } from "react"
import styles from "./Pool.module.scss"
import Image from "next/image"
import Pic from "./searchSec.jpg"

export interface PoolProps {
  images: any
  name: string
  location: string
}

export default function Pool({ images, name, location }: PoolProps) {
  return (
    <div className={styles.wrapper}>
      <Image
        className={styles.pic}
        src={`https://froakie.io.vn/assets/` + images}
        alt="pic"
        height={290}
        width={300}
      />
      <span className={styles.name}>{name}</span>
      <span className={styles.location}>{location}</span>
    </div>
  )
}
