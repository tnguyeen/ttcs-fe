"use client"
import Head from "next/head"
import styles from "./Host.module.scss"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/public/logo.png"
import { useState } from "react"
import LoginBox from "../LoginBox/LoginBox"
import Button, { ButtonType, ButtonStyle } from "../Button/Button"

export default function Host() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h2>Đăng kí bể bơi của bạn trên Aquarius</h2>
          <Button
            type={ButtonType.button}
            btnStyle={ButtonStyle.primary}
            content="Tạo bể bơi"
            func={() => { location.href = '/registpool' }}
          />
        </div>
      </div>
    </>
  )
}
