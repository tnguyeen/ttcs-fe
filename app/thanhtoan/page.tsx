"use client"
import Head from "next/head"
import styles from "./Thanhtoan.module.scss"
import Router from "next/router"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Button, { ButtonStyle, ButtonType } from "@/components/Button/Button"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import api from "@/api"
import Link from "next/link"
import { useSelector } from "react-redux"

interface PoolModel {
  id: number
  name: string
  location: string
  pools: Array<{
    id: number
    guest_type: string
    capacity: number
    pool_id: number
    name: string
    images: [
      {
        id: number
        pool_detail_id: number
        directus_files_id: string
      }
    ]
  }>
  tickets: Array<{
    id: number
    pool_id: number
    ticket_type: string
    ticket_name: string
    price: number
    total_ticket: number
  }>
  reviews: []
}

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

export default function Thanhtoan() {
  const searchParam = useSearchParams()
  const [pool, setPool] = useState<PoolModel>()
  const [userId, setUserId] = useState<string>("")
  const [name, setName] = useState("")
  const [sdt, setSdt] = useState("")
  const [email, setEmail] = useState("")
  const userLog = useSelector((state: any) => state.token)

  function handleSubmit() {
    if (!userLog) {
      Swal.fire({
        // title: "The Internet?",
        text: "Bạn cần phải đăng nhập để thực hiện thanh toán!",
        icon: "error",
      })
      return
    }
    if (!pool) {
      Swal.fire({
        // title: "The Internet?",
        text: "Không tìm thấy bể bơi.",
        icon: "error",
      })
      return
    }
    if (name === "") {
      Swal.fire({
        // title: "The Internet?",
        text: "Vui lòng nhập tên.",
        icon: "error",
      })
      return
    }
    if (email === "") {
      Swal.fire({
        // title: "The Internet?",
        text: "Vui lòng nhập địa chỉ Email.",
        icon: "error",
      })
      return
    }
    if (sdt === "") {
      Swal.fire({
        // title: "The Internet?",
        text: "Vui lòng nhập số điện thoại.",
        icon: "error",
      })
      return
    }

    const data = {
      customer_id: userId,
      order_date: new Date().toJSON(),
      pool_id: searchParam.get("p_id"),
      tickets: {
        create: [
          searchParam.get("na") != "0" && {
            ticket_id: pool.tickets[0].id,
            quantity: Number(searchParam.get("na")),
            date_available: searchParam.get("date"),
            total_amount: null,
          },
        ],
        update: [],
        delete: [],
      },
      email_receiver: email,
      phone_number_receiver: sdt,
      total_amount: null,
    }
    if (searchParam.get("nc") != "0" && pool.tickets[1]) {
      data.tickets.create.push({
        ticket_id: pool.tickets[1].id,
        quantity: Number(searchParam.get("nc")),
        date_available: searchParam.get("date"),
        total_amount: null,
      })
    }

    axios
      .post(`${api}/items/order`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        let link = `${api}/order/create_payment_url?order_id=${res.data.data.id}&amount=${res.data.data.total_amount}`
        return axios.get(link)
      })
      .then((res) => {
        window.location = res.data.data.redirectUrl
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data.message,
        })
      })
  }

  useEffect(() => {
    if (searchParam.get("result")) {
      if (searchParam.get("result") == 'success') {
        Swal.fire({
          icon: "success",
          title: "Thanh toán thành công",
          showConfirmButton: false,
          timer: 3500,
          confirmButtonText: 'Xác nhận'
        }).then(function (result) {
          if (result.value) {
          }
        })
        setTimeout(() => {
          location.href = '/orders'
        }, 3500);
      } else {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: 'Thanh toán thất bại.',
          confirmButtonText: 'Xác nhận'
        }).then(function (result) {
          if (result.value) {
            location.href = '/orders'
          }
        })
        setTimeout(() => {
          location.href = '/orders'
        }, 3500);
      }
    }
    axios(`${api}/pool/${searchParam.get("p_id")}`)
      .then((res) => {
        setPool(res.data.data)
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: err.response.data.message,
          footer: '<a href="/">Trở về trang chủ</a>',
        })
      })
    axios
      .get(`${api}/users/me`, {
        headers: {
          Authorization: "Bearer " + userLog,
        },
      })
      .then((res) => {
        setName(res.data.data.first_name + " " + res.data.data.last_name)
        setEmail(res.data.data.email)
        setUserId(res.data.data.id)
      })
      .catch((err) => err)
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader}>
          <Link href="/" color="#22BFEA">
            Trang chủ
          </Link>
          <span>{`  >  `}</span>
          <Link href="" className={styles.mainHref}>
            {" "}
            Thanh toán
          </Link>
        </div>
        <div className={styles.main}>
          {pool && (
            <div className={styles.trai}>
              <div className={styles.tenPool}>
                <strong style={{ fontSize: 20 }}>{pool?.name}</strong>
              </div>
              <div className={styles.location}>{pool?.location}</div>
              <div className={styles.numAdult}>
                {`x${searchParam.get("na")}  ${pool.tickets[0].ticket_name}`}
                <p>{VND.format(pool.tickets[0].price)}</p>
              </div>
              {pool.tickets[1] && searchParam.get("nc") != '0' && (
                <div className={styles.numChild}>
                  {`x${searchParam.get("nc")}  ${pool.tickets[1].ticket_name} `}
                  <p>{VND.format(pool.tickets[1].price)}</p>
                </div>
              )}
              <div className={styles.date}>
                <p>Thời gian:</p>
                {searchParam.get("date")}
              </div>

              <div
                className={styles.total}
                style={{ flex: "auto", alignItems: "center" }}
              >
                <strong style={{ fontSize: 20 }}>Tổng tiền:</strong>
                {VND.format(
                  (pool.tickets[0] &&
                    pool.tickets[0].price * Number(searchParam.get("na"))) +
                  (pool.tickets[1]
                    ? pool.tickets[1].price * Number(searchParam.get("nc"))
                    : 0)
                )}
              </div>
            </div>
          )}
          <div className={styles.phai}>
            <div className={styles.tenPool}>
              <strong style={{ fontSize: 20 }}>Điền thông tin chi tiết</strong>
            </div>
            <div className={styles.ten}>
              <label htmlFor="ten">Họ và tên: </label>
              <input
                type="text"
                id="ten"
                value={name}
                placeholder="Vui lòng nhập tên"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.sdt}>
              <label htmlFor="sdt">Số điện thoại: </label>
              <input
                type="text"
                placeholder="Vui lòng nhập số điện thoại"
                id="sdt"
                value={sdt}
                onChange={(e) => setSdt(e.target.value)}
              />
            </div>
            <div className={styles.dchi}>
              <label htmlFor="dchi">Email: </label>
              <input
                type="text"
                id="dchi"
                placeholder="Vui lòng nhập địa chỉ email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div
          className={styles.xacNhan}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Button
            btnStyle={ButtonStyle.primary}
            content={"Thanh toán"}
            func={handleSubmit}
          />
        </div>
      </div></>
  )
}
