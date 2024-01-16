"use client"

// import

import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome"
import styles from "./Pool.module.scss"
import Imgs from "@/components/picture"
import {
  faArrowUpFromBracket,
  faHeart,
  faDotCircle,
  IconDefinition,
  faUtensils,
  faVest,
  faRing,
} from "@fortawesome/free-solid-svg-icons"
import Image, { StaticImageData } from "next/image"
import { MouseEventHandler, useEffect, useRef, useState } from "react"
import Slider from "@/components/Slide"
import Button, { ButtonStyle } from "@/components/Button/Button"
import axios from "axios"
import api from "@/api"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import GoogleMapReact from "google-map-react"

//data

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
      ticket_name: string
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
      ticket_name: string
      total_ticket: number
      ticket_remain: number
    }
  ]
  reviews: []
}

interface PoolProps {
  pool: PoolModel
}

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})
function iconService(name: string): IconDefinition {
  var iconR: IconDefinition = faUtensils
  switch (name) {
    case "Đồ ăn và đồ uống":
      iconR = faUtensils
      break
    case "Phao bơi":
      iconR = faRing
      break
    case "Đồ bơi":
      iconR = faVest
      break
    default:
      break
  }
  return iconR
}

//main export
export default function Pool({ params }: { params: { id: string } }) {
  const [pool, setPool] = useState<PoolModel>()
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, "0")
  var mm = String(today.getMonth() + 1).padStart(2, "0")
  var yyyy = today.getFullYear()
  const [date, setDate] = useState(yyyy + "-" + mm + "-" + dd)

  const [numAdult, setNumAdult] = useState<number>(0)
  const [numChild, setNumChild] = useState<number>(0)
  const position = { lat: 53.54, lng: 10 }
  const router = useRouter()

  function handleCongAdult() {
    setNumAdult(numAdult + 1)
  }
  function handleTruAdult() {
    if (numAdult == 0) return
    setNumAdult(numAdult - 1)
  }
  function handleCongChild() {
    setNumChild(numChild + 1)
  }
  function handleTruChild() {
    if (numChild == 0) return
    setNumChild(numChild - 1)
  }
  function handleThanhtoan() {
    if (!pool) return

    let data = `/thanhtoan?na=${numAdult}&nc=${numChild}&p_id=${
      pool!.id
    }&date=${date}`
    router.push(data)
  }
  function getCookie(cName: string) {
    const name = cName + "="
    const cDecoded = decodeURIComponent(document.cookie) //to be careful
    const cArr = cDecoded.split("; ")
    let res
    cArr.forEach((val) => {
      if (val.indexOf(name) === 0) res = val.substring(name.length)
    })
    return res
  }

  useEffect(() => {
    axios(`${api}/pool/${params.id}`)
      .then((res) => {
        setPool(res.data.data)
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data.message,
          footer: '<a href="/">Trở về trang chủ</a>',
        })
      })
  }, [params.id])
  if (!pool) {
    // redirect("/thanhtoan")
  }

  return (
    pool && (
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h1>{pool.name}</h1>
          <div className={styles.share}>
            <FontAwesomeIcon
              icon={faArrowUpFromBracket}
              className={styles.btnHeaderIcon}
            />
            <p>Chia sẻ</p>
          </div>
          <div className={styles.save}>
            <FontAwesomeIcon icon={faHeart} className={styles.btnHeaderIcon} />
            <p>Lưu</p>
          </div>
        </div>
        <div className={styles.detailWrapper}>
          <PoolPics />
          <div className={styles.detail}>
            <div className={styles.trai}>
              <div className={styles.tren}>
                <ul>
                  <li>
                    <FontAwesomeIcon
                      icon={faDotCircle}
                      className={styles.listIcon}
                    />
                    Địa điểm : {pool.location}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      icon={faDotCircle}
                      className={styles.listIcon}
                    />
                    {`Giá vé:  ${
                      pool.tickets[0] &&
                      pool.tickets[0].ticket_name +
                        " " +
                        VND.format(pool.tickets[0].price)
                    } /người` +
                      (pool.tickets[1]
                        ? `, ${pool.tickets[1].ticket_name} ${VND.format(
                            pool.tickets[1].price
                          )}/người`
                        : "")}
                  </li>
                  <li>
                    <FontAwesomeIcon
                      icon={faDotCircle}
                      className={styles.listIcon}
                    />
                    {`Giờ mở cửa: ${pool.opening_time}h - ${pool.closing_time}h`}
                  </li>
                </ul>
              </div>
              <div className={styles.duoi}>
                <h2>{pool.name}</h2>
                <p>{pool.description}</p>
                <span>Hiển thị thêm...</span>
              </div>
            </div>
            <div className={styles.phai}>
              <div className={styles.main}>
                <div className={styles.formjday}>
                  <div className={styles.datePicker}>
                    <strong style={{ color: "white" }}>
                      Chọn ngày
                      {": " + date}
                    </strong>
                    <input
                      type="date"
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className={styles.ticketPicker}>
                    <div
                      className={styles.nglon}
                      style={
                        pool.tickets[1]
                          ? {}
                          : { borderWidth: "0px", padding: "0 20px" }
                      }
                    >
                      <strong>{pool.tickets[0].ticket_name}</strong>
                      <div className={styles.numbers}>
                        <p onClick={handleCongAdult}>+</p>
                        <span>{numAdult}</span>
                        <p onClick={handleTruAdult}>-</p>
                      </div>
                    </div>
                    {pool.tickets[1] && (
                      <div className={styles.treem}>
                        <strong>{pool.tickets[1].ticket_name}</strong>
                        <div className={styles.numbers}>
                          <p onClick={handleCongChild}>+</p>
                          <span>{numChild}</span>
                          <p onClick={handleTruChild}>-</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  btnStyle={ButtonStyle.primary}
                  content="Đặt vé ngày"
                  priceForTicket={
                    (pool.tickets[0] && pool.tickets[0].price * numAdult) +
                      (pool.tickets[1]
                        ? pool.tickets[1].price * numChild
                        : 0) || true
                  }
                  func={handleThanhtoan}
                />
                <Button
                  btnStyle={ButtonStyle.primary}
                  content="Đặt vé tháng"
                  priceForTicket={2000000}
                />
              </div>
            </div>
          </div>
          {pool.services.length ? (
            <div className={styles.service}>
              <h2>Nơi này có những gì dành cho bạn</h2>
              <div className={styles.serviceElements}>
                {pool.services.map((e, i) => {
                  return (
                    <div className={styles.kbt1Element} key={i}>
                      <FontAwesomeIcon icon={iconService(e.service_id.name)} />
                      <span>{e.service_id.name}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <section></section>
          )}
          {pool.pools.length ? (
            <div className={styles.phankhuc}>
              <h2>Phân khúc bể bơi</h2>
              <div className={styles.pkhucElements}>
                {pool.pools.map((e, i) => {
                  return (
                    <div className={styles.pkhucElement} key={i}>
                      <Image
                        src={`https://froakie.io.vn/assets/${e.images[0].directus_files_id}`}
                        alt=""
                        width={300}
                        height={200}
                      />
                      <span>{e.name}</span>
                      <p>{e.description}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <section></section>
          )}
          <div className={styles.map}>
            <h2 style={{ marginBottom: "20px" }}>Nơi bạn sẽ đến</h2>
            {/* <APIProvider apiKey="AIzaSyApZGB7UJRujOnfvwOrVE1-PfPA6ky4gvE">
              <div style={{ height: "400px", width: "100%" }}>
                <Map
                  zoom={9}
                  center={position}
                  gestureHandling={"greedy"}
                  disableDefaultUI={true}
                />
              </div>
            </APIProvider> */}
            <div style={{ height: "400px", width: "100%" }}>
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyApZGB7UJRujOnfvwOrVE1-PfPA6ky4gvE",
                }}
                defaultCenter={{
                  lat: 10.99835602,
                  lng: 77.01502627,
                }}
                defaultZoom={11}
              ></GoogleMapReact>
            </div>
          </div>
          <div className={styles.danhgia}></div>
          <div className={styles.binhluan}></div>
        </div>
        <div className={styles.suggest}></div>
      </div>
    )
  )
}

//functions

function PoolPics() {
  const [active, setActive] = useState<boolean>(false)
  const [current, setCurrent] = useState<number>(0)
  function handleClose() {
    setActive(false)
  }
  return (
    <div className={styles.pics}>
      {Imgs.map((slide, i) => {
        if (i > 4) return
        return (
          <div
            key={i}
            className={styles[`item${i + 1}`] + " " + styles.img}
            style={{ backgroundImage: `url("${slide.src}")` }}
            onClick={() => {
              setActive(true)
              setCurrent(i)
            }}
          ></div>
        )
      })}
      {active && (
        <Slider handleClose={handleClose} index={current} imgs={Imgs} />
      )}
    </div>
  )
}
