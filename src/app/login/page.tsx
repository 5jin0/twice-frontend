import { PageContainer } from "@/components/ui";
import { LoginForm } from "@/components/features/auth";

export const metadata = {
  title: "로그인 | Twice Frontend",
  description: "로그인 페이지",
};

export default function LoginPage() {
  return (
    <PageContainer narrow>
      <h1>로그인</h1>
      <LoginForm />
    </PageContainer>
  );
}
