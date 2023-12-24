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
} from "@fortawesome/free-solid-svg-icons"
import Image, { StaticImageData } from "next/image"
import { MouseEventHandler, useEffect, useRef, useState } from "react"
import Slider from "@/components/Slide"
import Button, {
  ButtonStyle,
  ButtonProps,
  ButtonType,
} from "@/components/Button/Button"
import anh1 from "./anh1.png"
import axios from "axios"
import api from "@/api"
import GoogleMapReact from "google-map-react"
import { useRouter } from "next/navigation"

//data

interface kbt1Item {
  icon: IconDefinition
  des: string
}
interface pkhucItem {
  // image: StaticImageData | string
  pkhuc: string
  des: string
}
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

interface PoolProps {
  pool: PoolModel
}
const kbt1Data: Array<kbt1Item> = [
  { icon: faArrowUpFromBracket, des: "View nhìn ra sông Hồng" },
  { icon: faArrowUpFromBracket, des: "Kiến trúc độc đáo" },
  { icon: faArrowUpFromBracket, des: "Kết nối với thiên nhiên" },
  { icon: faArrowUpFromBracket, des: "Menu đa dạng" },
  { icon: faArrowUpFromBracket, des: "Trải nghiệm thư giãn và tâm trạng " },
  { icon: faArrowUpFromBracket, des: "Minigame thú vị" },
]
const pkhucData: Array<pkhucItem> = [
  {
    pkhuc: "Bể bơi dành cho người lớn",
    des: "Bể bơi có độ sâu từ 1m5 đến 2m thích hợp cho người lớn...",
  },
  {
    pkhuc: "Bể bơi dành cho người lớn",
    des: "Bể bơi có độ sâu từ 1m5 đến 2m thích hợp cho người lớn...",
  },
  {
    pkhuc: "Bể bơi dành cho người lớn",
    des: "Bể bơi có độ sâu từ 1m5 đến 2m thích hợp cho người lớn...",
  },
]

//main export
export default function Pool({ params }: { params: { id: string } }) {
  const [pool, setPool] = useState<PoolModel>()
  useEffect(() => {
    axios(`${api}/pool/${params.id}`)
      .then((res) => {
        setPool(res.data)
      })
      .catch((err) => {
        return <h1>Khong tim thay be boi nay</h1>
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
        <Detail pool={pool} />
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
function Detail({ pool }: PoolProps) {
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, "0")
  var mm = String(today.getMonth() + 1).padStart(2, "0")
  var yyyy = today.getFullYear()
  const [date, setDate] = useState(yyyy + "-" + mm + "-" + dd)

  const [numAdult, setNumAdult] = useState<number>(0)
  const [numChild, setNumChild] = useState<number>(0)
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
    let data = `/thanhtoan?na=${numAdult}&nc=${numChild}&p_id=${pool.id}&date=${date}`
    router.push(data)
  }

  const defaultProps = {
    center: {
      lat: 10.99835602,
      lng: 77.01502627,
    },
    zoom: 11,
  }
  return (
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
                {`Giá vé: Người lớn ${pool.tickets[0].price}VNĐ/người, trẻ em ${pool.tickets[1].price}VNĐ/người`}
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
            <span>Hien thi them...</span>
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
                <input type="date" onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className={styles.ticketPicker}>
                <div className={styles.nglon}>
                  <strong>Người lớn</strong>
                  <div className={styles.numbers}>
                    <p onClick={handleCongAdult}>+</p>
                    <span>{numAdult}</span>
                    <p onClick={handleTruAdult}>-</p>
                  </div>
                </div>
                <div className={styles.treem}>
                  <strong>Trẻ em</strong>
                  <div className={styles.numbers}>
                    <p onClick={handleCongChild}>+</p>
                    <span>{numChild}</span>
                    <p onClick={handleTruChild}>-</p>
                  </div>
                </div>
              </div>
            </div>
            <Button
              btnStyle={ButtonStyle.primary}
              content="Đặt vé ngày"
              priceForTicket={
                pool.tickets[0].price * numAdult +
                  pool.tickets[1].price * numChild || true
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
      <div className={styles.kbt1}>
        <h2>Nơi này có những gì dành cho bạn</h2>
        <div className={styles.kbt1Elements}>
          {kbt1Data.map((e, i) => {
            return (
              <div className={styles.kbt1Element} key={i}>
                <FontAwesomeIcon icon={e.icon} />
                <span>{e.des}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.phankhuc}>
        <h2>Phân khúc bể bơi</h2>
        <div className={styles.pkhucElements}>
          {pkhucData.map((e, i) => {
            return (
              <div className={styles.pkhucElement} key={i}>
                <Image src={anh1} alt="" width={300} />
                <span>{e.pkhuc}</span>
                <p>{e.des}</p>
              </div>
            )
          })}
        </div>
      </div>
      <div className={styles.map}>
        <h2 style={{ marginBottom: "20px" }}>Nơi bạn sẽ đến</h2>
        <div style={{ height: "400px", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyA66KwUrjxcFG5u0exynlJ45CrbrNe3hEc",
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
          >
            <div></div>
          </GoogleMapReact>
        </div>
      </div>
      <div className={styles.danhgia}></div>
      <div className={styles.binhluan}></div>
    </div>
  )
}
