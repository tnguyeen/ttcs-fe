"use client"
import Head from "next/head"
import styles from "./Thanhtoan.module.scss"
import Router from "next/router"
import {
  ChangeEvent,
  EventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react"
import LoginBox from "@/components/LoginBox/LoginBox"
import Button, { ButtonStyle, ButtonType } from "@/components/Button/Button"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import api from "@/api"
import Link from "next/link"

interface PoolModel {
  id: number
  status: string
  sort: string
  user_created: string
  date_created: string
  user_updated: string
  date_updated: string
  name: string
  host_id: string
  longtitude: number
  latitude: number
  location: string
  rentable: false
  opening_time: number
  closing_time: number
  description: string
  rating: number
  location_searching: string
  pools: [
    {
      id: number
      status: string
      sort: string
      user_created: string
      date_created: string
      user_updated: string
      date_updated: string
      depth: number
      length: number
      width: number
      quantity: number
      description: string
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
    },
    {
      id: number
      status: string
      sort: string
      user_created: string
      date_created: string
      user_updated: null
      date_updated: null
      depth: number
      length: number
      width: number
      quantity: number
      description: string
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
    }
  ]
  images: [
    {
      id: number
      pool_id: number
      directus_files_id: string
    }
  ]
  services: [
    {
      service_id: {
        name: string
      }
    },
    {
      service_id: {
        name: string
      }
    },
    {
      service_id: {
        name: string
      }
    }
  ]
  orders: [1]
  tickets: [
    {
      id: number
      status: string
      sort: string
      user_created: string
      date_created: string
      user_updated: string
      date_updated: string
      pool_id: number
      ticket_type: string
      price: number
      total_ticket: number
      ticket_remain: number
    },
    {
      id: number
      status: string
      sort: string
      user_created: string
      date_created: string
      user_updated: string
      date_updated: string
      pool_id: number
      ticket_type: string
      price: number
      total_ticket: number
      ticket_remain: number
    }
  ]
  reviews: []
}

export default function Thanhtoan() {
  const searchParam = useSearchParams()
  const [pool, setPool] = useState<PoolModel>()
  const [pttt, setPttt] = useState<string>("")
  const [name, setName] = useState("")
  const [sdt, setSdt] = useState("")
  const [dchi, setDchi] = useState("")

  function handlechange() {
    const data = {
      name: name,
      sdt: sdt,
      dchi: dchi,
      pttt: pttt,
    }
    console.log(data)
  }

  useEffect(() => {
    axios(`${api}/pool/${searchParam.get("p_id")}`)
      .then((res) => {
        setPool(res.data)
      })
      .catch((err) => {
        return <h1>Khong tim thay be boi nay</h1>
      })
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.mainHeader}>
        <Link href="/" color="#22BFEA">
          Trang chủ
        </Link>
        <span>{`  >  `}</span>
        <Link href="" className={styles.mainHref}>
          {" "}
          Thanh toans
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
              {`x${searchParam.get("na")}  Người lớn`}
              <p>{pool.tickets[0].price + " VND"}</p>
            </div>
            <div className={styles.numChild}>
              {`x${searchParam.get("nc")}  Trẻ em`}
              <p>{pool.tickets[1].price + " VND"}</p>
            </div>
            <div className={styles.date}>
              <p>Thời gian:</p>
              {searchParam.get("date")}
            </div>

            <div
              className={styles.total}
              style={{ flex: "auto", alignItems: "center" }}
            >
              <strong style={{ fontSize: 20 }}>Tổng tiền:</strong>
              {pool!.tickets[0].price * Number(searchParam.get("na")) +
                pool!.tickets[1].price * Number(searchParam.get("nc")) +
                " VND"}
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
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={styles.sdt}>
            <label htmlFor="sdt">Số điện thoại: </label>
            <input
              type="text"
              id="sdt"
              value={sdt}
              onChange={(e) => setSdt(e.target.value)}
            />
          </div>
          <div className={styles.dchi}>
            <label htmlFor="dchi">Địa chỉ: </label>
            <input
              type="text"
              id="dchi"
              value={dchi}
              onChange={(e) => setDchi(e.target.value)}
            />
          </div>
          <div className={styles.pttt} style={{ display: "flex" }}>
            Phương thức thanh toán:
            <div style={{ marginRight: "20px" }}>
              <input
                type="radio"
                id="vnPay"
                value="vnPay"
                name="ptttRadio"
                style={{ margin: "0 10px" }}
                onChange={(e) => setPttt(e.target.value)}
              />
              <label htmlFor="vnPay">VNPay</label>
              <br></br>
              <br></br>
              <input
                type="radio"
                id="tttt"
                value="tttt"
                name="ptttRadio"
                style={{ margin: "0 10px" }}
                onChange={(e) => setPttt(e.target.value)}
              />
              <label htmlFor="tttt">Thanh toán trực tiếp</label>
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.xacNhan}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Button
          btnStyle={ButtonStyle.primary}
          content={"Xác nhận thông tin"}
          func={handlechange}
        />
      </div>
    </div>
  )
}
