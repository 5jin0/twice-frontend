import { PageContainer } from "@/components/ui";
import { QuizSection, QuizFlow } from "@/components/features/quiz";

export const metadata = {
  title: "퀴즈 | Twice Frontend",
  description: "퀴즈 페이지",
};

export default function QuizPage() {
  return (
    <PageContainer>
      <h1>퀴즈</h1>
      <p>퀴즈 콘텐츠가 여기에 표시됩니다.</p>
      <QuizSection title="진행 영역">
        <QuizFlow />
      </QuizSection>
    </PageContainer>
  );
}
