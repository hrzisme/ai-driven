"use client";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { title: "Card 1", bg: "bg-rose-500" },
  { title: "Card 2", bg: "bg-indigo-500" },
  { title: "Card 3", bg: "bg-emerald-500" },
];

export default function Test() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 初始状态：全部藏在屏幕下方
      gsap.set(cardRefs.current, { yPercent: 100 });

      cards.forEach((_, i) => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: wrapRef.current,
              start: `${i * 100}% top`, // 第 i 屏开始
              end: `${(i + 1) * 100}% top`, // 第 i 屏结束
              scrub: true,
              pin: true, // 钉住屏幕
              pinSpacing: true,
            },
          })
          .to(cardRefs.current[i], {
            yPercent: 0, // 从底部覆盖到可视区
            duration: 1,
            ease: "none",
          });
      });
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  const addToRefsTwo = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  }, []);

  return (
    <main>
      <section className="h-screen flex items-center justify-center bg-gray-100 text-3xl">
        上面内容
      </section>

      <section ref={wrapRef} className="relative h-[300vh]">
        {/* 三张卡片绝对定位，叠在一起 */}
        <div className="sticky top-0 h-screen w-full">
          {cards.map((c, i) => (
            <div
              key={i}
              ref={addToRefsTwo}
              className={`absolute inset-0 flex items-center justify-center text-white text-3xl font-bold ${c.bg}`}
            >
              {c.title}
            </div>
          ))}
        </div>
      </section>
      <section className="h-screen flex items-center justify-center bg-gray-100 text-3xl">
        下面内容
      </section>
    </main>
  );
}
