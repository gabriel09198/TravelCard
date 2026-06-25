"use client";

import { motion, useReducedMotion } from "motion/react";

function PirateShipShape() {
  return (
    <>
      <path className="pirate-ship-hull" d="M31 111h178l-24 25H63z" />
      <path className="pirate-ship-mast" d="M116 26h5v88h-5z" />
      <path className="pirate-ship-sail" d="M112 34 62 74l50 28zm12 3 50 41-50 23z" />
      <path className="pirate-ship-flag" d="M121 27v-18l28 9-28 9z" />
      <path className="pirate-ship-detail" d="M48 112 31 98m160 14 24-18M74 123h93" />
    </>
  );
}

function PirateCompass({
  className,
  reverse = false,
  reduceMotion = false
}: {
  className: string;
  reverse?: boolean;
  reduceMotion?: boolean;
}) {
  return (
    <motion.div
      className={`pirate-compass ${className}`}
      animate={
        reduceMotion
          ? undefined
          : {
              rotate: reverse ? [0, -360] : [0, 360],
              y: reverse ? [0, -10, 0] : 0
            }
      }
      transition={{
        rotate: { duration: reverse ? 240 : 180, ease: "linear", repeat: Infinity },
        y: { duration: 16, ease: "easeInOut", repeat: Infinity }
      }}
    >
      <span className="pirate-compass-ring" />
      <span className="pirate-compass-axis pirate-compass-axis-main" />
      <span className="pirate-compass-axis pirate-compass-axis-cross" />
      <span className="pirate-compass-core" />
    </motion.div>
  );
}

