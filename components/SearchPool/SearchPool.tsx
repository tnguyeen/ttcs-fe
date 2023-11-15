"use client"
import { useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
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
          placeholder="Search your location"
          ref={inputLocation}
          onChange={changeHandler}
          value={location}
          required
        />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" />
        </button>
      </form>
    </div>
  )
}
