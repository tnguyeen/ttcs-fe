"use client"
import { useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import styles from "./SearchPool.module.scss"
import { redirect } from "next/navigation"

export default function SearchPool({placeholder}:{placeholder : string}) {
  const [location, setLocation] = useState<string>(placeholder)
  const inputLocation = useRef<HTMLInputElement>(null)

  const changeHandler = () => {
    setLocation(inputLocation.current?.value!)
  }

  const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    window.location.href =
      window.location.origin + `/pools?location=${location}`
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={submitForm} className={styles.searchForm}>
        <input
          type="text"
          name="location"
          id="location"
          placeholder={placeholder  || "Tìm kiếm"}
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
