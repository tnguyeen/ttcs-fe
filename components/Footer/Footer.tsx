import styles from "./Footer.module.scss"

const actions: Array<string> = [
  "Help",
  "FAQ",
  "Customer Service",
  "How to guild",
  "Contact Us",
]

export default function Footer() {
  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.footer}>
          <div className={styles.tenCty}>
            <h1>AQUARIUS</h1>
            <h4>Aquarius - All rights reserved © 2023</h4>
          </div>
          <ul className={styles.actions}>
            {actions.map((e, i) => {
              return <li key={i}>{e}</li>
            })}
          </ul>
        </div>
      </div>
    </>
  )
}
