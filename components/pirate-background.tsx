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

      <div className="pirate-ocean">
        <div className="pirate-wave pirate-wave-back" />
        <div className="pirate-wave pirate-wave-middle" />
        <div className="pirate-wave pirate-wave-front" />
      </div>

      <div className="pirate-vignette" />
      <div className="pirate-readability-layer" />
    </div>
  );
}
