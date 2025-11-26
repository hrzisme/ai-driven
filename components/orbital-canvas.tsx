"use client";
import React, { useEffect, useRef, useCallback } from "react";

interface Orb {
  baseAngle: number; // 初始角度
  scrollSpeed: number; // 滚动速度倍数
  orbitA: number; // 椭圆长轴
  orbitB: number; // 椭圆短轴
  rotation: number; // 轨道倾斜角度
  offsetY: number; // 轨道垂直偏移，让顶部对齐
  size: number;
  color: string;
  glowColor: string;
}

interface OrbitalCanvasProps {
  className?: string;
}

export default function OrbitalCanvas({ className }: OrbitalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const orbsRef = useRef<Orb[]>([]);
  const scrollProgressRef = useRef<number>(0);

  // 计算椭圆与横线的交点
  // 返回所有交点的 x 坐标和对应角度
  const findIntersections = useCallback((a: number, b: number, rotation: number, lineY: number): {x: number, angle: number}[] => {
    const intersections: {x: number, angle: number}[] = [];
    let lastY = Infinity;

    for (let t = -Math.PI; t <= Math.PI; t += 0.001) {
      const x = a * Math.cos(t) * Math.cos(rotation) - b * Math.sin(t) * Math.sin(rotation);
      const y = a * Math.cos(t) * Math.sin(rotation) + b * Math.sin(t) * Math.cos(rotation);

      // 检测穿越横线
      if ((lastY < lineY && y >= lineY) || (lastY > lineY && y <= lineY)) {
        intersections.push({ x, angle: t });
      }
      lastY = y;
    }
    return intersections;
  }, []);

  // 根据目标x位置，计算需要的轨道旋转角度
  // 使得轨道与横线的交点恰好在目标x位置
  const findRotationForTargetX = useCallback((a: number, b: number, lineY: number, targetX: number, baseRotation: number): { rotation: number, angle: number } => {
    let bestRotation = baseRotation;
    let bestAngle = 0;
    let minDiff = Infinity;

    // 扩大搜索范围，确保能找到合适的旋转角度
    for (let r = baseRotation - 1.5; r <= baseRotation + 1.5; r += 0.005) {
      const intersections = findIntersections(a, b, r, lineY);
      for (const inter of intersections) {
        const diff = Math.abs(inter.x - targetX);
        if (diff < minDiff) {
          minDiff = diff;
          bestRotation = r;
          bestAngle = inter.angle;
        }
      }
    }
    return { rotation: bestRotation, angle: bestAngle };
  }, [findIntersections]);

  // 初始化轨道上的小球
  // 扁椭圆轨道围绕大球，轨道中心与大球中心对齐
  // 调整轨道旋转角度，使横线与4个轨道的交点均匀分布
  const initOrbs = useCallback(() => {
    const lineY = -550; // 大球顶部(500)上方50px

    // 四个交点的目标 x 位置（均匀分布，间距80px）
    const targetXPositions = [-120, -40, 40, 120];

    const baseConfigs = [
      {
        scrollSpeed: 0.9,
        orbitA: 700,
        orbitB: 280,
        baseRotation: -Math.PI * 0.42, // 向左倾斜，使交点在左边
        size: 18,
        color: "#e0625c", // 红色
        glowColor: "rgba(224, 98, 92, 0.8)",
      },
      {
        scrollSpeed: -0.7,
        orbitA: 750,
        orbitB: 320,
        baseRotation: Math.PI * 0.15, // 略向右倾斜
        size: 20,
        color: "#61e4fa", // 青色
        glowColor: "rgba(97, 228, 250, 0.8)",
      },
      {
        scrollSpeed: 1.1,
        orbitA: 700,
        orbitB: 280,
        baseRotation: Math.PI * 0.18, // 略向右倾斜
        size: 22,
        color: "#fdee2f", // 黄色
        glowColor: "rgba(253, 238, 47, 0.8)",
      },
      {
        scrollSpeed: -0.6,
        orbitA: 780,
        orbitB: 340,
        baseRotation: Math.PI * 0.45, // 向右倾斜
        size: 16,
        color: "#6b7cfa", // 蓝色
        glowColor: "rgba(107, 124, 250, 0.8)",
      },
    ];

    orbsRef.current = baseConfigs.map((config, index) => {
      const { rotation, angle } = findRotationForTargetX(
        config.orbitA,
        config.orbitB,
        lineY,
        targetXPositions[index],
        config.baseRotation
      );
      return {
        scrollSpeed: config.scrollSpeed,
        orbitA: config.orbitA,
        orbitB: config.orbitB,
        rotation,
        size: config.size,
        color: config.color,
        glowColor: config.glowColor,
        baseAngle: angle,
        offsetY: 0,
      };
    });
  }, [findRotationForTargetX]);

  // 绘制中心大星球
  const drawCenterPlanet = useCallback(
    (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scrollProgress: number) => {
      const planetRadius = 500;

      // 根据滚动进度计算月牙大小 (0 -> 1)
      const moonScale = Math.min(1, scrollProgress / (Math.PI * 2)); // 滚动一半页面达到最大

      // 外发光 - 白色，用圆环形状（只在外层）
      ctx.save();
      ctx.beginPath();
      // 外圆
      ctx.arc(centerX, centerY, planetRadius + 30, 0, Math.PI * 2);
      // 内圆（逆时针，形成圆环）
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.clip();

      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        planetRadius,
        centerX,
        centerY,
        planetRadius + 30
      );
      outerGlow.addColorStop(0, "rgba(255, 255, 255, 0.4)");
      outerGlow.addColorStop(0.5, "rgba(255, 255, 255, 0.15)");
      outerGlow.addColorStop(1, "transparent");
      ctx.fillStyle = outerGlow;
      ctx.fillRect(centerX - planetRadius - 40, centerY - planetRadius - 40, (planetRadius + 40) * 2, (planetRadius + 40) * 2);
      ctx.restore();

      // 黑色打底
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#15191a";
      ctx.fill();

      // 基础内发光 - 整圈均匀的蓝色发光
      const innerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        planetRadius - 20,
        centerX,
        centerY,
        planetRadius
      );
      innerGlow.addColorStop(0, "transparent");
      innerGlow.addColorStop(0.3, "rgba(97, 228, 250, 0.1)");
      innerGlow.addColorStop(1, "rgba(97, 228, 250, 0.4)");
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = innerGlow;
      ctx.fill();

      // 底部月牙 - 根据滚动进度变大
      // 偏移量从 0.03 到 0.5，内圆半径从 0.96 到 0.3
      const moonOffset = 0.03 + moonScale * 0.47;
      const moonInnerRadius = 0.96 - moonScale * 0.66;
      const moonAlpha = 0.15 + moonScale * 0.7;

      const bottomGlow = ctx.createRadialGradient(
        centerX,
        centerY - planetRadius * moonOffset,
        planetRadius * moonInnerRadius,
        centerX,
        centerY - planetRadius * moonOffset,
        planetRadius
      );
      bottomGlow.addColorStop(0, "transparent");
      bottomGlow.addColorStop(0.5, "transparent");
      bottomGlow.addColorStop(1, `rgba(97, 228, 250, ${moonAlpha})`);
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.fillStyle = bottomGlow;
      ctx.fill();

      // 白色圆环 - 厚度为2
      ctx.beginPath();
      ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
    },
    []
  );

  // 计算椭圆与大球边缘的交点角度
  const findOrbitIntersections = useCallback(
    (a: number, b: number, rotation: number, planetRadius: number): number[] => {
      const intersections: number[] = [];
      let lastDist = 0;

      // 遍历角度，找到椭圆上距离中心等于planetRadius的点
      for (let t = -Math.PI; t <= Math.PI; t += 0.005) {
        const ellipseX = Math.cos(t) * a;
        const ellipseY = Math.sin(t) * b;

        // 应用旋转
        const x = ellipseX * Math.cos(rotation) - ellipseY * Math.sin(rotation);
        const y = ellipseX * Math.sin(rotation) + ellipseY * Math.cos(rotation);

        // 计算到中心的距离
        const dist = Math.sqrt(x * x + y * y);

        // 检测穿越大球边缘（从内到外或从外到内）
        if (lastDist !== 0) {
          if ((lastDist < planetRadius && dist >= planetRadius) ||
              (lastDist > planetRadius && dist <= planetRadius)) {
            intersections.push(t);
          }
        }
        lastDist = dist;
      }

      return intersections;
    },
    []
  );

  // 绘制椭圆轨道（隐藏在大球内部的短弧段）
  const drawOrbit = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      a: number,
      b: number,
      rotation: number,
      offsetY: number,
      color: string,
      planetRadius: number
    ) => {
      const intersections = findOrbitIntersections(a, b, rotation, planetRadius);

      // 计算某角度点的位置
      const getPosition = (angle: number) => {
        const ellipseX = Math.cos(angle) * a;
        const ellipseY = Math.sin(angle) * b;
        const x = ellipseX * Math.cos(rotation) - ellipseY * Math.sin(rotation);
        const y = ellipseX * Math.sin(rotation) + ellipseY * Math.cos(rotation);
        return { x, y, dist: Math.sqrt(x * x + y * y) };
      };

      if (intersections.length >= 4) {
        // 4个交点，分成4段弧
        const angles = [...intersections].sort((a, b) => a - b);

        // 计算每段弧的长度和中点位置
        const arcs: { start: number; end: number; length: number; midY: number; isInside: boolean }[] = [];

        for (let i = 0; i < angles.length; i++) {
          const startAngle = angles[i];
          const endAngle = i < angles.length - 1 ? angles[i + 1] : angles[0] + Math.PI * 2;
          const length = endAngle - startAngle;
          const midAngle = (startAngle + endAngle) / 2;
          const midPos = getPosition(midAngle);

          arcs.push({
            start: startAngle,
            end: endAngle,
            length,
            midY: midPos.y,
            isInside: midPos.dist < planetRadius
          });
        }

        // 找出在大球内部的两段短弧，只隐藏 y 值更大的那段（在后面/下面的）
        const insideArcs = arcs.filter(arc => arc.isInside);
        let hiddenArc: typeof arcs[0] | null = null;

        if (insideArcs.length >= 2) {
          // 隐藏 y 值更大的那段（在大球后面）
          hiddenArc = insideArcs.reduce((a, b) => a.midY > b.midY ? a : b);
        } else if (insideArcs.length === 1) {
          hiddenArc = insideArcs[0];
        }

        // 绘制除了隐藏弧之外的所有弧
        for (const arc of arcs) {
          if (arc !== hiddenArc) {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + offsetY, a, b, rotation, arc.start, arc.end);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      } else if (intersections.length >= 2) {
        // 2个交点的情况，隐藏在大球内部且 y 值更大的那段
        const angles = [...intersections].sort((a, b) => a - b);
        const angle1 = angles[0];
        const angle2 = angles[1];

        const midAngle1 = (angle1 + angle2) / 2;
        const midAngle2 = (angle2 + angle1 + Math.PI * 2) / 2;
        const pos1 = getPosition(midAngle1);
        const pos2 = getPosition(midAngle2);

        // 只隐藏在大球内部且 y 更大的那段
        const arc1Inside = pos1.dist < planetRadius;
        const arc2Inside = pos2.dist < planetRadius;

        if (arc1Inside && arc2Inside) {
          // 两段都在内部，隐藏 y 更大的
          if (pos1.y <= pos2.y) {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + offsetY, a, b, rotation, angle1, angle2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          if (pos2.y <= pos1.y) {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + offsetY, a, b, rotation, angle2, angle1 + Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        } else {
          // 绘制不在内部的弧
          if (!arc1Inside || (arc1Inside && !arc2Inside)) {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + offsetY, a, b, rotation, angle1, angle2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          if (!arc2Inside || (arc2Inside && !arc1Inside)) {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + offsetY, a, b, rotation, angle2, angle1 + Math.PI * 2);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      } else {
        // 没有交点，绘制完整椭圆
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + offsetY, a, b, rotation, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    },
    [findOrbitIntersections]
  );

  // 绘制发光小球
  const drawOrb = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      color: string,
      glowColor: string
    ) => {
      // 解析颜色为rgba格式
      const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      // 外发光 - 白色，厚度8px
      const gradient = ctx.createRadialGradient(x, y, size, x, y, size + 8);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
      gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
      gradient.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(x, y, size + 8, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // 主球体 - 黑色打底
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = "#15191a";
      ctx.fill();

      // 整圈基础内发光
      const innerGlow = ctx.createRadialGradient(
        x,
        y,
        size * 0.6,
        x,
        y,
        size
      );
      innerGlow.addColorStop(0, "transparent");
      innerGlow.addColorStop(0.3, hexToRgba(color, 0.1));
      innerGlow.addColorStop(1, hexToRgba(color, 0.6));
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = innerGlow;
      ctx.fill();

      // 底部月牙 - 彩色发光
      const moonGlow = ctx.createRadialGradient(
        x,
        y - size * 0.3,
        size * 0.4,
        x,
        y - size * 0.3,
        size
      );
      moonGlow.addColorStop(0, "transparent");
      moonGlow.addColorStop(0.4, "transparent");
      moonGlow.addColorStop(0.8, hexToRgba(color, 0.5));
      moonGlow.addColorStop(1, color);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = moonGlow;
      ctx.fill();

      // 内部黑色圆带渐变边缘 - 向上偏移，让底部月牙显示
      const innerBlack = ctx.createRadialGradient(
        x,
        y - size * 0.25,
        size * 0.4,
        x,
        y - size * 0.25,
        size * 0.7
      );
      innerBlack.addColorStop(0, "#15191a");
      innerBlack.addColorStop(0.7, "#15191a");
      innerBlack.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(x, y - size * 0.25, size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = innerBlack;
      ctx.fill();

      // 小球下方彩色阴影
      const shadowGradient = ctx.createRadialGradient(
        x,
        y + size * 1.2,
        0,
        x,
        y + size * 1.2,
        size * 1.5
      );
      shadowGradient.addColorStop(0, hexToRgba(color, 0.4));
      shadowGradient.addColorStop(0.5, hexToRgba(color, 0.15));
      shadowGradient.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(x, y + size * 1.2, size * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = shadowGradient;
      ctx.fill();
    },
    []
  );

  // 渲染函数
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const centerX = canvas.width / dpr / 2;
    // 中心点在 canvas 正中心，与星球中心对齐
    const centerY = canvas.height / dpr / 2;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. 先绘制中心大星球
    drawCenterPlanet(ctx, centerX, centerY, scrollProgressRef.current);


    // 2. 绘制轨道线（只绘制大球外面的部分）
    const planetRadius = 500;
    orbsRef.current.forEach((orb) => {
      drawOrbit(
        ctx,
        centerX,
        centerY,
        orb.orbitA,
        orb.orbitB,
        orb.rotation,
        orb.offsetY,
        "rgba(255, 255, 255, 0.08)",
        planetRadius
      );
    });

    // 3. 绘制每个小球
    orbsRef.current.forEach((orb) => {
      // 根据滚动进度计算角度
      const angle = orb.baseAngle + scrollProgressRef.current * orb.scrollSpeed;

      // 计算椭圆上的位置（未旋转）
      const ellipseX = Math.cos(angle) * orb.orbitA;
      const ellipseY = Math.sin(angle) * orb.orbitB;

      // 应用轨道旋转，并加上offsetY使轨道顶部对齐
      const x = centerX + ellipseX * Math.cos(orb.rotation) - ellipseY * Math.sin(orb.rotation);
      const y = centerY + orb.offsetY + ellipseX * Math.sin(orb.rotation) + ellipseY * Math.cos(orb.rotation);

      // 绘制小球
      drawOrb(ctx, x, y, orb.size, orb.color, orb.glowColor);
    });

    animationRef.current = requestAnimationFrame(render);
  }, [drawCenterPlanet, drawOrbit, drawOrb]);

  // 处理 canvas 尺寸
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  // 处理滚动
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    // 滚动进度转换为弧度，一个完整页面滚动 = 4π
    scrollProgressRef.current = (scrollTop / docHeight) * Math.PI * 4;
  }, []);

  useEffect(() => {
    initOrbs();
    handleResize();
    handleScroll();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initOrbs, handleResize, handleScroll, render]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
