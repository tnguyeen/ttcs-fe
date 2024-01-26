"use client"
import Head from "next/head"
import styles from "./Header.module.scss"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/public/logo.png"
import defava from "./defava.jpg"
import { useState, useRef, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLocationDot,
  faStar,
  faXmark,
  faBars,
} from "@fortawesome/free-solid-svg-icons"
import LoginBox from "../LoginBox/LoginBox"
import Button, { ButtonType, ButtonStyle } from "../Button/Button"
import { useDispatch, useSelector } from "react-redux"
import { setLogout } from "@/state"
import { useOnClickOutside } from "usehooks-ts"
import axios from "axios"
import api from "@/api"

export default function Header() {
  const [login, setLogin] = useState<Boolean>(false)
  const [option, setOption] = useState<Boolean>(false)
  const [username, setUsername] = useState<string>("")
  const [useremail, setUseremail] = useState<string>("")
  const userLog = useSelector((state: any) => state.token)
  const optionBox = useRef(null)

  const dispatch = useDispatch()

  const showLogin = () => {
    setLogin(true)
    // tesst()
    // console.log(tesst());

  }
  const hideLogin = () => {
    setLogin(false)
  }
  function logOut(): void {
    setOption(false)
    dispatch(setLogout())
    localStorage.clear()
    setLogin(false)
    window.location.reload()
  }
  const handleClickOutsideOption = () => {
    // Your custom logic here
    setOption(false)
  }

  useOnClickOutside(optionBox, handleClickOutsideOption)
  useEffect(() => {
    if (userLog) {

      axios
        .get(`${api}/users/me`, {
          headers: {
            Authorization: "Bearer " + userLog,
          },
        })
        .then((res) => {
          setUsername(res.data.data.first_name + " " + res.data.data.last_name)
          setUseremail(res.data.data.email)
        })
        .catch((err) => err)
    }
  }, [userLog])
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <Link href="/" className={styles.logoWrapper}>
            <Image src={Logo} alt="logo" height={70} />
          </Link>
          <div className={styles.navbar}>
            {/* <Button btnStyle={ButtonStyle.secondary} content="Phổ biến" /> */}
          </div>
          <div className={styles.loginHeaderWrapper}>
            {userLog ? (
              <div
                className={styles.loggedin}
                onClick={() => {
                  setOption(true)
                }}
              >
                <Image
                  height={30}
                  width={30}
                  src={defava}
                  alt=""
                  className={styles.defava}
                />
                <FontAwesomeIcon icon={faBars} />
                {option && (
                  <div className={styles.options} ref={optionBox}>
                    <div className={styles.info}>
                      <p style={{ fontWeight: "600" }}>{username}</p>
                      <span style={{ fontWeight: "300" }}>{useremail}</span>
                    </div>
                    <ul>
                      <li>
                        <Link style={{ flex: "auto" }} href="/me">
                          Trang cá nhân
                        </Link>
                      </li>
                      <li>
                        <Link style={{ flex: "auto" }} href="/mypool">
                          Bể bơi của tôi
                        </Link>
                      </li>
                      <li>
                        <Link style={{ flex: "auto" }} href="/orders">
                          Vé của tôi
                        </Link>
                      </li>
                      <li
                        onClick={() => {
                          setOption(false)
                          logOut()
                        }}
                        style={{ padding: '10px 20px' }}
                      >
                        Đăng xuất
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Button
                btnStyle={ButtonStyle.secondary}
                content="Đăng nhập"
                func={showLogin}
              />
            )}
          </div>
        </div>
      </div>
      {login && !userLog && (
        <div className={styles.loginWrapper}>
          <LoginBox />
          <h1 onClick={hideLogin}>
            <FontAwesomeIcon
              icon={faXmark}
              style={{
                margin: "20px",
                color: "rgb(0,0,0,0.7)",
                backgroundColor: "white",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
              }}
            />
          </h1>
        </div>
      )}
    </>
  )
}
