import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import Approach from "@/components/sections/Approach";
import Experience from "@/components/sections/Experience";
import MindBody from "@/components/sections/MindBody";
import Stories from "@/components/sections/Stories";
import FinalCta from "@/components/sections/FinalCta";
import BackgroundController from "@/components/layout/BackgroundController";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <Approach />
      <Experience />
      <MindBody />
      <Stories />
      <FinalCta />
      <BackgroundController />
    </>
  );
}
