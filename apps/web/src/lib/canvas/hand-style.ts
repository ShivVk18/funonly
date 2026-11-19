
type Point = {
  x: number;
  y: number;
};

interface HandStyleOptions {
  roughness: number;
  seed: number;
  closed?: boolean;
}

// Deterministic pseudo-random generator
function createRandom(seed: number) {
  let value = seed;

  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function drawHandDrawnPath(
  ctx: CanvasRenderingContext2D,
  points: Point[],
  options: HandStyleOptions
) {
  if (points.length < 2) return;

  const {
    roughness,
    seed,
    closed = false,
  } = options;

  const random = createRandom(seed);

  const amplitude = roughness * 3;
  const segments = 8;

  const generatedPoints: Point[] = [];

  const totalSegments = closed
    ? points.length
    : points.length - 1;

  for (let i = 0; i < totalSegments; i++) {
    const start = points[i];
    const end = points[(i + 1) % points.length];

    const dx = end.x - start.x;
    const dy = end.y - start.y;

    const length = Math.hypot(dx, dy);

    if (length === 0) continue;

    // Perpendicular direction
    const normalX = -dy / length;
    const normalY = dx / length;

    for (let j = 0; j < segments; j++) {
      const t = j / segments;

      const offset =
        (random() * 2 - 1) * amplitude;

      generatedPoints.push({
        x: start.x + dx * t + normalX * offset,
        y: start.y + dy * t + normalY * offset,
      });
    }
  }

  if (!closed) {
    generatedPoints.push(points[points.length - 1]);
  }

  if (generatedPoints.length < 2) return;

  // Smooth the generated points
  ctx.beginPath();
  ctx.moveTo(
    generatedPoints[0].x,
    generatedPoints[0].y
  );

  for (let i = 1; i < generatedPoints.length; i++) {
    const current = generatedPoints[i];
    const next = generatedPoints[
      (i + 1) % generatedPoints.length
    ];

    if (closed || i < generatedPoints.length - 1) {
      const midX = (current.x + next.x) / 2;
      const midY = (current.y + next.y) / 2;

      ctx.quadraticCurveTo(
        current.x,
        current.y,
        midX,
        midY
      );
    } else {
      ctx.lineTo(current.x, current.y);
    }
  }

  if (closed) {
    ctx.closePath();
  }

  ctx.stroke();
}
