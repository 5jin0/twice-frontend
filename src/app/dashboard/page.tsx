import { PageContainer, Card } from "@/components/ui";
import { DashboardNav, DashboardStats } from "@/components/features/dashboard";

export const metadata = {
  title: "대시보드 | Twice Frontend",
  description: "대시보드 페이지",
};

export default function DashboardPage() {
  return (
    <PageContainer>
      <h1>대시보드</h1>
      <p>메인 대시보드입니다. 요약 정보와 바로가기를 배치할 수 있습니다.</p>
      <DashboardNav style={{ marginTop: "2rem" }} />
      <Card title="요약 카드 영역" style={{ marginTop: "2rem" }}>
        통계, 최근 활동 등 대시보드 위젯을 여기에 추가할 수 있습니다.
      </Card>
      <DashboardStats />
    </PageContainer>
  );
}
