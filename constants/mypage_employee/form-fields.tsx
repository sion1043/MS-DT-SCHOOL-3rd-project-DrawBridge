import type { FormField } from "@/types/mypage_employee"

export const PROFILE_FORM_FIELDS: FormField[] = [
  {
    name: "name",
    label: "이름",
    type: "text",
    required: true,
    placeholder: "홍길동",
  },
  {
    name: "email",
    label: "이메일",
    type: "email",
    required: true,
    placeholder: "example@email.com",
  },
  {
    name: "phone",
    label: "전화번호",
    type: "tel",
    required: true,
    placeholder: "010-1234-5678",
  },
  {
    name: "position",
    label: "희망 직무",
    type: "text",
    required: true,
    placeholder: "프론트엔드 개발자",
  },
  {
    name: "location",
    label: "거주지역",
    type: "text",
    required: false,
    placeholder: "서울특별시",
  },
]

export const APPLICATION_FORM_FIELDS: FormField[] = [
  {
    name: "company",
    label: "회사명",
    type: "text",
    required: true,
    placeholder: "회사명을 입력하세요",
  },
  {
    name: "position",
    label: "지원 직무",
    type: "text",
    required: true,
    placeholder: "지원하는 직무를 입력하세요",
  },
]

export const TODO_FORM_FIELDS: FormField[] = [
  {
    name: "title",
    label: "제목",
    type: "text",
    required: true,
    placeholder: "할 일을 입력하세요",
  },
  {
    name: "description",
    label: "설명",
    type: "textarea",
    required: false,
    placeholder: "상세 설명을 입력하세요",
  },
  {
    name: "category",
    label: "카테고리",
    type: "select",
    required: true,
    options: [
      { value: "이력서", label: "이력서" },
      { value: "포트폴리오", label: "포트폴리오" },
      { value: "네트워킹", label: "네트워킹" },
      { value: "스킬 개발", label: "스킬 개발" },
      { value: "면접 준비", label: "면접 준비" },
      { value: "기타", label: "기타" },
    ],
  },
  {
    name: "priority",
    label: "우선순위",
    type: "select",
    required: true,
    options: [
      { value: "높음", label: "높음" },
      { value: "보통", label: "보통" },
      { value: "낮음", label: "낮음" },
    ],
  },
]
