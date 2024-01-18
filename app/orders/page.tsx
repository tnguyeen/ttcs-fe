"use client"
import SearchPool from "@/components/SearchPool/SearchPool"
import Pool, { PoolProps } from "@/components/Pool/Pool"
import styles from "./Profile.module.scss"
import { useEffect, useState } from "react"
import ReactPaginate from "react-paginate"
import Link from "next/link"
import Image from "next/image"
import axios from "axios"
import api from "@/api"
import { useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import defava from "./defava.jpg"
import Button, { ButtonStyle } from "@/components/Button/Button"

interface UserModel {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  description: string
  avatar: string
}
interface OrderModel {
  id: number
  date_created: string
  customer_id: string
  order_date: string
  pool_id: number
  email_receiver: string
  phone_number_receiver: string
  total_amount: number
  order_status: string
  tickets: Array<{ date_available: string }>
}
type OrderProp = {
  order: OrderModel
}
const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})
const resultsFilters: Array<{ filter: string; id: number }> = [
  // { filter: "Đề xuất của chúng tôi", id: 1 },
  { filter: "Tất cả", id: 1 },
  { filter: "Chưa thanh toán", id: 2 },
]
function formatDate(initdate: string, full: boolean) {
  var date = new Date(initdate)
  var hours = date.getHours()
  hours = hours ? hours : 24 // the hour '0' should be '12'
  var strTime = full ? hours + "h  Ngày:" : ""
  return (
    strTime +
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear()
  )
}

export default function Profile() {
  const [user, setUser] = useState<UserModel>()
  const [orders, setOrders] = useState<Array<OrderModel>>([])
  const [displayOrders, setDisplayOrders] = useState<Array<OrderModel>>([])
  const token = useSelector((state: any) => state.token)
  const [currentTab, setCurrentTab] = useState<number>(1)

  const hdClickRF = (e: number) => {
    setCurrentTab(e)
    if (e == 1) {
      setDisplayOrders(orders)
    } else {
      setDisplayOrders(orders.filter((e) => e.order_status != "00"))
    }
  }

  useEffect(() => {
    axios
      .get(`${api}/users/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setUser(res.data.data)
        return axios.get(
          `${api}/items/order?fields=*,tickets.*&filter[customer_id]=${res.data.data.id}`
        )
      })
      .then((res) => {
        setOrders(res.data.data)
        setDisplayOrders(res.data.data)
      })
      .catch((err) => console.log(err))
  }, [token])

  if (!user) {
    return
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.sec1}>
          <Image
            src={defava}
            height={260}
            width={360}
            alt=""
            className={styles.ava}
          />
          <div className={styles.info}>
            <h2>{user?.first_name + " " + user?.last_name}</h2>
          </div>
        </div>
        <div className={styles.sec2}>
          <div className={styles.resultsFilter}>
            {resultsFilters.map((e, i) => (
              <span
                key={i}
                onClick={(a) => hdClickRF(e.id)}
                className={e.id === currentTab ? styles.selected : ""}
              >
                {e.filter}
              </span>
            ))}
          </div>
          {displayOrders.length == 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                columnSpan: "all",
              }}
            >
              <h2 style={{ textAlign: "center" }}>Không có vé để hiển thị.</h2>
            </div>
          ) : (
            <div className={styles.orders}>
              {displayOrders.map((e, i) => {
                return <Order key={i} order={e} />
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function Order({ order }: OrderProp) {
  const [poolname, setPoolname] = useState<string>()
  function handleClick(id: number, amount: number) {
    let link = `${api}/order/create_payment_url?order_id=${id}&amount=${amount}`
    axios
      .get(link)
      .then((res) => {
        window.open(res.data.data.redirectUrl, "_ blank")
      })
      .catch((err) => err)
  }

  useEffect(() => {
    axios
      .get(`${api}/pool/${order.pool_id}`)
      .then((res) => {
        setPoolname(res.data.data.name)
      })
      .catch((err) => err)
  }, [])

  return (
    <div className={styles.order}>
      <div
        className={styles.main}
        style={
          order.order_status == "00"
            ? { backgroundColor: "#138636e8" }
            : { backgroundColor: "#c91432e8" }
        }
      >
        <div>
          <h3 style={{ fontSize: "20px" }}>{poolname}</h3>
          <h4>
            {"Thời gian hiệu lực : " +
              formatDate(order.tickets[0].date_available, false)}
          </h4>
        </div>
        <div className={styles.sec22}>
          <p>{"Email: " + order.email_receiver}</p>
          <p>{"Thời gian tạo : " + formatDate(order.date_created, true)}</p>
        </div>
        <div className={styles.sec3}>
          <h3>{"Tổng : " + VND.format(order.total_amount)}</h3>
          <Button
            content={
              order.order_status == "00" ? "Đã thanh toán" : "Thanh toán ngay"
            }
            btnStyle={
              order.order_status == "00"
                ? ButtonStyle.secondary
                : ButtonStyle.primary
            }
            dis={order.order_status == "00" ? true : false}
            func={(e) => handleClick(order.id, order.total_amount)}
          />
        </div>
      </div>
    </div>
  )
}
