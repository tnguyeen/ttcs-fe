import { MouseEventHandler, useState } from "react"
import styles from "./Button.module.scss"

export interface ButtonProps {
  type?: ButtonType
  btnStyle: ButtonStyle
  content: string
  dis?: boolean
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

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

export default function Button({
  type,
  btnStyle,
  content,
  func,
  priceForTicket,
  dis,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={dis}
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
          typeof priceForTicket == "boolean" ? 0 : VND.format(priceForTicket)
        } `}
    </button>
  )
}
