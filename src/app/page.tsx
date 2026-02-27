import { Hero } from "@/components/Hero";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Projects } from "@/components/Projects";
import { Publication } from "@/components/Publication";
import { Skills } from "@/components/Skills";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { CursorGlow } from "@/components/CursorGlow";

export default function Home() {
  return (
    <>
      <CursorGlow />
      <main>
        <Hero />
        <Experience />
        <Education />
        <Projects />
        <Publication />
        <Skills />
        <About />
      </main>
      <Footer />
    </>
  );
}
