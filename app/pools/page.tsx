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

export default function Pools() {
  const searchParam = useSearchParams()
  const [currentTab, setCurrentTab] = useState<number>(2)
  const [pools, setPools] = useState<Array<PoolProps>>([])

  const [listPrices, setListPrices] = useState<Array<priceModel>>([])
  const [listServices, setListServices] = useState<Array<serviceModel>>([])

  const [priceId, setPriceId] = useState<priceModel>()
  const [arrService, setArrService] = useState<Array<string>>([])

  const [itemOffset, setItemOffset] = useState(0)
  const currentItems = pools.slice(itemOffset, itemOffset + 4)
  const pageCount = Math.ceil(pools.length / 4)

  const handlePageClick = (event: any) => {
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
      ? `from_price=${priceId?.from_price}&to_price=300000000`
      : ""
    let reqArr: Array<string> = [reqLocation, reqService, reqPrice]

    const a = reqArr.filter((ser) => ser !== "")
    return a.join("&")
  }

  useEffect(() => {
    console.log(finalReq())

    axios(`${api}/pool?${finalReq()}`)
      .then((res) => {
        setPools(
          res.data.data.sort(function (a: PoolProps, b: PoolProps) {
            return b.rating! - a.rating!
          })
        )
        return axios(`${api}/items/service?fields=code,name,id`)
      })
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
  }, [searchParam.get("location"), arrService, priceId])

  return (
    <>
      <div className={styles.wrapper}>
        <SearchPool />
        <div className={styles.main}>
          <div className={styles.mainHeader}>
            <Link href="/" color="#22BFEA">
              Trang chủ
            </Link>
            <span>{`  >  `}</span>
            <Link href="/pools" className={styles.mainHref}>
              {" "}
              Các hồ bơi trên Hà Nội
            </Link>
          </div>
          {false && <span style={{ margin: "10px" }}>{330} địa điểm</span>}
          <div className={styles.idk}>
            <div className={styles.filters}>
              <form className={styles.filtersBox}>
                <h2 className={styles.header}>Lọc</h2>
                <p>Loại bể</p>
                {listPrices.map((e, i) => {
                  return (
                    <>
                      <div>
                        <input
                          type="radio"
                          id={String(e.id)}
                          onChange={(el) => {
                            setPriceId(e)
                          }}
                          name="type"
                          value={String(e.id)}
                          className={styles.filterInput}
                        />
                        <label htmlFor={String(e.id)}>{`Từ ${VND.format(
                          e.from_price
                        )} - ${VND.format(e.to_price)}`}</label>
                      </div>
                      <br></br>
                    </>
                  )
                })}

                <p>Dịch vụ đi kèm</p>
                {listServices.map((e, i) => {
                  return (
                    <>
                      <div>
                        <input
                          type="checkbox"
                          id={e.code}
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
                          value={e.id}
                          className={styles.filterInput}
                        />
                        <label htmlFor={e.code}>{e.name}</label>
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
