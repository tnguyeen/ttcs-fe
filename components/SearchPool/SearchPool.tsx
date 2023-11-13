"use client"
import { useRef, useState } from "react"
import styles from "./SearchPool.module.scss"

export default function SearchPool() {
  const [location, setLocation] = useState<string>("")
  const inputLocation = useRef<HTMLInputElement>(null)

  const changeHandler = () => {
    setLocation(inputLocation.current?.value!)
  }

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append("location", location)
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={submitForm} className={styles.searchForm}>
        <input
          type="text"
          name="location"
          id="location"
          ref={inputLocation}
          onChange={changeHandler}
          value={location}
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  )
}
