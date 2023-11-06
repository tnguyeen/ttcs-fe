import { useRef, useState } from "react"
import styles from "./LoginBox.module.scss"
import Link from "next/link"

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
    const fd = new FormData()
    fd.append("username", usernameValue)
    fd.append("password", passwordValue)
  }

  return (
    <div className={styles.wrapper}>
      <h2>Login</h2>
      <div className={styles.registerForm}>
        <form onSubmit={submitForm}>
          <div>
            <label htmlFor="username">Username</label>
            <br />
            <input
              type="text"
              name="username"
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
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              name="password"
              id="password"
              ref={inputPassword}
              onChange={changeHandler}
              value={usernameValue}
              required
              minLength={4}
              maxLength={20}
              pattern="[A-Za-z0-9]+"
            />
          </div>

          <button type="submit" className={styles.loginBtn}>
            Log in
          </button>
        </form>
        <div>
          Dont have an account
          <Link href="/register" style={{ marginLeft: 4, cursor: "pointer" }}>
            <strong>Register</strong>
          </Link>
        </div>
        <div className={styles.social}></div>
      </div>
    </div>
  )
}
