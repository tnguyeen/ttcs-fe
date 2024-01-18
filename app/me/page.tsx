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
import Button, {
  ButtonProps,
  ButtonStyle,
  ButtonType,
} from "@/components/Button/Button"

interface UserModel {
  id: string
  first_name: string
  last_name: string
  email: string
  password: string
  description: string
  avatar: string
}

export default function Profile() {
  const [user, setUser] = useState<UserModel>()
  const token = useSelector((state: any) => state.token)
  useEffect(() => {
    axios
      .get(`${api}/users/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => setUser(res.data.data))
      .catch((err) => console.log(err))
  }, [token])
  if (!user) {
    // window.location.href = window.location.origin
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
          <div>
            <h3 style={{ width: "200px" }}>Địa chỉ email:</h3>
            <span style={{ flex: "auto" }}>{user?.email}</span>
            <Button btnStyle={ButtonStyle.secondary} content="Thay đổi" />
          </div>
          <div>
            <h3 style={{ width: "200px" }}>Mật khẩu:</h3>
            <span style={{ flex: "auto" }}>{user?.email}</span>
            <Button btnStyle={ButtonStyle.secondary} content="Thay đổi" />
          </div>
          <div>
            <h3 style={{ width: "100px", color: "white" }}>
              <Link style={{ color: "black" }} href="/orders">
                Vé đã đặt
              </Link>
            </h3>
          </div>
        </div>
        <div className={styles.sec3}>
          <div>
            <h3 style={{ color: "white" }}>
              <Link style={{ color: "black" }} href="/orders">
                Trợ giúp và hỗ trợ
              </Link>
            </h3>
          </div>
          <div>
            <h3 style={{ color: "white" }}>
              <Link style={{ color: "black" }} href="/orders">
                Điểu khoản và chính sách
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}
