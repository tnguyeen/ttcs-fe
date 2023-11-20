"use client"
import SearchPool from "@/components/SearchPool/SearchPool"
import Pool, { PoolProps } from "@/components/Pool/Pool"
import styles from "./Pools.module.scss"
import { useEffect, useRef, useState } from "react"
import ReactPaginate from "react-paginate"
import Axios from "axios"
import Host from "@/components/Host/Host"
import Link from "next/link"
import anh from "./searchSec.jpg"

const resultsFilters: Array<{ filter: string; id: number }> = [
  { filter: "Đề xuất của chúng tôi", id: 1 },
  { filter: "Được ưa chuộng nhất", id: 2 },
  { filter: "Giá thấp nhất", id: 3 },
]
const items: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

function Items({ currentItems }: any) {
  return (
    <>
      {currentItems &&
        currentItems.map((item: number) => (
          <Pool
            images={anh}
            name="Bể bơi bốn mùa Vinhomes OceanPark "
            location="location"
            description="Được xây dựng với diện tích lên đến 2000m2, sở hữu 1 bể bơi rộng
                  1000m2 dành cho người lớn, 120m2 cho trẻ em....."
            rating={item}
            expand={true}
            key={item}
          />
        ))}
    </>
  )
}

export default function Home() {
  const [currentTab, setCurrentTab] = useState<number>(1)

  const [itemOffset, setItemOffset] = useState(0)
  const endOffset = itemOffset + 4
  const currentItems = items.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(items.length / 4)

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 4) % items.length
    setItemOffset(newOffset)
  }

  const hdClickRF = (e: number) => {
    setCurrentTab(e)
    items.reverse()
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
            <div className={styles.filters}>
              <form className={styles.filtersBox}>
                <h2 className={styles.header}>Lọc</h2>
                <p>Loại bể</p>
                <div>
                  <input
                    type="radio"
                    id="normal"
                    name="type"
                    value="normal"
                    className={styles.filterInput}
                  />
                  <label htmlFor="normal">Bể thường</label>
                </div>
                <br></br>
                <div>
                  <input
                    type="radio"
                    id="special"
                    name="type"
                    value="special"
                    className={styles.filterInput}
                  />
                  <label htmlFor="special">Bể bơi 4 mùa</label>
                </div>
                <br></br>

                <p>Dịch vụ đi kèm</p>
                <div>
                  <input
                    type="checkbox"
                    id="dichvu1"
                    name="type"
                    value="dichvu1"
                    className={styles.filterInput}
                  />
                  <label htmlFor="dichvu1">Thuê quần, áo, kính bơi</label>
                </div>
                <br></br>
                <div>
                  <input
                    type="checkbox"
                    id="dichvu2"
                    name="type"
                    value="dichvu2"
                    className={styles.filterInput}
                  />
                  <label htmlFor="dichvu2">Phao bơi</label>
                </div>
                <br></br>
                <div>
                  <input
                    type="checkbox"
                    id="dichvu3"
                    name="type"
                    value="dichvu3"
                    className={styles.filterInput}
                  />
                  <label htmlFor="dichvu3">Đồ uống</label>
                </div>
                <br></br>
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
                {/* <Pool
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
                /> */}
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
