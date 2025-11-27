"use client"; // Add this at the very top of your file
import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import Lenis from "lenis";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Input } from "@components/ui/input";

import logo from "@assets/img/logo.svg";
import logo_l from "@assets/img/logo_l.svg";
import logo_r from "@assets/img/logo_r.svg";
import btn01 from "@assets/img/btn-01.png";
import OrbitalCanvas from "@components/orbital-canvas";
const navItems = [
  { label: "Home", active: true },
  { label: "Problem", active: false },
  { label: "Solution", active: false },
  { label: "Works", active: false },
  { label: "Participant", active: false },
  { label: "Ecosystem", active: false },
];

interface TextDataType {
  trigger: any;
  scrub: number;
}

const comparisonCards = [
  {
    title: "The Old Way",
    description:
      "Brittle & Manual. Today's \"smart\" trading relies on slow, manual systems. Quant teams write rules, engineers code them. Every new strategy is a fragile pipeline that doesn't scale.",
    image: "https://c.animaapp.com/mi7lh0u1WhAn7g/img/frame-1.svg",
    left: "left-[120px]",
  },
  {
    title: 'The "AI" Way',
    description:
      "Zero Transparency. The alternative is a total black box. AI bots promise returns with no visibility. \nFor institutions, this risk is unacceptable. For users, it's not participation—it's just a bet.",
    image: "https://c.animaapp.com/mi7lh0u1WhAn7g/img/frame-2.svg",
    left: "left-[740px]",
  },
];

const philosophyColumns = [
  {
    title: "You (The Human):",
    subtitle: "Set the Goals",
    description:
      "Define the boundaries, provide the capital, and establish the mandate.",
  },
  {
    title: "The AI:",
    subtitle: "Suggests the Actions",
    description: "Continuously reads the market and proposes optimal actions.",
  },
  {
    title: "Neberu (The Framework):",
    subtitle: "Executes & Verifies",
    description:
      "Intercepts every AI suggestion, validates it against your rules, executes safely, and creates an immutable audit trail.",
  },
];

const architectureSteps = [
  {
    title: "The Universal Data Layer",
    description:
      "Neberu translates chaos into order. It unifies disparate market data, APIs, and account information (from CEX, DEX, and brokers) into one consistent, rules-based language.",
    top: "top-[4755px]",
  },
  {
    title: "The AI Decision Core",
    description:
      'This is the modular brain. Instead of hard-coded rules, models receive the unified market state and output clear actions: "how to adjust positions," "how to hedge." The core can be upgraded without breaking the system.',
    top: "top-[5020px]",
  },
  {
    title: "The Control & Execution Shell",
    description:
      'The "adult supervision." This shell stands at the gate, validating every AI decision against your pre-set risk, compliance, and capital limits. Only permitted actions are executed, and everything is logged.',
    top: "top-[5285px]",
  },
];

const cardInfoSteps = [
  {
    title: "For Institutions & Funds",
    description: "A Framework for Compliance and Scale.",
    btn_text: "Schedule An Enterprise Demo",
    info: " Stop building brittle infrastructure. Plug your proprietary models into Neberu. Move from an untrusted black box to a fully auditable, compliant, and scalable system. Manage risk, ensure compliance, and deploy AI-driven strategies with confidence.",
    img_src:
      "https://c.animaapp.com/mi7lh0u1WhAn7g/img/9a8165ba6b56f173d96bb229323b4097-1.png",
  },
  {
    title: "For Institutions & Funds",
    description: "A Framework for Compliance and Scale.",
    btn_text: "Schedule An Enterprise Demo",
    info: " Stop building brittle infrastructure. Plug your proprietary models into Neberu. Move from an untrusted black box to a fully auditable, compliant, and scalable system. Manage risk, ensure compliance, and deploy AI-driven strategies with confidence.",
    img_src:
      "https://c.animaapp.com/mi7lh0u1WhAn7g/img/9a8165ba6b56f173d96bb229323b4097-1.png",
  },
  {
    title: "For Institutions & Funds",
    description: "A Framework for Compliance and Scale.",
    btn_text: "Schedule An Enterprise Demo",
    info: " Stop building brittle infrastructure. Plug your proprietary models into Neberu. Move from an untrusted black box to a fully auditable, compliant, and scalable system. Manage risk, ensure compliance, and deploy AI-driven strategies with confidence.",
    img_src:
      "https://c.animaapp.com/mi7lh0u1WhAn7g/img/9a8165ba6b56f173d96bb229323b4097-1.png",
  },
];

// 动画注册
gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

