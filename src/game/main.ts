import { Boot } from "./scenes/Boot";
import { Title } from "./scenes/Title";
import { GameOver } from "./scenes/GameOver";
import { Game as MainGame } from "./scenes/Game";
import Phaser, { AUTO, Game } from "phaser";
import { CRTShader } from "./shaders/CRTShader";

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
  scene: [Boot, Title, MainGame, GameOver],
  callbacks: {
    postBoot: (game) => {
      const renderer = game.renderer as Phaser.Renderer.WebGL.WebGLRenderer;
      if (renderer.pipelines) {
        renderer.pipelines.addPostPipeline("CRTShader", CRTShader);
      }
    },
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
