"use client"

import React from "react";
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, ArrowLeft, Eye, EyeOff, Briefcase } from "lucide-react"


type Role = "jobseeker" | "company"

export default function LoginPage() {
  const router = useRouter()
    const [activeTab, setActiveTab] = useState<Role>("jobseeker")
    const [showPassword, setShowPassword] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [formErrors, setFormErrors] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
  
    // 로그인 확인용
    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault()
      setLoading(true)
      setFormErrors(null)
      setFieldErrors({})
  
      const fd = new FormData(e.currentTarget)
      const email = String(fd.get("email") || "")
      const password = String(fd.get("password") || "")
  
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: activeTab }),
      })
  
      if (res.status === 422) {
        const data = await res.json()
        const fe: Record<string, string> = {}
        Object.entries<string[]>(data.fieldErrors || {}).forEach(([k, v]) =>(
          fe[k] = v?.[0] ?? ""
        ))
        setFieldErrors(fe)
      } else if (res.status === 403) {
        setFormErrors(
          activeTab === "jobseeker"
          ? "기업 계정으로 접속할 수 없습니다."
          : "구직자 계정으로 접속할 수 없습니다."
        )
      } else if (res.status === 401) {
        setFormErrors("이메일 또는 비밀번호가 일치하지 않습니다.")
      } else if (!res.ok) {
        setFormErrors("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
      } else {
        router.replace("/")
        router.refresh();
      }
      setLoading(false)
    }

  return (
    <>
      <div
        id="content"
        className="intergrated_login_content"
        style={{
          padding: "0px",
          fontFamily: 'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
          margin: "40px auto 0",
          position: "relative",
          zIndex: 1,
          width: "900px",
        }}
      >
        <div
          className="wrap_content"
          role="main"
          style={{
            margin: "0px",
            padding: "0px",
            fontFamily: 'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
          }}
        >
          <h1
            className="blind"
            style={{
              margin: "0px",
              padding: "0px",
              fontFamily:
                'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
              fontSize: "100%",
              fontWeight: "normal",
              overflow: "hidden",
              clip: "rect(1px, 1px, 1px, 1px)",
              width: "1px",
              height: "1px",
              position: "absolute",
            }}
          >
            회원로그인페이지입니다.
          </h1>
          <div
            className="wrap_intergranted_login_page"
            style={{
              fontFamily:
                'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
              margin: "0px auto 20px",
              padding: "20px 30px",
              border: "1px solid #d7dce5",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              width: "100%",
              height: "580px",
              boxSizing: "border-box",
            }}
          >
            <input
              name="login_tab_default"
              type="hidden"
              defaultValue="p"
              style={{
                margin: "0px",
                padding: "0px",
                fontFamily: "inherit",
                fontSize: "inherit",
                fontWeight: "inherit",
                fontStyle: "inherit",
                lineHeight: "normal",
              }}
            />
            <div
              className="box_logo"
              style={{
                margin: "0px",
                padding: "0px",
                fontFamily:
                  'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                className="item_logo"
                style={{
                  margin: "0px",
                  padding: "0px",
                  fontFamily:
                    'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                  position: "relative",
                }}
              >
                <a
                  className="link_logo saramin"
                  href="https://www.saramin.co.kr/zf_user"
                  style={{
                    margin: "0px",
                    padding: "0px",
                    fontFamily:
                      'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                    textDecoration: "none",
                    color: "rgb(68, 68, 68)",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  <svg
                    height="24"
                    width="91"
                    fill="none"
                    viewBox="0 0 91 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M21.1766 19.5331L21.1403 19.5556C20.8688 19.724 20.0415 20.237 18.5387 20.237C16.9802 20.237 16.0858 19.5804 16.0858 18.4352C16.0858 17.3882 17.04 16.6842 18.4595 16.6842C19.4703 16.6842 20.2265 16.8432 21.1205 17.0999L21.1766 17.1157V19.5331ZM13.7097 11.147C13.7097 11.6238 13.9028 12.0249 14.2535 12.2761C14.6865 12.5853 15.3191 12.6346 16.0349 12.4133C16.6797 12.2122 17.6468 11.972 18.5921 11.972C20.4034 11.972 21.1766 12.5955 21.1766 14.0574V14.8497L21.0801 14.8272C20.1073 14.6024 19.3289 14.4431 18.1699 14.4431C13.1987 14.4431 12.8125 17.5984 12.8125 18.5649C12.8125 20.7197 14.2547 23.022 18.3016 23.022C21.4606 23.022 23.3278 21.9477 23.8246 21.6184C24.2783 21.3231 24.4237 21.0443 24.4237 20.4709V14.1607C24.4237 10.7416 22.4883 9.00842 18.6708 9.00842C17.0756 9.00842 15.5579 9.3385 14.823 9.6461C14.0842 9.94305 13.7097 10.4482 13.7097 11.147Z"
                      fill="#4876EF"
                      fillRule="evenodd"
                    />
                    <path
                      clipRule="evenodd"
                      d="M60.0412 10.5117L59.9923 10.4605C59.0409 9.46999 57.8432 9.00842 56.2226 9.00842C54.478 9.00842 52.713 9.55445 51.5 10.4693C51.0129 10.8166 50.8496 11.1208 50.8496 11.6771V21.3117C50.8496 22.2388 51.6176 23.022 52.5272 23.022C53.4842 23.022 54.2056 22.2868 54.2056 21.3117V12.9036L54.2919 12.8497C54.5499 12.6851 55.236 12.2473 56.3795 12.2473C57.8396 12.2473 58.5803 13.0578 58.5803 14.6555V21.3117C58.5803 22.2388 59.3487 23.022 60.2583 23.022C61.1992 23.022 61.9363 22.2705 61.9363 21.3117V12.9036L62.023 12.8497C62.281 12.6851 62.9667 12.2473 64.111 12.2473C65.5507 12.2473 66.3114 13.0888 66.3114 14.6813V21.3117C66.3114 22.2388 67.0678 23.022 67.9625 23.022C68.9187 23.022 69.6678 22.2705 69.6678 21.3117V14.6039C69.6678 10.8388 67.91 9.00842 64.294 9.00842C62.7705 9.00842 61.3192 9.51361 60.0966 10.4681L60.0412 10.5117Z"
                      fill="#4876EF"
                      fillRule="evenodd"
                    />
                    <path
                      clipRule="evenodd"
                      d="M44.8001 19.5331L44.7637 19.5556C44.4927 19.724 43.6662 20.237 42.1626 20.237C40.6037 20.237 39.7097 19.5804 39.7097 18.4352C39.7097 17.3882 40.6635 16.6842 42.0834 16.6842C43.0937 16.6842 43.8504 16.8432 44.7439 17.0999L44.8001 17.1157V19.5331ZM37.3328 11.147C37.3328 11.6238 37.5263 12.0245 37.8765 12.2761C38.31 12.5853 38.9422 12.6346 39.658 12.4133C40.3027 12.2122 41.2698 11.972 42.2151 11.972C44.0265 11.972 44.7997 12.5955 44.7997 14.0574V14.8497L44.7031 14.8272C43.7304 14.6024 42.9519 14.4431 41.793 14.4431C36.8217 14.4431 36.4355 17.5984 36.4355 18.5649C36.4355 20.7197 37.8777 23.022 41.9247 23.022C45.0837 23.022 46.9508 21.9477 47.4481 21.6184C47.9013 21.3235 48.0468 21.0447 48.0468 20.4709V14.1607C48.0468 10.7416 46.1114 9.00842 42.2943 9.00842C40.6982 9.00842 39.1809 9.3385 38.4465 9.6461C37.7072 9.94305 37.3328 10.4478 37.3328 11.147Z"
                      fill="#4876EF"
                      fillRule="evenodd"
                    />
                    <path
                      clipRule="evenodd"
                      d="M34.0542 9.21343C33.5381 9.08733 32.6744 9.00842 31.8006 9.00842C28.8937 9.00842 27.2266 10.5946 27.2266 13.3608V21.4287C27.2266 22.3074 27.9563 23.022 28.8528 23.022C28.8678 23.02 28.8755 23.0188 28.884 23.0184L28.9123 23.0208H28.9139C29.8691 23.0208 30.6118 22.2816 30.6118 21.3375V14.0083C30.6118 12.8528 31.0862 12.2771 32.0624 12.2477C32.5081 12.2323 32.8816 12.3056 33.241 12.3758C33.5199 12.4297 33.7834 12.4809 34.0477 12.4809C35.1304 12.4809 35.6347 11.553 35.6347 10.9261C35.6347 10.0898 35.0737 9.48149 34.0542 9.21343Z"
                      fill="#4876EF"
                      fillRule="evenodd"
                    />
                    <path
                      clipRule="evenodd"
                      d="M7.35748 14.944L5.28128 14.5204C4.11921 14.2618 3.62413 13.8809 3.62413 13.2466C3.62413 12.8792 3.81582 12.0247 5.58942 12.0247C6.32493 12.0247 7.38837 12.2793 8.06328 12.6163C8.90413 13.0502 9.77113 12.9738 10.2718 12.4226C10.5514 12.1031 10.6987 11.6541 10.6639 11.2233C10.6409 10.9343 10.5276 10.5186 10.1209 10.1824C9.27327 9.47999 7.50561 9.00842 5.72171 9.00842C2.46602 9.00842 0.362098 10.7134 0.362098 13.3523C0.362098 15.8262 2.45136 16.8802 4.20397 17.3284C4.80481 17.4824 5.10503 17.5363 5.45278 17.5988C5.70191 17.6436 5.95975 17.6903 6.35899 17.7786C7.46759 18.0423 7.96109 18.4513 7.96109 19.105C7.96109 19.5797 7.69335 20.376 5.89638 20.376C4.65193 20.376 3.30648 20.0267 2.46879 19.4863C2.13055 19.2709 1.78399 19.1652 1.45723 19.1652C0.996997 19.1652 0.576371 19.3746 0.272982 19.7844C-0.19042 20.393 -0.0474384 21.3836 0.577559 21.9043C1.12255 22.3608 2.72109 23.4224 5.78429 23.4224C9.03008 23.4224 11.2108 21.6022 11.2108 18.8928C11.2108 16.8323 9.95015 15.5403 7.35748 14.944Z"
                      fill="#4876EF"
                      fillRule="evenodd"
                    />
                    <path
                      clipRule="evenodd"
                      d="M74.0721 7.40686C73.1596 7.40686 72.4707 8.13774 72.4707 9.10713V18.119C72.4707 19.0407 73.204 19.8189 74.0721 19.8189C74.97 19.8189 75.6738 19.0722 75.6738 18.119V9.10713C75.6738 8.15391 74.97 7.40686 74.0721 7.40686Z"
                      fill="#4876EF"
                      fillRule="evenodd"
                    />
                    <mask
                      id="mask0_2800_18175"
                      height="5"
                      width="6"
                      maskUnits="userSpaceOnUse"
                      x="71"
                      y="1"
                      style={{ maskType: "luminance" }}
                    >
                      <path
                        clipRule="evenodd"
                        d="M71.6699 1.00012H76.4746V5.80477H71.6699V1.00012Z"
                        fill="white"
                        fillRule="evenodd"
                      />
                    </mask>
                    <g mask="url(#mask0_2800_18175)">
                      <path
                        clipRule="evenodd"
                        d="M74.0722 1.00012C72.7026 1.00012 71.6699 2.01831 71.6699 3.36824C71.6699 4.73478 72.7251 5.80477 74.0722 5.80477C75.3745 5.80477 76.4746 4.68931 76.4746 3.36824C76.4746 2.04005 75.4194 1.00012 74.0722 1.00012Z"
                        fill="#4876EF"
                        fillRule="evenodd"
                      />
                    </g>
                    <mask
                      id="mask1_2800_18175"
                      height="15"
                      width="13"
                      maskUnits="userSpaceOnUse"
                      x="78"
                      y="9"
                      style={{ maskType: "luminance" }}
                    >
                      <path
                        clipRule="evenodd"
                        d="M78.4766 9.00842H90.4882V23.022H78.4766V9.00842Z"
                        fill="white"
                        fillRule="evenodd"
                      />
                    </mask>
                    <g mask="url(#mask1_2800_18175)">
                      <path
                        clipRule="evenodd"
                        d="M84.584 9.00842C81.2346 9.00842 79.4142 10.1834 79.0761 10.4189C78.6279 10.7298 78.4766 11.0335 78.4766 11.6256V21.3113C78.4766 22.2384 79.2492 23.022 80.1638 23.022C81.126 23.022 81.8515 22.2864 81.8515 21.3113V12.9036L81.8874 12.881C82.3792 12.5757 83.3769 12.2473 84.4791 12.2473C85.7524 12.2473 87.1133 12.9072 87.1133 14.759V21.3113C87.1133 22.2384 87.8863 23.022 88.8005 23.022C89.7628 23.022 90.4882 22.2864 90.4882 21.3113V14.6035C90.4882 10.9431 88.4467 9.00842 84.584 9.00842Z"
                        fill="#4876EF"
                        fillRule="evenodd"
                      />
                    </g>
                  </svg>
                </a>
              </div>

              {/* X 아이콘 로고 */}
              <div style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px"
              }}>
                <span style={{
                  fontSize: "24px",
                  color: "#666",
                  margin: "0 10px",
                  fontWeight: "bold"
                }}>✕</span>
              </div>

              {/* Jumpit 로고 */}
              <div
                className="item_logo jumpit"
                style={{
                  margin: "0px",
                  padding: "0px",
                  fontFamily:
                    'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                  position: "relative",
                  marginLeft: "10px",
                  display: "block"
                }}
              >
                <a
                  className="link_logo"
                  href="/"
                  style={{
                    margin: "0px",
                    padding: "0px",
                    fontFamily:
                      'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                    textDecoration: "none",
                    color: "rgb(68, 68, 68)",
                    display: "inline-block",
                    position: "relative",
                  }}
                >
                  <svg
                    height="24"
                    width="47"
                    fill="none"
                    viewBox="0 0 47 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.83626 11.3227L3.09343 13.8233C4.74991 12.9655 6.27896 11.7027 7.60095 10.1804C8.53386 11.5138 9.81034 12.6811 11.1392 13.4911L14.063 10.5854C12.3701 9.58428 10.857 8.18038 9.9719 6.51253C10.1858 6.05973 10.3815 5.81171 10.5544 5.33616H14.1586L14.8867 2.005H3.73509L3.02972 5.33616H6.52925C5.44617 7.98014 3.70778 9.81637 0.833984 11.3249L0.83626 11.3227Z"
                      fill="black"
                    />
                    <path
                      d="M13.4473 9.13558H16.0321L14.6077 15.0561H18.6943L21.6819 2H17.5953L16.6442 6.35735H14.0616L13.4473 9.13558Z"
                      fill="black"
                    />
                    <path
                      d="M0 22.4474H17.2246L18.6945 15.057H1.60414L0 22.4474ZM4.93302 17.5918L14.253 17.5827L13.9617 18.9638H4.63494L4.93529 17.5918H4.93302Z"
                      fill="black"
                    />
                    <path
                      d="M35.7103 10.9328H34.0151L34.9935 6.45032H31.3757L30.3973 10.9328H28.4518L29.4302 6.45032H25.9034L24.9273 10.9328H23.2185L22.5586 14.0979H35.0504L35.7103 10.9328Z"
                      fill="black"
                    />
                    <path
                      d="M37.5894 2.0061H25.2932L24.5605 5.33953H36.8521L37.5894 2.0061Z"
                      fill="black"
                    />
                    <path
                      d="M34.2087 16.2378L30.6363 15.1183C28.9275 18.0239 25.1868 19.1503 21.3027 19.5075L22.652 22.6998C25.3119 22.3904 28.2836 21.1753 30.6659 19.3664C32.5385 20.9865 35.5602 22.3426 38.3339 22.6293L40.6002 19.3437C37.8038 19.057 35.2189 18.7885 33.4828 17.3117C33.7445 16.9773 33.9857 16.62 34.2087 16.24V16.2378Z"
                      fill="black"
                    />
                    <path
                      d="M40.2293 2.01111L37.5762 14.0979L41.6673 14.0865L44.3158 2.01111H40.2293Z"
                      fill="black"
                    />
                    <path
                      d="M47 20.6981C47 21.829 46.083 22.7459 44.9521 22.7459C43.8213 22.7459 42.9043 21.829 42.9043 20.6981C42.9043 19.5672 43.8213 18.6503 44.9521 18.6503C46.083 18.6503 47 19.5672 47 20.6981Z"
                      fill="#5CF636"
                    />
                  </svg>
                </a>
              </div>

              {/* X 아이콘 로고 */}
              <div style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "10px"
              }}>
                <span style={{
                  fontSize: "24px",
                  color: "#666",
                  margin: "0 10px",
                  fontWeight: "bold"
                }}>✕</span>
              </div>

              {/* DrawBridge 로고 */}
              {/* rounded-2xl bg-gradient-to-br from-[#F4B819] to-[#E6A617] */}
              <div className="h-10 w-10 items-center justify-center"
                style={{
                  margin: "0px",
                  padding: "0px",
                  position: "relative",
                  marginLeft: "5px",
                  display: "flex"
                }}
              >
                <Image src="/logo_yellow.png" alt="Logo" width={30} height={30} />
              </div>
              <h1 className="text-1xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F4B819] to-[#E6A617]"
                style={{
                  position: "relative",
                  marginLeft: "5px",
                  display: "block"
              }}>DrawBridge</h1>

              {/* Back to Home */}
              <Link
                  href="/"
                  className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
                  style={{
                    margin: "0px",
                    padding: "0px",
                    marginLeft: "30px",
                    textDecoration: "none",
                    position: "relative",
                }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  홈으로 돌아가기
                </Link>
            </div>
            <div
              className="box_intergrated_login"
              style={{
                margin: "0px",
                padding: "0px",
                fontFamily:
                  'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                display: "flex",
                height: "100%",
              }}
            >
              <div
                className="box_left"
                style={{
                  margin: "0px",
                  padding: "0px",
                  fontFamily:
                    'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                  flex: "0 0 50%",
                }}
              >
                <div
                  className="area_intergranted_login person person_logo"
                  style={{
                    padding: "0px",
                    fontFamily:
                      'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                    margin: "0px auto",
                    width: "310px",
                    display: "block",
                  }}
                >
                  <strong
                    className="tit"
                    style={{
                      padding: "0px",
                      fontFamily:
                        'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                      fontStyle: "normal",
                      margin: "26px 0px 45px",
                      fontSize: "28px",
                      fontWeight: "normal",
                      lineHeight: "38px",
                      display: "block",
                    }}
                  >
                    {"다양한 사람인 서비스를"}
                    <br />
                    {"로그인 한 번으로"}
                    <br />
                    {"편하게 이용하세요!"}
                  </strong>
                </div>

                {/* 사람인 점핏 어깨동무 사진 */}
                <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                  <Image src="/login_widget.png" alt="Logo" width={300} height={300} />
                </div>
              </div>

              <div
                className="box_right"
                style={{
                  margin: "0px",
                  padding: "0px",
                  fontFamily:
                    'Pretendard, "Malgun Gothic", dotum, gulim, sans-serif',
                  flex: "0 0 50%",
                  position: "relative",
                }}
              >
                <div className="w-full max-w-md">

                <Card className="border-2">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-foreground">로그인</CardTitle>
                    <CardDescription className="text-muted-foreground">계정에 로그인하여 서비스를 이용하세요</CardDescription>
                  </CardHeader>
                  <CardContent>

                    {/* 기존에는 defaultvalue="jobseeker" */}
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Role)} className="w-full">

                      {/* 로그인 구분 */}
                      <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="jobseeker" className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>구직자</span>
                        </TabsTrigger>
                        <TabsTrigger value="company" className="flex items-center space-x-2">
                          <Building2 className="h-4 w-4" />
                          <span>기업</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* 구직자 로그인 */}
                      <TabsContent value="jobseeker">
                        <form className="space-y-4" onSubmit={onSubmit}>
                          <div className="space-y-2">
                            <Label htmlFor="jobseekerEmail">이메일</Label>
                            <Input id="jobseekerEmail" name="email" type="email" placeholder="example@email.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="jobseekerPassword">비밀번호</Label>
                            <div className="relative">
                              <Input
                                id="jobseekerPassword"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호를 입력해주세요"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                              비밀번호를 잊으셨나요?
                            </Link>
                          </div>

                          {/* 에러 확인 */}
                          {formErrors && (
                            <p className="text-red-500 text-sm mt-2">{formErrors}</p>
                          )}

                          <Button type="submit" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                            {loading ? "로그인 중..." : "구직자 로그인"}
                          </Button>
                        </form>
                      </TabsContent>

                      {/* 기업 로그인 */}
                      <TabsContent value="company">
                        <form className="space-y-4" onSubmit={onSubmit}>
                          <div className="space-y-2">
                            <Label htmlFor="employerEmail">담당자 이메일</Label>
                            <Input id="employerEmail" name="email" type="email" placeholder="manager@company.com" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="employerPassword">비밀번호</Label>
                            <div className="relative">
                              <Input
                                id="employerPassword"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="비밀번호를 입력해주세요"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                              비밀번호를 잊으셨나요?
                            </Link>
                          </div>

                          {/* 에러 확인 */}
                          {formErrors && (
                            <p className="text-red-500 text-sm mt-2">{formErrors}</p>
                          )}

                          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                            {loading ? "로그인 중..." : "기업 로그인"}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        아직 계정이 없으신가요?{" "}
                        <Link href="/main_signup" className="text-primary hover:underline">
                          회원가입하기
                        </Link>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              </div>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
            <symbol id="icon_login_naver" fill="none" viewBox="0 0 20 20">
              <path
                d="M13.5615 10.704L6.14588 0H0V20H6.43845V9.296L13.8541 20H20V0H13.5615V10.704Z"
                fill="white"
              />
            </symbol>
            <symbol id="icon_login_kakao" fill="none" viewBox="0 0 24 22">
              <path
                d="M12 -0.00012207C5.37092 -0.00012207 0 4.23616 0 9.46609C0 12.868 2.27684 15.8528 5.69401 17.5215C5.44314 18.4545 4.78556 20.9082 4.65252 21.4316C4.48907 22.0839 4.89199 22.0725 5.15426 21.8981C5.35952 21.7616 8.44219 19.6681 9.77257 18.7654C10.4948 18.8716 11.2398 18.9285 12 18.9285C18.6291 18.9285 24 14.6922 24 9.4623C24 4.23237 18.6291 -0.00012207 12 -0.00012207Z"
                fill="#181600"
              />
            </symbol>
            <symbol id="icon_login_google" fill="none" viewBox="0 0 22 22">
              <path
                clipRule="evenodd"
                d="M21.5593 11.25C21.5593 10.4697 21.4888 9.72048 21.3593 9.00027H10.9998V13.2552H16.9199C16.665 14.6303 15.8899 15.7951 14.7251 16.5754V19.3349H18.2805C20.3603 17.4199 21.5603 14.6002 21.5603 11.25H21.5593Z"
                fill="#4285F4"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M10.9993 22.0002C13.9692 22.0002 16.4594 21.0147 18.2791 19.3349L14.7236 16.5754C13.7382 17.2355 12.4791 17.6251 10.9983 17.6251C8.133 17.6251 5.70815 15.6904 4.84287 13.0904H1.16931V15.9401C2.97966 19.5349 6.69881 22.0002 10.9993 22.0002Z"
                fill="#34A853"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M4.84453 13.0895C4.62484 12.4294 4.49946 11.7248 4.49946 10.9994C4.49946 10.274 4.62484 9.56933 4.84453 8.90923V6.05951H1.16994C0.424868 7.54448 0 9.22426 0 10.9994C0 12.7745 0.424868 14.4543 1.16994 15.9392L4.84453 13.0895Z"
                fill="#FBBC05"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M10.9993 4.37511C12.6138 4.37511 14.0646 4.93054 15.2045 6.01966L18.3599 2.86423C16.4542 1.09015 13.9641 0 10.9993 0C6.69881 0 2.97966 2.46527 1.16931 6.06007L4.8439 8.90979C5.70918 6.30981 8.13404 4.37511 10.9993 4.37511Z"
                fill="#EA4335"
                fillRule="evenodd"
              />
            </symbol>
            <symbol id="icon_login_facebook" fill="none" viewBox="0 0 14 26">
              <path
                d="M4.60526 25.5H8.9386V14.4801H12.9504L13.3677 10.3223C13.3677 10.3223 13.4544 10.118 13.0165 10.118H8.9386V6.97963C8.9386 6.97963 8.75842 4.60805 11.1053 4.60805H13.5V0.937039C13.5 0.937039 12.4691 0.477875 9.97404 0.500833C9.97404 0.500833 7.77316 0.473283 6.05123 2.13086C6.05123 2.13086 4.60526 3.43489 4.60526 4.9134V10.118H0.5V14.4801H4.60526V25.5Z"
                fill="white"
              />
            </symbol>
            <symbol id="icon_login_apple" fill="none" viewBox="0 0 22 25">
              <path
                clipRule="evenodd"
                d="M8.48584 5.81313C8.27201 4.15256 9.4239 0.539339 13.4774 0C13.9464 2.78179 11.6001 5.97873 8.48584 5.81313Z"
                fill="white"
                fillRule="evenodd"
              />
              <path
                clipRule="evenodd"
                d="M20.7747 8.39829C19.4527 7.15287 18.3008 5.94884 15.8694 5.82349C13.9071 5.7407 13.0115 6.90332 11.1768 6.94472C9.47077 6.98612 9.59836 5.6579 6.0576 6.03164C2.98587 6.36283 0.298109 9.35277 0.511949 13.5467C0.725788 18.073 3.96764 24.3427 6.99566 24.3427C9.12815 24.3013 9.64089 23.3043 11.3894 23.3043C13.5644 23.3043 14.0772 24.5497 15.7832 24.3002C18.7261 23.885 21.499 19.3587 21.499 17.9063C19.878 17.076 18.2571 15.6638 18.0433 13.2972C17.8731 10.9305 19.3653 9.43557 20.7736 8.39714L20.7747 8.39829Z"
                fill="white"
                fillRule="evenodd"
              />
            </symbol>
          </svg>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
html {
  background: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  width: 100%;
  text-size-adjust: none;
  min-height: 100%;
  margin: 0px;
  padding: 0px;
  font-family: Pretendard, "Malgun Gothic", dotum, gulim, sans-serif;
}

body {
  width: 100%;
  text-size-adjust: none;
  min-height: 100%;
  margin: 0px;
  padding: 0px;
  font-family: Pretendard, "Malgun Gothic", dotum, gulim, sans-serif;
  position: relative;
  padding-top: 0px;
  min-width: 1280px;
  box-sizing: border-box;
}
`,
        }}
      />
    </>
  );
}
