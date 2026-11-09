import HomeClient from "@/app/HomeClient";
import LandingPage from "@/components/landing/LandingPage";

// Signed-out visitors see the landing page (rendered on the server, so search engines read it).
// Signed-in students see their dashboard (HomeClient).
export default function Home() {
  return <HomeClient landing={<LandingPage />} />;
}
