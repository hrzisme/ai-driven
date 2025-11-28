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
import HexagonLogoGrid, { HexagonLogoGridRef } from "@components/hexagon-logo-grid";
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
  const planetBallRef = useRef<HTMLDivElement>(null);
  const philosophySectionRef = useRef<HTMLDivElement>(null);
  const hexagonGridRef = useRef<HexagonLogoGridRef>(null);
  const hexagonSectionRef = useRef<HTMLDivElement>(null);

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

      // 小球下落和内容上移的联动动画
      if (planetBallRef.current && philosophySectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: text_animation_ref_t.current,
            start: "top 20%",   // 更早开始
            end: "top -30%",
            scrub: 0.3,
            markers: false,
          },
        });

        // 小球向下移动
        tl.to(planetBallRef.current, {
          y: 500,
          ease: "power2.inOut",
        }, 0);

        // 三栏内容和力场图向上移动（减少上移距离）
        tl.to(philosophySectionRef.current, {
          y: -150,
          ease: "power2.inOut",
        }, 0);
      }

      // 六边形网格滚动动画 - 当section顶部进入视口底部时开始，当section顶部离开视口顶部时结束
      if (hexagonSectionRef.current && hexagonGridRef.current) {
        const gridElement = hexagonGridRef.current.gridRef.current;
        const logoElements = hexagonGridRef.current.logoRefs.current;
        const glowGridElement = hexagonGridRef.current.glowGridRef.current;
        const glowMaskElement = hexagonGridRef.current.glowMaskRef.current;

        if (gridElement && glowMaskElement && glowGridElement) {
          // 创建主时间线
          const hexTl = gsap.timeline({
            scrollTrigger: {
              trigger: hexagonSectionRef.current,
              start: "top bottom", // 当section顶部进入视口底部时开始
              end: "top top", // 当section顶部离开视口顶部时结束
              scrub: 2, // 平滑跟随
            },
          });

          // 阶段1: 网格从放大状态缩小到正常 (0% - 70%)
          hexTl.to(gridElement, {
            scale: 1,
            duration: 2.1,
            ease: "power2.out",
          }, 0);

          // 发光网格也同步缩小
          hexTl.to(glowGridElement, {
            scale: 1,
            duration: 2.1,
            ease: "power2.out",
          }, 0);

          // 阶段2: 蜂窝边框发光波浪式从中心向外扩散 (60% - 100%)
          // 在网格缩小即将完成时开始
          // 使用环形遮罩实现波浪效果：transparent -> black -> transparent
          
          // 波浪开始 - 中心小环 (网格缩小到约85%时开始)
          hexTl.to(glowMaskElement, {
            maskImage: "radial-gradient(circle at center, transparent 0%, black 0%, black 10%, transparent 18%)",
            webkitMaskImage: "radial-gradient(circle at center, transparent 0%, black 0%, black 10%, transparent 18%)",
            duration: 0.15,
            ease: "none",
          }, 1.3);

          // 环向外扩展
          hexTl.to(glowMaskElement, {
            maskImage: "radial-gradient(circle at center, transparent 8%, black 13%, black 23%, transparent 32%)",
            webkitMaskImage: "radial-gradient(circle at center, transparent 8%, black 13%, black 23%, transparent 32%)",
            duration: 0.15,
            ease: "none",
          }, 1.45);

          hexTl.to(glowMaskElement, {
            maskImage: "radial-gradient(circle at center, transparent 20%, black 25%, black 38%, transparent 48%)",
            webkitMaskImage: "radial-gradient(circle at center, transparent 20%, black 25%, black 38%, transparent 48%)",
            duration: 0.15,
            ease: "none",
          }, 1.6);

          hexTl.to(glowMaskElement, {
            maskImage: "radial-gradient(circle at center, transparent 35%, black 40%, black 55%, transparent 65%)",
            webkitMaskImage: "radial-gradient(circle at center, transparent 35%, black 40%, black 55%, transparent 65%)",
            duration: 0.15,
            ease: "none",
          }, 1.75);

          hexTl.to(glowMaskElement, {
            maskImage: "radial-gradient(circle at center, transparent 50%, black 55%, black 72%, transparent 82%)",
            webkitMaskImage: "radial-gradient(circle at center, transparent 50%, black 55%, black 72%, transparent 82%)",
            duration: 0.15,
            ease: "none",
          }, 1.9);

          hexTl.to(glowMaskElement, {
            maskImage: "radial-gradient(circle at center, transparent 68%, black 73%, black 90%, transparent 100%)",
            webkitMaskImage: "radial-gradient(circle at center, transparent 68%, black 73%, black 90%, transparent 100%)",
            duration: 0.15,
            ease: "none",
          }, 2.05);

          // 波浪到达边缘并消失
          hexTl.to(glowMaskElement, {
            maskImage: "radial-gradient(circle at center, transparent 85%, black 90%, black 105%, transparent 115%)",
            webkitMaskImage: "radial-gradient(circle at center, transparent 85%, black 90%, black 105%, transparent 115%)",
            duration: 0.12,
            ease: "none",
          }, 2.2);

          // 完全消失
          hexTl.to(glowMaskElement, {
            maskImage: "radial-gradient(circle at center, transparent 0%, transparent 100%)",
            webkitMaskImage: "radial-gradient(circle at center, transparent 0%, transparent 100%)",
            duration: 0.1,
            ease: "none",
          }, 2.32);

          // 阶段3: Logo逐个显现 (50% - 90%)
          logoElements.forEach((logo, index) => {
            if (logo) {
              hexTl.to(logo, {
                opacity: 1,
                duration: 0.2,
                ease: "power2.out",
              }, 0.5 + index * 0.06);
            }
          });

        }

        // 下方文字打字机效果 - 同样的滚动范围
        if (text_animation_ref.current) {
          const textElement = text_animation_ref.current as HTMLElement;
          const text = textElement.innerText;
          
          // 创建打字机效果的容器
          textElement.innerHTML = '';
          const chars = text.split('');
          chars.forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            textElement.appendChild(span);
          });

          const charSpans = textElement.querySelectorAll('span');
          
          // 创建打字机动画时间线
          const typingTl = gsap.timeline({
            scrollTrigger: {
              trigger: hexagonSectionRef.current,
              start: "top bottom", // 当section顶部进入视口底部时开始
              end: "top top", // 当section顶部离开视口顶部时结束
              scrub: 2,
            },
          });

          // 逐字显示：从30%开始，到80%完成 (总范围50%)
          const startTime = 0.3; // 30%处开始
          const endTime = 0.8; // 80%处结束
          const totalDuration = endTime - startTime; // 0.5
          const charDelay = totalDuration / charSpans.length; // 每个字符的间隔
          
          charSpans.forEach((span, index) => {
            typingTl.to(span, {
              opacity: 1,
              duration: 0.01,
              ease: "none",
            }, startTime + index * charDelay);
          });
        }
      }
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
      className="pt-5 bg-[#15191a] overflow-hidden w-full min-w-[1000px] min-h-[10000px] relative"
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

      <section className="absolute top-[2925px] left-[50%] translate-x-[-50%] w-210 flex flex-col items-center z-30">
        <h2
          ref={text_animation_ref_t}
          className="[font-family:'SF_Pro-Semibold',Helvetica] font-normal text-[#a5adae] text-[56px] text-center tracking-[0] leading-[normal]"
        >
          The power of AI is ready. <br />
          The infrastructure to trust it is not.
          <br /> Until now.
        </h2>
        {/* 蓝色小球 */}
        <div ref={planetBallRef} className="mt-12 relative w-[120px] h-[120px] z-50">
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
        ref={(el) => {
          ballContentRef.current = el;
          philosophySectionRef.current = el;
        }}
        className="absolute top-[3474px] left-[50%] translate-x-[-50%] w-[1200px] h-[826px] z-10"
      >
        <div className="absolute top-0 left-0 flex gap-[61px]">
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
          className="absolute top-[291px] left-px w-[1199px] h-[264px]"
          alt="Frame"
          src="https://c.animaapp.com/mi7lh0u1WhAn7g/img/frame.svg"
        />
      </section>

      <section className="absolute top-[4100px] left-[50%] translate-x-[-50%] w-[1200px]">
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
        className="sticky mt-[5327px] pt-[50px] mr-auto ml-auto w-[1000px]"
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

      <section 
        ref={hexagonSectionRef}
        className="absolute top-[7600px] left-0 w-full h-[900px] bg-[#15191a] overflow-visible"
      >
        {/* 六边形网格背景 + Logo */}
        <HexagonLogoGrid ref={hexagonGridRef} className="absolute inset-0" />

        {/* 顶部渐变遮罩 - 柔化边界 */}
        <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-[#15191a] to-transparent z-20 pointer-events-none" />
        
        {/* 底部渐变遮罩 - 柔化边界 */}
        <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-[#15191a] to-transparent z-20 pointer-events-none" />

        {/* 标题 */}
        <h2 className="absolute top-[80px] left-1/2 -translate-x-1/2 [text-shadow:0px_0px_4px_#00000040] bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-semibold text-4xl tracking-[0] leading-normal text-center z-30">
          More Than a Platform. An Evolving Standard
        </h2>

        {/* 按钮标签 */}
        <div className="inline-flex items-center justify-center gap-2.5 px-6 py-3 absolute top-[380px] left-1/2 -translate-x-1/2 bg-[#61e4fa] rounded-2xl z-30">
          <span className="[font-family:'SF_Pro-Semibold',Helvetica] font-semibold text-[#15191a] text-[22px] tracking-[0] leading-normal whitespace-nowrap">
            The Strategy Hub
          </span>
        </div>

        {/* 描述文字 */}
        <p
          ref={text_animation_ref}
          className="absolute w-[800px] max-w-[90%] top-[480px] left-1/2 -translate-x-1/2 text-[#a5adae] [font-family:'SF_Pro-Medium',Helvetica] font-medium text-[28px] text-center tracking-[0] leading-[42px] z-30"
        >
          A "strategy economy" built on our framework. Define your strategy, run
          it on your capital, or monetize it by letting others subscribe. The
          framework is the trust layer for all participants.
        </p>
      </section>

      {/* New Updates Section */}
      <section className="absolute top-[8550px] left-[50%] translate-x-[-50%] w-[1200px]">
        <h2 className="text-center bg-[linear-gradient(90deg,rgba(149,156,157,1)_0%,rgba(240,253,255,1)_51%,rgba(149,156,157,1)_100%)] [-webkit-background-clip:text] bg-clip-text [-webkit-text-fill-color:transparent] [text-fill-color:transparent] [font-family:'SF_Pro-Semibold',Helvetica] font-semibold text-4xl tracking-[0] leading-normal">
          New Updates
        </h2>

        <div className="flex gap-6 mt-12 justify-center">
          {/* Card 1 */}
          <div className="group relative w-[370px] bg-[#1a1f20] rounded-2xl overflow-hidden border border-[#2a3235] transition-all duration-300">
            {/* Hover 灯光效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#61e4fa]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            
            <div className="p-4">
              <img 
                src="https://c.animaapp.com/mi7lh0u1WhAn7g/img/frame-1.svg" 
                alt="Article" 
                className="w-full h-[160px] object-cover rounded-xl bg-[#0a0d0e]"
              />
            </div>
            <div className="px-4 pb-6">
              <p className="text-[#61e4fa] text-sm [font-family:'SF_Pro-Regular',Helvetica] mb-2">November 11, 2025</p>
              <h3 className="text-white text-lg [font-family:'SF_Pro-Medium',Helvetica] leading-relaxed mb-4">
                x402 Meets BioAgents: AI Scientists Rewiring the Science Economy
              </h3>
              <a href="#" className="text-white text-sm [font-family:'SF_Pro-Regular',Helvetica] underline hover:text-[#61e4fa] transition-colors">
                Read More
              </a>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative w-[370px] bg-[#1a1f20] rounded-2xl overflow-hidden border border-[#2a3235] transition-all duration-300">
            {/* Hover 灯光效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#61e4fa]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            
            <div className="p-4">
              <img 
                src="https://c.animaapp.com/mi7lh0u1WhAn7g/img/frame-2.svg" 
                alt="Article" 
                className="w-full h-[160px] object-cover rounded-xl bg-[#0a0d0e]"
              />
            </div>
            <div className="px-4 pb-6">
              <p className="text-[#61e4fa] text-sm [font-family:'SF_Pro-Regular',Helvetica] mb-2">November 4, 2025</p>
              <h3 className="text-white text-lg [font-family:'SF_Pro-Medium',Helvetica] leading-relaxed mb-4">
                Bio Monthly: Bio Season 2, x402 Payments x DeSci Agents, eDMT on Rogan, HSC Aging, Stack ...
              </h3>
              <a href="#" className="text-white text-sm [font-family:'SF_Pro-Regular',Helvetica] underline hover:text-[#61e4fa] transition-colors">
                Read More
              </a>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative w-[370px] bg-[#1a1f20] rounded-2xl overflow-hidden border border-[#2a3235] transition-all duration-300">
            {/* Hover 灯光效果 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#61e4fa]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
            
            <div className="p-4">
              <img 
                src="https://c.animaapp.com/mi7lh0u1WhAn7g/img/group.png" 
                alt="Article" 
                className="w-full h-[160px] object-cover rounded-xl bg-[#0a0d0e]"
              />
            </div>
            <div className="px-4 pb-6">
              <p className="text-[#61e4fa] text-sm [font-family:'SF_Pro-Regular',Helvetica] mb-2">October 31, 2025</p>
              <h3 className="text-white text-lg [font-family:'SF_Pro-Medium',Helvetica] leading-relaxed mb-4">
                Bio Season 2: Building the Future of Permissionless DeSci
              </h3>
              <a href="#" className="text-white text-sm [font-family:'SF_Pro-Regular',Helvetica] underline hover:text-[#61e4fa] transition-colors">
                Read More
              </a>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <button className="flex items-center gap-2 px-6 py-3 border border-[#3a4245] rounded-full text-white [font-family:'SF_Pro-Medium',Helvetica] text-sm hover:bg-white/5 transition-colors">
            VIEW ALL
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </button>
        </div>
      </section>

      {/* Logo 聚拢动效 */}
      <div
        style={{
          willChange: "transform", // 性能优化
        }}
        className="absolute top-[9250px] left-[50%] translate-x-[-50%] w-[260px] h-[180px]"
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

      {/* 底部光效 */}
      <div className="absolute top-[9850px] left-[-190px] w-[1440px] h-[287px] bg-[#61e4fa] rounded-[720px/143.5px] blur-[87.45px]" />

      <div className="absolute top-[9850px] left-[909px] w-[1440px] h-[287px] bg-[#ffeabc] rounded-[720px/143.5px] blur-[87.45px]" />

      <div className="absolute top-[9938px] left-0 w-[1440px] h-[218px] bg-[#fefeff] rounded-[720px/109px] blur-[25px]" />

      <footer className="absolute top-[9550px] left-[50%] translate-x-[-50%] w-[1280px] h-[450px] px-10">
        {/* 左侧 - Logo、地址、社交 */}
        <div className="absolute top-0 left-10 flex flex-col gap-8">
          {/* Logo */}
          <img
            src="/neberu.svg"
            alt="Neberu"
            className="h-5 w-auto self-start"
          />

          {/* 地址 */}
          <div className="flex flex-col gap-1 text-white/70 [font-family:'SF_Pro-Regular',Helvetica] text-sm leading-relaxed max-w-[280px]">
            <span>260 Sheridan Ave</span>
            <span>Suite 300</span>
            <span>Palo Alto, CA 94306</span>
            <span>United States</span>
          </div>

          {/* 社交媒体 */}
          <div className="flex flex-col gap-4 mt-4">
            <h4 className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-white/50 text-xs tracking-wider">
              SOCIALS
            </h4>
            <div className="flex gap-3">
              <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 右侧 - 链接列 */}
        <div className="absolute top-0 right-10 flex gap-24">
          {/* LEGAL */}
          <div className="flex flex-col gap-4">
            <h4 className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-white/50 text-xs tracking-wider">
              LEGAL
            </h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                Terms And Conditions
              </a>
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>

          {/* RESOURCES */}
          <div className="flex flex-col gap-4">
            <h4 className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-white/50 text-xs tracking-wider">
              RESOURCES
            </h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                Web Agents
              </a>
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                User Guide
              </a>
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                Forum
              </a>
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                Technical Docs
              </a>
            </div>
          </div>

          {/* COMPANY */}
          <div className="flex flex-col gap-4">
            <h4 className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-white/50 text-xs tracking-wider">
              COMPANY
            </h4>
            <div className="flex flex-col gap-3">
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                Careers
              </a>
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                Blog
              </a>
              <a href="#" className="[font-family:'SF_Pro-Regular',Helvetica] text-white text-base hover:text-white/70 transition-colors">
                Brand
              </a>
            </div>
          </div>
        </div>

        {/* 分割线 - 两头渐变消失 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[1px] bg-gradient-to-r from-transparent via-[#3a4245] to-transparent" />

        {/* 底部版权 */}
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 [font-family:'SF_Pro-Regular',Helvetica] font-normal text-[#3a4245] text-sm tracking-[0] leading-[normal] whitespace-nowrap">
          © 2025 Neberu. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
