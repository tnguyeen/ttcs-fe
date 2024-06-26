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
import Swal from "sweetalert2"

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
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: 'Không tìm thấy thông tin cá nhân!',
          footer: '<a href="/">Trở về trang chủ</a>',
        })
      })
  }, [token])
  if (!user) {
    // window.location.href = window.location.origin
    return
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.sec1}>
          <div className={styles.ava} style={user.avatar ? { backgroundImage: `url("${api}/assets/${user.avatar}")` } : {}}></div>
          <div className={styles.info}>
            <h2>{user?.first_name + " " + user?.last_name}</h2>
          </div>
        </div>
        <div className={styles.sec2}>
          <div>
            <h3 style={{ width: "200px" }}>Địa chỉ email:</h3>
            <span style={{ flex: "auto" }}>{user?.email}</span>
            {/* <Button btnStyle={ButtonStyle.secondary} content="Thay đổi" /> */}
          </div>
          <div>
            <h3 style={{ width: "400px" }}>
              <Link
                style={{
                  color: "black",
                  padding: "0 180px 0 0",
                }}
                href="/myinfo"
              >
                Thông tin cá nhân
              </Link>
            </h3>
          </div>
          <div>
            <h3 style={{ width: "400px" }}>
              <Link
                style={{
                  color: "black",
                  padding: "0 180px 0 0",
                }}
                href="/orders"
              >
                Vé đã đặt
              </Link>
            </h3>
          </div>
          <div>
            <h3 style={{ width: "400px" }}>
              <Link
                style={{
                  color: "black",
                  padding: "0 180px 0 0",
                }}
                href="/mypool"
              >
                Bể bơi của tôi
              </Link>
            </h3>
          </div>
        </div>
        <div className={styles.sec3}>
          <div>
            <h3 style={{ color: "white" }}>
              <Link style={{ color: "black" }} href="/">
                Trợ giúp và hỗ trợ
              </Link>
            </h3>
          </div>
          <div>
            <h3 style={{ color: "white" }}>
              <Link style={{ color: "black" }} href="/">
                Điểu khoản và chính sách
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}
