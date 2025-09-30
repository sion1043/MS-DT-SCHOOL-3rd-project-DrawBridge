"use client"

import React from "react";
import { useRouter } from "next/navigation";

export function Header_jobseeker() {
  const router = useRouter();

  const onClick = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/");     // 홈으로
    router.refresh();        // 서버 컴포넌트 재렌더 → 비로그인 헤더로 전환
  };
  
  return (
    <>
      <header
        className="sc-f154264c-0 buPvbY"
        style={{
          margin: "0px",
          padding: "0px",
          display: "block",
          borderBottom: "1px solid rgb(228, 228, 228)",
          top: "0px",
          left: "0px",
          right: "0px",
          zIndex: 10,
          backgroundColor: "rgb(255, 255, 255)",
          width: "100%",
        }}
      >
        <div
          className="sc-f154264c-1 ijmsti"
          style={{
            margin: "0px auto",
            position: "relative",
            maxWidth: "1060px",
          }}
        >
          <div
            className="sc-f154264c-2 jRdVRd"
            style={{
              transition: "0.2s",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "64px",
            }}
          >
            <div className="logo_wrap" style={{ paddingTop: "5px" }}>
              <a
                className="sc-4e553e93-0 kcEqVg"
                aria-current="page"
                aria-label="점핏"
                href="/"
                style={{
                  textDecoration: "none",
                  color: "rgb(0, 0, 0)",
                  display: "inline-flex",
                }}
              >
                <svg
                  height="28"
                  width="62"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 62 28"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="a"
                    height="28"
                    width="62"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    style={{ maskType: "luminance" }}
                  >
                    <path d="M62 0H0v28h62V0Z" fill="#fff" />
                  </mask>
                  <g mask="url(#a)">
                    <path
                      d="m1.58 12.65 2.957 3.274c2.17-1.123 4.173-2.776 5.905-4.769 1.222 1.746 2.894 3.274 4.635 4.334l3.83-3.804c-2.218-1.31-4.2-3.148-5.36-5.331.28-.593.537-.918.764-1.54h4.721l.954-4.361H5.377l-.924 4.36h4.585c-1.42 3.462-3.693 5.863-7.458 7.838Z"
                      fill="#000"
                    />
                    <path
                      clipRule="evenodd"
                      d="M5.257.304H20.17l-1.019 4.659h-4.738a5.697 5.697 0 0 1-.334.703l-.086.157c-.091.164-.184.33-.28.527 1.15 2.124 3.091 3.92 5.269 5.207l.166.098-4.05 4.022-.1-.06a16.047 16.047 0 0 1-4.57-4.222c-1.713 1.941-3.686 3.556-5.824 4.662l-.102.052-3.162-3.501.17-.09c3.662-1.92 5.894-4.24 7.303-7.555H4.27l.987-4.66Zm.241.298-.86 4.063H9.26l-.084.205c-1.413 3.445-3.666 5.85-7.357 7.823l2.751 3.046c2.112-1.112 4.065-2.732 5.76-4.681l.124-.144.11.156c1.186 1.695 2.803 3.184 4.491 4.231l3.611-3.586c-2.168-1.314-4.103-3.133-5.25-5.292l-.035-.065.032-.068c.112-.236.22-.432.322-.616l.084-.15c.125-.23.242-.46.352-.761l.035-.098h4.706l.89-4.063H5.497Z"
                      fill="#000"
                      fillRule="evenodd"
                    />
                    <path
                      d="M18.1 9.788h3.385l-1.866 7.75h5.354L28.887.448h-5.354L22.287 6.15h-3.383L18.1 9.788Z"
                      fill="#000"
                    />
                    <path
                      clipRule="evenodd"
                      d="M23.413.298h5.66l-3.981 17.39H19.43l1.866-7.751h-3.382l.87-3.935h3.383L23.413.298Zm.24.298L22.407 6.3h-3.383l-.74 3.34h3.39l-1.865 7.75h5.045L28.7.596h-5.047Z"
                      fill="#000"
                      fillRule="evenodd"
                    />
                    <path
                      d="M.483 27.214h22.564l1.926-9.675H2.584L.483 27.214Zm6.462-6.357 12.21-.012-.382 1.808H6.555l.393-1.796h-.003Z"
                      fill="#000"
                    />
                    <path
                      clipRule="evenodd"
                      d="M2.464 17.39h22.69l-1.984 9.973H.298l2.166-9.973Zm.24.298L.669 27.065h22.257l1.866-9.377H2.705Zm16.634 3.008-.444 2.106H6.37l.433-1.977.142.031v-.148l12.393-.012Zm-.367.298-11.903.012-.328 1.498h11.912l.319-1.51Z"
                      fill="#000"
                      fillRule="evenodd"
                    />
                    <path
                      d="M47.263 12.132h-2.22l1.281-5.868h-4.74l-1.28 5.868h-2.55l1.282-5.868h-4.62l-1.279 5.868H30.9l-.865 4.144H46.4l.864-4.144Z"
                      fill="#000"
                    />
                    <path
                      clipRule="evenodd"
                      d="M34.296 6.115h4.925l-1.281 5.868h2.243l1.282-5.868h5.044l-1.281 5.868h2.218l-.926 4.442H29.851l.927-4.442h2.24l1.278-5.868Zm.24.298-1.279 5.868H31.02l-.802 3.846h16.06l.802-3.846h-2.222l1.281-5.868h-4.434l-1.282 5.868H37.57l1.282-5.868h-4.315Z"
                      fill="#000"
                      fillRule="evenodd"
                    />
                    <path
                      d="M49.725.45H33.617l-.96 4.364H48.76L49.725.45Z"
                      fill="#000"
                    />
                    <path
                      clipRule="evenodd"
                      d="M33.497.3h16.414l-1.032 4.663H32.472L33.497.3Zm.24.299-.894 4.066H48.64l.9-4.066H33.737Z"
                      fill="#000"
                      fillRule="evenodd"
                    />
                    <path
                      d="m45.296 19.079-4.68-1.466c-2.239 3.804-7.139 5.279-12.227 5.746l1.768 4.18c3.484-.406 7.377-1.996 10.498-4.365 2.453 2.121 6.411 3.897 10.045 4.272l2.969-4.301c-3.664-.376-7.05-.727-9.324-2.66.343-.438.659-.906.95-1.403v-.003Z"
                      fill="#000"
                    />
                    <path
                      clipRule="evenodd"
                      d="m40.548 17.436 4.897 1.533v.153l-.02.035c-.27.46-.56.895-.874 1.305 1.094.891 2.444 1.43 3.97 1.792 1.577.374 3.33.555 5.163.743l.25.025-3.161 4.581-.088-.009c-3.62-.374-7.554-2.123-10.036-4.228-3.124 2.343-6.998 3.916-10.475 4.32l-.111.013-1.89-4.47.202-.018c5.084-.467 9.914-1.938 12.113-5.673l.06-.102Zm.136.355c-2.275 3.745-7.101 5.213-12.079 5.697l1.645 3.89c3.428-.423 7.247-1.994 10.315-4.322l.096-.073.091.079c2.41 2.084 6.296 3.835 9.876 4.226l2.775-4.02c-1.74-.18-3.424-.362-4.951-.724-1.602-.38-3.042-.958-4.203-1.946l-.11-.092.089-.113c.301-.386.583-.795.845-1.228l-4.39-1.374Z"
                      fill="#000"
                      fillRule="evenodd"
                    />
                    <path
                      d="m53.183.453-3.475 15.823 5.359-.015L58.537.453h-5.354Z"
                      fill="#000"
                    />
                    <path
                      clipRule="evenodd"
                      d="M53.063.304h5.659L55.187 16.41l-5.665.015L53.063.304Zm.24.298-3.41 15.524 5.054-.014L58.351.602h-5.048Z"
                      fill="#000"
                      fillRule="evenodd"
                    />
                    <path
                      d="M62 24.92a2.682 2.682 0 1 1-5.364-.002A2.682 2.682 0 0 1 62 24.92Z"
                      fill="#5CF636"
                    />
                  </g>
                </svg>
              </a>
            </div>
            <div
              className="sc-5987bd9e-0 gRpSZR"
              style={{ position: "relative" }}
            >
              <div
                className="sc-244f9287-0 iohkDx"
                style={{
                  margin: "0px auto",
                  position: "relative",
                  zIndex: 2,
                  width: "100%",
                  height: "100%",
                  maxWidth: "1060px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="search_box"
                  style={{
                    padding: "0px 20px",
                    borderRadius: "100px",
                    border: "1.5px solid rgb(0, 221, 109)",
                    width: "523px",
                    height: "43px",
                    backgroundColor: "rgb(255, 255, 255)",
                    position: "relative",
                  }}
                >
                  <input
                    type="text"
                    autoComplete="off"
                    maxLength={50}
                    placeholder="검색어를 입력해주세요"
                    style={{
                      margin: "0px",
                      borderRadius: "0px",
                      boxSizing: "border-box",
                      fontFamily: "inherit",
                      appearance: "none",
                      padding: "1px 40px 0px 44px",
                      border: "none",
                      width: "100%",
                      height: "40px",
                      color: "rgb(0, 0, 0)",
                      position: "absolute",
                      right: "0px",
                      backgroundColor: "transparent",
                      fontSize: "16px",
                      lineHeight: "24px",
                    }}
                  />
                  <button
                    className="search_button"
                    type="button"
                    aria-label="검색"
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
                      left: "16px",
                      top: "8px",
                    }}
                  >
                    <svg
                      height="24"
                      width="24"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g
                        fill="none"
                        fillRule="evenodd"
                        stroke="#222"
                        strokeWidth="2"
                      >
                        <circle
                          cx="11.111"
                          cy="11.111"
                          r="7.111"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ stroke: "rgb(0, 221, 109)" }}
                        />
                        <path
                          d="m20 20-3.867-3.867"
                          style={{ stroke: "rgb(0, 221, 109)" }}
                        />
                      </g>
                    </svg>
                  </button>
                </div>
                <button
                  className="close_button"
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
                    display: "none",
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
          <nav
            className="sc-f154264c-3 dhZUDH"
            aria-label="Main navigation"
            style={{
              margin: "0px",
              padding: "0px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "56px",
            }}
          >
            <ul
              className="sc-f154264c-4 koQDcE"
              style={{
                margin: "0px",
                padding: "0px",
                listStyle: "none",
                display: "flex",
                marginLeft: "-20px",
              }}
            >
              <li
                style={{
                  margin: "0px",
                  padding: "0px 20px",
                  position: "relative",
                }}
              >
                <a
                  className="sc-f154264c-5 drbbjg"
                  href="https://jumpit.saramin.co.kr/positions?sort=popular"
                  style={{
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontWeight: 400,
                    padding: "10px 4px",
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  개발자 채용
                </a>
              </li>
              <li
                style={{
                  margin: "0px",
                  padding: "0px 20px",
                  position: "relative",
                }}
              >
                <a
                  className="sc-f154264c-5 drbbjg"
                  href="https://jumpit.saramin.co.kr/resumes"
                  style={{
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontWeight: 400,
                    padding: "10px 4px",
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  이력서
                </a>
              </li>
              <li
                style={{
                  margin: "0px",
                  padding: "0px 20px",
                  position: "relative",
                }}
              >
                <a
                  className="sc-f154264c-5 drbbjg"
                  href="https://jumpit.saramin.co.kr/feed"
                  style={{
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontWeight: 400,
                    padding: "10px 4px",
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  #꿀 피드
                </a>
              </li>
              <li
                style={{
                  margin: "0px",
                  padding: "0px 20px",
                  position: "relative",
                }}
              >
                <a
                  className="sc-f154264c-5 drbbjg"
                  href="https://jumpit.saramin.co.kr/job-interview"
                  style={{
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontWeight: 400,
                    padding: "10px 4px",
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  개발자 인터뷰
                </a>
              </li>
              <li
                style={{
                  margin: "0px",
                  padding: "0px 20px",
                  position: "relative",
                }}
              >
                <a
                  className="sc-f154264c-5 drbbjg"
                  href="/employee_skillfit"
                  style={{
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontWeight: 400,
                    padding: "10px 4px",
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  스킬핏
                </a>
              </li>
              <li
                style={{
                  margin: "0px",
                  padding: "0px 20px",
                  position: "relative",
                }}
              >
                <a
                  className="sc-f154264c-5 drbbjg"
                  href="/employee_careerfit"
                  style={{
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontWeight: 400,
                    padding: "10px 4px",
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  커리어핏
                </a>
              </li>              
              <li
                style={{
                  margin: "0px",
                  padding: "0px 20px",
                  position: "relative",
                }}
              >
                <a
                  className="sc-f154264c-5 drbbjg"
                  href="/employee_trend"
                  style={{
                    textDecoration: "none",
                    color: "rgb(0, 0, 0)",
                    fontWeight: 400,
                    padding: "10px 4px",
                    cursor: "pointer",
                    display: "inline-block",
                    position: "relative",
                    fontSize: "16px",
                    lineHeight: "24px",
                  }}
                >
                  채용핏
                </a>
              </li>
            </ul>
            <ul
              className="sc-f154264c-6 ivGCuH"
              style={{
                margin: "0px",
                padding: "0px",
                listStyle: "none",
                display: "flex",
                marginRight: "-12px",
                fontSize: "14px",
                lineHeight: "20px",
              }}
            >
              <li
                style={{
                  margin: "0px",
                  padding: "0px 12px",
                  position: "relative",
                }}
              >
                <a
                  href="/main_mypage"
                  style={{ textDecoration: "none", color: "rgb(0, 0, 0)" }}
                >
                  마이페이지
                </a>
              </li>
              <li
                style={{
                  margin: "0px",
                  padding: "0px 12px",
                  position: "relative",
                }}
              >
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault(); // 기본 링크 동작 방지
                    onClick(); // 로그아웃 함수 실행
                  }}
                  style={{ textDecoration: "none", color: "rgb(0, 0, 0)", cursor: "pointer" }}
                >
                  로그아웃
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
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
