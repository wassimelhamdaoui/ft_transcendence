import Matter, { Body, Events, World } from 'matter-js';
import { render } from 'react-dom';
import { Socket } from 'socket.io-client';

class Game {
  private _engine: Matter.Engine;
  private _world: Matter.World;
  private _render: Matter.Render;
  private _element: HTMLElement;

  width: number;
  height: number;
  map: string = '';
  walls: Matter.Body[] = [];
  ball: Matter.Body | null = null;
  player1: Matter.Body | null = null;
  player2: Matter.Body | null = null;
  scale: number = 1;
  mouse: Matter.Mouse | null = null;
  mouseConstraint: Matter.MouseConstraint | null = null;
  socket: Socket | null = null;

  constructor(element: HTMLElement, map: string) {

    this._element = element;
    this.map = map;
    [this.width, this.height] = this._calculateDimensions();
    this._engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
    this._world = this._engine.world;
    this._render = Matter.Render.create({
      element: this._element,
      engine: this._engine,
      options: {
        width: this.width,
        height: this.height,
        wireframes: false,
        background: map == 'black' ? '#000000' : '#ffffff',
      },
    });
    this._calculateScale();
    this._setMouse();
    this._createWalls();
    this._createBall();
    this._createPlayers();
    this._setEvents();
  }

  private _setEvents(): void {
    Events.on(this.mouseConstraint, 'mousemove', () => {
      if (this.mouse) {
        if (
          this.mouse.position.x < this.width - 60 * this.scale &&
          this.mouse.position.x > 60 * this.scale
        )
          this.socket?.emit('MovePlayer', {
            x: this._map(this.mouse.position.x, 0, this.width, 0, 600),
          });
      }
    });
  }

  private _setMouse(): void {
    this.mouse = Matter.Mouse.create(this._render.canvas);
    this.mouseConstraint = Matter.MouseConstraint.create(this._engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
  }

  private _calculateScale(): void {
    const sWidth: number = this.width / 600;
    const sHeight: number = this.height / 800;
    this.scale = sWidth < sHeight ? sWidth : sHeight;
  }

  private _createPlayers(): void {
    this.player1 = Matter.Bodies.rectangle(
      this.width / 2,
      this.height - this._map(50, 0, 800, 0, this.height),
      this._map(100, 0, 600, 0, this.width),
      this._map(10, 0, 800, 0, this.height),
      { render: { fillStyle: '#00B2FF' }, isStatic: true },
    );
    this.player2 = Matter.Bodies.rectangle(
      this.width / 2,
      this._map(50, 0, 800, 0, this.height),
      this._map(100, 0, 600, 0, this.width),
      this._map(10, 0, 800, 0, this.height),
      { render: { fillStyle: '#FF0742' }, isStatic: true },
    );
    Matter.World.add(this._world, [this.player1, this.player2]);
  }

  private _createBall(): void {
    this.ball = Matter.Bodies.circle(this.width / 2, this.height / 2, 10 * this.scale, {
      render: { fillStyle: this.map == 'black' ? '#ffffff' : '#000000' },
      isStatic: true,
    });
    Matter.World.add(this._world, this.ball);
  }

  private _map(value: number, x1: number, y1: number, x2: number, y2: number): number {
    return ((value - x1) * (y2 - x2)) / (y1 - x1 + x2);
  }

  private _createWalls(): void {
    this.walls = [
      Matter.Bodies.rectangle(
        this.width / 2,
        0,
        this.width,
        this._map(10, 0, 800, 0, this.height),
        { render: { fillStyle: this.map == 'black' ? '#ffffff' : '#000000' }, isStatic: true },
      ),
      Matter.Bodies.rectangle(
        this.width / 2,
        this.height,
        this.width,
        this._map(10, 0, 800, 0, this.height),
        { render: { fillStyle: this.map == 'black' ? '#ffffff' : '#000000' }, isStatic: true },
      ),
      Matter.Bodies.rectangle(
        0,
        this.height / 2,
        this._map(10, 0, 600, 0, this.width),
        this.height,
        { render: { fillStyle: this.map == 'black' ? '#ffffff' : '#000000' }, isStatic: true },
      ),
      Matter.Bodies.rectangle(
        this.width,
        this.height / 2,
        this._map(10, 0, 600, 0, this.width),
        this.height,
        { render: { fillStyle: this.map == 'black' ? '#ffffff' : '#000000' }, isStatic: true },
      ),
    ];
    Matter.World.add(this._world, this.walls);
  }

  private _calculateDimensions(): number[] {
    let width: number = 0;
    let height: number = 0;
    if (this._element.clientWidth > this._element.clientHeight) {
      height = this._element.clientHeight;
      width = height * (3 / 4);
    } else {
      width = this._element.clientWidth;
      height = width * (4 / 3);
      if (height > this._element.clientHeight) {
        height = this._element.clientHeight;
        width = height * (3 / 4);
      }
    }
    return [width, height];
  }

  public setSocket(socket: Socket): void {
    this.socket = socket;
  }

  public start(): void {
    Matter.Runner.run(this._engine);
    Matter.Render.run(this._render);
  }

  public destroy(): void {
    Matter.Events.off(this._engine, 'mousemove', () => {});
    this._render.canvas.remove();
    Matter.Render.stop(this._render);
    Matter.World.clear(this._world, true);
    Matter.Engine.clear(this._engine);
  }
  //last update
  public spawnBall(): void {
    if (this.ball) {
      Matter.World.remove(this._world, this.ball);
      this.ball = Matter.Bodies.circle(this.width / 2, this.height / 2, 10 * this.scale, {
        render: { fillStyle: this.map == 'black' ? '#ffffff' : '#000000' },
        isStatic: true,
      });
      Matter.World.add(this._world, this.ball);
    }
  }

  public setState(p1: Matter.Vector, p2: Matter.Vector, ball: Matter.Vector): void {
    if (this.player2 && this.ball && this.player1) {
      Body.setPosition(this.player1, {
        x: this._map(p1.x, 0, 600, 0, this.width),
        y: this._map(p1.y, 0, 800, 0, this.height),
      });
      Body.setPosition(this.player2, {
        x: this._map(p2.x, 0, 600, 0, this.width),
        y: this._map(p2.y, 0, 800, 0, this.height),
      });
      Body.setPosition(this.ball, {
        x: this._map(ball.x, 0, 600, 0, this.width),
        y: this._map(ball.y, 0, 800, 0, this.height),
      });
    }
  }
}

export default Game;
