"use client"
import Head from "next/head"
import styles from "./Footer.module.scss"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/public/logo.png"
import { useState } from "react"
import LoginBox from "../LoginBox/LoginBox"
import Button, { ButtonType, ButtonStyle } from "../Button/Button"

const actions: Array<string> = [
  "Help",
  "FAQ",
  "Customer Service",
  "How to guild",
  "Contact Us",
]

export default function Footer() {
  const [login, setLogin] = useState<Boolean>(false)

  const showLogin = () => {
    setLogin(true)
  }
  const hideLogin = () => {
    setLogin(false)
  }
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.footer}>
          <div className={styles.tenCty}>
            <h1>AQUARIUS</h1>
            <h4>Aquarius - All rights reserved © 2023</h4>
          </div>
          <ul className={styles.actions}>
            {actions.map((e, i) => {
              return <li key={i}>{e}</li>
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
