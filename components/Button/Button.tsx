import { MouseEventHandler, useState } from "react"
import styles from "./Button.module.scss"

export interface ButtonProps {
  type?: ButtonType
  btnStyle: ButtonStyle
  content: string
  func?: MouseEventHandler
  priceForTicket?: number | boolean
}

export enum ButtonStyle {
  primary = "primary",
  secondary = "secondary",
}
export enum ButtonType {
  button = "button",
  reset = "reset",
  submit = "submit",
}

export default function Button({
  type,
  btnStyle,
  content,
  func,
  priceForTicket,
}: ButtonProps) {
  const [price, setPrice] = useState<number>(0)
  return (
    <button
      type={type}
      className={
        styles.btn +
        " " +
        styles[btnStyle] +
        " " +
        (priceForTicket ? styles.expand : "")
      }
      onClick={func}
    >
      <p>{content}</p>
      {priceForTicket && <br />}
      {priceForTicket &&
        `Tổng tiền: ${
          typeof priceForTicket == "boolean" ? 0 : priceForTicket
        } VNĐ`}
    </button>
  )
}
