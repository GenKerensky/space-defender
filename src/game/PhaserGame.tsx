"use client";

import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import Phaser from "phaser";
import { EventBus } from "./EventBus";
import { Boot } from "./scenes/Boot";
import { Title } from "./scenes/Title";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import { CRTShader } from "./shaders/CRTShader";

export interface IRefPhaserGame {
  game: Phaser.Game | undefined;
  scene: Phaser.Scene | undefined;
}

interface IProps {
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(
  function PhaserGame({ currentActiveScene }, ref) {
    const game = useRef<Phaser.Game | undefined>(undefined);

    useLayoutEffect(() => {
      if (game.current === undefined) {
        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          width: 1024,
          height: 768,
          parent: "phaser-game",
          backgroundColor: "#000000",
          physics: {
            default: "arcade",
            arcade: {
              debug: false,
            },
          },
          scene: [Boot, Title, MainGame, GameOver],
          callbacks: {
            postBoot: (gameInstance) => {
              const renderer =
                gameInstance.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
              if (renderer.pipelines) {
                renderer.pipelines.addPostPipeline("CRTShader", CRTShader);
              }
            },
          },
        };

        game.current = new Phaser.Game(config);

        if (typeof ref === "function") {
          ref({ game: game.current, scene: undefined });
        } else if (ref) {
          ref.current = { game: game.current, scene: undefined };
        }
      }

      return () => {
        if (game.current) {
          game.current.destroy(true);
          game.current = undefined;
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      const handleSceneReady = (scene_instance: Phaser.Scene) => {
        if (currentActiveScene && typeof currentActiveScene === "function") {
          currentActiveScene(scene_instance);
        }

        if (typeof ref === "function") {
          ref({ game: game.current, scene: scene_instance });
        } else if (ref) {
          ref.current = { game: game.current, scene: scene_instance };
        }
      };

      EventBus.on("current-scene-ready", handleSceneReady);
      return () => {
        EventBus.off("current-scene-ready", handleSceneReady);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentActiveScene]);

    return <div id="phaser-game"></div>;
  },
);
