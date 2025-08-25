import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const PinballGame = ({ isGameActive, pinballCount, setPinballCount }) => {
    const canvasRef = useRef(null);
    const engineRef = useRef(Matter.Engine.create());
    const runnerRef = useRef(Matter.Runner.create());
    const launcherRef = useRef(null);
    const ballRef = useRef(null);
    const mouseConstraintRef = useRef(null);
    const isLaunching = useRef(false);

    // This function sets up or resets the game state
    const restartGame = (engine) => {
        Matter.World.clear(engine.world, false); // Clear existing bodies
        setPinballCount(10); // Reset pinball count

        const canvas = canvasRef.current;
        if (!canvas) return;
        const width = canvas.width;
        const height = canvas.height;

        // Create Walls
        const wallOptions = { isStatic: true, render: { fillStyle: '#855a3c' } };
        Matter.World.add(engine.world, [
            Matter.Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions), // Bottom (out of bounds)
            Matter.Bodies.rectangle(width / 2, -25, width, 50, wallOptions), // Top
            Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions), // Left
            Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions), // Right
            // Slanted bumpers
            Matter.Bodies.rectangle(width * 0.2, height * 0.8, width * 0.4, 20, { ...wallOptions, angle: Math.PI / 6 }),
            Matter.Bodies.rectangle(width * 0.8, height * 0.8, width * 0.4, 20, { ...wallOptions, angle: -Math.PI / 6 }),
        ]);

        // Create Pegs
        const pegOptions = { isStatic: true, restitution: 0.5, render: { fillStyle: '#f1c40f' }, label: 'peg' };
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 5; j++) {
                if (Math.random() > 0.4) {
                    Matter.World.add(engine.world, Matter.Bodies.circle(width * 0.15 + i * (width/8), height * 0.15 + j * (height/8), 10, pegOptions));
                }
            }
        }
        
        // Create Target Columns
        const targetOptions = { isStatic: true, isSensor: true, render: { fillStyle: 'cyan' }, label: 'target' };
        for (let i = 0; i < 4; i++) {
             Matter.World.add(engine.world, Matter.Bodies.rectangle(width * 0.2 + i * (width/5), 80, 20, 80, targetOptions));
        }

        // Create Launcher
        const launcherX = width * 0.9;
        const launcherY = height - 60;
        const launcherBase = Matter.Bodies.rectangle(launcherX, launcherY + 25, 60, 50, { isStatic: true, render: { visible: false } });
        launcherRef.current = Matter.Bodies.rectangle(launcherX, launcherY, 40, 40, { render: { fillStyle: '#e74c3c' } });
        const launcherConstraint = Matter.Constraint.create({
            bodyA: launcherBase,
            bodyB: launcherRef.current,
            stiffness: 0.1,
            render: { visible: false }
        });
        Matter.World.add(engine.world, [launcherBase, launcherRef.current, launcherConstraint]);
    };

    const createBall = () => {
        if (pinballCount <= 0) return;
        setPinballCount(prev => prev - 1);
        const canvas = canvasRef.current;
        const width = canvas.width;
        const height = canvas.height;
        
        ballRef.current = Matter.Bodies.circle(width * 0.9, height - 150, 15, {
            restitution: 0.8,
            friction: 0.1,
            render: { fillStyle: '#ecf0f1' },
            label: 'ball'
        });
        Matter.World.add(engineRef.current.world, ballRef.current);
    };

    useEffect(() => {
        const engine = engineRef.current;
        const runner = runnerRef.current;
        const canvas = canvasRef.current;
        const render = Matter.Render.create({
            canvas: canvas,
            engine: engine,
            options: {
                width: Math.min(window.innerWidth * 0.95, 700),
                height: window.innerHeight * 0.7,
                wireframes: false,
                background: 'transparent'
            }
        });

        Matter.Render.run(render);
        Matter.Runner.run(runner, engine);
        
        restartGame(engine);
        createBall(); // Create the first ball

        // Add mouse control for launcher
        const mouse = Matter.Mouse.create(render.canvas);
        mouseConstraintRef.current = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            },
            // Only allow dragging the launcher
            collisionFilter: { mask: 0x0001 },
            body: launcherRef.current
        });
        Matter.World.add(engine.world, mouseConstraintRef.current);

        Matter.Events.on(mouseConstraintRef.current, 'startdrag', (event) => {
            if (event.body === launcherRef.current) {
                isLaunching.current = true;
            }
        });

        Matter.Events.on(mouseConstraintRef.current, 'enddrag', (event) => {
            if (event.body === launcherRef.current) {
                isLaunching.current = false;
            }
        });

        // Collision Handling
        Matter.Events.on(engine, 'collisionStart', (event) => {
            event.pairs.forEach((pair) => {
                const { bodyA, bodyB } = pair;
                if ((bodyA.label === 'ball' && bodyB.label === 'target') || (bodyA.label === 'target' && bodyB.label === 'ball')) {
                    const targetBody = bodyA.label === 'target' ? bodyA : bodyB;
                    setPinballCount(prev => prev + 10);
                    targetBody.render.fillStyle = '#fff'; // Flash target
                    setTimeout(() => { targetBody.render.fillStyle = 'cyan'; }, 100);
                }
            });
        });

        // Check for out-of-bounds balls
        Matter.Events.on(engine, 'afterUpdate', () => {
             engine.world.bodies.forEach(body => {
                if (body.label === 'ball' && body.position.y > render.options.height) {
                    Matter.World.remove(engine.world, body);
                    if (pinballCount > 1) {
                       createBall();
                    }
                }
            });
        });

        return () => {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
            Matter.World.clear(engine.world);
            Matter.Engine.clear(engine);
            render.canvas.remove();
            render.textures = {};
        };
    }, []);

    useEffect(() => {
        if (pinballCount === 0 && isGameActive) {
            setTimeout(() => {
                window.alert("Game Over! Restarting..."); // Using alert as a simple modal
                restartGame(engineRef.current);
                createBall();
            }, 500);
        }
    }, [pinballCount, isGameActive]);

    return (
        <div className={`minigame-container ${isGameActive ? 'active' : ''}`}>
            <h2 className="pinball-counter">Pinballs: {pinballCount}</h2>
            <canvas ref={canvasRef} className="game-canvas"></canvas>
        </div>
    );
};

export default PinballGame;