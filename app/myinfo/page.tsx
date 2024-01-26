"use client"
import SearchPool from "@/components/SearchPool/SearchPool"
import Pool, { PoolProps } from "@/components/Pool/Pool"
import styles from "./Profile.module.scss"
import { useEffect, useRef, useState } from "react"
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
  const [updatedAva, setUpdatedAva] = useState<Array<any>>([])
  const [firstname, setFirstname] = useState<string>()
  const [lastname, setLastname] = useState<string>()
  const [password, setPassword] = useState<string>()

  const inputPic = useRef<HTMLInputElement>(null)


  const handleFileChange = (event: any) => {
    setUpdatedAva(event.target.files);
  };
  const handleFileSubmit = () => {
    if (updatedAva.length) {
      const fd = new FormData()
      Array.from(updatedAva).forEach(e => {
        fd.append("image[]", e)
      })
      axios
        .post(`${api}/files`, fd, {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${token}`
          },
        })
        .then(res => {
          const data: any = {
            "last_name": lastname,
            "first_name": firstname,
            "password": password,
            "avatar": res.data.data.id
          }
          return axios.patch(`${api}/users/me`, data, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
        })
        .then(res => {
          Swal.fire({
            icon: "success",
            title: "Cập nhật thông tin thành công",
            showConfirmButton: false,
            timer: 3500,
            confirmButtonText: 'Xác nhận'
          }).then(function (result) {
            if (result.value) {
            }
          })
          setTimeout(() => {
            location.href = '/me'
          }, 3500);
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      const data: any = {
        "last_name": lastname,
        "first_name": firstname,
        "password": password
      }
      axios.patch(`${api}/users/me`, data, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err)
        })
    }
  };
  useEffect(() => {
    axios
      .get(`${api}/users/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setUser(res.data.data)
        setFirstname(res.data.data.first_name)
        setLastname(res.data.data.last_name)
        setPassword(res.data.data.password)
      })
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
    return
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.sec1}>
          {!updatedAva.length ?
            <div className={styles.ava} style={user.avatar ? { backgroundImage: `url("${api}/assets/${user.avatar}")` } : {}}></div> :
            Array.from(updatedAva).map((e, i) => {
              return (
                <div className={styles.ava} style={e ? { backgroundImage: `url("${URL.createObjectURL(e)}")` } : {}}></div>
              )
            })

          }
          <div className={styles.info}>
            <input type="file" accept="image/png, image/jpeg" multiple={false} onChange={handleFileChange} ref={inputPic} style={{ display: 'none' }} />
            <Button content="Chọn ảnh đại diện" btnStyle={ButtonStyle.secondary} type={ButtonType.button} func={(e) => {
              inputPic.current?.click()
            }} />
          </div>
        </div>
        <div className={styles.sec2}>
          <div>
            <label htmlFor="firstname">Họ</label>
            <input type="text" id="firstname" placeholder="Vui lòng điền họ" pattern="[A-Za-z\s]+" value={firstname} onChange={e => setFirstname(e.target.value)} />
          </div>
          <div>
            <label htmlFor="lastname">Tên</label>
            <input type="text" id="lastname" placeholder="Vui lòng điền tên" pattern="[A-Za-z\s]+" value={lastname} onChange={e => setLastname(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password">Mật khẩu</label>
            <input type="password" id="password" placeholder="Vui lòng điền mật khẩu" pattern="[A-Za-z\s]+" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
        </div>
        <div className={styles.sec3}>
          <div>
            <Button content="Cập nhật thông tin" btnStyle={ButtonStyle.primary} type={ButtonType.button} func={(e) => {
              handleFileSubmit()
            }} />
          </div>
        </div>
      </div>
    </>
  )
}