function PirateOcean({ reduceMotion }: { reduceMotion: boolean }) {
  const waveTransition = {
    duration: 18,
    ease: "easeInOut" as const,
    repeat: Infinity,
    repeatType: "mirror" as const
  };

  return (
    <div className="pirate-ocean">
      <svg
        className="pirate-sea-layer pirate-sea-back"
        viewBox="0 0 1600 280"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pirate-sea-back-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#155e75" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.78" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#pirate-sea-back-gradient)"
          animate={
            reduceMotion
              ? undefined
              : {
                  d: [
                    "M0 92 C150 62 260 118 420 88 C590 56 720 112 890 82 C1070 50 1210 109 1380 76 C1470 59 1540 65 1600 78 L1600 280 L0 280 Z",
                    "M0 82 C145 112 280 58 430 91 C600 124 725 61 900 94 C1070 126 1210 62 1380 91 C1470 106 1540 97 1600 84 L1600 280 L0 280 Z"
                  ]
                }
          }
          transition={{ ...waveTransition, duration: 26 }}
          d="M0 92 C150 62 260 118 420 88 C590 56 720 112 890 82 C1070 50 1210 109 1380 76 C1470 59 1540 65 1600 78 L1600 280 L0 280 Z"
        />
      </svg>

      <svg
        className="pirate-sea-layer pirate-sea-middle"
        viewBox="0 0 1600 280"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pirate-sea-middle-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0e7490" stopOpacity="0.18" />
            <stop offset="45%" stopColor="#083344" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#pirate-sea-middle-gradient)"
          animate={
            reduceMotion
              ? undefined
              : {
                  d: [
                    "M0 116 C125 80 250 139 390 108 C535 76 670 135 820 103 C985 68 1110 132 1265 105 C1400 82 1510 91 1600 111 L1600 280 L0 280 Z",
                    "M0 106 C130 137 255 79 400 112 C545 144 680 82 830 114 C990 148 1125 83 1280 111 C1410 135 1515 125 1600 104 L1600 280 L0 280 Z"
                  ]
                }
          }
          transition={{ ...waveTransition, duration: 20 }}
          d="M0 116 C125 80 250 139 390 108 C535 76 670 135 820 103 C985 68 1110 132 1265 105 C1400 82 1510 91 1600 111 L1600 280 L0 280 Z"
        />
      </svg>

      <svg
        className="pirate-sea-layer pirate-sea-front"
        viewBox="0 0 1600 280"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="pirate-sea-front-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0891b2" stopOpacity="0.12" />
            <stop offset="32%" stopColor="#164e63" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
          </linearGradient>
        </defs>
        <motion.path
          fill="url(#pirate-sea-front-gradient)"
          animate={
            reduceMotion
              ? undefined
              : {
                  d: [
                    "M0 148 C115 117 230 169 360 142 C505 111 625 171 770 139 C915 108 1045 167 1190 141 C1325 116 1460 121 1600 151 L1600 280 L0 280 Z",
                    "M0 140 C120 169 240 115 370 146 C510 179 640 117 780 149 C925 181 1055 119 1200 146 C1335 171 1470 165 1600 139 L1600 280 L0 280 Z"
                  ]
                }
          }
          transition={{ ...waveTransition, duration: 16 }}
          d="M0 148 C115 117 230 169 360 142 C505 111 625 171 770 139 C915 108 1045 167 1190 141 C1325 116 1460 121 1600 151 L1600 280 L0 280 Z"
        />
      </svg>

      <motion.div
        className="pirate-sea-glimmer"
        animate={reduceMotion ? undefined : { x: ["-4%", "5%"], opacity: [0.12, 0.22, 0.12] }}
        transition={{ duration: 24, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="pirate-sea-depth" />
    </div>
  );
}

export function PirateBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pirate-background" aria-hidden="true">
      <div className="pirate-sky" />
      <div className="pirate-stars pirate-stars-far" />
      <div className="pirate-stars pirate-stars-near" />

      <motion.svg
        className="pirate-chart"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        animate={
          reduceMotion
            ? undefined
            : {
                x: ["-1.5%", "1.5%"],
                y: ["-1%", "1%"],
                rotate: [-0.5, 0.5]
              }
        }
        transition={{ duration: 85, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
      >
        <path d="M-80 610C130 445 226 650 414 478S725 298 902 438s274 52 380-52" />
        <path d="M104 85c106 44 72 128 169 159s180-48 250 27 5 148 104 201" />
        <path d="M766 84c-62 74-9 139-64 199s-148 49-176 143" />
        <path d="M1000 112c-36 56-22 117 34 145s77 81 57 143" />
        <circle cx="416" cy="478" r="8" />
        <circle cx="902" cy="438" r="8" />
        <path d="m889 425 27 27m0-27-27 27" />
      </motion.svg>

      <PirateCompass className="pirate-compass-primary" reduceMotion={Boolean(reduceMotion)} />
      <PirateCompass
        className="pirate-compass-secondary"
        reverse
        reduceMotion={Boolean(reduceMotion)}
      />

      <motion.div
        className="pirate-moon"
        animate={reduceMotion ? undefined : { scale: [1, 1.025, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
      >
        <span />
      </motion.div>

      <motion.div
        className="pirate-fog pirate-fog-back"
        animate={reduceMotion ? undefined : { x: ["-4%", "4%"], y: ["0%", "3%"] }}
        transition={{ duration: 45, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
      />
      <motion.div
        className="pirate-fog pirate-fog-front"
        animate={reduceMotion ? undefined : { x: ["4%", "-4%"], y: ["3%", "0%"] }}
        transition={{ duration: 64, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
      />

      <div className="pirate-fleet pirate-fleet-horizon">
        <motion.svg
          className="pirate-ship pirate-ship-distant pirate-ship-distant-one"
          viewBox="0 0 240 150"
          animate={reduceMotion ? undefined : { x: ["-12vw", "112vw"], y: [0, -4, 0] }}
          transition={{ delay: -37, duration: 92, ease: "linear", repeat: Infinity }}
        >
          <PirateShipShape />
        </motion.svg>
        <motion.svg
          className="pirate-ship pirate-ship-distant pirate-ship-distant-two"
          viewBox="0 0 240 150"
          animate={
            reduceMotion
              ? { scaleX: -1 }
              : { x: ["12vw", "-112vw"], y: [0, -3, 0], scaleX: -1 }
          }
          transition={{ delay: -64, duration: 118, ease: "linear", repeat: Infinity }}
        >
          <PirateShipShape />
        </motion.svg>
      </div>

      <motion.svg
        className="pirate-ship pirate-ship-midground"
        viewBox="0 0 240 150"
        animate={
          reduceMotion
            ? undefined
            : { x: ["-16vw", "116vw"], y: [0, -6, 1, -5, 0], rotate: [-1, 1, -0.7, 1.2, -1] }
        }
        transition={{ delay: -21, duration: 58, ease: "linear", repeat: Infinity }}
      >
        <PirateShipShape />
      </motion.svg>

      <motion.svg
        className="pirate-ship pirate-ship-main"
        viewBox="0 0 240 150"
        animate={reduceMotion ? undefined : { x: [0, -12, 0], y: [0, -8, 0], rotate: [-1.4, 1.4, -1.4] }}
        transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
      >
        <PirateShipShape />
      </motion.svg>

      <div className="pirate-island pirate-island-left" />
      <div className="pirate-island pirate-island-right" />

      <PirateOcean reduceMotion={Boolean(reduceMotion)} />

      <div className="pirate-vignette" />
      <div className="pirate-readability-layer" />
    </div>
  );
}
