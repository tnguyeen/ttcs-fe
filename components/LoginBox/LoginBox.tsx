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

export default function LoginBox() {
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
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: err.response.data.message,
        })
      })
  }

  const loginGoogle = () => {}

  if (userLog) {
    return <div className={styles.wrapper}>{userLog} da dang nhap</div>
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.registerForm}>
        <form onSubmit={submitForm}>
          <div>
            <label htmlFor="username">Email</label>
            <br />
            <input
              type="email"
              name="username"
              id="username"
              ref={inputUsername}
              onChange={changeHandler}
              value={usernameValue}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              name="password"
              id="password"
              ref={inputPassword}
              onChange={changeHandler}
              value={passwordValue}
              required
              minLength={4}
              maxLength={20}
              pattern="[A-Za-z0-9]+"
            />
          </div>
          <Button
            type={ButtonType.submit}
            btnStyle={ButtonStyle.primary}
            content="Log in"
          />
        </form>
        <div style={{ marginTop: 10, textAlign: "center" }}>
          Dont have an account
          <Link
            href="/register"
            style={{
              marginLeft: 4,
              cursor: "pointer",
              color: "black",
            }}
          >
            <strong>Register</strong>
          </Link>
        </div>
        <div className={styles.social}></div>
      </div>
      <span style={{ cursor: "pointer" }} onClick={loginGoogle}>
        Or continue with Google
      </span>
    </div>
  )
}
