"use client"
import Head from "next/head"
import styles from "./Register.module.scss"
import Router from "next/router"
import { useRef, useState } from "react"
import LoginBox from "@/components/LoginBox/LoginBox"
import Button, { ButtonStyle, ButtonType } from "@/components/Button/Button"
import Swal from "sweetalert2"
import axios from "axios"
import api from "@/api"

export default function Register() {
  const [login, setLogin] = useState<Boolean>(false)

  const [fullnameValue, setFullnameValue] = useState<string>("")
  const [usernameValue, setUsernameValue] = useState<string>("")
  const [emailValue, setEmailValue] = useState<string>("")
  const [passwordValue, setPasswordValue] = useState<string>("")
  const [cfmPassValue, setCfmPassValue] = useState<string>("")
  const [profilePic, setProfilePic] = useState<any>()
  const inputFullname = useRef<HTMLInputElement>(null)
  const inputUsername = useRef<HTMLInputElement>(null)
  const inputEmail = useRef<HTMLInputElement>(null)
  const inputPassword = useRef<HTMLInputElement>(null)
  const inputCfmPass = useRef<HTMLInputElement>(null)
  const inputPic = useRef<HTMLInputElement>(null)

  const changeHandler = () => {
    setFullnameValue(inputFullname.current?.value!)
    setUsernameValue(inputUsername.current?.value!)
    setPasswordValue(inputPassword.current?.value!)
    setEmailValue(inputEmail.current?.value!)
    setCfmPassValue(inputCfmPass.current?.value!)
  }
  const changePicHandler = () => {
    changeHandler()
    setProfilePic(inputPic.current?.files![0])
  }

  const showLogin = () => {
    setLogin(true)
  }
  const hideLogin = () => {
    setLogin(false)
  }

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (passwordValue !== cfmPassValue) {
      Swal.fire({
        title: "Lỗi!",
        text: "Mật khẩu không khớp!",
      })
      return
    }

    const fd = {
      email: emailValue,
      password: passwordValue,
      first_name: fullnameValue,
      last_name: usernameValue,
    }

    axios
      .post(`${api}/users`, fd)
      .then((res) => {
        Swal.fire({
          title: "Đăng kí thành công!",
          text: "Vui lòng xác nhận tài khoản qua địa chỉ gmail trước khi đăng nhập.",
          confirmButtonText: "Xác nhận",
        }).then(function (result) {
          window.location.href = "/"
        })
      })
      .catch((err) => err)
  }
  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className={styles.wrapper}>
        <div className={styles.slogan}>
          <h1>Aquarius</h1>
          <h3>
            Discover random
            <br />
            catchy slogan ideas
            <br />
            for your brand
          </h3>
        </div>
        <div className={styles.registerForm}>
          <h2>Please Fill out form to Register!</h2>
          <form
            onSubmit={submitForm}
            encType="multipart/form-data"
            method="POST"
          >
            <div>
              <label htmlFor="firstname">Tên : </label>
              <br />
              <input
                type="text"
                id="firstname"
                ref={inputFullname}
                onChange={changeHandler}
                value={fullnameValue}
                required
                minLength={4}
                maxLength={20}
                pattern="[A-Za-z0-9]+"
              />
            </div>
            <div>
              <label htmlFor="lastname">Họ : </label>
              <br />
              <input
                type="text"
                id="lastname"
                ref={inputUsername}
                onChange={changeHandler}
                value={usernameValue}
                required
                minLength={4}
                maxLength={20}
                pattern="[A-Za-z0-9]+"
              />
            </div>
            <div>
              <label htmlFor="email">Địa chỉ Email : </label>
              <br />
              <input
                type="email"
                id="email"
                ref={inputEmail}
                onChange={changeHandler}
                value={emailValue}
                required
                // minLength={4}
                // pattern="[A-Za-z0-9]+"
              />
            </div>
            <div>
              <label htmlFor="password">Mật khẩu : </label>
              <br />
              <input
                type="password"
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
            <div>
              <label htmlFor="cfmPass">Xác nhận mật khẩu : </label>
              <br />
              <input
                type="password"
                id="cfmPass"
                ref={inputCfmPass}
                onChange={changeHandler}
                value={cfmPassValue}
                required
                minLength={4}
                maxLength={20}
                pattern="[A-Za-z0-9]+"
              />
            </div>
            {/* <div>
              <label
                className={styles.proPic}
                htmlFor="role"
                onClick={() => {
                  inputPic.current?.click()
                }}
              >
                Choose Profile Picture
              </label>
              {profilePic && <span>{profilePic.name}</span>}
              <br />
              <input
                type="file"
                accept="image/png, image/jpeg"
                ref={inputPic}
                onChange={changePicHandler}
                style={{ display: "none" }}
              />
            </div> */}
            <Button
              type={ButtonType.submit}
              btnStyle={ButtonStyle.primary}
              content="Đăng kí"
            />
          </form>
          <div>
            Yes I have an account
            <span
              style={{ marginLeft: 4, cursor: "pointer" }}
              onClick={showLogin}
            >
              <strong>Log in</strong>
            </span>
          </div>
          <div className={styles.social}></div>
        </div>
      </div>
      {login && (
        <div className={styles.loginWrapper}>
          <LoginBox goToHome={true} />
          <h1 onClick={hideLogin}>X</h1>
        </div>
      )}
    </>
  )
}
