import { Card } from "@/components/ui";

export interface QuizSectionProps {
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export function QuizSection({
  title = "진행 영역",
  children,
  className = "",
}: QuizSectionProps) {
  return (
    <Card title={title} className={className}>
      {children ?? (
        <p>문제 목록, 선택지, 제출 버튼 등을 이 섹션에 구현할 수 있습니다.</p>
      )}
    </Card>
  );
}
