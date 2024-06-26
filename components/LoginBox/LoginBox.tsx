"use client"
import { useRef, useState } from "react"
import styles from "./LoginBox.module.scss"
import Link from "next/link"
import Button, { ButtonStyle, ButtonType } from "../Button/Button"
import axios from "axios"
import api from "@/api"
import { useDispatch, useSelector } from "react-redux"
import { setLogin } from "@/state"
import Swal from "sweetalert2"

type OrderProp = {
  goToHome?: boolean
}


export default function LoginBox({ goToHome=false }: OrderProp) {
  const [usernameValue, setUsernameValue] = useState<string>("")
  const [passwordValue, setPasswordValue] = useState<string>("")
  const inputUsername = useRef<HTMLInputElement>(null)
  const inputPassword = useRef<HTMLInputElement>(null)
  const userLog = useSelector((state: any) => state.user)

  const dispatch = useDispatch()

  const changeHandler = () => {
    setUsernameValue(inputUsername.current?.value!)
    setPasswordValue(inputPassword.current?.value!)
  }

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const url: string = `${api}/auth/login`
    const data = {
      email: usernameValue,
      password: passwordValue,
    }

    axios
      .post(url, data)
      .then((res) => res.data.data)
      .then((res) => {
        dispatch(
          setLogin({
            user: data.email,
            token: res.access_token,
          })
        )
        localStorage.setItem("user", data.email)
        localStorage.setItem("token", res.access_token)
        if (goToHome) {
          window.location.href = "/"
        } else {
          window.location.reload()
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.",
        })
      })
  }

  const loginGoogle = () => {}

  if (userLog) {
    return <div className={styles.wrapper}>{userLog} da dang nhap</div>
  }

  return (
    <><div className={styles.wrapper}>
      <div className={styles.registerForm}>
        <form onSubmit={submitForm}>
          <h2>Đăng nhập</h2>
          <div>
            <label htmlFor="username">Địa chỉ email</label>
            <br />
            <input
              type="email"
              placeholder="Vui lòng nhập "
              name="username"
              id="username"
              ref={inputUsername}
              onChange={changeHandler}
              value={usernameValue}
              style={{marginBottom:'20px'}}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Mật khẩu</label>
            <br />
            <input
              type="password"
              placeholder="Vui lòng nhập "
              name="password"
              id="password"
              ref={inputPassword}
              onChange={changeHandler}
              value={passwordValue}
              style={{marginBottom:'20px'}}
              required
              minLength={4}
              maxLength={20}
              pattern="[A-Za-z0-9]+"
            />
          </div>
          <Button
            type={ButtonType.submit}
            btnStyle={ButtonStyle.primary}
            content="Đăng nhập"
          />
        </form>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          Chưa có tài khoản ? 
          <Link
            href="/register"
            style={{
              marginLeft: 4,
              cursor: "pointer",
              color: "black",
            }}
          >
            <strong>Đăng kí</strong>
          </Link>
        </div>
        <div className={styles.social}></div>
      </div>
      {/* <span style={{ cursor: "pointer" }} onClick={loginGoogle}>
        Or continue with Google
      </span> */}
    </div></>
  )
}