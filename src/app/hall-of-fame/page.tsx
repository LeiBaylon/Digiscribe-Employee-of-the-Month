"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Avatar } from "@/components/ui/avatar";
import { CategoryBadge } from "@/components/ui/badge";
import { monthlyWinners } from "@/lib/data";
import { CATEGORY_LABELS } from "@/lib/types";
import { Award, Quote, Sparkles, Star } from "lucide-react";

const hexPoints = (cx: number, cy: number, r: number) => {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(" ");
};

function HallOfFameSVG() {
  const centerX = 500;
  const centerY = 320;
  const rings = [
    { radius: 0, items: [monthlyWinners[0]] },
    { radius: 160, items: monthlyWinners.slice(1, 4) },
    { radius: 280, items: monthlyWinners.slice(4, 10) },
  ];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox="0 0 1000 640"
        className="w-full max-w-[1000px] mx-auto"
        style={{ minWidth: 600 }}
      >
        <defs>
          <linearGradient id="svgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#818CF8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#C084FC" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#D4A574" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background glow */}
        <circle cx={centerX} cy={centerY} r={320} fill="url(#bgGlow)" />

        {/* Connection rings */}
        <circle
          cx={centerX}
          cy={centerY}
          r={160}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <circle
          cx={centerX}
          cy={centerY}
          r={280}
          fill="none"
          stroke="rgba(255,255,255,0.02)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Connection lines to center */}
        {rings[1].items.map((_, i) => {
          const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
          const x = centerX + 160 * Math.cos(angle);
          const y = centerY + 160 * Math.sin(angle);
          return (
            <line
              key={`line1-${i}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Outer ring nodes */}
        {rings[2].items.map((winner, i) => {
          const angle = (Math.PI * 2 * i) / rings[2].items.length - Math.PI / 2;
          const x = centerX + 280 * Math.cos(angle);
          const y = centerY + 280 * Math.sin(angle);
          const initials = winner.employee.name
            .split(" ")
            .map((n) => n[0])
            .join("");
          return (
            <motion.g
              key={`outer-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
            >
              <polygon
                points={hexPoints(x, y, 32)}
                fill="rgba(15, 23, 42, 0.8)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
              <text
                x={x}
                y={y - 4}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
                fontWeight="600"
              >
                {initials}
              </text>
              <text
                x={x}
                y={y + 12}
                textAnchor="middle"
                fill="#64748B"
                fontSize="7"
              >
                {winner.month.slice(0, 3)} {winner.year}
              </text>
            </motion.g>
          );
        })}

        {/* Inner ring nodes */}
        {rings[1].items.map((winner, i) => {
          const angle = (Math.PI * 2 * i) / 3 - Math.PI / 2;
          const x = centerX + 160 * Math.cos(angle);
          const y = centerY + 160 * Math.sin(angle);
          const initials = winner.employee.name
            .split(" ")
            .map((n) => n[0])
            .join("");
          return (
            <motion.g
              key={`inner-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
            >
              <polygon
                points={hexPoints(x, y, 40)}
                fill="rgba(15, 23, 42, 0.9)"
                stroke="url(#svgGrad)"
                strokeWidth="1.5"
                filter="url(#glow)"
              />
              <text
                x={x}
                y={y - 6}
                textAnchor="middle"
                fill="#E2E8F0"
                fontSize="13"
                fontWeight="700"
              >
                {initials}
              </text>
              <text
                x={x}
                y={y + 10}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="8"
              >
                {winner.month.slice(0, 3)} {winner.year}
              </text>
            </motion.g>
          );
        })}

        {/* Center node (current winner) */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            bounce: 0.3,
            duration: 0.8,
          }}
        >
          <polygon
            points={hexPoints(centerX, centerY, 55)}
            fill="rgba(15, 23, 42, 0.95)"
            stroke="url(#goldGrad)"
            strokeWidth="2"
            filter="url(#glow)"
          />
          <text
            x={centerX}
            y={centerY - 12}
            textAnchor="middle"
            fill="#F59E0B"
            fontSize="16"
            fontWeight="800"
          >
            {monthlyWinners[0].employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </text>
          <text
            x={centerX}
            y={centerY + 6}
            textAnchor="middle"
            fill="#E2E8F0"
            fontSize="8"
            fontWeight="500"
          >
            EMPLOYEE OF
          </text>
          <text
            x={centerX}
            y={centerY + 18}
            textAnchor="middle"
            fill="#E2E8F0"
            fontSize="8"
            fontWeight="500"
          >
            THE MONTH
          </text>
          <text
            x={centerX}
            y={centerY + 34}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="7"
          >
            {monthlyWinners[0].month} {monthlyWinners[0].year}
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

export default function HallOfFamePage() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          <span className="gradient-text">Hall of Fame</span>
        </h1>
        <p className="text-sm text-foreground-muted mt-1">
          Celebrating our greatest achievers across all time.
        </p>
      </motion.div>

      {/* SVG Constellation Visualization */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-10"
      >
        <GlassCard glow="gradient">
          <HallOfFameSVG />
        </GlassCard>
      </motion.div>

      {/* Winners Grid */}
      <h2 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <Star className="w-4 h-4 text-amber-400" strokeWidth={1.5} />
        Monthly Winners
      </h2>
      <div className="grid grid-cols-3 gap-5">
        {monthlyWinners.map((winner, i) => (
          <motion.div
            key={`${winner.month}-${winner.year}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
          >
            <GlassCard
              variant="interactive"
              glow={i === 0 ? "gradient" : "none"}
              className={i === 0 ? "gradient-border" : ""}
            >
              <div className="flex items-center gap-2 mb-3 text-xs text-foreground-muted">
                <Award className="w-3.5 h-3.5" strokeWidth={1.5} />
                {winner.month} {winner.year}
              </div>
              <div className="flex items-center gap-3 mb-3">
                <Avatar
                  name={winner.employee.name}
                  size="lg"
                  showRing={i === 0}
                  ringColor={i === 0 ? "gold" : "gradient"}
                />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {winner.employee.name}
                  </h3>
                  <p className="text-[10px] text-foreground-muted">
                    {winner.employee.role}
                  </p>
                  <p className="text-[10px] text-foreground-muted">
                    {winner.employee.department}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <CategoryBadge category={winner.category} />
                <span className="text-[10px] text-foreground-muted flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-accent-cyan" />
                  {winner.totalVotes} votes
                </span>
              </div>
              {winner.quote && (
                <div className="mt-3 flex gap-2 pt-3 border-t border-white/5">
                  <Quote className="w-3 h-3 text-foreground-muted shrink-0 mt-0.5" />
                  <p className="text-[11px] text-foreground-muted italic leading-relaxed">
                    {winner.quote}
                  </p>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
