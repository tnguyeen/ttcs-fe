"use client"
import SearchPool from "@/components/SearchPool/SearchPool"
import Pool, { PoolProps } from "@/components/Pool/Pool"
import styles from "./Pools.module.scss"
import { useEffect, useState } from "react"
import ReactPaginate from "react-paginate"
import Link from "next/link"
import axios from "axios"
import api from "@/api"
import { useSearchParams } from "next/navigation"

interface serviceModel {
  code: string
  name: string
  id: number
}
interface priceModel {
  from_price: number
  to_price: number
  id: number
}
const resultsFilters: Array<{ filter: string; id: number }> = [
  // { filter: "Đề xuất của chúng tôi", id: 1 },
  { filter: "Được ưa chuộng nhất", id: 2 },
  { filter: "Giá thấp nhất", id: 3 },
]

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

function Items({ currentItems }: any) {
  return (
    <>
      {currentItems &&
        currentItems.map((e: PoolProps) => (
          <Pool
            id={e.id}
            images={e.images[0].directus_files_id}
            name={e.name}
            location={e.location}
            description={e.description}
            rating={e.rating}
            expand={true}
            tickets={e.tickets}
            key={e.id}
          />
        ))}
    </>
  )
}
const listTime: Array<any> = [
  { id: 'time1', open: 5, close: 20 },
  { id: 'time2', open: 8, close: 22 },
  { id: 'time3', open: 16, close: 22 },
]

export default function Pools() {
  const searchParam = useSearchParams()
  const [currentTab, setCurrentTab] = useState<number>(2)
  const [pools, setPools] = useState<Array<PoolProps>>([])

  const [listPrices, setListPrices] = useState<Array<any>>([])
  const [listServices, setListServices] = useState<Array<serviceModel>>([])

  const [priceId, setPriceId] = useState<priceModel>()
  const [arrService, setArrService] = useState<Array<string>>([])

  const [timeId, setTimeId] = useState<any>()

  const [itemOffset, setItemOffset] = useState(0)
  const currentItems = pools.slice(itemOffset, itemOffset + 4)
  const pageCount = Math.ceil(pools.length / 4)
  const [currentPage, setCurrentPage] = useState(0);

  const handlePageClick = (event: any) => {
    setCurrentPage(event.selected)
    const newOffset = (event.selected * 4) % pools.length
    setItemOffset(newOffset)
  }

  const hdClickRF = (e: number) => {
    setCurrentTab(e)
    if (e == 2) {
      setPools(
        pools.sort(function (a: PoolProps, b: PoolProps) {
          return b.rating! - a.rating!
        })
      )
    } else {
      setPools(
        pools.sort(function (a: PoolProps, b: PoolProps) {
          return b.tickets![0].price - a.tickets![0].price
        })
      )
    }
  }

  const finalReq = () => {
    let reqLocation: string = searchParam.get("location")
      ? `location=${searchParam.get("location")}`
      : ""
    let reqService: string =
      arrService.length != 0 ? `service=${arrService.join()}` : ""
    let reqPrice: string = priceId
      ? `from_price=${priceId?.from_price}&to_price=${priceId?.to_price}`
      : ""
    let reqTime: string = timeId
      ? `opening_time=${timeId.open}&closing_time=${timeId.close}`
      : ''
    let reqArr: Array<string> = [reqLocation, reqService, reqPrice, 'limit=99&page=1', reqTime]
    const a = reqArr.filter((ser) => ser !== "")
    setCurrentPage(0)
    return a.join("&")
  }

  useEffect(() => {
    axios(`${api}/items/service?fields=code,name,id`)
      .then((res) => {
        setListServices(res.data.data)
        return axios(`${api}/items/price`)
      })
      .then((res) => {
        setListPrices(res.data.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    axios(`${api}/pool?${finalReq()}`)
      .then((res) => {

        setPools(
          res.data.data.sort(function (a: PoolProps, b: PoolProps) {
            return b.rating! - a.rating!
          })
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }, [searchParam.get("location"), arrService, priceId, timeId])

  return (
    <>
      <div className={styles.wrapper}>
        <SearchPool placeholder={searchParam.get("location") || ""} />
        <div className={styles.main}>
          <div className={styles.mainHeader}>
            <Link href="/" color="#22BFEA">
              Trang chủ
            </Link>
            <span>{`  >  `}</span>
            <Link href="" className={styles.mainHref}>
              {" "}
              Danh sách hồ bơi
            </Link>
          </div>
          {false && <span style={{ margin: "10px" }}>{330} địa điểm</span>}
          <div className={styles.idk}>
            <div className={styles.filters}>
              <form className={styles.filtersBox}>
                <h2 className={styles.header}>Lọc</h2>
                <p>Giờ hoạt động</p>
                {listTime.map((el, i) => {
                  return (
                    <>
                      <div>
                        <input
                          type="radio"
                          id={String(el.id)}
                          onChange={(e) => {
                            setTimeId(el)
                          }}
                          onClick={e => {
                            if (timeId == el) {
                              e.currentTarget.checked = false
                              setTimeId(undefined)
                            }
                          }}
                          name="time"
                          value={String(el.id)}
                          className={styles.filterInput}
                        />
                        <label htmlFor={String(el.id)}>{`${el.open} giờ - ${el.close} giờ`}</label>
                      </div>
                      <br></br>
                    </>
                  )
                })}
                <p>Khoảng giá</p>
                {listPrices.map((el, i) => {
                  if (i + 1 == listPrices.length) {
                    return (
                      <>
                        <div>
                          <input
                            type="radio"
                            id={String(el.id)}
                            onChange={(e) => {
                              setPriceId(el)
                            }}
                            onClick={e => {
                              if (priceId == el) {
                                e.currentTarget.checked = false
                                setPriceId(undefined)
                              }
                            }}
                            name="price"
                            value={String(el.id)}
                            className={styles.filterInput}
                          />
                          <label htmlFor={String(el.id)}>{`Trên ${VND.format(
                            el.from_price
                          )} `}</label>
                        </div>
                        <br></br>
                      </>
                    )
                  }
                  return (
                    <>
                      <div>
                        <input
                          type="radio"
                          id={String(el.id)}
                          onChange={(e) => {
                            setPriceId(el)
                          }}
                          onClick={e => {
                            if (priceId == el) {
                              e.currentTarget.checked = false
                              setPriceId(undefined)
                            }
                          }}
                          name="price"
                          value={String(el.id)}
                          className={styles.filterInput}
                        />
                        <label htmlFor={String(el.id)}>{`Từ ${VND.format(
                          el.from_price
                        )} - ${VND.format(el.to_price)}`}</label>
                      </div>
                      <br></br>
                    </>
                  )
                })}
                <p>Dịch vụ đi kèm</p>
                {listServices.map((el, i) => {
                  return (
                    <>
                      <div>
                        <input
                          type="checkbox"
                          id={el.code}
                          name="type"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setArrService((current) => [
                                ...current,
                                e.target.value,
                              ])
                            } else {
                              const a = arrService.filter(
                                (ser) => ser !== e.target.value
                              )
                              setArrService(a)
                            }
                          }}
                          value={el.id}
                          className={styles.filterInput}
                        />
                        <label htmlFor={el.code}>{el.name}</label>
                      </div>
                      <br></br>
                    </>
                  )
                })}
              </form>
            </div>
            <div className={styles.results}>
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
              <div className={styles.pools}>
                <Items currentItems={currentItems} />
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=" > "
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={5}
                  pageCount={pageCount}
                  previousLabel=" < "
                  renderOnZeroPageCount={null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
