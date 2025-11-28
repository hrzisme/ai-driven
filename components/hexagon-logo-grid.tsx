"use client";
import React, { useRef, forwardRef, useImperativeHandle } from "react";

// 六边形网格参数 (基于 group.svg 分析)
const HEX_WIDTH = 85.76;
const HEX_HEIGHT = 74.23;
const ROW_ODD_START_X = 67;
const ROW_EVEN_START_X = 24;
const ROW_START_Y = 46;

// 计算六边形中心位置
const getHexCenter = (col: number, row: number) => {
  const isOddRow = row % 2 === 1;
  const startX = isOddRow ? ROW_ODD_START_X : ROW_EVEN_START_X;
  return {
    x: startX + col * HEX_WIDTH,
    y: ROW_START_Y + row * HEX_HEIGHT,
  };
};

// Logo 配置 - 均匀分布在左右两侧，避免遮挡文字
const logoConfigs = [
  // 左侧
  { id: "hl", col: 3, row: 1, logo: "/logo/hl.svg", scale: 1.0 },
  { id: "lighter", col: 5, row: 3, logo: "/logo/lighter.svg", scale: 1.0 },
  { id: "kucoin", col: 2, row: 6, logo: "/logo/kucoin.svg", scale: 1.0 },
  { id: "aster", col: 3, row: 8, logo: "/logo/aster.svg", scale: 1.0 },
  // 右侧
  { id: "coinbase", col: 13, row: 1, logo: "/logo/coinbase.svg", scale: 1.5 },
  { id: "okx", col: 15, row: 2, logo: "/logo/okx.svg", scale: 1.0 },
  { id: "binance", col: 12, row: 5, logo: "/logo/binance.svg", scale: 1.0 },
  { id: "bybit", col: 14, row: 7, logo: "/logo/bybit.svg", scale: 1.0 },
];

const logoPositions = logoConfigs.map((config) => {
  const center = getHexCenter(config.col, config.row);
  return {
    id: config.id,
    x: center.x,
    y: center.y,
    logo: config.logo,
    scale: config.scale || 1.0,
  };
});

interface HexagonLogoGridProps {
  className?: string;
}

export interface HexagonLogoGridRef {
  gridRef: React.RefObject<HTMLDivElement>;
  logoRefs: React.RefObject<(SVGImageElement | null)[]>;
  glowGridRef: React.RefObject<HTMLDivElement>;
  glowMaskRef: React.RefObject<HTMLDivElement>;
}

const HexagonLogoGrid = forwardRef<HexagonLogoGridRef, HexagonLogoGridProps>(
  ({ className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const logoRefs = useRef<(SVGImageElement | null)[]>([]);
    const glowGridRef = useRef<HTMLDivElement>(null);
    const glowMaskRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      gridRef,
      logoRefs,
      glowGridRef,
      glowMaskRef,
    }));

    const baseWidth = 108;
    const baseHeight = 118;

    return (
      <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
        {/* 六边形网格背景 - 基础层 */}
        <div
          ref={gridRef}
          className="absolute inset-0 w-full h-full"
          style={{
            transform: "scale(3)",
            transformOrigin: "center center",
          }}
        >
          <img
            src="/logo/group.svg"
            alt="Hexagon Grid"
            className="w-full h-full object-cover pointer-events-none"
            style={{
              objectPosition: "center",
            }}
          />
        </div>

        {/* 发光的蜂窝网格层 - 使用遮罩控制从中心向外扩散 */}
        <div
          ref={glowMaskRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            maskImage: "radial-gradient(circle at center, black 0%, black 0%, transparent 0%)",
            WebkitMaskImage: "radial-gradient(circle at center, black 0%, black 0%, transparent 0%)",
          }}
        >
          <div
            ref={glowGridRef}
            className="absolute inset-0 w-full h-full"
            style={{
              transform: "scale(3)",
              transformOrigin: "center center",
            }}
          >
            <img
              src="/logo/group.svg"
              alt="Hexagon Grid Glow"
              className="w-full h-full object-cover pointer-events-none"
              style={{
                objectPosition: "center",
                filter: "drop-shadow(0 0 8px rgba(97, 228, 250, 1)) drop-shadow(0 0 16px rgba(97, 228, 250, 0.8)) drop-shadow(0 0 24px rgba(97, 228, 250, 0.6)) brightness(2)",
              }}
            />
          </div>
        </div>

        {/* Logo 层 */}
        <div className="absolute inset-0 w-full h-full z-20">
          <svg
            viewBox="0 0 1439 900"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {logoPositions.map((pos, index) => {
              const width = baseWidth * pos.scale;
              const height = baseHeight * pos.scale;
              return (
                <image
                  key={pos.id}
                  ref={(el) => {
                    logoRefs.current[index] = el;
                  }}
                  href={pos.logo}
                  x={pos.x - width / 2}
                  y={pos.y - height / 2}
                  width={width}
                  height={height}
                  style={{
                    opacity: 0,
                    filter: "drop-shadow(0 0 15px rgba(97, 228, 250, 0.4))",
                  }}
                />
              );
            })}
          </svg>
        </div>
      </div>
    );
  }
);

HexagonLogoGrid.displayName = "HexagonLogoGrid";

export default HexagonLogoGrid;
