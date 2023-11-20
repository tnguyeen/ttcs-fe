"use client"
import Header from "../components/Header/Header"
import SearchPool from "@/components/SearchPool/SearchPool"
import Pool, { PoolProps } from "@/components/Pool/Pool"
import styles from "./page.module.scss"
import { useEffect, useRef, useState } from "react"
import Axios from "axios"
import Host from "@/components/Host/Host"
import api from "@/api"

export default function Home() {
  const [pools, setPools] = useState<Array<PoolProps>>([])

  const getPools = () => {
    Axios.get(`${api}/items/pool?fields=*,images.*&limit=4&page=1&sort=rating`)
      .then((res) => setPools(res.data.data))
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    getPools()
  }, [])
  return (
    <>
      <div className={styles.wrapper}>
        <SearchPool />
        <div className={styles.poolsSec}>
          <h2>Phổ biến</h2>
          <div className={styles.pools}>
            {pools.map((e, i) => {
              return (
                <Pool
                  key={i}
                  images={e.images[0].directus_files_id}
                  name={e.name}
                  location={e.location}
                  expand={false}
                />
              )
            })}
          </div>
        </div>
        <Host />
      </div>
    </>
  )
}
