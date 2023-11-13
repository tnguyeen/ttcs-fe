"use client"
import Head from "next/head"
import styles from "./Header.module.scss"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/public/logo.png"
import { useState } from "react"
import LoginBox from "../LoginBox/LoginBox"
import Button, { ButtonType, ButtonStyle } from "../Button/Button"

export default function Header() {
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
        <div className={styles.header}>
          <Link href="/" className={styles.logoWrapper}>
            <Image src={Logo} alt="logo" height={70} />
          </Link>
          <div className={styles.navbar}>
            <Button btnStyle={ButtonStyle.secondary} content="Phổ biến" />
          </div>
          <div className={styles.loginHeaderWrapper}>
            <Button
              btnStyle={ButtonStyle.secondary}
              content="Log in"
              func={showLogin}
            />
          </div>
        </div>
      </div>
      {login && (
        <div className={styles.loginWrapper}>
          <LoginBox />
          <h1 onClick={hideLogin}>X</h1>
        </div>
      )}
    </>
  )
}
