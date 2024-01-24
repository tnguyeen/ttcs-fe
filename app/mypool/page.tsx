"use client"
import Head from "next/head"
import Image from "next/image"
import styles from "./MyPool.module.scss"
import Router from "next/router"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Button, { ButtonStyle, ButtonType } from "@/components/Button/Button"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import api from "@/api"
import Link from "next/link"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faPlus } from "@fortawesome/free-solid-svg-icons"


interface PoolModel {
  id: number
  name: string
  location: string
  description: string
  images: Array<{
    id: number
    pool_id: number
    directus_files_id: string
  }>
}

type PoolProp = {
  pool: PoolModel
}

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

export default function MyPool() {
  const [pools, setPools] = useState<Array<PoolModel>>()
  const [username, setUsername] = useState("")
  const token = useSelector((state: any) => state.token)
  useEffect(() => {
    axios
      .get(`${api}/users/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setUsername(res.data.data.first_name)
        return axios.get(`${api}/items/pool?fields=*,images.*&filter[host_id]=${res.data.data.id}`)
      }).then(res => {
        setPools(res.data.data)
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: 'Không tìm thấy thông tin cá nhân!',
          footer: '<a href="/">Trở về trang chủ</a>',
        })
      })
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader}>
          <Link href="/" color="#22BFEA">
            Trang chủ
          </Link>
          <span>{`  >  `}</span>
          <Link href="" className={styles.mainHref}>
            {" "}
            Chủ bể bơi
          </Link>
        </div>
        <div className={styles.main}>
          <div style={{ width: '100%' }}><h2>{`Chào mừng, ${username}!`}</h2></div>
          <div className={styles.pools}>
            {pools && pools.map((e, i) => {
              return <Pool key={i} pool={e} />
            })}
            <CreatePoolBtn />
          </div>
        </div>
      </div></>
  )
}


function Pool({ pool }: PoolProp) {
  return (
    <Link href={`/pools/${pool.id}`}>
      <div className={styles.pool}>
        <Image src={`${api}/assets/${pool.images[0].directus_files_id}`} alt={"poolPic"} className={styles.mainImg} height={156} width={156} />
        <div className={styles.mainDes}>
          <h3 style={{ margin: '6px 0' }}>{pool.name}</h3>
          <div>
            <FontAwesomeIcon icon={faLocationDot} style={{ margin: '0 4px' }} />
            {pool.location}
          </div>
        </div>
      </div>
    </Link>
  )
}

function CreatePoolBtn() {
  return (
    <Link href={'/registpool'}>
      <div className={styles.pool + " " + styles.create} style={{ color: '#00B2EB', padding: ' 0 50px' }}>
        <FontAwesomeIcon icon={faPlus} size="2x" style={{ borderRadius: '50%', padding: '16px', border: '1px solid #00B2EB' }} />
        <div className={styles.mainDes} >
          {"Bắt đầu tạo bể bơi của bạn !"}
        </div>
      </div>
    </Link>
  )
}