const animationConfig: any = {
  cardHeight: 600,
  viewportHeight: 600,
  scrubIntensity: 0.5,
  snapDuration: 0.8,
};

export default function Screen() {
  const [status, setStatus] = useState<number>(0);
  const text_animation_ref = useRef(null);
  const text_animation_ref_t = useRef(null);
  const img_logo_l = useRef(null);
  const img_logo_r = useRef(null);
  const text_l = useRef(null);
  const text_r = useRef(null);
  const ballRef = useRef(null);
  const ballContentRef = useRef(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const containerRefTwo = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardsRefTwo = useRef<HTMLDivElement[]>([]);
  const scrollTriggerRef = useRef<HTMLDivElement>(null);
  const problemSectionRef = useRef<HTMLDivElement>(null);
  const problemTitleRef = useRef<HTMLHeadingElement>(null);
  const comparisonCardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // 初始化 Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // 连接 Lenis 和 ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 在 RAF 中更新
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // 禁用 GSAP 的默认滚动监听
    // gsap.ticker.lagSmoothing(0);

    const text_data: TextDataType[] = [
      { trigger: text_animation_ref.current, scrub: 1 },
    ];

    const split: any = [];
    text_data.forEach((item: TextDataType) => {
      split.push(textCharAnimation(item));
    });

    // "The power of AI..." 文字发光动画
    if (text_animation_ref_t.current) {
      const splitGlow = new SplitText(text_animation_ref_t.current, {
        type: "chars",
        charsClass: "char",
      });

      // 设置初始状态 - 灰色
      gsap.set(splitGlow.chars, {
        color: "rgba(100,110,112,1)",
        textShadow: "none",
      });

      // 逐字高亮发光动画
      gsap.to(splitGlow.chars, {
        color: "rgba(255,255,255,1)",
        textShadow: "0 0 30px rgba(97,228,250,0.9), 0 0 60px rgba(97,228,250,0.5)",
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: text_animation_ref_t.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 2,
        },
      });

      // 发光消退，保持白色 - 更快消退
      gsap.to(splitGlow.chars, {
        textShadow: "0 0 0px rgba(97,228,250,0)",
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: text_animation_ref_t.current,
          start: "top 70%",
          end: "top 10%",
          scrub: 2,
        },
      });

      split.push(splitGlow);
    }

    const ctx = gsap.context(() => {
      const logo_data = [
        {
          trigger: img_logo_l.current,
          xPercent: 84,
          duration: 2,
          stagger: 0.05,
        },
        {
          trigger: img_logo_r.current,
          xPercent: -84,
          duration: 2,
          stagger: 0.05,
        },
        {
          trigger: text_l.current,
          xPercent: 264,
          duration: 1,
          stagger: 0.1,
        },
        {
          trigger: text_r.current,
          xPercent: -166,
          duration: 1,
          stagger: 0.1,
        },
      ];

      ballAnimation();

      cardStackAnimationTwo();

      logo_data.forEach((item: gsap.TweenVars, index: number) => {
        logoMergAnimation(item);
      });

      cardStackAnimation();

      // Problem section 动画
      problemTitleAnimation();
      comparisonCardsAnimation();
    });

    // 清理函数
    return () => {
      if (split.length) {
        split.forEach((item: any) => {
          if (item.revert) split.revert();
        });
      }
      ctx.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, []);

  // 文字逐一显示动画
  const textCharAnimation = (data: { trigger: any; scrub: number }) => {
    const split = new SplitText(data.trigger, {
      type: "words,chars", // 分割单词和字符
      wordsClass: "word",
      charsClass: "char",
    });

    // 设置初始状态
    gsap.set(split.chars, {
      opacity: 0,
      color: "#61E4FA", // 起始颜色
    });

    // 创建滚动触发动画
    gsap.to(split.chars, {
      opacity: 1,
      color: "#fff",
      duration: 0.8,
      stagger: 0.05,
      ease: "power2.out",
      scrollTrigger: {
        trigger: data.trigger,
        start: "top 80%", // 当元素顶部到达视口80%时开始
        end: "bottom 20%", // 当元素底部到达视口20%时结束
        toggleActions: "play none none reverse", // 播放一次，反向滚动时反向播放
        // scrub: data.scrub ? 1 : false,
        scrub: false,
      },
    });

    return split;
  };

  // ball动画
  const ballAnimation = () => {
    gsap.to(ballRef.current, {
      yPercent: 450,
      scale: 3,
      duration: 2,
      stagger: 0.05,
      ease: "none",
      scrollTrigger: {
        trigger: ballContentRef.current,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play none none reverse", // 播放一次，反向滚动时反向播放
        scrub: 1,
      },
    });
  };

  // logo合并分离动画
  const logoMergAnimation = (data: gsap.TweenVars) => {
    gsap.to(data.trigger, {
      xPercent: data.xPercent,
      duration: data.duration,
      stagger: data.stagger,
      ease: "none",
      scrollTrigger: {
        trigger: data.trigger,
        start: "top bottom",
        end: "center center",
        // toggleActions: "play none none reverse", // 播放一次，反向滚动时反向播放
        scrub: 1,
      },
    });
  };

  // 添加卡片到 ref 数组
  const addToRefs = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  }, []);

  // 多张卡片层叠动画
  const cardStackAnimation = () => {
    const cards = cardsRef.current;

    // 为每张卡片创建动画时间轴
    cards.forEach((card: gsap.TweenTarget, index: number) => {
      const totalCards = cards.length;
      const cardHeight = 400; // 卡片高度
      const overlap = 200; // 卡片重叠距离

      // 计算开始和结束位置
      const startPosition = index * (cardHeight - overlap);
      const endPosition = (index + 1) * (cardHeight - overlap) + 500;

      // 创建卡片的时间轴
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: `top+=${startPosition} center`,
          end: `top+=${endPosition} center`,
          scrub: 1,
          markers: false, // 设为 true 可查看触发区域
        },
      });

      // 卡片展开动画
      tl.fromTo(
        card,
        {
          y: index * 100, // 初始层叠位置
          scale: 0.6, // 初始缩放
          opacity: 0, // 初始透明度
          zIndex: totalCards - index, // z-index 控制层叠顺序
        },
        {
          y: 0, // 移动到正常位置
          scale: 1, // 正常大小
          opacity: 1, // 完全显示
          zIndex: totalCards - index, // 展开时在最上层
          duration: 1,
        }
      );
    });
  };

  // 添加卡片到 ref 数组
  const addToRefsTwo = useCallback((el: HTMLDivElement | null) => {
    if (el && !cardsRefTwo.current.includes(el)) {
      cardsRefTwo.current.push(el);
    }
  }, []);

  // 添加 comparison cards 到 ref 数组
  const addToComparisonCardsRef = useCallback((el: HTMLDivElement | null) => {
    if (el && !comparisonCardsRef.current.includes(el)) {
      comparisonCardsRef.current.push(el);
    }
  }, []);

  // Problem section 标题浮现动画 - 卡片下移露出标题
  const problemTitleAnimation = () => {
    if (!problemTitleRef.current || !comparisonCardsRef.current.length) return;

    // 卡片容器向下移动，露出标题
    const cardsContainer = comparisonCardsRef.current[0]?.parentElement;
    if (cardsContainer) {
      gsap.fromTo(
        cardsContainer,
        {
          y: 0,
        },
        {
          y: 80, // 向下移动80px
          ease: "power2.out",
          scrollTrigger: {
            trigger: problemSectionRef.current,
            start: "top 60%",
            end: "top 30%",
            scrub: 1,
          },
        }
      );
    }

    // 标题第二行浮现
    const lines = problemTitleRef.current.querySelectorAll('.title-line');
    lines.forEach((line, index) => {
      if (index === 1) {
        // 只对第二行做动画
        gsap.fromTo(
          line,
          {
            y: 30,
            opacity: 0.5,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: problemSectionRef.current,
              start: "top 60%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }
    });
  };

  // Comparison cards 文字动画 - 标题逐字高亮（带反光效果）
  const comparisonCardsAnimation = () => {
    const cards = comparisonCardsRef.current;

    cards.forEach((card) => {
      const title = card.querySelector('.card-title');
      const description = card.querySelector('.card-description');

      // 标题逐字高亮效果 - 带发光
      if (title) {
        const split = new SplitText(title, {
          type: "chars",
          charsClass: "char",
        });

        // 设置初始样式
        gsap.set(split.chars, {
          color: "rgba(100,110,112,1)",
          textShadow: "none",
        });

        // 逐字高亮动画 - 延长滚动范围
        gsap.to(split.chars, {
          color: "rgba(255,255,255,1)",
          textShadow: "0 0 20px rgba(97,228,250,0.8), 0 0 40px rgba(97,228,250,0.4)",
          stagger: 0.15, // 增加间隔，让效果更明显
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",  // 更早开始
            end: "top 20%",    // 更晚结束，延长动画时间
            scrub: 2,          // 增加 scrub 值，让动画更平滑
          },
        });

        // 高亮后逐渐恢复正常白色（去掉发光）
        gsap.to(split.chars, {
          textShadow: "0 0 0px rgba(97,228,250,0)",
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 40%",
            end: "top 0%",
            scrub: 2,
          },
        });
      }

      // 描述文字从左往右渐出
      if (description) {
        gsap.fromTo(
          description,
          {
            x: -20,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 60%",
              end: "top 30%",
              scrub: 1,
            },
          }
        );
      }
    });
  };

  // 多张卡片层叠动画二
  const cardStackAnimationTwo = () => {
    const cards = cardsRefTwo.current;
    // 创建卡片的时间轴
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRefTwo.current,
        start: `top top`,
        end: `bottom tottom`,
        scrub: 0.5,
        pin: true,
        markers: false, // 设为 true 可查看触发区域
      },
    });

    tl.fromTo(
      cards[1],
      {
        y: 40,
        opacity: 1,
        scale: 1,
      },
      {
        y: `-=${100}`,
        opacity: 1,
        duration: 0.1,
        scale: 1,
      },
      0
    )
      .fromTo(
        cards[2],
        {
          y: 80,
          opacity: 1,
          scale: 1,
        },
        {
          y: `-=${100}`,
          opacity: 1,
          duration: 0.1,
          scale: 1,
        },
        0
      )
      .to(
        cards[1],
        {
          y: `-=${300}`,
          opacity: 1,
          duration: 0.4,
          scale: 1,
        },
        0.1
      )
      .to(
        cards[2],
        {
          y: `-=${300}`,
          opacity: 1,
          duration: 0.4,
          scale: 1,
        },
        0.1
      )
      .to(
        cards[0],
        {
          scale: 0.9,
          opacity: 0.8,
          duration: 0.4,
        },
        0.1
      )
      .to(
        cards[2],
        {
          y: `-=${100}`,
          opacity: 1,
          duration: 0.1,
          scale: 1,
        },
        0.5
      )
      .to(
        cards[1],
        {
          scale: 0.9,
          opacity: 0.8,
          duration: 0.4,
        },
        0.6
      )
      .to(
        cards[2],
        {
          y: `-=${300}`,
          opacity: 1,
          duration: 0.4,
          scale: 1,
        },
        0.6
      )
      .to(
        cards[0],
        {
          scale: 0.8,
          opacity: 0.6,
          duration: 0.4,
        },
        0.6
      );
  };
  return (
    <div
      className="pt-5 bg-[#15191a] overflow-hidden w-full min-w-[1000px] min-h-[9778px] relative"
      data-model-id="1:2"
    >

      <nav className="flex flex-col items-start gap-2.5 pl-4 pr-4 py-2 absolute top-8 translate-[-50%] left-[50%] h-[60px] rounded-[20px] shadow-[0px_9.66px_38.62px_#61e4fa1f] z-10 bg-[linear-gradient(47deg,rgba(97,228,250,0.06)_0%,rgba(217,217,217,0.06)_100%)] translate-y-[-1rem] animate-fade-in opacity-0">
        <div className="inline-flex items-center gap-8 relative flex-[0_0_auto] mr-[-8.00px]">
          <div className="relative w-32 h-6">
            <Image className="w-32 h-6" alt="Vector" src={logo} />
            {/* <div className="top-0 left-[58px] w-[70px] [font-family:'Inter',Helvetica] text-white text-[19.9px] absolute font-normal tracking-[0] leading-[normal]">
              Neberu
            </div> */}
          </div>

          <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
            {navItems.map((item, index) => (
              <button
                key={index}
                className="relative w-fit mt-[-1.00px] [font-family:'SF_Pro-Regular',Helvetica] cursor-pointer font-normal text-base text-center tracking-[0] hover:text-white leading-4 whitespace-nowrap transition-colors hover:text-white"
                style={{ color: item.active ? "white" : "#a5acad" }}
              >
                {item.label}
              </button>
            ))}
          </div>

          <Button className="px-[18px] py-3.5 h-auto bg-[linear-gradient(90deg,rgba(194,203,205,1)_0%,rgba(237,249,251,1)_50%,rgba(198,208,209,1)_100%)] hover:opacity-90 transition-opacity rounded-2xl">
            <span className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-[#15191a] text-base text-center tracking-[0] leading-4 whitespace-nowrap">
              request Demo
            </span>
          </Button>
        </div>
      </nav>

      <header className="flex flex-col w-[840px] translate-x-[-50%] items-center gap-8 absolute top-[180px] left-[50%]">
        <h1 className="relative w-fit mt-[-1.00px] bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-[56px] text-center tracking-[0] leading-[normal] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
          AI-Driven Trading. <br />
          Human-Defined Boundaries.
        </h1>

        <p className="relative self-stretch [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-xl text-center tracking-[0] leading-[30px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
          Neberu is the institutional-grade framework for automated trading. We
          delegate complex decision-making to AI, while ensuring every action is
          executed within a controllable, verifiable, and fully-auditable
          ecosystem.
        </p>
      </header>

      <div className="inline-flex items-center gap-6 absolute top-[516px] left-[50%] translate-y-[-1rem] translate-x-[-50%] animate-fade-in opacity-0 [--animation-delay:600ms]">
        <Button
          className="inline-flex items-center bg-center bg-no-repeat bg-cover shadow-none h-25 w-84 justify-center gap-4 px-6 py-4 hover:opacity-90 transition-opacity"
          style={{ backgroundImage: `url(${btn01.src})` }}
        >
          {/* <span className="relative w-fit [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#eaf6f8] text-lg tracking-[0] leading-[normal] whitespace-nowrap">
            Explore the Application&nbsp;&nbsp;&gt;
          </span> */}
        </Button>
      </div>




      {/* 轨道动画 Canvas - 包含中心大星球和轨道小球 */}
      <div className="absolute top-[40px] left-[50%] -translate-x-1/2 w-[1440px] h-[2600px] pointer-events-none">
        <OrbitalCanvas />
      </div>


      <section className="flex flex-col w-[840px] items-center justify-center gap-8 absolute top-[1271px] left-[50%] translate-x-[-50%]">
        <h2 className="relative self-stretch mt-[-1.00px] bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-4xl text-center tracking-[0] leading-[normal]">
          Stop Guessing. Start Controlling.
        </h2>

        <p className="relative self-stretch [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] text-center tracking-[0] leading-[33px]">
          Whenther you're an institution needing an auditable AI framework or an
          individual ready to enter the world of AI trading, Neberu is the new
          standard.
        </p>
      </section>

      <section ref={problemSectionRef} className="absolute top-[2102px] left-[50%] translate-x-[-50%] w-[1200px]">
        <h2 ref={problemTitleRef} className="[font-family:'SF_Pro-Semibold',Helvetica] font-normal text-[56px] tracking-[0] leading-[normal] relative z-0 mb-[-60px]">
          <span className="title-line block bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]">
            Trading is Run by Machines.
          </span>
          <span className="title-line block bg-[linear-gradient(90deg,rgba(120,130,132,1)_0%,rgba(200,212,214,1)_51%,rgba(120,130,132,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent]">
            The "Brain" is Still a Black Box
          </span>
        </h2>

        <div className="flex gap-[60px] mt-8 relative z-10">
          {comparisonCards.map((card, index) => (
            <div
              ref={addToComparisonCardsRef}
              key={index}
              className="comparison-card relative w-[580px] h-[429px] rounded-[20px] shadow-[0px_9.66px_38.62px_#61e4fa1f] bg-[linear-gradient(0deg,rgba(21,25,26,1)_0%,rgba(21,25,26,1)_100%),linear-gradient(47deg,rgba(97,228,250,0.03)_0%,rgba(217,217,217,0.03)_100%)] border border-[rgba(97,228,250,0.1)] overflow-hidden transition-all duration-500 group hover:shadow-[0px_9.66px_60px_#61e4fa40] hover:border-[rgba(97,228,250,0.3)]"
            >
              {/* Hover 开灯效果 - 光晕层 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(97,228,250,0.15)_0%,transparent_70%)]" />
              {/* 顶部发光线条 - 全宽 */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[linear-gradient(90deg,transparent_0%,#61e4fa_50%,transparent_100%)] opacity-0 group-hover:opacity-80 transition-opacity duration-500" />

              <CardContent className="p-8 flex flex-col h-full justify-between relative z-10">
                <div className="text-right flex justify-end align-middle">
                  <img
                    className="w-[222px] h-[195px] transition-all duration-500 group-hover:drop-shadow-[0_0_20px_rgba(97,228,250,0.3)]"
                    alt="Frame"
                    src={card.image}
                  />
                </div>
                <div>
                  <h3 className="card-title [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-[#959c9d] text-[28px] tracking-[0] leading-[normal] whitespace-nowrap mb-4">
                    {card.title}
                  </h3>
                  <p className="card-description [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] tracking-[0] leading-[33px] transition-colors duration-500 group-hover:text-[#c0c8ca]">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </div>
          ))}
        </div>
      </section>

      <section className="absolute top-[2925px] left-[50%] translate-x-[-50%] w-210 flex flex-col items-center">
        <h2
          ref={text_animation_ref_t}
          className="[font-family:'SF_Pro-Semibold',Helvetica] font-normal text-[#a5adae] text-[56px] text-center tracking-[0] leading-[normal]"
        >
          The power of AI is ready. <br />
          The infrastructure to trust it is not.
          <br /> Until now.
        </h2>
        {/* 蓝色小球 */}
        <div className="mt-12 relative w-[120px] h-[120px]">
          {/* 基础星球 */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(102,156,173,0.9)_0%,rgba(31,41,46,1)_55%,rgba(13,17,19,1)_90%)] shadow-[0px_25px_40px_rgba(0,0,0,0.45),inset_-25px_-25px_55px_rgba(0,0,0,0.65)]" />
          {/* 左侧环形渐变高光 */}
          <svg
            className="absolute inset-0"
            viewBox="0 0 120 120"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="leftArcGlow" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#c8fbff" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#61e4fa" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#61e4fa" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="55"
              fill="none"
              stroke="url(#leftArcGlow)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="190 400"
              strokeDashoffset="220"
            />
          </svg>
          {/* 底部柔和阴影 */}
          <div className="absolute -bottom-6 left-[18%] w-[64%] h-8 rounded-full blur-[18px] bg-[radial-gradient(circle,rgba(0,0,0,0.45)_0%,rgba(0,0,0,0)_70%)]" />
        </div>
      </section>

      <section
        ref={ballContentRef}
        className="absolute top-[3474px] left-[50%] translate-x-[-50%] w-[1200px] h-[826px]"
      >
        <div className="absolute top-0 left-0 w-[396px] h-[86px]">
          <h2 className="absolute text-white top-0 left-0 [text-shadow:0px_0px_4px_#00000040] bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [font-family:'SF_Pro-Semibold',Helvetica] font-normal  text-4xl text-left">
            The&nbsp;
            <span className="[text-shadow:0px_0px_6px_#61e4fa] [font-family:'SF_Pro-Semibold',Helvetica] text-[#61e4fa] text-4xl text-center font-normal">
              Neberu
            </span>
            &nbsp;Philosophy:
            <br />
            Delegate, not surrender
          </h2>
        </div>

        <p className="absolute top-[100px] left-0 w-[1015px] [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] tracking-[0] leading-[33px]">
          Neberu lets AI handle the heavy lifting—reading markets, tuning
          parameters, spotting opportunities—while you keep all the guardrails.
        </p>

        <div className="absolute top-[271px] left-0 flex gap-[61px]">
          {philosophyColumns.map((column, index) => (
            <div className="flex  gap-[61px]" key={index}>
              <div
                className="flex flex-col items-start gap-8"
                style={{
                  maxWidth:
                    index === 2 ? "346px" : index === 1 ? "275px" : "282px",
                }}
              >
                <div className="flex flex-col items-start gap-2">
                  <h3 className="bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-[28px] tracking-[0] leading-[normal]">
                    {column.title}
                  </h3>
                  <p className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] tracking-[0] leading-[33px]">
                    {column.subtitle}
                  </p>
                </div>
                <p className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] tracking-[0] leading-[33px]">
                  {column.description}
                </p>
              </div>
              {index < 2 ? (
                <div className="w-px h-[229px] bg-[linear-gradient(180deg,rgba(21,25,26,1)_0%,rgba(165,165,165,1)_46%,rgba(21,25,26,1)_100%)]" />
              ) : null}
            </div>
          ))}
        </div>


        <img
          className="absolute top-[562px] left-px w-[1199px] h-[264px]"
          alt="Frame"
          src="https://c.animaapp.com/mi7lh0u1WhAn7g/img/frame.svg"
        />
      </section>

      <section className="absolute top-[4380px] left-[50%] translate-x-[-50%] w-[1200px]">
        <h2 className="absolute top-0 left-[495px] bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-4xl text-center tracking-[0] leading-[normal] whitespace-nowrap">
          How It Works
        </h2>

        <p className="absolute top-[59px] left-[378px] [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] tracking-[0] leading-[33px] whitespace-nowrap">
          A Closed-Loop Architecture for Verifiable AI
        </p>

        <div className="absolute top-[142px] left-[525px] w-[150px] h-[150px] bg-[#15191a] rounded-[100px] shadow-[0px_9.66px_50px_#61e4fa]" />

        <img
          className="absolute top-[201px] left-[548px] w-[104px] h-8"
          alt="Group"
          src="https://c.animaapp.com/mi7lh0u1WhAn7g/img/group-5.png"
        />
        <div ref={containerRef} className="cards-scroll-section">
          {architectureSteps.map((step, index) => (
            <div ref={addToRefs} key={index}>
              <img
                className={`absolute ${
                  step.top === "top-[4755px]"
                    ? "top-[372px]"
                    : step.top === "top-[5020px]"
                    ? "top-[636px]"
                    : "top-[902px]"
                } left-[94px] w-[1012px] h-[216px]`}
                alt="Vector"
                src="https://c.animaapp.com/mi7lh0u1WhAn7g/img/vector.svg"
              />
              <h3
                className={`absolute ${
                  step.top === "top-[4755px]"
                    ? "top-[375px]"
                    : step.top === "top-[5020px]"
                    ? "top-[640px]"
                    : "top-[905px]"
                } left-[50%] translate-x-[-50%] bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-[28px] tracking-[0] leading-[normal] whitespace-nowrap`}
              >
                {step.title}
              </h3>
              <p
                className={`absolute ${
                  step.top === "top-[4755px]"
                    ? "top-[440px]"
                    : step.top === "top-[5020px]"
                    ? "top-[705px]"
                    : "top-[970px]"
                } left-[50%] translate-x-[-50%] w-[${
                  step.title === "The AI Decision Core"
                    ? "714px"
                    : step.title === "The Universal Data Layer"
                    ? "671px"
                    : "669px"
                }] [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] text-center tracking-[0] leading-[33px]`}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        ref={containerRefTwo}
        className="sticky mt-[5607px] pt-[50px] mr-auto ml-auto w-[1000px]"
      >
        <h2 className="[text-shadow:0px_0px_4px_#00000040] bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-4xl tracking-[0] leading-[normal] whitespace-nowrap">
          Institutional Power. Universal Access
        </h2>

        <p className="mt-[18px] [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] tracking-[0] leading-[33px] whitespace-nowrap">
          Neberu bridges the gap, offering the same core infrastructure to all
          market participants.
        </p>

        <div className="relative mt-20 w-full">
          {cardInfoSteps.map((item, index) => (
            <Card
              ref={addToRefsTwo}
              key={index}
              className={`z-${index} position w-[1000px] h-[400px] rounded-[20px] shadow-[0px_9.66px_38.62px_#61e4fa1f] bg-[linear-gradient(0deg,rgba(21,25,26,1)_0%,rgba(21,25,26,1)_100%),linear-gradient(47deg,rgba(97,228,250,0.03)_0%,rgba(217,217,217,0.03)_100%)] border-0`}
            >
              <CardContent className="p-8 relative h-full">
                <h3 className="bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-[28px] tracking-[0] leading-[normal] whitespace-nowrap">
                  {item.title}
                </h3>

                <p className="mt-[9px] w-[480px] [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] tracking-[0] leading-[33px]">
                  {item.description}
                </p>

                <Button className="absolute top-[201px] left-8 px-[18px] py-3.5 h-auto bg-[linear-gradient(90deg,rgba(194,203,205,1)_0%,rgba(237,249,251,1)_50%,rgba(198,208,209,1)_100%)] hover:opacity-90 transition-opacity rounded-2xl">
                  <span className="[font-family:'SF_Pro-Bold',Helvetica] font-bold text-[#15191a] text-base text-center tracking-[0] leading-4 whitespace-nowrap">
                    {item.btn_text}
                  </span>
                </Button>

                <p className="absolute top-[269px] left-8 w-[936px] [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#a8b0b2] text-[22px] tracking-[0] leading-[33px]">
                  {item.info}
                </p>

                <div className="absolute top-2 left-[592px] w-[400px] h-[225px]">
                  <img className="w-full h-full" alt="Img" src={item.img_src} />
                  <div className="absolute top-0 left-0 w-full h-full rounded-[20px] [background:radial-gradient(50%_50%_at_50%_50%,rgba(21,25,26,0)_0%,rgba(21,25,26,1)_100%)]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="absolute top-[7880px] bg-[url('https://c.animaapp.com/mi7lh0u1WhAn7g/img/group.png')] bg-size-[80%] left-0 w-[100%] h-[900px] bg-[#15191a]">
        {/* <section className=" relative mt-[120px] bg-[url('https://c.animaapp.com/mi7lh0u1WhAn7g/img/group.png')] bg-size-[80%] w-full h-[900px] bg-[#15191a]"> */}
        <h2 className="absolute w-[47.99%] h-[4.78%] top-[8.89%] left-[50%] translate-x-[-50%] [text-shadow:0px_0px_4px_#00000040] bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-transparent text-4xl tracking-[0] leading-[normal] whitespace-nowrap">
          More Than a Platform. An Evolving Standard
        </h2>
        <div className="inline-flex items-center justify-center gap-2.5 p-3 absolute top-[350px] left-[50%] translate-x-[-50%] bg-[#61e4fa] rounded-2xl">
          <span className="relative w-fit mt-[-1.00px] [font-family:'SF_Pro-Semibold',Helvetica] font-normal text-[#15191a] text-[22px] tracking-[0] leading-[normal] whitespace-nowrap">
            The Strategy Hub
          </span>
        </div>

        <p
          ref={text_animation_ref}
          className="text-[#a5adae80] absolute w-[56.11%] h-[14.00%] top-[47.11%] left-[21.94%] [font-family:'SF_Pro-Medium',Helvetica] font-medium text-[28px] text-center tracking-[0] leading-[42px]"
        >
          A "strategy economy" built on our framework. Define your strategy, run
          it on your capital, or monetize it by letting others subscribe. The
          framework is the trust layer for all participants.
        </p>
      </section>
      <div
        style={{
          willChange: "transform", // 性能优化
        }}
        className="relative mt-[450px] mr-auto ml-auto w-[260px] h-[180px]"
      >
        <Image
          ref={img_logo_l}
          className="absolute top-0 left-[-50%] w-40 h-[77px]"
          alt="Group"
          src={logo_r}
        />
        <div
          ref={text_l}
          className="h-[49.26%] top-[50.74%] left-[-100%] [font-family:'Inter',Helvetica] text-white text-[73.5px] absolute font-normal tracking-[0] leading-[normal]"
        >
          Ne
        </div>
        <Image
          ref={img_logo_r}
          className="absolute top-0 right-[-50%] w-40 h-[77px]"
          alt="Group"
          src={logo_l}
        />
        <div
          ref={text_r}
          className="h-[49.26%] top-[50.74%] right-[-100%] [font-family:'Inter',Helvetica] text-white text-[73.5px] absolute font-normal tracking-[0] leading-[normal]"
        >
          beru
        </div>
      </div>

      <div className="absolute top-[9650px] left-[-190px] w-[1440px] h-[287px] bg-[#61e4fa] rounded-[720px/143.5px] blur-[87.45px]" />

      <div className="absolute top-[9650px] left-[909px] w-[1440px] h-[287px] bg-[#ffeabc] rounded-[720px/143.5px] blur-[87.45px]" />

      <div className="absolute top-[9738px] left-0 w-[1440px] h-[218px] bg-[#fefeff] rounded-[720px/109px] blur-[25px]" />

      <footer className="absolute top-[9280px] left-[50%] translate-x-[-50%] w-[1202px] h-[158px]">
        {/* <footer className=" mt-[150px] relative mr-auto ml-auto w-[1202px] h-[158px]"> */}
        <div className="absolute top-0 left-0 w-[375px] h-[102px] flex flex-col gap-6">
          <h3 className="w-[234px] h-[22px] [font-family:'SF_Pro-Regular',Helvetica] font-normal text-white text-[22px] tracking-[-0.66px] leading-[22px] whitespace-nowrap">
            Sign up for our newsletter
          </h3>

          <div className="w-[375px] h-14 relative">
            <div className="absolute top-0 left-0 w-[373px] h-14 rounded-[20px] border border-solid border-[#ffffff4c] backdrop-blur-[25px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(25px)_brightness(100%)]" />

            <Input
              placeholder="Your Email"
              className="absolute top-0 left-0 w-[373px] h-14 bg-transparent border-0 px-5 py-4 text-white placeholder:text-white placeholder:opacity-50 [font-family:'SF_Pro-Regular',Helvetica] font-normal text-base"
            />

            <Button className="px-5 py-4 h-auto absolute top-1 left-[252px] bg-white shadow-[0px_2px_20px_#ffffff99] hover:bg-white/90 transition-colors rounded-2xl">
              <span className="relative w-fit mt-[-1.00px] [font-family:'SF_Pro-Regular',Helvetica] font-normal text-black text-base text-center tracking-[0] leading-4 whitespace-nowrap">
                Subscribe
              </span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col w-[216px] items-start gap-4 absolute top-0 left-[984px]">
          <h3 className="relative self-stretch mt-[-1.00px] [font-family:'SF_Pro-Medium',Helvetica] font-medium text-white text-xs tracking-[0] leading-[normal]">
            SOCIALS
          </h3>

          <img
            className="relative flex-[0_0_auto]"
            alt="Frame"
            src="https://c.animaapp.com/mi7lh0u1WhAn7g/img/frame-2147256338.svg"
          />
        </div>

        <p className="absolute top-[139px] left-0 opacity-50 [font-family:'SF_Pro-Regular',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
          © 2025 Neberu. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
}
