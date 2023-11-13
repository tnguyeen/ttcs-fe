"use client"
import Head from "next/head"
import styles from "./Register.module.scss"
import Router from "next/router"
import { useRef, useState } from "react"
import Link from "next/link"
import LoginBox from "@/components/LoginBox/LoginBox"
import Button, { ButtonStyle, ButtonType } from "@/components/Button/Button"

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
      alert("Confirm password is not equal to password!")
      return
    }

    const fd = new FormData()
    fd.append("username", usernameValue)
    fd.append("fullname", fullnameValue)
    fd.append("email", emailValue)
    fd.append("password", passwordValue)
    fd.append("cfmPass", cfmPassValue)
    fd.append("profilepic", profilePic)
    alert("tete")
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
              <label htmlFor="fullname">Full name</label>
              <br />
              <input
                type="text"
                id="fullname"
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
              <label htmlFor="username">Username</label>
              <br />
              <input
                type="text"
                id="username"
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
              <label htmlFor="email">Email</label>
              <br />
              <input
                type="text"
                id="email"
                ref={inputEmail}
                onChange={changeHandler}
                value={emailValue}
                required
                minLength={4}
                pattern="[A-Za-z0-9]+"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
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
              <label htmlFor="cfmPass">Confirm Password</label>
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
            <div>
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
            </div>
            <Button
              type={ButtonType.submit}
              btnStyle={ButtonStyle.primary}
              content="Register"
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
          <LoginBox />
          <h1 onClick={hideLogin}>X</h1>
        </div>
      )}
    </>
  )
}
