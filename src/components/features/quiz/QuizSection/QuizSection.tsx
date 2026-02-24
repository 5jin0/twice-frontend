export interface QuizSectionProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export function QuizSection({
  title = "진행 영역",
  description = "문제 목록, 선택지, 제출 버튼 등을 이 섹션에 구현할 수 있습니다.",
  children,
}: QuizSectionProps) {
  return (
    <section style={{ marginTop: "2rem" }}>
      <h2>{title}</h2>
      {children ?? <p>{description}</p>}
    </section>
  );
}
