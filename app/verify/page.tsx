"use client"
import Head from "next/head"
import styles from "./Verify.module.scss"
import Router from "next/router"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Button, { ButtonStyle, ButtonType } from "@/components/Button/Button"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import api from "@/api"
import Link from "next/link"
import { useSelector } from "react-redux"

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

export default function Verify() {
  const searchParam = useSearchParams()

  useEffect(() => {
    console.log(searchParam.get("token"))
    axios
      .post(`${api}/users/activate`, {
        token: searchParam.get("token"),
      })
      .then((res) => {
        setTimeout(() => {
          Swal.fire({
            title: "Đã xác thực tài khoản",
            text: "Tài khoản đã có thể đăng nhập",
            confirmButtonText: "Xác nhận",
          }).then(function (result) {
            window.location.href = "/"
          })
        }, Math.floor(Math.random() * 4000))
      })
      .catch((err) => err)
  }, [])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "54vh",
      }}
    >
      <span className={styles.loader}></span>
    </div>
  )
}
