import BackgroundShift from "@/components/global/BackgroundShift";
import LilyStem from "@/components/global/LilyStem";
import PetalCanvas from "@/components/global/PetalCanvas";
import ProgressBar from "@/components/global/ProgressBar";
import SmoothScroll from "@/components/global/SmoothScroll";
import Hero from "@/components/sections/Hero";
import Ruler from "@/components/sections/Ruler";
import Smart from "@/components/sections/Smart";
import Kind from "@/components/sections/Kind";
import Feeling from "@/components/sections/Feeling";
import Progress from "@/components/sections/Progress";
import Honest from "@/components/sections/Honest";
import Journey from "@/components/sections/Journey";
import Proud from "@/components/sections/Proud";
import Note from "@/components/sections/Note";
import AlwaysThere from "@/components/sections/AlwaysThere";
import Closing from "@/components/sections/Closing";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <ProgressBar />
      <PetalCanvas />
      <main className="relative">
        <LilyStem />
        <Hero />
        <Ruler />
        <Smart />
        <Kind />
        <Feeling />
        <Progress />
        <Honest />
        <Journey />
        <Proud />
        <AlwaysThere />
        <Note />
        <Closing />
      </main>
      <BackgroundShift />
    </>
  );
}
