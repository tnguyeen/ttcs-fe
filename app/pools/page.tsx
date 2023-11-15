"use client"
import SearchPool from "@/components/SearchPool/SearchPool"
import Pool, { PoolProps } from "@/components/Pool/Pool"
import styles from "./Pools.module.scss"
import { useEffect, useRef, useState } from "react"
import Axios from "axios"
import Host from "@/components/Host/Host"
import Link from "next/link"
import anh from "./searchSec.jpg"

const resultsFilters: Array<{ filter: string; id: number }> = [
  { filter: "Đề xuất của chúng tôi", id: 1 },
  { filter: "Được ưa chuộng nhất", id: 2 },
  { filter: "Giá thấp nhất", id: 3 },
]

export default function Home() {
  const [currentTab, setCurrentTab] = useState<number>(1)

  const hdClickRF = (e: number) => {
    setCurrentTab(e)
  }

  // const getPools = () => {
  //   Axios.get(
  //     "https://froakie.io.vn/items/pool?fields=*,images.*&limit=4&page=1&sort=rating"
  //   )
  //     .then((res) => setPools(res.data.data))
  //     .catch((err) => console.log(err))
  // }
  // useEffect(() => {
  //   getPools()
  // }, [])
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
            <Link href="/pools"> Các hồ bơi trên Hà Nội</Link>
          </div>
          <span style={{ margin: "10px" }}>{330} địa điểm</span>
          <div className={styles.idk}>
            <div className={styles.filters}>a</div>
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
                <Pool
                  images={anh}
                  name="Bể bơi bốn mùa Vinhomes OceanPark"
                  location="location"
                  description="Được xây dựng với diện tích lên đến 2000m2, sở hữu 1 bể bơi rộng
                  1000m2 dành cho người lớn, 120m2 cho trẻ em....."
                  rating={3}
                  expand={true}
                />
                <Pool
                  images={anh}
                  name="Bể bơi bốn mùa Vinhomes OceanPark"
                  location="location"
                  description="Được xây dựng với diện tích lên đến 2000m2, sở hữu 1 bể bơi rộng
                  1000m2 dành cho người lớn, 120m2 cho trẻ em....."
                  rating={3}
                  expand={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
