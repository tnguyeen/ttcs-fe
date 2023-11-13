import { MouseEventHandler } from "react"
import styles from "./Button.module.scss"

export interface ButtonProps {
  type?: ButtonType
  btnStyle: ButtonStyle
  content: string
  func?: MouseEventHandler
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

export default function Button({ type, btnStyle, content, func }: ButtonProps) {
  return (
    <button
      type={type}
      className={styles.btn + " " + styles[btnStyle]}
      onClick={func}
    >
      {content}
    </button>
  )
}
