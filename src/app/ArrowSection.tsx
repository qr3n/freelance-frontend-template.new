import { ArrowSvg } from "@/shared/ui/svg/ui/ArrowSvg";

export default function ArrowSection() {
  return (
    <>
      <div className="absolute w-full p-10 h-full top-0 left-0"></div>

      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1
          className={"text-emerald-800 text-center text-3xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold z-50"}
        >
          Абсолютная <br /> универсальность
        </h1>

        <div className="flex items-center justify-center gap-24">
          <ArrowSvg className={'w-[600px] h-[600px] max-w-[90dvw]'} width={600} height={400} />
        </div>
      </div>
    </>
  );
}