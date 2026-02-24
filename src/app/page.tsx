import { PageContainer } from "@/components/ui";
import { MainNav } from "@/components/features/layout";

export default function HomePage() {
  return (
    <PageContainer>
      <h1>Twice Frontend</h1>
      <MainNav style={{ marginTop: "1.5rem" }} />
    </PageContainer>
  );
}
