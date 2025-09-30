"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  is_job_seeker: boolean;
  companies: { company_id: string; company_name: string; role: string }[];
  accountType: "company" | "jobseeker";
} | null;

export function JumpitCTASection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentBannerSlide, setCurrentBannerSlide] = useState(0);
  const [currentSideSlide, setSideSlide] = useState(0);
  const [currentBottomSlide, setCurrentBottomSlide] = useState(0);
  const totalSlides = 4; // 총 슬라이드 개수
  const totalBannerSlides = 2; // 배너 슬라이드 개수 (파란색, 녹색)
  const totalSideSlides = 3; // 사이드 슬라이드 개수
  const totalBottomSlides = 3; // 하단 슬라이드 개수 (5300px / 530px = 10개)
  const [user, setUser] = useState<SessionUser>(null);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // 클라이언트 컴포넌트
  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => { setUser(data) });
  }, []);

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 1500); // 1.5초마다 자동으로 다음 슬라이드로 이동

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [totalSlides]);

  // 배너 슬라이더 자동 애니메이션
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerSlide((prev) => (prev + 1) % totalBannerSlides);
    }, 2000); // 2초마다 자동으로 다음 배너 슬라이드로 이동

    return () => clearInterval(bannerInterval);
  }, [totalBannerSlides]);

  // 사이드 슬라이더 자동 애니메이션
  useEffect(() => {
    const sideInterval = setInterval(() => {
      setSideSlide((prev) => (prev + 1) % totalSideSlides);
    }, 2500); // 2.5초마다 자동으로 다음 사이드 슬라이드로 이동

    return () => clearInterval(sideInterval);
  }, [totalSideSlides]);

  // 하단 슬라이더 자동 애니메이션
  useEffect(() => {
    const bottomInterval = setInterval(() => {
      setCurrentBottomSlide((prev) => (prev + 1) % totalBottomSlides);
    }, 3000); // 3초마다 자동으로 다음 하단 슬라이드로 이동

    return () => clearInterval(bottomInterval);
  }, [totalBottomSlides]);

  return (
    <>
      <main
        className="sc-91f7b759-0 htkZDl"
        style={{
          margin: "0px",
          padding: "0px",
          display: "block",
          backgroundColor: "rgb(255, 255, 255)",
          paddingTop: "0px",
        }}
      >
        <div>
          <section
            className="sc-884cdeb2-0 jDpGsx"
            style={{
              padding: "0px",
              gap: "32px",
              margin: "32px auto",
              display: "flex",
              flexDirection: "column",
              width: "1060px",
            }}
          >
            <div
              className="sc-884cdeb2-1 gxtIeu"
              style={{ gap: "20px", display: "flex" }}
            >
              <div
                className="sc-90f62648-0 ecZRGq"
                style={{ position: "relative", width: "700px" }}
              >
                <div
                  className="slick-slider slick-initialized"
                  dir="ltr"
                  style={{
                    boxSizing: "border-box",
                    userSelect: "none",
                    touchAction: "pan-y",
                    WebkitTapHighlightColor: "transparent",
                    position: "relative",
                    display: "block",
                  }}
                >
                  <div className="sc-90f62648-2 eweOKp">
                    <button
                      className="sc-3fbad3de-0 eqUqtW slick-arrow slick-prev"
                      type="button"
                      aria-label="Previous"
                      onClick={prevSlide}
                      style={{
                        margin: "0px",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        border: "none",
                        borderRadius: "0px",
                        background: "none",
                        cursor: "pointer",
                        padding: "0.3px",
                        width: "41px",
                        height: "41px",
                        zIndex: 2,
                        position: "absolute",
                        bottom: "40px",
                        left: "50px",
                        display: "block",
                      }}
                    >
                      <svg
                        height="40"
                        width="40"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <g clipPath="url(#clip0_2450_17212)">
                          <path
                            d="M39.5 20c0 10.77-8.73 19.5-19.5 19.5S.5 30.77.5 20 9.23.5 20 .5 39.5 9.23 39.5 20Z"
                            stroke="#444"
                            style={{
                              fill: "transparent",
                              stroke: "rgb(255, 255, 255)",
                              opacity: 0.5,
                            }}
                          />
                          <path
                            clipRule="evenodd"
                            d="M23.09 26.84a.833.833 0 0 1-1.179 0l-6.25-6.25a.833.833 0 0 1 0-1.18l6.25-6.25a.833.833 0 0 1 1.179 1.18L17.43 20l5.66 5.66a.833.833 0 0 1 0 1.18Z"
                            fill="#444"
                            fillRule="evenodd"
                            style={{ fill: "rgb(255, 255, 255)" }}
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                  <div
                    className="slick-list"
                    style={{
                      position: "relative",
                      display: "block",
                      overflow: "hidden",
                      margin: "0px",
                      padding: "0px",
                      transform: "translateZ(0px)",
                    }}
                  >
                    <div
                      className="slick-track"
                      style={{
                        position: "relative",
                        top: "0px",
                        left: "0px",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "6300px",
                        opacity: 1,
                        transform: `translate3d(-${1400 + (currentSlide * 700)}px, 0px, 0px)`,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <div
                        className="slick-slide slick-cloned"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/position/51627847"
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`AI의 한계를 넘는 여정
에이엠스퀘어와 함께해요`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255309125345373/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 cRnGmW"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`AI의 한계를 넘는 여정
에이엠스퀘어와 함께해요`}</h3>
                          </a>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/company/ODAyODcwMjIzNQ=="
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`AI 영상분석 솔루션
피아스페이스 부문별 채용`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255209125201823/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 cRnGmW"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`AI 영상분석 솔루션
피아스페이스 부문별 채용`}</h3>
                          </a>
                        </div>
                      </div>
                      <div
                        className="slick-slide slick-active slick-current"
                        aria-hidden="false"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/company/MTYxODcwMDIwOQ=="
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`[핀다] 채용중!
BE, WEB, DEVOPS`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255409125451058/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 isJucR"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                animation:
                                  "1s ease 0s 1 normal none running bfxZeQ",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`[핀다] 채용중!
BE, WEB, DEVOPS`}</h3>
                          </a>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/company/MzM2ODcwMDY1Mg=="
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`의료차트의 새로운 표준
닥터팔레트 적극 채용중!`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255409125417415/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 cRnGmW"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`의료차트의 새로운 표준
닥터팔레트 적극 채용중!`}</h3>
                          </a>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/position/51627847"
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`AI의 한계를 넘는 여정
에이엠스퀘어와 함께해요`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255309125345373/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 cRnGmW"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`AI의 한계를 넘는 여정
에이엠스퀘어와 함께해요`}</h3>
                          </a>
                        </div>
                      </div>
                      <div
                        className="slick-slide slick-cloned"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/company/ODAyODcwMjIzNQ=="
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`AI 영상분석 솔루션
피아스페이스 부문별 채용`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255209125201823/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 cRnGmW"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`AI 영상분석 솔루션
피아스페이스 부문별 채용`}</h3>
                          </a>
                        </div>
                      </div>
                      <div
                        className="slick-slide slick-cloned"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/company/MTYxODcwMDIwOQ=="
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`[핀다] 채용중!
BE, WEB, DEVOPS`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255409125451058/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 isJucR"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                animation:
                                  "1s ease 0s 1 normal none running bfxZeQ",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`[핀다] 채용중!
BE, WEB, DEVOPS`}</h3>
                          </a>
                        </div>
                      </div>
                      <div
                        className="slick-slide slick-cloned"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/company/MzM2ODcwMDY1Mg=="
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`의료차트의 새로운 표준
닥터팔레트 적극 채용중!`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255409125417415/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 cRnGmW"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`의료차트의 새로운 표준
닥터팔레트 적극 채용중!`}</h3>
                          </a>
                        </div>
                      </div>
                      <div
                        className="slick-slide slick-cloned"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          width: "700px",
                        }}
                      >
                        <div>
                          <a
                            className="sc-90f62648-3 hEEMqi"
                            href="https://jumpit.saramin.co.kr/position/51627847"
                            tabIndex={-1}
                            target="_blank"
                            style={{
                              textDecoration: "none",
                              color: "rgb(0, 0, 0)",
                              position: "relative",
                              width: "100%",
                              display: "inline-block",
                            }}
                          >
                            <img
                              height={340}
                              width={700}
                              alt={`AI의 한계를 넘는 여정
에이엠스퀘어와 함께해요`}
                              src="https://cdn.jumpit.co.kr/images/328716/20255309125345373/profile-image.png"
                              style={{
                                border: "none",
                                display: "block",
                                borderRadius: "4px",
                              }}
                            />
                            <h3
                              className="sc-90f62648-4 cRnGmW"
                              style={{
                                margin: "0px",
                                padding: "0px",
                                whiteSpace: "pre",
                                color: "rgb(255, 255, 255)",
                                position: "absolute",
                                fontSize: "32px",
                                lineHeight: "42px",
                                bottom: "110px",
                                left: "50px",
                                width: "600px",
                              }}
                            >{`AI의 한계를 넘는 여정
에이엠스퀘어와 함께해요`}</h3>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="sc-90f62648-2 cXYAZm">
                    <button
                      className="sc-3fbad3de-0 eqUqtW slick-arrow slick-next"
                      type="button"
                      aria-label="Next"
                      onClick={nextSlide}
                      style={{
                        margin: "0px",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        border: "none",
                        borderRadius: "0px",
                        background: "none",
                        cursor: "pointer",
                        padding: "0.3px",
                        width: "41px",
                        height: "41px",
                        position: "absolute",
                        bottom: "40px",
                        left: "110px",
                        display: "block",
                      }}
                    >
                      <svg
                        height="40"
                        width="40"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "40px", height: "40px" }}
                      >
                        <g clipPath="url(#clip0_2450_17215)">
                          <path
                            d="M39.5 20c0 10.77-8.73 19.5-19.5 19.5S.5 30.77.5 20 9.23.5 20 .5 39.5 9.23 39.5 20Z"
                            stroke="#444"
                            style={{
                              fill: "transparent",
                              stroke: "rgb(255, 255, 255)",
                              opacity: 0.5,
                            }}
                          />
                          <path
                            clipRule="evenodd"
                            d="M16.911 13.16a.833.833 0 0 1 1.179 0l6.25 6.25a.833.833 0 0 1 0 1.18l-6.25 6.25a.833.833 0 1 1-1.179-1.18l5.66-5.66-5.66-5.66a.833.833 0 0 1 0-1.18Z"
                            fill="#444"
                            fillRule="evenodd"
                            style={{ fill: "rgb(255, 255, 255)" }}
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <aside
                className="sc-884cdeb2-2 iCirtB"
                style={{
                  margin: "0px",
                  padding: "0px",
                  gap: "20px",
                  display: "flex",
                  flexDirection: "column",
                  width: "340px",
                }}
              >
                <div
                  className="sc-60f82662-0 cvVvjS"
                  style={{
                    border: "1px solid rgb(228, 228, 228)",
                    padding: "32px 20px",
                    borderRadius: "4px",
                    position: "relative",
                    height: "220px",
                    backgroundColor: "rgb(250, 250, 250)",
                    boxSizing: "border-box",
                  }}
                >
                  <ul
                    style={{ margin: "0px", padding: "0px", listStyle: "none" }}
                  >
                    <li
                      className="title"
                      style={{
                        margin: "0px",
                        padding: "0px",
                        fontSize: "17px",
                        lineHeight: "24px",
                        fontWeight: 500,
                        color: "rgb(34, 34, 34)",
                        marginBottom: "5px",
                      }}
                    >
                      점핏 앱 다운로드 하고
                      <br />
                      편리하게 이용해보세요.
                    </li>
                    <li
                      className="app_store"
                      style={{
                        margin: "0px",
                        padding: "0px",
                        gap: "17px",
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "22px",
                        lineHeight: "30px",
                      }}
                    >
                      <button
                        type="button"
                        aria-label="go Apple Store"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          boxSizing: "border-box",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          border: "none",
                          borderRadius: "0px",
                          background: "none",
                          cursor: "pointer",
                          position: "relative",
                        }}
                      >
                        <span style={{ display: "flex" }}>
                          <div
                            className="icon_button_wrapper"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <svg
                              height="24"
                              width="24"
                              fill="none"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M19.457 8.819c-.121.09-2.26 1.244-2.26 3.81 0 2.968 2.722 4.019 2.803 4.045-.012.064-.432 1.438-1.435 2.838-.893 1.232-1.827 2.462-3.247 2.462s-1.785-.79-3.424-.79c-1.598 0-2.166.816-3.465.816s-2.205-1.14-3.247-2.54C3.975 17.816 3 15.26 3 12.837c0-3.888 2.64-5.95 5.237-5.95 1.38 0 2.531.868 3.398.868.825 0 2.11-.92 3.681-.92.595 0 2.734.051 4.141 1.984Zm-4.886-3.63c.65-.739 1.109-1.763 1.109-2.787 0-.142-.013-.286-.04-.402-1.057.038-2.314.674-3.072 1.516-.595.648-1.15 1.672-1.15 2.71 0 .156.027.312.04.362.066.012.175.026.283.026.948 0 2.14-.608 2.83-1.426Z"
                                fill="#000"
                              />
                            </svg>
                            <span
                              className="app_store_name"
                              style={{
                                fontSize: "12px",
                                lineHeight: "16px",
                                color: "rgb(102, 102, 102)",
                                fontWeight: 700,
                                marginLeft: "4px",
                              }}
                            >
                              App Store
                            </span>
                          </div>
                        </span>
                      </button>
                      <button
                        type="button"
                        aria-label="go Google Play"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          boxSizing: "border-box",
                          fontFamily: "inherit",
                          fontSize: "inherit",
                          border: "none",
                          borderRadius: "0px",
                          background: "none",
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ display: "flex" }}>
                          <div
                            className="icon_button_wrapper"
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <svg
                              height="24"
                              width="24"
                              fill="none"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.814 8.972a28258.82 28258.82 0 0 1-11.08-6.296 1.289 1.289 0 0 0-1.148-.152l9.29 9.432 2.938-2.984Z"
                                fill="#32BBFF"
                              />
                              <path
                                d="M4.586 2.523a1.329 1.329 0 0 0-.893 1.265v16.334a1.329 1.329 0 0 0 .892 1.265l9.29-9.432-9.29-9.432Z"
                                fill="#32BBFF"
                              />
                              <path
                                d="m13.875 11.955-9.29 9.432c.363.126.783.096 1.149-.152a7736.796 7736.796 0 0 1 11.082-6.294l-2.94-2.986Z"
                                fill="#32BBFF"
                              />
                              <path
                                d="M3.693 11.955v8.167a1.329 1.329 0 0 0 .892 1.265l9.29-9.432H3.693Z"
                                fill="#2C9FD9"
                              />
                              <path
                                d="M5.733 2.676a1.293 1.293 0 0 0-1.345-.067l9.346 9.49 3.079-3.127c-2.175-1.235-5.666-3.218-11.08-6.296Z"
                                fill="#29CC5E"
                              />
                              <path
                                d="m13.734 11.812-9.346 9.49c.4.215.912.228 1.345-.067a7803.62 7803.62 0 0 1 10.902-6.19l.18-.104-3.081-3.129Z"
                                fill="#D93F21"
                              />
                              <path
                                d="M20.693 11.956c0-.453-.225-.91-.67-1.163 0 0-.834-.472-3.39-1.924l-3.04 3.087 3.043 3.089c2.527-1.441 3.386-1.927 3.386-1.927.446-.253.67-.71.67-1.162Z"
                                fill="#FFD500"
                              />
                              <path
                                d="M20.022 13.118c.446-.254.67-.71.67-1.163h-7.098l3.042 3.09c2.527-1.442 3.386-1.927 3.386-1.927Z"
                                fill="#FA0"
                              />
                            </svg>
                            <span
                              className="app_store_name"
                              style={{
                                fontSize: "12px",
                                lineHeight: "16px",
                                color: "rgb(102, 102, 102)",
                                fontWeight: 700,
                                marginLeft: "4px",
                              }}
                            >
                              Google Play
                            </span>
                          </div>
                        </span>
                      </button>
                    </li>
                    <li
                      className="qr_code"
                      style={{
                        margin: "0px",
                        padding: "0px",
                        position: "absolute",
                        top: "32px",
                        right: "20px",
                      }}
                    >
                      <img
                        height={80}
                        width={80}
                        alt="앱 다운로드 QR 코드"
                        src="https://jumpit.saramin.co.kr/assets/ic_qr_code.svg"
                        style={{ border: "none" }}
                      />
                    </li>
                    <li
                      className="login_button_wrap"
                      style={{ margin: "0px", padding: "0px" }}
                    >
                      <section>
                        {user ? (
                          <button
                            className="sc-4e6882eb-0 kvIYYK"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push("/main_mypage");
                            }}
                            style={{
                              margin: "0px",
                              boxSizing: "border-box",
                              fontFamily: "inherit",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              padding: "0px 16px",
                              fontSize: "15px",
                              lineHeight: "22px",
                              height: "48px",
                              minWidth: "180px",
                              color: "rgb(255, 255, 255)",
                              backgroundColor: "rgb(0, 0, 0)",
                              borderRadius: "8px",
                              marginTop: "28px",
                              width: "100%",
                              fontWeight: 700,
                            }}
                          >
                            마이페이지
                          </button>
                        ) : (
                          <button
                            className="sc-4e6882eb-0 kvIYYK"
                            onClick={(e) => {
                              e.preventDefault();
                              router.push("/main_login");
                            }}
                            style={{
                              margin: "0px",
                              boxSizing: "border-box",
                              fontFamily: "inherit",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              padding: "0px 16px",
                              fontSize: "15px",
                              lineHeight: "22px",
                              height: "48px",
                              minWidth: "180px",
                              color: "rgb(255, 255, 255)",
                              backgroundColor: "rgb(0, 0, 0)",
                              borderRadius: "8px",
                              marginTop: "28px",
                              width: "100%",
                              fontWeight: 700,
                            }}
                          >
                            회원가입 / 로그인
                          </button>
                        )}
                      </section>
                    </li>
                  </ul>
                </div>
                <div
                  className="sc-abb239bf-0 iBNVRj"
                  style={{
                    padding: "20px 20px 26px",
                    border: "1px solid rgb(228, 228, 228)",
                    borderRadius: "4px",
                    width: "340px",
                    minHeight: "100px",
                  }}
                >
                  <h2
                    style={{
                      margin: "0px",
                      padding: "0px",
                      color: "rgb(0, 221, 109)",
                      fontSize: "13px",
                      lineHeight: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Notice
                  </h2>
                  <div
                    className="notice_list"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "6px",
                    }}
                  >
                    <span
                      className="notice_con"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        color: "rgb(34, 34, 34)",
                        fontSize: "15px",
                        lineHeight: "22px",
                        cursor: "pointer",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: "1",
                        WebkitBoxOrient: "vertical",
                        width: "80%",
                      }}
                    >
                      [공지] 개인정보 처리방침 개정에 대해 안내드립니다.
                      (20250812)
                    </span>
                    <span
                      className="notice_date"
                      style={{
                        color: "rgb(153, 153, 153)",
                        flexShrink: 0,
                        fontSize: "14px",
                        lineHeight: "20px",
                      }}
                    >
                      2025-08
                    </span>
                  </div>
                </div>
              </aside>
            </div>
            <div
              className="slick-slider slick-initialized"
              dir="ltr"
              style={{
                boxSizing: "border-box",
                userSelect: "none",
                touchAction: "pan-y",
                WebkitTapHighlightColor: "transparent",
                position: "relative",
                display: "block",
              }}
            >
              <div
                className="slick-list"
                style={{
                  position: "relative",
                  display: "block",
                  overflow: "hidden",
                  margin: "0px",
                  padding: "0px",
                  transform: "translateZ(0px)",
                }}
              >
                <div
                  className="slick-track"
                  style={{
                    position: "relative",
                    top: "0px",
                    left: "0px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "5300px",
                    opacity: 1,
                    transform: `translate3d(-${2120 + (currentBannerSlide * 1060)}px, 0px, 0px)`,
                    transition: "transform 0.5s ease",
                  }}
                >
                  <div
                    className="slick-slide slick-cloned"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      width: "1060px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-884cdeb2-15 dudscA"
                        tabIndex={-1}
                        style={{ display: "block", width: "unset" }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://jumpit.saramin.co.kr/report?utm_source=jumpit_per&utm_medium=main_home&utm_campaign=report_2025&utm_term=report_2025"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture style={{ display: "flex" }}>
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/106/20251926081901787/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/106/20251826081858649/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/106/20251826081854360/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/106/20251826081854360/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      outline: "none",
                      width: "1060px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-884cdeb2-15 dudscA"
                        tabIndex={-1}
                        style={{ display: "block", width: "unset" }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://jumpit.saramin.co.kr/applications-status/applied?utm_source=jumpit_per&utm_medium=bnr&utm_campaign=main_home&utm_term=celebrate"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture style={{ display: "flex" }}>
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20251427101416082/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20251427101402508/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20251327101357041/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20251327101357041/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide slick-active slick-current"
                    aria-hidden="false"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      outline: "none",
                      width: "1060px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-884cdeb2-15 dudscA"
                        tabIndex={-1}
                        style={{ display: "block", width: "unset" }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://jumpit.saramin.co.kr/report?utm_source=jumpit_per&utm_medium=main_home&utm_campaign=report_2025&utm_term=report_2025"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture style={{ display: "flex" }}>
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/106/20251926081901787/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/106/20251826081858649/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/106/20251826081854360/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/106/20251826081854360/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide slick-cloned"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      width: "1060px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-884cdeb2-15 dudscA"
                        tabIndex={-1}
                        style={{ display: "block", width: "unset" }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://jumpit.saramin.co.kr/applications-status/applied?utm_source=jumpit_per&utm_medium=bnr&utm_campaign=main_home&utm_term=celebrate"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture style={{ display: "flex" }}>
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20251427101416082/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20251427101402508/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20251327101357041/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20251327101357041/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide slick-cloned"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      width: "1060px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-884cdeb2-15 dudscA"
                        tabIndex={-1}
                        style={{ display: "block", width: "unset" }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://jumpit.saramin.co.kr/report?utm_source=jumpit_per&utm_medium=main_home&utm_campaign=report_2025&utm_term=report_2025"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture style={{ display: "flex" }}>
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/106/20251926081901787/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/106/20251826081858649/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/106/20251826081854360/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/106/20251826081854360/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="sc-884cdeb2-11 eXQOuM"
              aria-label="테마별 모음.zip"
              role="region"
            >
              <div className="sc-716a116f-0 cZyQnu">
                <div
                  className="sc-716a116f-1 fWNEGh"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    className="title"
                    style={{
                      margin: "0px",
                      padding: "0px",
                      fontWeight: 700,
                      fontSize: "24px",
                      lineHeight: "32px",
                      color: "rgb(34, 34, 34)",
                    }}
                  >
                    테마별 모음.zip
                  </h3>
                  <div
                    className="btns"
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <a
                      href="https://jumpit.saramin.co.kr/theme"
                      style={{
                        textDecoration: "underline",
                        color: "rgb(136, 136, 136)",
                        marginRight: "12px",
                      }}
                    >
                      전체 보기
                    </a>
                    <button
                      className="sc-3fbad3de-0 dRaePU"
                      type="button"
                      aria-label="Previous"
                      disabled
                      style={{
                        margin: "0px",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        border: "none",
                        borderRadius: "0px",
                        background: "none",
                        padding: "0.3px",
                        width: "33px",
                        height: "33px",
                        cursor: "default",
                      }}
                    >
                      <svg
                        height="40"
                        width="40"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <g clipPath="url(#clip0_2450_17212)">
                          <path
                            d="M39.5 20c0 10.77-8.73 19.5-19.5 19.5S.5 30.77.5 20 9.23.5 20 .5 39.5 9.23 39.5 20Z"
                            stroke="#444"
                            style={{
                              fill: "transparent",
                              stroke: "rgb(196, 196, 196)",
                            }}
                          />
                          <path
                            clipRule="evenodd"
                            d="M23.09 26.84a.833.833 0 0 1-1.179 0l-6.25-6.25a.833.833 0 0 1 0-1.18l6.25-6.25a.833.833 0 0 1 1.179 1.18L17.43 20l5.66 5.66a.833.833 0 0 1 0 1.18Z"
                            fill="#444"
                            fillRule="evenodd"
                            style={{ fill: "rgb(196, 196, 196)" }}
                          />
                        </g>
                      </svg>
                    </button>
                    <button
                      className="sc-3fbad3de-0 dRaePU"
                      type="button"
                      aria-label="Next"
                      style={{
                        margin: "0px",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        border: "none",
                        borderRadius: "0px",
                        background: "none",
                        cursor: "pointer",
                        padding: "0.3px",
                        width: "33px",
                        height: "33px",
                        marginLeft: "6px",
                      }}
                    >
                      <svg
                        height="40"
                        width="40"
                        aria-hidden="true"
                        fill="none"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <g clipPath="url(#clip0_2450_17215)">
                          <path
                            d="M39.5 20c0 10.77-8.73 19.5-19.5 19.5S.5 30.77.5 20 9.23.5 20 .5 39.5 9.23 39.5 20Z"
                            stroke="#444"
                          />
                          <path
                            clipRule="evenodd"
                            d="M16.911 13.16a.833.833 0 0 1 1.179 0l6.25 6.25a.833.833 0 0 1 0 1.18l-6.25 6.25a.833.833 0 1 1-1.179-1.18l5.66-5.66-5.66-5.66a.833.833 0 0 1 0-1.18Z"
                            fill="#444"
                            fillRule="evenodd"
                          />
                        </g>
                      </svg>
                    </button>
                  </div>
                </div>
                <div
                  className="slick-slider slick-initialized"
                  dir="ltr"
                  style={{
                    boxSizing: "border-box",
                    userSelect: "none",
                    touchAction: "pan-y",
                    WebkitTapHighlightColor: "transparent",
                    position: "relative",
                    display: "block",
                  }}
                >
                  <div
                    className="slick-list"
                    style={{
                      position: "relative",
                      display: "block",
                      overflow: "hidden",
                      margin: "0px",
                      padding: "0px",
                      transform: "translateZ(0px)",
                    }}
                  >
                    <div
                      className="slick-track"
                      style={{
                        position: "relative",
                        top: "0px",
                        left: "0px",
                        display: "block",
                        marginRight: "auto",
                        marginLeft: "0px",
                        width: "5300px",
                        opacity: 1,
                        transform: `translate3d(-${currentBottomSlide * 530}px, 0px, 0px)`,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <div
                        className="slick-slide slick-active slick-current"
                        aria-hidden="false"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/hitmi"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 eRazml"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/banners/pc_bn_themes_hitmi.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(0, 0, 0)",
                                    wordBreak: "keep-all",
                                  }}
                                >
                                  요즘 폼 미친 기업s
                                </h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide slick-active"
                        aria-hidden="false"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/showmethemoney"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 lamwlH"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/banners/pc_bn_themes_showmethemoney.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(0, 0, 0)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`내 연봉 앞자리가
바뀌는 포지션`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/jobinterview"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 fRbtZS"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/jobinterview/pc_bn_themes_jobinterview.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(0, 0, 0)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`개발자 인터뷰가
등록된 HOT 기업`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/rookie"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 eaTDqO"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/rookie/pc_bn_themes_rookie.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(255, 255, 255)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`신입 개발자를 위한
더.루키 포지션`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/unicorns"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 eknxUR"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/unicorns/pc_bn_themes_unicorns.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(0, 0, 0)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`K-유니콘으로
무럭무럭 크는 중`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/iamt"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 lhbLzK"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/banners/pc_bn_themes_iamt.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(0, 0, 0)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`나는 T다.
로봇 개발자가 되어볼까?`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/forthefuture"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 fwsUBC"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/forthefuture/pc_bn_themes_forthefuture.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(0, 0, 0)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`이제는 필환경 시대!
지구를 지키는 착한 기업`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/msaischool"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 dSZzEq"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/msaischool/pc_bn_themes_msaischool.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(255, 255, 255)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`마이크로소프트
AI School 채용관`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/krafton"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 cBaGHG"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/banners/pc_bn_themes_krafton.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(0, 0, 0)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`기본기를 갖춘 개발자
크래프톤 정글 채용관`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div
                        className="slick-slide"
                        aria-hidden="true"
                        tabIndex={-1}
                        style={{
                          float: "left",
                          height: "100%",
                          minHeight: "1px",
                          display: "block",
                          outline: "none",
                          width: "530px",
                        }}
                      >
                        <div>
                          <div
                            className="sc-884cdeb2-12 fGTAoa"
                            tabIndex={-1}
                            style={{ width: "100%", display: "inline-block" }}
                          >
                            <a
                              href="https://jumpit.saramin.co.kr/theme/wecode"
                              style={{
                                textDecoration: "none",
                                color: "rgb(0, 0, 0)",
                              }}
                            >
                              <div
                                className="sc-884cdeb2-14 eDMkon"
                                style={{
                                  borderRadius: "8px",
                                  background:
                                    'url("https://cdn.jumpit.co.kr/jumpit/position/themes/banners/pc_bn_themes_wecode.webp") center center / 520px 140px no-repeat',
                                  position: "relative",
                                  width: "520px",
                                  height: "140px",
                                }}
                              >
                                <h5
                                  style={{
                                    margin: "0px",
                                    whiteSpace: "pre-wrap",
                                    position: "absolute",
                                    top: "30px",
                                    left: "30px",
                                    fontWeight: 700,
                                    fontSize: "18px",
                                    lineHeight: "26px",
                                    color: "rgb(255, 255, 255)",
                                    wordBreak: "keep-all",
                                  }}
                                >{`오프라인 NO.1 부트캠프
위코드 전용 채용관`}</h5>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section
            className="sc-884cdeb2-6 dnKSmY"
            style={{
              padding: "0px",
              display: "block",
              margin: "0px auto 64px",
              width: "1060px",
            }}
          >
            <div
              className="sc-884cdeb2-7 lWjaN"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h3
                style={{
                  margin: "0px",
                  padding: "0px",
                  fontWeight: 700,
                  fontSize: "24px",
                  lineHeight: "32px",
                  color: "rgb(34, 34, 34)",
                }}
              >
                회원님을 위한 AI 추천 포지션을 보고싶다면?
              </h3>
            </div>
            <div
              className="sc-884cdeb2-8 eFRQpE"
              role="link"
              style={{
                padding: "0px 26px 0px 20px",
                borderRadius: "4px",
                marginTop: "16px",
                backgroundColor: "rgb(245, 245, 248)",
                height: "56px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <p
                style={{
                  margin: "0px",
                  padding: "0px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "15px",
                  lineHeight: "22px",
                  fontWeight: 500,
                  color: "rgb(34, 34, 34)",
                  position: "relative",
                  width: "100%",
                }}
              >
                <i
                  style={{
                    background: "rgb(255, 255, 255)",
                    borderRadius: "100%",
                    width: "36px",
                    height: "36px",
                    minWidth: "36px",
                    minHeight: "36px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "8px",
                    fontStyle: "normal",
                  }}
                >
                  🖐
                </i>
                <span
                  style={{ position: "relative", width: "100%" }}
                >{`3초만에 로그인하고
딱 맞는 포지션을 추천 받아보세요!`}</span>
              </p>
              <span
                style={{
                  whiteSpace: "pre",
                  fontWeight: 400,
                  fontSize: "13px",
                  lineHeight: "18px",
                  color: "rgb(119, 119, 119)",
                  right: "10px",
                  position: "relative",
                }}
              >
                회원가입/로그인
                <svg
                  height="12"
                  width="12"
                  fill="none"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    display: "block",
                    position: "absolute",
                    right: "-12px",
                    top: "4px",
                  }}
                >
                  <path
                    clipRule="evenodd"
                    d="M4.146 1.896a.5.5 0 0 1 .708 0l3.75 3.75a.5.5 0 0 1 0 .708l-3.75 3.75a.5.5 0 0 1-.708-.708L7.543 6 4.146 2.604a.5.5 0 0 1 0-.708Z"
                    fill="#222"
                    fillRule="evenodd"
                    style={{ fill: "rgb(196, 196, 196)" }}
                  />
                </svg>
              </span>
            </div>
          </section>
          <section
            className="sc-884cdeb2-4 dWuhJn"
            style={{
              padding: "0px",
              display: "block",
              margin: "40px auto 100px",
              maxWidth: "1080px",
            }}
          >
            <div className="sc-bc6eaaeb-0 bHwmuy">
              <div
                className="sc-bc6eaaeb-1 dsjaUt"
                style={{ display: "flex", marginBottom: "6px" }}
              >
                <h3
                  className="sc-bc6eaaeb-2 bZHpqb"
                  style={{
                    margin: "0px",
                    padding: "0px 10px",
                    fontSize: "24px",
                    lineHeight: "32px",
                    fontWeight: 700,
                  }}
                >
                  <div>이번주 인기 포지션</div>
                </h3>
              </div>
              <div
                className="sc-bc6eaaeb-3 jrttMM"
                style={{
                  margin: "0px auto",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="sc-d609d44f-0 dzfXSV"
                  style={{
                    flex: "1 1 22%",
                    padding: "10px",
                    opacity: "initial",
                    position: "relative",
                    width: "calc(25% - 20px)",
                    boxSizing: "border-box",
                    maxWidth: "270px",
                  }}
                >
                  <a
                    href="https://jumpit.saramin.co.kr/position/51592917?DP=HOME_WEEKLY_POSITION_RECOMMEND"
                    target="_self"
                    title="백엔드 주니어 개발자(1~3년)"
                    style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                  >
                    <div className="img_filter" />
                    <div
                      className="img_box"
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "166px",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img"
                        alt="푸딘코"
                        src="https://cdn.jumpit.co.kr/lg/images/340928/20250416120454633/profile-image.webp"
                        style={{
                          border: "none",
                          transition: "0.3s",
                          width: "250px",
                          height: "166px",
                          objectFit: "cover",
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                      <div
                        className="sc-d609d44f-3 hwTKyC"
                        style={{
                          gap: "4px",
                          position: "absolute",
                          display: "flex",
                          top: "12px",
                          left: "12px",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="sc-a0b0873a-0 fdoAcj"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgb(255, 255, 255)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "rgb(68, 68, 68)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(0, 0, 0, 0.08) 0px -2px 4px 0px",
                          }}
                        >
                          D-5
                        </span>
                      </div>
                      <div
                        className="counts"
                        style={{
                          display: "none",
                          top: "16px",
                          right: "16px",
                          position: "absolute",
                          marginLeft: "auto",
                          color: "rgb(255, 255, 255)",
                          fontSize: "13px",
                          lineHeight: "18px",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="sc-fd5ea417-6 dXdfDi"
                          type="button"
                          aria-pressed="false"
                          style={{
                            margin: "0px",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            border: "none",
                            borderRadius: "0px",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <svg
                            height="24"
                            width="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <path
                              clipRule="evenodd"
                              d="M10.725 14.71a2 2 0 0 1 2.55 0l3.975 3.289V5H6.75v12.999l3.975-3.29ZM4.75 20.123V5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v15.124a1 1 0 0 1-1.638.77L12 16.25l-5.612 4.645a1 1 0 0 1-1.638-.77Z"
                              fill="#222"
                              fillRule="evenodd"
                              style={{ fill: "rgb(255, 255, 255)" }}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className="sc-15ba67b8-0 kkQQfR"
                      style={{
                        padding: "12px 0px 36px",
                        width: "calc(100% - 7px)",
                      }}
                    >
                      <div
                        className="sc-15ba67b8-2 ixzmqw"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgb(68, 68, 68)",
                            textOverflow: "ellipsis",
                          }}
                        >
                          푸딘코
                        </span>
                      </div>
                      <h2
                        className="position_card_info_title"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          overflow: "hidden",
                          marginTop: "6px",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        백엔드 주니어 개발자(1~3년)
                      </h2>
                      <ul
                        className="sc-15ba67b8-1 iFMgIl"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          overflow: "hidden",
                          display: "flex",
                          marginTop: "8px",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          height: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          MySQL
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · PHP
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · AWS
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · MariaDB
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Redis
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · REST API
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Git
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Java
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Node.js
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Slack
                        </li>
                      </ul>
                      <ul
                        className="sc-15ba67b8-1 cdeuol"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          display: "flex",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          marginTop: "4px",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          서울 강남구
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          경력 1~3년
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
                <div
                  className="sc-d609d44f-0 dzfXSV"
                  style={{
                    flex: "1 1 22%",
                    padding: "10px",
                    opacity: "initial",
                    position: "relative",
                    width: "calc(25% - 20px)",
                    boxSizing: "border-box",
                    maxWidth: "270px",
                  }}
                >
                  <a
                    href="https://jumpit.saramin.co.kr/position/51706727?DP=HOME_WEEKLY_POSITION_RECOMMEND"
                    target="_self"
                    title="Front-End 개발자(1년이상)"
                    style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                  >
                    <div className="img_filter" />
                    <div
                      className="img_box"
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "166px",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img"
                        alt="이노케어플러스"
                        src="https://cdn.jumpit.co.kr/lg/images/297033/20243910113943794/profile-image.webp"
                        style={{
                          border: "none",
                          transition: "0.3s",
                          width: "250px",
                          height: "166px",
                          objectFit: "cover",
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                      <div
                        className="sc-d609d44f-3 hwTKyC"
                        style={{
                          gap: "4px",
                          position: "absolute",
                          display: "flex",
                          top: "12px",
                          left: "12px",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="sc-a0b0873a-0 fdoAcj"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgb(255, 255, 255)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "rgb(68, 68, 68)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(0, 0, 0, 0.08) 0px -2px 4px 0px",
                          }}
                        >
                          D-9
                        </span>
                      </div>
                      <div
                        className="counts"
                        style={{
                          display: "none",
                          top: "16px",
                          right: "16px",
                          position: "absolute",
                          marginLeft: "auto",
                          color: "rgb(255, 255, 255)",
                          fontSize: "13px",
                          lineHeight: "18px",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="sc-fd5ea417-6 dXdfDi"
                          type="button"
                          aria-pressed="false"
                          style={{
                            margin: "0px",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            border: "none",
                            borderRadius: "0px",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <svg
                            height="24"
                            width="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <path
                              clipRule="evenodd"
                              d="M10.725 14.71a2 2 0 0 1 2.55 0l3.975 3.289V5H6.75v12.999l3.975-3.29ZM4.75 20.123V5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v15.124a1 1 0 0 1-1.638.77L12 16.25l-5.612 4.645a1 1 0 0 1-1.638-.77Z"
                              fill="#222"
                              fillRule="evenodd"
                              style={{ fill: "rgb(255, 255, 255)" }}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className="sc-15ba67b8-0 kkQQfR"
                      style={{
                        padding: "12px 0px 36px",
                        width: "calc(100% - 7px)",
                      }}
                    >
                      <div
                        className="sc-15ba67b8-2 ixzmqw"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgb(68, 68, 68)",
                            textOverflow: "ellipsis",
                          }}
                        >
                          이노케어플러스
                        </span>
                      </div>
                      <h2
                        className="position_card_info_title"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          overflow: "hidden",
                          marginTop: "6px",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        Front-End 개발자(1년이상)
                      </h2>
                      <ul
                        className="sc-15ba67b8-1 iFMgIl"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          overflow: "hidden",
                          display: "flex",
                          marginTop: "8px",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          height: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          CSS 3
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · HTML5
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · JavaScript
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · React
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Redux
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Webpack
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Babel
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Git
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · REST API
                        </li>
                      </ul>
                      <ul
                        className="sc-15ba67b8-1 cdeuol"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          display: "flex",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          marginTop: "4px",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          서울 서초구
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          경력 1~10년
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
                <div
                  className="sc-d609d44f-0 dzfXSV"
                  style={{
                    flex: "1 1 22%",
                    padding: "10px",
                    opacity: "initial",
                    position: "relative",
                    width: "calc(25% - 20px)",
                    boxSizing: "border-box",
                    maxWidth: "270px",
                  }}
                >
                  <a
                    href="https://jumpit.saramin.co.kr/position/51791374?DP=HOME_WEEKLY_POSITION_RECOMMEND"
                    target="_self"
                    title="Java Spring 웹개발자 (경력)"
                    style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                  >
                    <div className="img_filter" />
                    <div
                      className="img_box"
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "166px",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img"
                        alt="하이퍼정보"
                        src="https://cdn.jumpit.co.kr/lg/images/hmlee_4/20221814111822631_954_640.webp"
                        style={{
                          border: "none",
                          transition: "0.3s",
                          width: "250px",
                          height: "166px",
                          objectFit: "cover",
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                      <div
                        className="sc-d609d44f-3 hwTKyC"
                        style={{
                          gap: "4px",
                          position: "absolute",
                          display: "flex",
                          top: "12px",
                          left: "12px",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="sc-a0b0873a-0 fdoAcj"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgb(255, 255, 255)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "rgb(68, 68, 68)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(0, 0, 0, 0.08) 0px -2px 4px 0px",
                          }}
                        >
                          D-19
                        </span>
                      </div>
                      <div
                        className="counts"
                        style={{
                          display: "none",
                          top: "16px",
                          right: "16px",
                          position: "absolute",
                          marginLeft: "auto",
                          color: "rgb(255, 255, 255)",
                          fontSize: "13px",
                          lineHeight: "18px",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="sc-fd5ea417-6 dXdfDi"
                          type="button"
                          aria-pressed="false"
                          style={{
                            margin: "0px",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            border: "none",
                            borderRadius: "0px",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <svg
                            height="24"
                            width="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <path
                              clipRule="evenodd"
                              d="M10.725 14.71a2 2 0 0 1 2.55 0l3.975 3.289V5H6.75v12.999l3.975-3.29ZM4.75 20.123V5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v15.124a1 1 0 0 1-1.638.77L12 16.25l-5.612 4.645a1 1 0 0 1-1.638-.77Z"
                              fill="#222"
                              fillRule="evenodd"
                              style={{ fill: "rgb(255, 255, 255)" }}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className="sc-15ba67b8-0 kkQQfR"
                      style={{
                        padding: "12px 0px 36px",
                        width: "calc(100% - 7px)",
                      }}
                    >
                      <div
                        className="sc-15ba67b8-2 ixzmqw"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgb(68, 68, 68)",
                            textOverflow: "ellipsis",
                          }}
                        >
                          하이퍼정보
                        </span>
                      </div>
                      <h2
                        className="position_card_info_title"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          overflow: "hidden",
                          marginTop: "6px",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        Java Spring 웹개발자 (경력)
                      </h2>
                      <ul
                        className="sc-15ba67b8-1 iFMgIl"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          overflow: "hidden",
                          display: "flex",
                          marginTop: "8px",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          height: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          Spring
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Mybatis
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Java
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · SQL
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Spring Framework
                        </li>
                      </ul>
                      <ul
                        className="sc-15ba67b8-1 cdeuol"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          display: "flex",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          marginTop: "4px",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          서울 강남구
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          경력 1~3년
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
                <div
                  className="sc-d609d44f-0 dzfXSV"
                  style={{
                    flex: "1 1 22%",
                    padding: "10px",
                    opacity: "initial",
                    position: "relative",
                    width: "calc(25% - 20px)",
                    boxSizing: "border-box",
                    maxWidth: "270px",
                  }}
                >
                  <a
                    href="https://jumpit.saramin.co.kr/position/51729977?DP=HOME_WEEKLY_POSITION_RECOMMEND"
                    target="_self"
                    title="이커머스 플랫폼(카페24, 고도몰 등) 백엔드 개발자 (2년 이상)"
                    style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                  >
                    <div className="img_filter" />
                    <div
                      className="img_box"
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "166px",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img"
                        alt="와이톤"
                        src="https://cdn.jumpit.co.kr/lg/images/company/5748101528/20241319191304228/riuyn4_w3b7-g81ron_workenv-bg.webp"
                        style={{
                          border: "none",
                          transition: "0.3s",
                          width: "250px",
                          height: "166px",
                          objectFit: "cover",
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                      <div
                        className="sc-d609d44f-3 hwTKyC"
                        style={{
                          gap: "4px",
                          position: "absolute",
                          display: "flex",
                          top: "12px",
                          left: "12px",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="sc-a0b0873a-0 fdoAcj"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgb(255, 255, 255)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "rgb(68, 68, 68)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(0, 0, 0, 0.08) 0px -2px 4px 0px",
                          }}
                        >
                          D-11
                        </span>
                      </div>
                      <div
                        className="counts"
                        style={{
                          display: "none",
                          top: "16px",
                          right: "16px",
                          position: "absolute",
                          marginLeft: "auto",
                          color: "rgb(255, 255, 255)",
                          fontSize: "13px",
                          lineHeight: "18px",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="sc-fd5ea417-6 dXdfDi"
                          type="button"
                          aria-pressed="false"
                          style={{
                            margin: "0px",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            border: "none",
                            borderRadius: "0px",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <svg
                            height="24"
                            width="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <path
                              clipRule="evenodd"
                              d="M10.725 14.71a2 2 0 0 1 2.55 0l3.975 3.289V5H6.75v12.999l3.975-3.29ZM4.75 20.123V5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v15.124a1 1 0 0 1-1.638.77L12 16.25l-5.612 4.645a1 1 0 0 1-1.638-.77Z"
                              fill="#222"
                              fillRule="evenodd"
                              style={{ fill: "rgb(255, 255, 255)" }}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className="sc-15ba67b8-0 kkQQfR"
                      style={{
                        padding: "12px 0px 36px",
                        width: "calc(100% - 7px)",
                      }}
                    >
                      <div
                        className="sc-15ba67b8-2 ixzmqw"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgb(68, 68, 68)",
                            textOverflow: "ellipsis",
                          }}
                        >
                          와이톤
                        </span>
                      </div>
                      <h2
                        className="position_card_info_title"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          overflow: "hidden",
                          marginTop: "6px",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        이커머스 플랫폼(카페24, 고도몰 등) 백엔드 개발자 (2년
                        이상)
                      </h2>
                      <ul
                        className="sc-15ba67b8-1 iFMgIl"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          overflow: "hidden",
                          display: "flex",
                          marginTop: "8px",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          height: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          AWS
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · REST API
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · SQL
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · PHP
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · MariaDB
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · MySQL
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Node.js
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Git
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Redis
                        </li>
                      </ul>
                      <ul
                        className="sc-15ba67b8-1 cdeuol"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          display: "flex",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          marginTop: "4px",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          서울 강남구
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          경력 2~7년
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
                <div
                  className="sc-d609d44f-0 dzfXSV"
                  style={{
                    flex: "1 1 22%",
                    padding: "10px",
                    opacity: "initial",
                    position: "relative",
                    width: "calc(25% - 20px)",
                    boxSizing: "border-box",
                    maxWidth: "270px",
                  }}
                >
                  <a
                    href="https://jumpit.saramin.co.kr/position/51616520?DP=HOME_WEEKLY_POSITION_RECOMMEND"
                    target="_self"
                    title="Payment 개발 담당자(JAVA 기반)"
                    style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                  >
                    <div className="img_filter" />
                    <div
                      className="img_box"
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "166px",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img"
                        alt="디어유"
                        src="https://cdn.jumpit.co.kr/lg/images/dabin_3358/20243708143740292_739_503.webp"
                        style={{
                          border: "none",
                          transition: "0.3s",
                          width: "250px",
                          height: "166px",
                          objectFit: "cover",
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                      <div
                        className="sc-d609d44f-3 hwTKyC"
                        style={{
                          gap: "4px",
                          position: "absolute",
                          display: "flex",
                          top: "12px",
                          left: "12px",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="sc-a0b0873a-0 bWkBQz"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgb(0, 221, 109)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                            backgroundColor: "rgba(0, 221, 109, 0.8)",
                            color: "rgb(255, 255, 255)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(0, 0, 0, 0.08) 0px -2px 4px 0px",
                          }}
                        >
                          D-day
                        </span>
                      </div>
                      <div
                        className="counts"
                        style={{
                          display: "none",
                          top: "16px",
                          right: "16px",
                          position: "absolute",
                          marginLeft: "auto",
                          color: "rgb(255, 255, 255)",
                          fontSize: "13px",
                          lineHeight: "18px",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="sc-fd5ea417-6 dXdfDi"
                          type="button"
                          aria-pressed="false"
                          style={{
                            margin: "0px",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            border: "none",
                            borderRadius: "0px",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <svg
                            height="24"
                            width="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <path
                              clipRule="evenodd"
                              d="M10.725 14.71a2 2 0 0 1 2.55 0l3.975 3.289V5H6.75v12.999l3.975-3.29ZM4.75 20.123V5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v15.124a1 1 0 0 1-1.638.77L12 16.25l-5.612 4.645a1 1 0 0 1-1.638-.77Z"
                              fill="#222"
                              fillRule="evenodd"
                              style={{ fill: "rgb(255, 255, 255)" }}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className="sc-15ba67b8-0 kkQQfR"
                      style={{
                        padding: "12px 0px 36px",
                        width: "calc(100% - 7px)",
                      }}
                    >
                      <div
                        className="sc-15ba67b8-2 ixzmqw"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgb(68, 68, 68)",
                            textOverflow: "ellipsis",
                          }}
                        >
                          디어유
                        </span>
                      </div>
                      <h2
                        className="position_card_info_title"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          overflow: "hidden",
                          marginTop: "6px",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        Payment 개발 담당자(JAVA 기반)
                      </h2>
                      <ul
                        className="sc-15ba67b8-1 iFMgIl"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          overflow: "hidden",
                          display: "flex",
                          marginTop: "8px",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          height: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          Java
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · REST API
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Spring Boot
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · AWS
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Python
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · MySQL
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · NoSql
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Redis
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Elasticsearch
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Cassandra
                        </li>
                      </ul>
                      <ul
                        className="sc-15ba67b8-1 cdeuol"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          display: "flex",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          marginTop: "4px",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          서울 강남구
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          경력 3~7년
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
                <div
                  className="sc-d609d44f-0 dzfXSV"
                  style={{
                    flex: "1 1 22%",
                    padding: "10px",
                    opacity: "initial",
                    position: "relative",
                    width: "calc(25% - 20px)",
                    boxSizing: "border-box",
                    maxWidth: "270px",
                  }}
                >
                  <a
                    href="https://jumpit.saramin.co.kr/position/51741491?DP=HOME_WEEKLY_POSITION_RECOMMEND"
                    target="_self"
                    title="Java Backend 서비스 개발자 모집"
                    style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                  >
                    <div className="img_filter" />
                    <div
                      className="img_box"
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "166px",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img"
                        alt="트럼피아"
                        src="https://cdn.jumpit.co.kr/lg/images/dabin_3358/20251220141255240_1500_1125.webp"
                        style={{
                          border: "none",
                          transition: "0.3s",
                          width: "250px",
                          height: "166px",
                          objectFit: "cover",
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                      <div
                        className="sc-d609d44f-3 hwTKyC"
                        style={{
                          gap: "4px",
                          position: "absolute",
                          display: "flex",
                          top: "12px",
                          left: "12px",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="sc-a0b0873a-0 fdoAcj"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgb(255, 255, 255)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "rgb(68, 68, 68)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(0, 0, 0, 0.08) 0px -2px 4px 0px",
                          }}
                        >
                          D-12
                        </span>
                      </div>
                      <div
                        className="counts"
                        style={{
                          display: "none",
                          top: "16px",
                          right: "16px",
                          position: "absolute",
                          marginLeft: "auto",
                          color: "rgb(255, 255, 255)",
                          fontSize: "13px",
                          lineHeight: "18px",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="sc-fd5ea417-6 dXdfDi"
                          type="button"
                          aria-pressed="false"
                          style={{
                            margin: "0px",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            border: "none",
                            borderRadius: "0px",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <svg
                            height="24"
                            width="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <path
                              clipRule="evenodd"
                              d="M10.725 14.71a2 2 0 0 1 2.55 0l3.975 3.289V5H6.75v12.999l3.975-3.29ZM4.75 20.123V5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v15.124a1 1 0 0 1-1.638.77L12 16.25l-5.612 4.645a1 1 0 0 1-1.638-.77Z"
                              fill="#222"
                              fillRule="evenodd"
                              style={{ fill: "rgb(255, 255, 255)" }}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className="sc-15ba67b8-0 kkQQfR"
                      style={{
                        padding: "12px 0px 36px",
                        width: "calc(100% - 7px)",
                      }}
                    >
                      <div
                        className="sc-15ba67b8-2 ixzmqw"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgb(68, 68, 68)",
                            textOverflow: "ellipsis",
                          }}
                        >
                          트럼피아
                        </span>
                      </div>
                      <h2
                        className="position_card_info_title"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          overflow: "hidden",
                          marginTop: "6px",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        Java Backend 서비스 개발자 모집
                      </h2>
                      <ul
                        className="sc-15ba67b8-1 iFMgIl"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          overflow: "hidden",
                          display: "flex",
                          marginTop: "8px",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          height: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          Backendless
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Java
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · JavaScript
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Spring Boot
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · MySQL
                        </li>
                      </ul>
                      <ul
                        className="sc-15ba67b8-1 cdeuol"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          display: "flex",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          marginTop: "4px",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          서울 강남구
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          경력 3~5년
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
                <div
                  className="sc-d609d44f-0 dzfXSV"
                  style={{
                    flex: "1 1 22%",
                    padding: "10px",
                    opacity: "initial",
                    position: "relative",
                    width: "calc(25% - 20px)",
                    boxSizing: "border-box",
                    maxWidth: "270px",
                  }}
                >
                  <a
                    href="https://jumpit.saramin.co.kr/position/51757635?DP=HOME_WEEKLY_POSITION_RECOMMEND"
                    target="_self"
                    title="프론트엔드 웹개발자 React.js 모집"
                    style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                  >
                    <div className="img_filter" />
                    <div
                      className="img_box"
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "166px",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img"
                        alt="애드크림"
                        src="https://cdn.jumpit.co.kr/lg/images/hmlee_4/20215017165035000_800_601.webp"
                        style={{
                          border: "none",
                          transition: "0.3s",
                          width: "250px",
                          height: "166px",
                          objectFit: "cover",
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                      <div
                        className="sc-d609d44f-3 hwTKyC"
                        style={{
                          gap: "4px",
                          position: "absolute",
                          display: "flex",
                          top: "12px",
                          left: "12px",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="sc-a0b0873a-0 fdoAcj"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgb(255, 255, 255)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "rgb(68, 68, 68)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(0, 0, 0, 0.08) 0px -2px 4px 0px",
                          }}
                        >
                          D-13
                        </span>
                      </div>
                      <div
                        className="counts"
                        style={{
                          display: "none",
                          top: "16px",
                          right: "16px",
                          position: "absolute",
                          marginLeft: "auto",
                          color: "rgb(255, 255, 255)",
                          fontSize: "13px",
                          lineHeight: "18px",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="sc-fd5ea417-6 dXdfDi"
                          type="button"
                          aria-pressed="false"
                          style={{
                            margin: "0px",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            border: "none",
                            borderRadius: "0px",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <svg
                            height="24"
                            width="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <path
                              clipRule="evenodd"
                              d="M10.725 14.71a2 2 0 0 1 2.55 0l3.975 3.289V5H6.75v12.999l3.975-3.29ZM4.75 20.123V5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v15.124a1 1 0 0 1-1.638.77L12 16.25l-5.612 4.645a1 1 0 0 1-1.638-.77Z"
                              fill="#222"
                              fillRule="evenodd"
                              style={{ fill: "rgb(255, 255, 255)" }}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className="sc-15ba67b8-0 kkQQfR"
                      style={{
                        padding: "12px 0px 36px",
                        width: "calc(100% - 7px)",
                      }}
                    >
                      <div
                        className="sc-15ba67b8-2 ixzmqw"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgb(68, 68, 68)",
                            textOverflow: "ellipsis",
                          }}
                        >
                          애드크림
                        </span>
                      </div>
                      <h2
                        className="position_card_info_title"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          overflow: "hidden",
                          marginTop: "6px",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        프론트엔드 웹개발자 React.js 모집
                      </h2>
                      <ul
                        className="sc-15ba67b8-1 iFMgIl"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          overflow: "hidden",
                          display: "flex",
                          marginTop: "8px",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          height: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          React.js Boilerplate
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · React
                        </li>
                      </ul>
                      <ul
                        className="sc-15ba67b8-1 cdeuol"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          display: "flex",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          marginTop: "4px",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          서울 강남구
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          경력 3~7년
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
                <div
                  className="sc-d609d44f-0 dzfXSV"
                  style={{
                    flex: "1 1 22%",
                    padding: "10px",
                    opacity: "initial",
                    position: "relative",
                    width: "calc(25% - 20px)",
                    boxSizing: "border-box",
                    maxWidth: "270px",
                  }}
                >
                  <a
                    href="https://jumpit.saramin.co.kr/position/51767525?DP=HOME_WEEKLY_POSITION_RECOMMEND"
                    target="_self"
                    title="보상코어개발팀_백엔드개발(주임)"
                    style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                  >
                    <div className="img_filter" />
                    <div
                      className="img_box"
                      style={{
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        width: "100%",
                        height: "166px",
                        position: "relative",
                      }}
                    >
                      <img
                        className="img"
                        alt="리만코리아"
                        src="https://cdn.jumpit.co.kr/lg/images/hkkim_68432/20223729103732447_1107_776.webp"
                        style={{
                          border: "none",
                          transition: "0.3s",
                          width: "250px",
                          height: "166px",
                          objectFit: "cover",
                          imageRendering: "-webkit-optimize-contrast",
                        }}
                      />
                      <div
                        className="sc-d609d44f-3 hwTKyC"
                        style={{
                          gap: "4px",
                          position: "absolute",
                          display: "flex",
                          top: "12px",
                          left: "12px",
                          zIndex: 1,
                        }}
                      >
                        <span
                          className="sc-a0b0873a-0 fdoAcj"
                          style={{
                            padding: "2px 8px",
                            borderRadius: "4px",
                            border: "1px solid rgb(255, 255, 255)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "fit-content",
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            color: "rgb(68, 68, 68)",
                            fontSize: "13px",
                            lineHeight: "18px",
                            fontWeight: 700,
                            boxSizing: "border-box",
                            boxShadow:
                              "rgba(0, 0, 0, 0.25) 0px 4px 4px 0px, rgba(0, 0, 0, 0.08) 0px -2px 4px 0px",
                          }}
                        >
                          D-16
                        </span>
                      </div>
                      <div
                        className="counts"
                        style={{
                          display: "none",
                          top: "16px",
                          right: "16px",
                          position: "absolute",
                          marginLeft: "auto",
                          color: "rgb(255, 255, 255)",
                          fontSize: "13px",
                          lineHeight: "18px",
                          zIndex: 1,
                        }}
                      >
                        <button
                          className="sc-fd5ea417-6 dXdfDi"
                          type="button"
                          aria-pressed="false"
                          style={{
                            margin: "0px",
                            boxSizing: "border-box",
                            fontFamily: "inherit",
                            fontSize: "inherit",
                            border: "none",
                            borderRadius: "0px",
                            background: "none",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <svg
                            height="24"
                            width="24"
                            fill="none"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ width: "16px", height: "16px" }}
                          >
                            <path
                              clipRule="evenodd"
                              d="M10.725 14.71a2 2 0 0 1 2.55 0l3.975 3.289V5H6.75v12.999l3.975-3.29ZM4.75 20.123V5a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v15.124a1 1 0 0 1-1.638.77L12 16.25l-5.612 4.645a1 1 0 0 1-1.638-.77Z"
                              fill="#222"
                              fillRule="evenodd"
                              style={{ fill: "rgb(255, 255, 255)" }}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div
                      className="sc-15ba67b8-0 kkQQfR"
                      style={{
                        padding: "12px 0px 36px",
                        width: "calc(100% - 7px)",
                      }}
                    >
                      <div
                        className="sc-15ba67b8-2 ixzmqw"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "rgb(68, 68, 68)",
                            textOverflow: "ellipsis",
                          }}
                        >
                          리만코리아
                        </span>
                      </div>
                      <h2
                        className="position_card_info_title"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          overflow: "hidden",
                          marginTop: "6px",
                          fontSize: "16px",
                          lineHeight: "24px",
                          fontWeight: 500,
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: "2",
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        보상코어개발팀_백엔드개발(주임)
                      </h2>
                      <ul
                        className="sc-15ba67b8-1 iFMgIl"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          overflow: "hidden",
                          display: "flex",
                          marginTop: "8px",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          height: "18px",
                          flexWrap: "wrap",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          Java
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Spring Framework
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Spring Boot
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · QueryDSL
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · JUnit
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Amazon Aurora
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          · Gradle
                        </li>
                      </ul>
                      <ul
                        className="sc-15ba67b8-1 cdeuol"
                        style={{
                          margin: "0px",
                          padding: "0px",
                          listStyle: "none",
                          display: "flex",
                          fontSize: "13px",
                          lineHeight: "18px",
                          color: "rgb(153, 153, 153)",
                          marginTop: "4px",
                        }}
                      >
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            maxWidth: "58%",
                            textOverflow: "ellipsis",
                            WebkitLineClamp: "1",
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          서울 강남구
                        </li>
                        <li
                          style={{
                            margin: "0px",
                            padding: "0px",
                            marginRight: "5px",
                          }}
                        >
                          경력 2~5년
                        </li>
                      </ul>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </section>
          <div
            className="sc-884cdeb2-10 BqRFj"
            style={{
              position: "absolute",
              top: "152px",
              left: "50%",
              width: "100px",
              height: "148px",
              marginLeft: "549px",
            }}
          >
            <div
              className="slick-slider slick-initialized"
              dir="ltr"
              style={{
                boxSizing: "border-box",
                userSelect: "none",
                touchAction: "pan-y",
                WebkitTapHighlightColor: "transparent",
                position: "relative",
                display: "block",
              }}
            >
              <div
                className="slick-list"
                style={{
                  position: "relative",
                  display: "block",
                  overflow: "hidden",
                  margin: "0px",
                  padding: "0px",
                  transform: "translateZ(0px)",
                }}
              >
                <div
                  className="slick-track"
                  style={{
                    position: "relative",
                    top: "0px",
                    left: "0px",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "700px",
                    opacity: 1,
                    transform: `translate3d(-${100 + (currentSideSlide * 100)}px, 0px, 0px)`,
                    transition: "transform 0.5s ease",
                  }}
                >
                  <div
                    className="slick-slide slick-cloned"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      width: "100px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-4f6837e2-0 jzOpgH"
                        tabIndex={-1}
                        style={{
                          height: "148px",
                          backgroundSize: "100px 148px",
                          cursor: "pointer",
                          width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://jumpit.saramin.co.kr/event/for-develop"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture
                            style={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20252027102032018/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20252027102027934/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20252027102023577/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20252027102023577/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      outline: "none",
                      width: "100px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-4f6837e2-0 jzOpgH"
                        tabIndex={-1}
                        style={{
                          height: "148px",
                          backgroundSize: "100px 148px",
                          cursor: "pointer",
                          width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="http://begins.saramin.co.kr/?utm_source=jp&utm_medium=bnr&utm_campaign=home_wing&utm_term=250628_jpbegins"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture
                            style={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20253227103209105/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20253227103205213/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20253127103152745/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20253127103152745/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide slick-active slick-current"
                    aria-hidden="false"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      outline: "none",
                      width: "100px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-4f6837e2-0 jzOpgH"
                        tabIndex={-1}
                        style={{
                          height: "148px",
                          backgroundSize: "100px 148px",
                          cursor: "pointer",
                          width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://komate.saramin.co.kr/?utm_source=jumpit_per&utm_medium=bnr&utm_campaign=main_right_wing&utm_term=250211_komate"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture
                            style={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20251827101854966/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20251827101849925/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20251827101843000/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20251827101843000/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      outline: "none",
                      width: "100px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-4f6837e2-0 jzOpgH"
                        tabIndex={-1}
                        style={{
                          height: "148px",
                          backgroundSize: "100px 148px",
                          cursor: "pointer",
                          width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://jumpit.saramin.co.kr/event/for-develop"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture
                            style={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20252027102032018/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20252027102027934/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20252027102023577/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20252027102023577/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide slick-cloned"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      width: "100px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-4f6837e2-0 jzOpgH"
                        tabIndex={-1}
                        style={{
                          height: "148px",
                          backgroundSize: "100px 148px",
                          cursor: "pointer",
                          width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="http://begins.saramin.co.kr/?utm_source=jp&utm_medium=bnr&utm_campaign=home_wing&utm_term=250628_jpbegins"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture
                            style={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20253227103209105/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20253227103205213/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20253127103152745/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20253127103152745/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide slick-cloned"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      width: "100px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-4f6837e2-0 jzOpgH"
                        tabIndex={-1}
                        style={{
                          height: "148px",
                          backgroundSize: "100px 148px",
                          cursor: "pointer",
                          width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://komate.saramin.co.kr/?utm_source=jumpit_per&utm_medium=bnr&utm_campaign=main_right_wing&utm_term=250211_komate"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture
                            style={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20251827101854966/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20251827101849925/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20251827101843000/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20251827101843000/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div
                    className="slick-slide slick-cloned"
                    aria-hidden="true"
                    tabIndex={-1}
                    style={{
                      float: "left",
                      height: "100%",
                      minHeight: "1px",
                      display: "block",
                      width: "100px",
                    }}
                  >
                    <div>
                      <div
                        className="sc-4f6837e2-0 jzOpgH"
                        tabIndex={-1}
                        style={{
                          height: "148px",
                          backgroundSize: "100px 148px",
                          cursor: "pointer",
                          width: "100%",
                          display: "inline-block",
                        }}
                      >
                        <a
                          className="sc-2c93d257-0 VhYHg"
                          href="https://jumpit.saramin.co.kr/event/for-develop"
                          target="_blank"
                          style={{
                            textDecoration: "none",
                            color: "rgb(0, 0, 0)",
                          }}
                        >
                          <picture
                            style={{
                              display: "flex",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <source
                              media="(max-width:600px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20252027102032018/profile-image.webp"
                            />
                            <source
                              media="(max-width:1080px)"
                              srcSet="https://cdn.jumpit.co.kr/images/3358/20252027102027934/profile-image.webp"
                            />
                            <img
                              alt="https://cdn.jumpit.co.kr/images/3358/20252027102023577/profile-image.webp"
                              sizes="100%"
                              src="https://cdn.jumpit.co.kr/images/3358/20252027102023577/profile-image.webp"
                              style={{
                                border: "none",
                                display: "block",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </picture>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ul
              className="sc-4f6837e2-1 lkoUwy"
              style={{
                padding: "0px",
                listStyle: "none",
                margin: "0px auto",
                display: "flex",
                justifyContent: "space-around",
                width: "29px",
              }}
            >
              <li
                className="sc-4f6837e2-2 hntOBv"
                style={{ margin: "0px", padding: "0px" }}
              >
                <span
                  style={{
                    borderRadius: "100%",
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    cursor: "pointer",
                    backgroundColor: currentSideSlide === 0 ? "rgb(136, 136, 136)" : "rgb(212, 212, 212)",
                  }}
                />
              </li>
              <li
                className="sc-4f6837e2-2 bUnUer"
                style={{ margin: "0px", padding: "0px" }}
              >
                <span
                  style={{
                    borderRadius: "100%",
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    cursor: "pointer",
                    backgroundColor: currentSideSlide === 1 ? "rgb(136, 136, 136)" : "rgb(212, 212, 212)",
                  }}
                />
              </li>
              <li
                className="sc-4f6837e2-2 hntOBv"
                style={{ margin: "0px", padding: "0px" }}
              >
                <span
                  style={{
                    borderRadius: "100%",
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    cursor: "pointer",
                    backgroundColor: currentSideSlide === 2 ? "rgb(136, 136, 136)" : "rgb(212, 212, 212)",
                  }}
                />
              </li>
            </ul>
          </div>
          <div className="sc-884cdeb2-3 bBwbUT" style={{ display: "none" }}>
            <div
              className="sc-abb239bf-0 iBNVRj"
              style={{
                padding: "20px 20px 26px",
                border: "1px solid rgb(228, 228, 228)",
                borderRadius: "4px",
                width: "300px",
                height: "52px",
              }}
            >
              <h2
                style={{
                  margin: "0px",
                  padding: "0px",
                  color: "rgb(0, 221, 109)",
                  fontSize: "13px",
                  lineHeight: "18px",
                }}
              >
                Notice
              </h2>
              <div
                className="notice_list"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "6px",
                }}
              >
                <span
                  className="notice_con"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    color: "rgb(34, 34, 34)",
                    fontSize: "15px",
                    lineHeight: "22px",
                    cursor: "pointer",
                    textOverflow: "ellipsis",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",
                    width: "80%",
                  }}
                >
                  [공지] 개인정보 처리방침 개정에 대해 안내드립니다. (20250812)
                </span>
                <span
                  className="notice_date"
                  style={{
                    color: "rgb(153, 153, 153)",
                    flexShrink: 0,
                    fontSize: "14px",
                    lineHeight: "20px",
                  }}
                >
                  2025-08
                </span>
              </div>
            </div>
          </div>
          <div
            className="sc-a0301295-0 btHfXC"
            style={{
              inset: "0px",
              display: "none",
              position: "fixed",
              width: "100%",
              height: "100%",
              zIndex: 100,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <div
              className="sc-a0301295-1 fRGaGN"
              style={{
                display: "none",
                position: "absolute",
                left: "0px",
                bottom: "0px",
                right: "0px",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                backgroundColor: "rgb(255, 255, 255)",
              }}
            >
              <div
                className="sc-a0301295-2 cbgVHv"
                style={{ padding: "40px 16px 24px", position: "relative" }}
              >
                <button
                  className="sc-a0301295-3 fJjUyN"
                  style={{
                    margin: "0px",
                    padding: "0px",
                    boxSizing: "border-box",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    border: "none",
                    borderRadius: "0px",
                    background: "none",
                    cursor: "pointer",
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                  }}
                >
                  <svg
                    height="24"
                    width="24"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g fill="none" fillRule="evenodd">
                      <path d="M0 0h24v24H0z" />
                      <path
                        d="M20 4 4 20M4 4l16 16"
                        stroke="#000"
                        strokeWidth="2"
                      />
                    </g>
                  </svg>
                </button>
                <div
                  className="sc-a0301295-4 lajSdK"
                  style={{
                    background:
                      'url("https://cdn.jumpit.co.kr/jumpit/personal/ic_app_download.png") center center / 101px 100px no-repeat',
                    margin: "0px auto",
                    width: "101px",
                    height: "100px",
                  }}
                />
                <div
                  className="sc-a0301295-5 jRAGyR"
                  style={{
                    marginTop: "14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  <span>원하는 포지션! 언제 어디서든</span>
                  <span>
                    <b>점핏 앱</b>으로 간편하게 지원해보세요
                  </span>
                </div>
                <div
                  className="sc-a0301295-6 hAxOhV"
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <a
                    className="sc-a0301295-7 bgrufx"
                    href="https://abr.ge/xvrmfl"
                    target="_blank"
                    style={{
                      textDecoration: "none",
                      borderRadius: "4px",
                      width: "100%",
                      height: "56px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgb(0, 221, 109)",
                      color: "rgb(255, 255, 255)",
                      fontWeight: 500,
                      fontSize: "18px",
                      lineHeight: "26px",
                    }}
                  >
                    앱 이용하기
                  </a>
                  <button
                    className="sc-fd5ea417-0 sc-fd5ea417-4 dpkBqd khcpPz"
                    style={{
                      margin: "0px",
                      padding: "0px",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      borderRadius: "3px",
                      height: "auto",
                      display: "inline-block",
                      color: "rgb(136, 136, 136)",
                      fontSize: "14px",
                      lineHeight: "20px",
                      marginTop: "20px",
                    }}
                  >
                    오늘은 이대로 볼래요
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <style
        dangerouslySetInnerHTML={{
          __html: `
html {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  text-size-adjust: none;
  font-synthesis: none;
}

body {
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 100%;
  text-size-adjust: none;
  position: relative;
  color: rgb(0, 0, 0);
  font-size: 16px;
  line-height: 24px;
  overflow-x: hidden;
  font-family: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji";
  font-synthesis: none;
}
`,
        }}
      />
    </>
  );
}
