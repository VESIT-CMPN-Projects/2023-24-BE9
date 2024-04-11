'use client'
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function ParticleAnimation() {
    const particlesInit = useCallback(async engine => {
      await loadSlim(engine);
    }, []);

  return (
    <Particles
      id='particle-anim'
      init={particlesInit}
      options={{
        fpsLimit: 30,
        fullScreen: {
            zIndex: -100
        },
        particles: {
          move: {
            direction: "none",
            enable: true,
            outModes: "out",
            random: false,
            speed: 2,
            straight: false
          },
          number: { density: { enable: true, area: 800 }, value: 30 },
          opacity: {
            value: 1.0
          },
          shape: {
            type: "image",
            image: {
              src:
                "/question-mark.png"
            }
          },
          size: {
            value: 20
          }
        }
      }}
    />
  );
}