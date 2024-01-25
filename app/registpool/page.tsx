"use client"
import Head from "next/head"
import Image from "next/image"
import styles from "./RegistPool.module.scss"
import Router from "next/router"
import { useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import Button, { ButtonStyle, ButtonType } from "@/components/Button/Button"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import api from "@/api"
import Link from "next/link"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faImage, faCircleInfo, faCheckDouble, faTicket, faXmark } from "@fortawesome/free-solid-svg-icons"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { IconProp } from "@fortawesome/fontawesome-svg-core"


interface TabModel {
  icon: IconProp
  name: string
}

const dataTabList: Array<TabModel> = [
  { icon: faCircleInfo, name: "Mô tả" },
  { icon: faImage, name: "Thêm ảnh" },
  { icon: faLocationDot, name: "Vị trí" },
  { icon: faTicket, name: "Vé" },
  { icon: faCheckDouble, name: "Dịch vụ" },
]

function checkHour(hour: number) {
  if (hour < 24 && hour > 0) {
    return true
  } else {
    return false
  }
}



export default function RegistPool() {
  const token = useSelector((state: any) => state.token)
  const [selectedTab, setSelectedTab] = useState(1)

  const [poolname, setPoolname] = useState<string>("")
  const [pooldes, setPooldes] = useState<string>("")
  const [poolopenT, setPoolopenT] = useState<number>(5)
  const [poolcloseT, setPoolcloseT] = useState<number>(19)

  const [files, setFiles] = useState<Array<any>>([]);
  const inputPic = useRef<HTMLInputElement>(null)

  function handleBtnPanel1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!poolname || !pooldes || !poolopenT || !poolcloseT) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Bạn cần nhập đủ các thông tin!',
      }).then(function (result) {
        return
      })
    }
    if (!(checkHour(poolopenT) && checkHour(poolcloseT))) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Phải nhập giờ trong khoảng 0-24!',
      }).then(function (result) {
        return
      })
    }
    setSelectedTab(1)
  }
  function handleBtnPanel2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (Array.from(files).length < 5) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Vui lòng chọn đủ 5 ảnh cho bể bơi',
        confirmButtonText: 'Xác nhận',
      }).then(function (result) {
        if (result.value) {
          // console.log(33);

        }
      })
    }

  }
  const handleFileChange = (event: any) => {
    setFiles(event.target.files);
  };
  const removeFile = (file: File) => {
    const updatedFiles = Array.from(files).filter((f) => f !== file);
    setFiles(updatedFiles);
  };


  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Bạn cần đăng nhập để tạo bể bơi!',
        confirmButtonText: 'Xác nhận',
      }).then(function (result) {
        if (result.value) {
          window.location.href = '/'
        }
      })
    }
  }, [])



  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader}>
          <Link href="/" color="#22BFEA">
            Trang chủ
          </Link>
          <span>{`  >  `}</span>
          <Link href="" className={styles.mainHref}>
            {" "}
            Chủ bể bơi
          </Link>
        </div>
        <div className={styles.main}>
          <Tabs className={styles.mainCreate} selectedIndex={selectedTab}>
            <TabList className={styles.tabList}>
              {dataTabList.map((e, i) => {
                return (
                  <Tab className={styles.tab} selectedClassName={styles.active} onClick={() => { setSelectedTab(i) }}>
                    <FontAwesomeIcon icon={e.icon} size="2x" width={100} />
                    <span>{e.name}</span>
                  </Tab>
                )
              })}
            </TabList>

            <div className={styles.tabPanels}>
              <TabPanel className={styles.descriptionPanel + " " + styles.panel}>
                <h2>Vui lòng điền thông tin chi tiết cho bể bơi</h2>
                <form onSubmit={handleBtnPanel1}>
                  <div>
                    <label htmlFor="poolname">Tên bể bơi</label>
                    <input type="text" id="poolname" placeholder="Vui lòng điền tên bể bơi" pattern="[A-Za-z\s]+" required value={poolname} onChange={e => setPoolname(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="description">Chi tiết</label>
                    <textarea id="description" placeholder="Chi tiết bể bơi" rows={6} cols={50} value={pooldes} onChange={e => setPooldes(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="openningtime">Giờ mở cửa</label>
                    <input type="text" id="openningtime" placeholder="Vui lòng điền giờ mở cửa" pattern="[0-9]+" required value={poolopenT} onChange={e => setPoolopenT(Number(e.target.value))} />
                  </div>
                  <div>
                    <label htmlFor="closingtime">Giờ đóng cửa</label>
                    <input type="text" id="closingtime" placeholder="Vui lòng điền giờ đóng cửa" pattern="[0-9]+" required value={poolcloseT} onChange={e => setPoolcloseT(Number(e.target.value))} />
                  </div>
                  <Button content="Tiếp tục" btnStyle={ButtonStyle.primary} type={ButtonType.submit} />
                </form>
              </TabPanel>
              <TabPanel className={styles.imagesPanel + " " + styles.panel}>
                <h2>Vui lòng thêm ảnh cho bể bơi</h2>
                <h2>Hình ảnh:</h2>
                <div className={styles.imgsPreview}>
                  {files && Array.from(files).map((e, i) => {
                    return <div className={styles.image}>
                      <section>
                        <img src={URL.createObjectURL(e)} height={50} />
                        <span>{e.name.split('.')[0]}</span>
                      </section>
                      <div onClick={() => { removeFile(e) }}>
                        <FontAwesomeIcon icon={faXmark} />
                      </div>
                    </div>
                  })}
                </div>
                <form onSubmit={handleBtnPanel2}>
                  <input type="file" multiple onChange={handleFileChange} ref={inputPic} style={{ display: 'none' }} />
                  <Button content="Thêm ảnh" btnStyle={ButtonStyle.secondary} type={ButtonType.button} func={(e) => {
                    inputPic.current?.click()
                  }} />
                  <Button content="Tiếp tục" btnStyle={ButtonStyle.primary} />
                </form>
              </TabPanel>
              <TabPanel className={styles.descriptionPanel + " " + styles.panel}>
                <h2>Any content 3</h2>
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  )
}

