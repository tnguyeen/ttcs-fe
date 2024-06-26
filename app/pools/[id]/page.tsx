"use client"

// import

import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome"
import styles from "./Pool.module.scss"
import {
  faArrowUpFromBracket,
  faHeart,
  faDotCircle,
  IconDefinition,
  faUtensils,
  faVest,
  faRing,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons"
import Image, { StaticImageData } from "next/image"
import { MouseEventHandler, useEffect, useRef, useState } from "react"
import Slider from "@/components/Slide"
import Button, { ButtonStyle } from "@/components/Button/Button"
import axios from "axios"
import SugPool from "@/components/Pool/Pool"
import api from "@/api"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"
import { Rating } from "react-simple-star-rating"
import {
  APIProvider,
  Map,
  useMapsLibrary,
  Marker,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps"

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
  pools: Array<
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
    }
  >
  images: [
    {
      id: number
      pool_id: number
      directus_files_id: string
    }
  ]
  services: Array<
    {
      service_id: {
        icon: string
        name: string
      }
    }
  >
  orders: [1]
  tickets: Array<
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
    }
  >
  reviews: Array<any>
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
  const [suggestPool, setSuggestPool] = useState<Array<PoolModel>>([])
  var today = new Date()
  var dd = String(today.getDate()).padStart(2, "0")
  var mm = String(today.getMonth() + 1).padStart(2, "0")
  var yyyy = today.getFullYear()
  const [date, setDate] = useState(yyyy + "-" + mm + "-" + dd)

  const [numAdult, setNumAdult] = useState<number>(0)
  const [numChild, setNumChild] = useState<number>(0)

  const [showinfoLocation, setShowinfoLocation] = useState(false);

  const [limitRv, setLimitRv] = useState(4)
  const [btnLimit, setBtnLimit] = useState(true)

  const router = useRouter()

  function getMinDate() {
    var dtToday = new Date();

    var month = dtToday.getMonth() + 1;
    var day = dtToday.getDate();
    var year = dtToday.getFullYear();
    var montha
    var daya
    if (month < 10) {
      montha = '0' + month.toString();
    } else {
      montha = month.toString()
    }
    if (day < 10) {
      daya = '0' + day.toString();
    } else {
      daya = day.toString();
    }
    var maxDate = year + '-' + montha + '-' + daya;
    return maxDate
  }
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

    if (numAdult == 0 && numChild == 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Bạn cần chọn ít nhất 1 vé',
        confirmButtonText: 'Xác nhận'
      }).then(function (result) {
        if (result.value) {
        }
      })
      return
    }
    if (!pool) return
    let data = `/thanhtoan?na=${numAdult}&nc=${numChild}&p_id=${pool!.id
      }&date=${date}`
    router.push(data)
  }

  useEffect(() => {
    axios(`${api}/pool/${params.id}`)
      .then((res) => {
        setPool(res.data.data)
        return axios.get(
          `${api}/pool?limit=3&location=${res.data.data.location_searching.split(",").pop()
          }`
        )
      })
      .then((res) => {
        setSuggestPool(res.data.data.filter((e: PoolModel) => e.id != Number(params.id)))
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: 'Không tồn tại bể bơi này',
          footer: '<a href="/">Trở về trang chủ</a>',
        })
      })
  }, [params.id])

  if (!pool) {
    return
  }

  return (
    <>
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
          {/* <div className={styles.save}>
            <FontAwesomeIcon icon={faHeart} className={styles.btnHeaderIcon} />
            <p>Lưu</p>
          </div> */}
        </div>
        <div className={styles.detailWrapper}>
          <PoolPics images={pool.images} />
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
                    {`Giá vé:  ${pool.tickets[0] &&
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
                    {`Giờ mở cửa: ${pool.opening_time} giờ - ${pool.closing_time} giờ`}
                  </li>
                </ul>
              </div>
              <div className={styles.duoi}>
                <h2>{pool.name}</h2>
                <div>{(pool.description)}</div>
                {/* <span>Hiển thị thêm...</span> */}
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
                      min={getMinDate()}
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
                      <Image src={`${api}/assets/${e.service_id.icon}`} alt="" width={50} height={50} />
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
                      <span style={{ fontWeight: "500" }}>{e.name}</span>
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
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GG_API_KEY!}>
              <div style={{ height: "700px", width: "100%" }}>
                <Map zoom={15} center={{ lat: pool.latitude, lng: pool.longtitude }}>
                  <Marker position={{ lat: pool.latitude, lng: pool.longtitude }} onClick={() => setShowinfoLocation(true)} >

                  </Marker>
                  {showinfoLocation && <InfoWindow position={{ lat: pool.latitude + 0.0018, lng: pool.longtitude }} onCloseClick={() => setShowinfoLocation(false)} >
                    <div style={{ width: '160px', height: '100px' }}>
                      <p style={{ fontSize: '16px' }}>{pool.name}</p><br />
                      {pool.location.split(',').map(e => <><span>{e}</span><br /></>)}
                    </div>
                  </InfoWindow>}
                </Map>
              </div>
            </APIProvider>
          </div>
          <div className={styles.danhgia}>
            <h2 style={{ marginRight: "20px" }}>Đánh giá:</h2>
            <Rating
              initialValue={pool.rating}
              allowFraction
              disableFillHover={true}
              allowHover={false}
            />
            <h2 style={{ marginLeft: "20px" }}>{pool.rating} trên 5</h2>
          </div>
          <div className={styles.binhluan}>
            <div className={styles.main}>
              {pool.reviews && pool.reviews.map((e, i) => {
                if (i < limitRv) {
                  return <Review rv={e} />
                }
              })}
            </div>
            {(btnLimit && (pool.reviews.length > 4)) ? <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                border: '1px solid black',
                borderRadius: '15px',
                width: '240px',
                justifyContent: 'center',
                cursor: 'pointer',
                marginTop: '20px'
              }}
              onClick={() => {
                setLimitRv(10000000000)
                setBtnLimit(false)
              }}
            >
              <p style={{ fontSize: '22px', fontWeight: '500' }}>Hiển thị thêm</p>
              <FontAwesomeIcon icon={faAnglesRight} />
            </div> : <></>}
          </div>
        </div>
        <div className={styles.suggest}>
          <h2 style={{ margin: "20px" }}>Bể bơi lân cận</h2>
          <div className={styles.pkhucElements}>
            {suggestPool.map((e, i) => {
              return (
                <SugPool
                  key={i}
                  images={e.images[0].directus_files_id}
                  name={e.name}
                  location={e.location}
                  expand={false}
                  id={e.id}
                />
              )
            })}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px',
              border: '1px solid black',
              borderRadius: '15px',
              width: '240px',
              justifyContent: 'center',
              cursor: 'pointer',
              marginTop: '20px'
            }}
            onClick={() => {
              window.location.href = window.location.origin + `/pools?location=${pool.location.split(',').pop()}`
            }}
          >
            <p style={{ fontSize: '22px', fontWeight: '500' }}>Hiển thị thêm</p>
            <FontAwesomeIcon icon={faAnglesRight} />
          </div>
        </div>
      </div>
    </>
  )
}

//functions

function PoolPics({ images }: { images: Array<any> }) {
  const [active, setActive] = useState<boolean>(false)
  const [current, setCurrent] = useState<number>(0)
  function handleClose() {
    setActive(false)
  }
  return (
    <div className={styles.pics}>
      {images.map((img, i) => {
        if (i > 4) return
        return (
          <div
            key={i}
            className={styles[`item${i + 1}`] + " " + styles.img}
            style={{ backgroundImage: `url("${api}/assets/${img.directus_files_id}")` }}
            onClick={() => {
              setActive(true)
              setCurrent(i)
            }}
          ></div>
        )
      })}
      {active && (
        <Slider handleClose={handleClose} index={current} imgs={images} />
      )}
    </div>
  )
}


function Review({ rv }: { rv: any }) {
  const date = new Date(rv.date_created);

  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  const formattedDate = `${month} năm ${year}`;

  return (
    <div className={styles.review}>
      <div className={styles.header}>
        <div className={styles.ava} style={rv.user_created.avatar && { backgroundImage: `url("${api}/assets/${rv.user_created.avatar}")` }}></div>
        <h3>{rv.user_created.first_name + " " + rv.user_created.last_name}</h3>
      </div>
      <div className={styles.info}>
        <Rating
          initialValue={rv.total_rating}
          allowFraction
          disableFillHover={true}
          allowHover={false}
        />
        <p>{formattedDate}</p>
      </div>
      <div className={styles.content}>{rv.content}</div>
    </div>
  )
}