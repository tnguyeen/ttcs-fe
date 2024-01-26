"use client"
import Head from "next/head"
import Image from "next/image"
import styles from "./RegistPool.module.scss"
import Router from "next/router"
import { LegacyRef, RefObject, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import Button, { ButtonStyle, ButtonType } from "@/components/Button/Button"
import { useSearchParams } from "next/navigation"
import axios from "axios"
import api from "@/api"
import Link from "next/link"
import Select from 'react-select'
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faImage, faCircleInfo, faCheckDouble, faTicket, faXmark, faPlus, faClock, faWaterLadder } from "@fortawesome/free-solid-svg-icons"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import {
  APIProvider,
  Map,
  useMapsLibrary,
  Marker,
  AdvancedMarker,
  Pin,
  InfoWindow,
} from "@vis.gl/react-google-maps"
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete"
import { useOnClickOutside } from "usehooks-ts"
import htmlDk from "./dieukhoan"



interface TabModel {
  icon: IconProp
  name: string
}
interface ticketType {
  type: string
  name: string
  price: number
  remain: number
}
interface poolType {
  type: string
  name: string
  depth: number
  length: number
  width: number
  file: any
}
const dataTabList: Array<TabModel> = [
  { icon: faCircleInfo, name: "Mô tả" },
  { icon: faImage, name: "Thêm ảnh" },
  { icon: faLocationDot, name: "Vị trí" },
  { icon: faWaterLadder, name: "Bể" },
  { icon: faTicket, name: "Vé" },
  { icon: faCheckDouble, name: "Dịch vụ" },
  { icon: faClock, name: "Giờ hoạt động" },
]
const optionsTicket = [
  { value: 'ADULT', label: 'Vé dành cho người lớn' },
  { value: 'CHILD', label: 'Vé dành cho trẻ em' }
]
const optionsPool = [
  { value: 'ADULT', label: 'Bể bơi dành cho người lớn' },
  { value: 'CHILD', label: 'Bể bơi dành cho trẻ em' }
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
  const [userId, setUserId] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState(0)
  // Panel 1
  const [poolname, setPoolname] = useState<string>("")
  const [pooldes, setPooldes] = useState<string>("")
  const [poolopenT, setPoolopenT] = useState<number>(5)
  const [poolcloseT, setPoolcloseT] = useState<number>(19)
  // Panel 2
  const [files, setFiles] = useState<Array<any>>([]);
  const inputPic = useRef<HTMLInputElement>(null)
  const handleFileChange = (event: any) => {
    setFiles(event.target.files);
  };
  const removeFile = (file: File) => {
    const updatedFiles = Array.from(files).filter((f) => f !== file);
    setFiles(updatedFiles);
  };
  // Panel 3
  const [geocoding, setGeocoding] = useState({ lat: 21.0277644, lng: 105.8341598 })
  const [zoom, setZoom] = useState<number>(6)
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {},
    debounce: 300,
  });
  const handleSelect = ({ description }: { description: any }) =>
    () => {
      setValue(description, false);
      clearSuggestions();
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        setGeocoding({ lat: lat, lng: lng })
        setZoom(15)
      });
    };
  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong > {main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });
  // Panel 4 
  const [arrayTickets, setArrayTickets] = useState<Array<ticketType>>([])
  const [createBox, setCreateBox] = useState<boolean>(false)
  function showCreateBox() {
    setCreateBox(true)
  }
  function hideCreateBox() {
    setCreateBox(false)
  }
  function removeTicket(ticket: ticketType, i: number) {
    setArrayTickets(arrayTickets.splice(arrayTickets.indexOf(ticket), 1))
  }
  function addTicket(type: string, name: string, price: number, remain: number) {
    var newTicket: ticketType = {
      type: type,
      name: name,
      price: price,
      remain: remain
    }
    setArrayTickets(oldArray => [...oldArray, newTicket]);
    setCreateBox(false)
  }
  // Panel 5
  const [arrayService, setArrayService] = useState<Array<any>>([])
  const [arrayResultService, setArrayResultService] = useState<Array<number>>([])
  const handleCheckboxChange = (event: any) => {
    var updatedResSer = arrayResultService.filter(s => s !== event.target.value)
    setArrayResultService(updatedResSer)
    if (event.target.checked) {
      setArrayResultService(prev => [...prev, event.target.value])
    }
  };
  // Panel 6
  const [arrayPool, setArrayPool] = useState<Array<poolType>>([])
  const [createPoolBox, setCreatePoolBox] = useState<boolean>(false)
  function showCreatePoolBox() {
    setCreatePoolBox(true)
  }
  function hideCreatePoolBox() {
    setCreatePoolBox(false)
  }
  function removePool(ticket: poolType) {
    setArrayPool(arrayPool.splice(arrayPool.indexOf(ticket), 1))
  }
  function addPool(type: string, name: string, depth: number, length: number, width: number, file: any) {
    var newTicket: poolType = {
      type: type,
      name: name,
      depth: depth,
      length: length,
      width: width,
      file: file
    }
    setArrayPool(oldArray => [...oldArray, newTicket]);
    setCreatePoolBox(false)
  }




  function handleBtnPanel1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSelectedTab(1)
  }
  function handleBtnPanel2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSelectedTab(2)
  }
  function handleBtnPanel3() {
    setSelectedTab(3)
  }
  function handleBtnPanel4() {
    setSelectedTab(4)
  }
  function handleBtnPanel5() {
    setSelectedTab(5)
  }
  function handleBtnPanel6() {
    setSelectedTab(6)
  }
  function handleBtnComplete() {
    if (!poolname || !pooldes || !poolopenT || !poolcloseT) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Bạn cần nhập đủ các thông tin!',
      }).then(function (result) {
      })
      return
    }
    if (!(checkHour(poolopenT) && checkHour(poolcloseT))) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Phải nhập giờ trong khoảng 0-24!',
      }).then(function (result) {
      })
      return
    }
    if (Array.from(files).length < 5) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Vui lòng chọn ít nhất 5 ảnh cho bể bơi',
        confirmButtonText: 'Xác nhận',
      }).then(function (result) {
        if (result.value) {
        }
      })
      return
    }
    if (!value) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Vui lòng điền vị trí bể bơi',
        confirmButtonText: 'Xác nhận',
      }).then(function (result) {
        if (result.value) {
        }
      })
      return
    }
    if (arrayTickets.length == 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Vui lòng thêm ít nhất một vé!',
        confirmButtonText: 'Xác nhận',
      }).then(function (result) {
        if (result.value) {
        }
      })
      return
    }
    if (arrayPool.length == 0) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Vui lòng thêm ít nhất một loại bể!',
        confirmButtonText: 'Xác nhận',
      }).then(function (result) {
        if (result.value) {
        }
      })
      return
    }
    Swal.fire({
      title: "Điều khoản sử dụng",
      html: htmlDk,
      showCancelButton: true,
      confirmButtonColor: "#656ed3",
      cancelButtonColor: "#d33",
      width: '1000px',
      confirmButtonText: "Đồng ý và tiếp tục",
      cancelButtonText: "Không đồng ý",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        const fd = new FormData()
        Array.from(files).forEach(e => {
          fd.append("image[]", e)
        })
        axios
          .post(`${api}/files`, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
              'Authorization': `Bearer ${token}`
            },
          })
          .then((res) => {
            var createImgs: Array<any> = []
            var createPools: Array<any> = []
            var createTickets: Array<any> = []
            var createService: Array<any> = []
            res.data.data.forEach((element: { id: string }) => {
              createImgs.push(
                {
                  "pool_id": "+",
                  "directus_files_id": {
                    "id": element.id
                  }
                }
              )
            });
            arrayTickets.forEach(e => {
              createTickets.push(
                {
                  "ticket_type": e.type,
                  "ticket_name": e.name,
                  "price": e.price,
                  "total_ticket": e.remain
                }
              )
            })
            arrayPool.forEach(e => {
              var desIdk: string = e.type == "ADULT" ? 'Bể bơi có độ sâu từ 1m5 đến 2m thích hợp cho người lớn.' : 'Bể bơi có độ sâu từ 40cm đến 1m2 thích hợp cho trẻ em.'
              var imgIdk: string = e.type == "ADULT" ? 'ae205a25-ec7c-4f15-9b84-e22b7c5d505d' : '81667a99-ff3c-484a-8bed-ebcd0e42a088'
              const fd1 = new FormData()
              Array.from(e.file).forEach(el => {
                fd1.append("image[]", el)
              })
              axios
                .post(`${api}/files`, fd1, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`
                  },
                })
                .then(res => {
                  createPools.push(
                    {
                      "name": e.name,
                      "depth": e.depth,
                      "length": e.length,
                      "width": e.width,
                      "quantity": 1,
                      "description": desIdk,
                      "guest_type": e.type,
                      "capacity": 20,
                      "images": {
                        "create": [
                          {
                            "pool_detail_id": "+",
                            "directus_files_id": {
                              "id": res.data.data[0].id
                            }
                          }
                        ],
                        "update": [],
                        "delete": []
                      }
                    }
                  )
                })
                .catch(err => err)
            })
            arrayResultService.forEach(e => {
              createService.push(
                {
                  "pool_id": "+",
                  "service_id": {
                    "id": e
                  }
                }
              )
            })
            const sendData = {
              "name": poolname,
              "description": pooldes,
              "host_id": userId,
              "longtitude": geocoding.lng,
              "latitude": geocoding.lat,
              "location": value,
              "images": {
                "create": createImgs,
                "update": [],
                "delete": []
              },
              "opening_time": poolopenT,
              "closing_time": poolcloseT,
              "rating": (Math.random() * (5 - 3) + 3).toFixed(1),
              "pools": {
                "create": createPools,
                "update": [],
                "delete": []
              },
              "services": {
                "create": createService,
                "update": [],
                "delete": []
              },
              "tickets": {
                "create": createTickets,
                "update": [],
                "delete": []
              }
            }
            return axios.post(`${api}/items/pool`, sendData, {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
            )
          })
          .then(res => {
            location.href = '/mypool'
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: "Lỗi",
              text: 'Không thể tạo bể bơi!',
              confirmButtonText: 'Xác nhận',
            }).then(function (result) {
              if (result.value) {
                // window.location.href = '/'
              }
            })
          })
      }
    });


  }

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
    axios.get(`${api}/items/service?fields=icon,name,code,id`).then(res => {
      setArrayService(res.data.data)
      return axios.get(`${api}/users/me`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
    })
      .then(res => setUserId(res.data.data.id))
      .catch(err => err)
  }, [])

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.mainHeader} >
          <Link href="/" color="#22BFEA">
            Trang chủ
          </Link>
          <span>{`  >  `}</span>
          <Link href="" className={styles.mainHref}>
            {" "}
            Chủ bể bơi
          </Link>
        </div>
        <div className={styles.headerCreate} >
          <strong>Tạo bể bơi</strong>
          <Button content="Hoàn thành" btnStyle={ButtonStyle.primary} func={handleBtnComplete} />
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
                    <input type="text" id="poolname" placeholder="Vui lòng điền tên bể bơi" required value={poolname} onChange={e => setPoolname(e.target.value)} />
                  </div>
                  <div>
                    <label htmlFor="description">Chi tiết</label>
                    <textarea id="description" placeholder="Chi tiết bể bơi" rows={6} cols={50} value={pooldes} onChange={e => setPooldes(e.target.value)} />
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
                  <input type="file" accept="image/png, image/jpeg" multiple onChange={handleFileChange} ref={inputPic} style={{ display: 'none' }} />
                  <Button content="Thêm ảnh" btnStyle={ButtonStyle.secondary} type={ButtonType.button} func={(e) => {
                    inputPic.current?.click()
                  }} />
                  <Button content="Tiếp tục" btnStyle={ButtonStyle.primary} />
                </form>
              </TabPanel>
              <TabPanel className={styles.locationPanel + " " + styles.panel}>
                <h2>Điền vị trí bể bơi</h2>
                <div>
                  <input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Tìm kiếm trên Google Maps"
                  />
                  {status === "OK" && <ul>{renderSuggestions()}</ul>}
                </div>
                <div>
                  <APIProvider apiKey={process.env.NEXT_PUBLIC_GG_API_KEY!}>
                    <div style={{ height: "700px", width: "100%" }}>
                      <Map zoom={zoom} center={geocoding}>
                        <Marker position={geocoding} draggable onDragEnd={(e) => { setGeocoding(e.latLng!.toJSON()) }}>
                        </Marker>
                      </Map>
                    </div>
                  </APIProvider>
                </div>
                <Button content="Tiếp tục" btnStyle={ButtonStyle.primary} func={handleBtnPanel3} />
              </TabPanel>
              <TabPanel className={styles.poolPanel + " " + styles.panel}>
                <h2>Các loại bể</h2>
                {createPoolBox && <CreatePoolBox func={addPool} hide={hideCreatePoolBox} />}
                <div>
                  {arrayPool.map((e, i) => {
                    return <Pool ticket={e} func={removePool} i={i} />
                  })}
                  <CreateTicketBtn func={showCreatePoolBox} />
                </div>
                <Button content="Tiếp tục" btnStyle={ButtonStyle.primary} func={handleBtnPanel4} />
              </TabPanel>
              <TabPanel className={styles.ticketPanel + " " + styles.panel}>
                <h2>Các loại vé</h2>
                {createBox && <CreateTicketBox func={addTicket} hide={hideCreateBox} />}
                <div>
                  {arrayTickets.map((e, i) => {
                    return <Ticket ticket={e} func={removeTicket} i={i} />
                  })}
                  <CreateTicketBtn func={showCreateBox} />
                </div>
                <Button content="Tiếp tục" btnStyle={ButtonStyle.primary} func={handleBtnPanel5} />
              </TabPanel>
              <TabPanel className={styles.servicesPanel + " " + styles.panel}>
                <h2>Các dịch vụ</h2>
                <div>
                  {arrayService.map((e, i) => {
                    return (
                      <section>
                        <input type="checkbox" value={e.id} id={e.code} onChange={handleCheckboxChange} />
                        <label htmlFor={e.code}>
                          <Image src={`${api}/assets/${e.icon}`} height={50} width={50} alt="" />
                          <p>{e.name}</p>
                        </label>
                      </section>
                    )
                  })}
                </div>
                <Button content="Tiếp tục" btnStyle={ButtonStyle.primary} func={handleBtnPanel6} />
              </TabPanel>
              <TabPanel className={styles.servicesPanel + " " + styles.panel}>
                <h2>Giờ hoạt động</h2>
                <div>
                  <div>
                    <label htmlFor="openningtime" style={{ display: 'inline-block', width: '150px' }}>Giờ mở cửa</label>
                    <input type="text" id="openningtime" placeholder="Vui lòng điền giờ mở cửa" pattern="[0-9]+" required value={poolopenT} onChange={e => setPoolopenT(Number(e.target.value))} />
                  </div>
                  <div>
                    <label htmlFor="closingtime" style={{ display: 'inline-block', width: '150px' }}>Giờ đóng cửa</label>
                    <input type="text" id="closingtime" placeholder="Vui lòng điền giờ đóng cửa" pattern="[0-9]+" required value={poolcloseT} onChange={e => setPoolcloseT(Number(e.target.value))} />
                  </div>
                </div>
                <Button content="Hoàn thành" btnStyle={ButtonStyle.primary} func={handleBtnComplete} />
              </TabPanel>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  )
}

function CreateTicketBtn({ func }: { func: Function }) {
  return (
    <>
      <div className={styles.createTicket} onClick={e => func()} >
        <FontAwesomeIcon icon={faPlus} size="2x" style={{ borderRadius: '50%', padding: '16px', border: '1px solid #00B2EB' }} />
        <div className={styles.mainDes} >
          {"Thêm"}
        </div>
      </div>
    </>
  )
}
function Ticket({ ticket, func, i }: { ticket: ticketType, func: Function, i: number }) {
  function handleBtnRemove() {
    func(ticket, i)
  }
  return (
    <>
      <div className={styles.ticket} onClick={e => func()} >
        <FontAwesomeIcon icon={faTicket} size="2x" style={{ borderRadius: '50%', padding: '16px' }} />
        <div className={styles.mainDes}>
          <div >
            <strong>{ticket.name}</strong><br /><small>{ticket.price}</small>
          </div>
          <div onClick={() => handleBtnRemove()}>
            <FontAwesomeIcon icon={faXmark} size="2x" style={{ borderRadius: '50%', padding: '16px' }} />
          </div>
        </div>
      </div>
    </>
  )
}
function Pool({ ticket, func, i }: { ticket: poolType, func: Function, i: any }) {
  function handleBtnRemove() {
    func(ticket)
  }
  return (
    <>
      <div className={styles.ticket} onClick={e => func()} >
        {ticket.file && Array.from(ticket.file).map((e, i) => {
          return <img src={URL.createObjectURL(e)} height={50} />
        })}
        <div className={styles.mainDes}>
          <div >
            <strong>{ticket.name}</strong>
          </div>
          <div onClick={() => handleBtnRemove()}>
            <FontAwesomeIcon icon={faXmark} size="2x" style={{ borderRadius: '50%', padding: '16px' }} />
          </div>
        </div>
      </div>
    </>
  )
}
function CreateTicketBox({ func, hide }: { func: Function, hide: Function }) {
  const [Value, setValue] = useState<string>()
  const [Name, setName] = useState<string>()
  const [Price, setPrice] = useState<number>()
  const [Remain, setRemain] = useState<number>()
  function handleBtnPanel3() {
    if (!Remain || !Price || !Name) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Bạn cần nhập đủ các thông tin!',
      }).then(function (result) {
      })
      return
    }
    func(Value, Name, Price, Remain)
  }


  return (
    <>
      <section className={styles.createTicketBox}>
        <div style={{ padding: '16px', top: '0', right: 0, position: 'absolute', cursor: 'pointer' }} onClick={e => hide()}>
          <FontAwesomeIcon icon={faXmark} size="2x" />
        </div>
        <div>
          <Select options={optionsTicket} placeholder="Chọn loại vé" onChange={(value) => {
            setName(value?.label)
            setValue(value?.value)
          }} />
        </div>
        <div>
          <label htmlFor="price">Giá vé (VNĐ)</label>
          <input type="number" id="price" placeholder="Giá vé" pattern="[0-9]+" value={Price} onChange={e => setPrice(Number(e.target.value))} />
        </div>
        <div>
          <label htmlFor="price">Số lượng (Vé)</label>
          <input type="number" id="price" placeholder="Số lượng" pattern="[0-9]+" value={Remain} onChange={e => setRemain(Number(e.target.value))} />
        </div>
        <Button content="Thêm vé" btnStyle={ButtonStyle.primary} func={handleBtnPanel3} />
      </section>
      <section className={styles.backdrop} onClick={e => hide()}></section>
    </>
  )
}
function CreatePoolBox({ func, hide }: { func: Function, hide: Function }) {
  const [Value, setValue] = useState<string>()
  const [Name, setName] = useState<string>()
  const [Depth, setDepth] = useState<number>()
  const [Length, setLength] = useState<number>()
  const [Width, setWidth] = useState<number>()
  const [File, setFile] = useState<Array<any>>()
  const inputPic = useRef<HTMLInputElement>(null)
  function handleBtnPanel3() {
    if (!Depth || !Length || !Width || !Name || !File) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: 'Bạn cần nhập đủ các thông tin!',
      }).then(function (result) {
      })
      return
    }
    func(Value, Name, Depth, Length, Width, File)
  }
  const handleFileChange = (event: any) => {
    setFile(event.target.files);
  };


  return (
    <>
      <section className={styles.createPoolBox} style={{ width: '1200px', height: '700px' }}>
        <div style={{ display: 'flex', width: '100%', height: '600px' }}>
          <div style={{ flex: 'auto', }}>
            <div style={{ padding: '16px', top: '0', right: 0, position: 'absolute', cursor: 'pointer' }} onClick={e => hide()}>
              <FontAwesomeIcon icon={faXmark} size="2x" />
            </div>
            <div>
              <Select options={optionsPool} placeholder="Chọn loại bể" onChange={(value) => {
                setName(value?.label)
                setValue(value?.value)
              }} />
            </div>
            <div>
              <label htmlFor="depth">Độ sâu (m)</label>
              <input type="number" id="depth" placeholder="Độ sâu" pattern="[0-9]+" value={Depth} onChange={e => setDepth(Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="length">Chiều dài (m)</label>
              <input type="number" id="length" placeholder="Chiều dài" pattern="[0-9]+" value={Length} onChange={e => setLength(Number(e.target.value))} />
            </div>
            <div>
              <label htmlFor="width">Chiều rộng (m)</label>
              <input type="number" id="width" placeholder="Chiều rộng" pattern="[0-9]+" value={Width} onChange={e => setWidth(Number(e.target.value))} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', width: '500px', gap: '30px', marginLeft: '30px' }}>
            <input type="file" accept="image/png, image/jpeg" multiple={false} onChange={handleFileChange} ref={inputPic} style={{ display: 'none' }} />
            {File && Array.from(File).map((e, i) => {
              return <img src={URL.createObjectURL(e)} width={500} style={{ marginBottom: '30px' }} />
            })}
            <Button content="Chọn ảnh" btnStyle={ButtonStyle.secondary} func={(e) => {
              inputPic.current?.click()
            }} />
          </div>
        </div>
        <Button content="Thêm bể" btnStyle={ButtonStyle.primary} func={handleBtnPanel3} />
      </section>
      <section className={styles.backdrop} onClick={e => hide()}></section>
    </>
  )
}
