import { useRef, useState } from "react"
import styles from "./LoginBox.module.scss"
import Link from "next/link"
import Button, { ButtonStyle, ButtonType } from "../Button/Button"
import axios from "axios"
import api from "@/api"

export default function LoginBox() {
  const [usernameValue, setUsernameValue] = useState<string>("")
  const [passwordValue, setPasswordValue] = useState<string>("")
  const inputUsername = useRef<HTMLInputElement>(null)
  const inputPassword = useRef<HTMLInputElement>(null)

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
      .then((res) => console.log(res.data.data))
      .catch((err) => console.log(err))
  }

  const loginGoogle = () => {}

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
