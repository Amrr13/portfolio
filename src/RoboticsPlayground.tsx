import { useEffect, useRef, useState } from "react";
import { Bot, Flag, Play, RotateCcw } from "lucide-react";
import "./robotics-playground.css";

const columns = 6;
const rows = 5;
const start = 24;
const goal = 5;
const initialObstacles = [8, 9, 14, 20, 21];

function shortestRoute(obstacles: Set<number>) {
  const queue = [start];
  const previous = new Map<number, number | null>([[start, null]]);

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const cell = queue[cursor];
    if (cell === goal) break;

    const row = Math.floor(cell / columns);
    const column = cell % columns;
    const neighbors = [
      row > 0 ? cell - columns : -1,
      column < columns - 1 ? cell + 1 : -1,
      row < rows - 1 ? cell + columns : -1,
      column > 0 ? cell - 1 : -1,
    ];

    for (const neighbor of neighbors) {
      if (neighbor < 0 || obstacles.has(neighbor) || previous.has(neighbor))
        continue;
      previous.set(neighbor, cell);
      queue.push(neighbor);
    }
  }

  if (!previous.has(goal)) return [];
  const path: number[] = [];
  let cell: number | null = goal;
  while (cell !== null) {
    path.push(cell);
    cell = previous.get(cell) ?? null;
  }
  return path.reverse();
}

export default function RoboticsPlayground() {
  const [obstacles, setObstacles] = useState(() => new Set(initialObstacles));
  const [route, setRoute] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState(
    "Add obstacles, then let the robot find a way through.",
  );
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) clearInterval(timer.current);
    },
    [],
  );

  function stop() {
    if (timer.current !== null) clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
  }

  function reset(useDefaultObstacles: boolean) {
    stop();
    setObstacles(new Set(useDefaultObstacles ? initialObstacles : []));
    setRoute([]);
    setStep(0);
    setMessage(
      useDefaultObstacles
        ? "Board reset. Try a different route."
        : "Obstacles cleared. Build your own challenge.",
    );
  }

  function toggleObstacle(cell: number) {
    if (running || cell === start || cell === goal) return;
    setObstacles((current) => {
      const next = new Set(current);
      if (next.has(cell)) next.delete(cell);
      else next.add(cell);
      return next;
    });
    setRoute([]);
    setStep(0);
    setMessage("Board updated. Run the route to test it.");
  }

  function run() {
    stop();
    const path = shortestRoute(obstacles);
    setRoute(path);
    setStep(0);
    if (!path.length) {
      setMessage("No route found. Remove an obstacle to open a path.");
      return;
    }

    const completeMessage = `Goal reached in ${path.length - 1} moves. That’s the shortest available route.`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(path.length - 1);
      setMessage(completeMessage);
      return;
    }

    setRunning(true);
    setMessage("Following the shortest route…");
    let position = 0;
    timer.current = setInterval(() => {
      position += 1;
      setStep(position);
      if (position === path.length - 1) {
        stop();
        setMessage(completeMessage);
      }
    }, 160);
  }

  const robot = route[step] ?? start;
  const routeCells = new Set(route);
  const visited = new Set(route.slice(0, step + 1));

  return (
    <div className="robot-lab">
      <div className="robot-lab__intro">
        <p className="robot-lab__caption">Interactive simulation</p>
        <h3>Path planning playground</h3>
        <p>
          Change the obstacles. Find the shortest path. See how a robot plans
          its next move.
        </p>
      </div>
      <div className="robot-lab__workspace">
        <div
          className="robot-lab__board"
          role="group"
          aria-label="Robot navigation board"
        >
          {Array.from({ length: columns * rows }, (_, cell) => {
            const row = Math.floor(cell / columns) + 1;
            const column = (cell % columns) + 1;
            const blocked = obstacles.has(cell);
            const isStart = cell === start;
            const isGoal = cell === goal;
            const positionLabel = `Row ${row}, column ${column}`;
            const description = isStart
              ? "Start position"
              : isGoal
                ? "Goal"
                : blocked
                  ? "Obstacle. Remove obstacle"
                  : "Empty. Add obstacle";

            return (
              <button
                key={cell}
                type="button"
                className={[
                  "robot-lab__cell",
                  blocked ? "is-obstacle" : "",
                  routeCells.has(cell) ? "is-route" : "",
                  visited.has(cell) ? "is-visited" : "",
                  isStart ? "is-start" : "",
                  isGoal ? "is-goal" : "",
                  robot === cell ? "has-robot" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                aria-label={`${positionLabel}. ${description}.`}
                aria-pressed={blocked}
                disabled={running || isStart || isGoal}
                onClick={() => toggleObstacle(cell)}
              >
                {robot === cell ? (
                  <Bot size={24} aria-hidden="true" />
                ) : isGoal ? (
                  <Flag size={21} aria-hidden="true" />
                ) : isStart ? (
                  <span aria-hidden="true">S</span>
                ) : null}
              </button>
            );
          })}
        </div>
        <div className="robot-lab__legend" aria-hidden="true">
          <span>
            <i className="robot-lab__key robot-lab__key--start" /> Start
          </span>
          <span>
            <i className="robot-lab__key robot-lab__key--goal" /> Goal
          </span>
          <span>
            <i className="robot-lab__key robot-lab__key--obstacle" /> Obstacle
          </span>
        </div>
      </div>
      <div className="robot-lab__controls">
        <button
          className="robot-lab__run"
          type="button"
          disabled={running}
          onClick={run}
        >
          <Play size={17} aria-hidden="true" />{" "}
          {running ? "Robot moving…" : "Run route"}
        </button>
        <button
          className="robot-lab__clear"
          type="button"
          onClick={() => reset(false)}
        >
          Clear obstacles
        </button>
        <button
          className="robot-lab__reset"
          type="button"
          onClick={() => reset(true)}
          aria-label="Reset board"
        >
          <RotateCcw size={17} aria-hidden="true" />
        </button>
      </div>
      <p className="robot-lab__status" role="status">
        {message}
      </p>
    </div>
  );
}
