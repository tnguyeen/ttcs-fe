import styles from "./Pool.module.scss"
import Image from "next/image"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faStar } from "@fortawesome/free-solid-svg-icons"
import Pic from "./searchSec.jpg"
import Button, { ButtonStyle } from "../Button/Button"

export interface PoolProps {
  images: any
  name: string
  location: string
  description?: string
  rating?: number
  expand: boolean
}

export default function Pool({
  images,
  name,
  location,
  description,
  rating,
  expand,
}: PoolProps) {
  if (expand) {
    return (
      <div className={styles.expand}>
        <Image
          className={styles.pic}
          // src={`https://froakie.io.vn/assets/` + 3}
          src={Pic}
          alt="pic"
          height={184}
          width={240}
        />
        <div className={styles.details}>
          <span className={styles.name}>{name}</span>
          <span className={styles.description}>{description}</span>
          <span className={styles.rating}>
            <FontAwesomeIcon
              icon={faStar}
              size="lg"
              style={{ margin: "0 12px" }}
              color="yellow"
            />
            {rating + " / 5"}
          </span>
          <span className={styles.location}>
            <FontAwesomeIcon
              icon={faLocationDot}
              size="lg"
              style={{ margin: "0 15px" }}
              color="blue"
            />
            {location}
          </span>
          <div className={styles.btn}>
            <Button btnStyle={ButtonStyle.primary} content="Đặt vé" />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className={styles.wrapper}>
      <Image
        className={styles.pic}
        src={`https://froakie.io.vn/assets/` + images}
        alt="pic"
        height={290}
        width={300}
      />
      <span className={styles.name}>{name}</span>
      <span className={styles.location}>
        <FontAwesomeIcon
          icon={faLocationDot}
          size="lg"
          style={{ margin: "0 8px" }}
        />
        {location}
      </span>
    </div>
  )
}
