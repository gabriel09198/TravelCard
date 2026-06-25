function PirateShip({ className }: { className: string }) {
  return (
    <svg className={`pirate-ship ${className}`} viewBox="0 0 240 150">
      <path className="pirate-ship-hull" d="M31 111h178l-24 25H63z" />
      <path className="pirate-ship-mast" d="M116 26h5v88h-5z" />
      <path className="pirate-ship-sail" d="M112 34 62 74l50 28zm12 3 50 41-50 23z" />
      <path className="pirate-ship-flag" d="M121 27v-18l28 9-28 9z" />
      <path className="pirate-ship-detail" d="M48 112 31 98m160 14 24-18M74 123h93" />
    </svg>
  );
}

function PirateCompass({ className }: { className: string }) {
  return (
    <div className={`pirate-compass ${className}`}>
      <span className="pirate-compass-ring" />
      <span className="pirate-compass-axis pirate-compass-axis-main" />
      <span className="pirate-compass-axis pirate-compass-axis-cross" />
      <span className="pirate-compass-core" />
    </div>
  );
}

export function PirateBackground() {
  return (
    <div className="pirate-background" aria-hidden="true">
      <div className="pirate-sky" />
      <div className="pirate-stars pirate-stars-far" />
      <div className="pirate-stars pirate-stars-near" />

      <svg
        className="pirate-chart"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M-80 610C130 445 226 650 414 478S725 298 902 438s274 52 380-52" />
        <path d="M104 85c106 44 72 128 169 159s180-48 250 27 5 148 104 201" />
        <path d="M766 84c-62 74-9 139-64 199s-148 49-176 143" />
        <path d="M1000 112c-36 56-22 117 34 145s77 81 57 143" />
        <circle cx="416" cy="478" r="8" />
        <circle cx="902" cy="438" r="8" />
        <path d="m889 425 27 27m0-27-27 27" />
      </svg>

      <PirateCompass className="pirate-compass-primary" />
      <PirateCompass className="pirate-compass-secondary" />

      <div className="pirate-moon">
        <span />
      </div>

      <div className="pirate-fog pirate-fog-back" />
      <div className="pirate-fog pirate-fog-front" />

      <div className="pirate-fleet pirate-fleet-horizon">
        <PirateShip className="pirate-ship-distant pirate-ship-distant-one" />
        <PirateShip className="pirate-ship-distant pirate-ship-distant-two" />
      </div>

      <PirateShip className="pirate-ship-midground" />
      <PirateShip className="pirate-ship-main" />

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
