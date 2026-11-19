
import { drawHandDrawnPath } from "./hand-style";
import type {
  DrawingDocument,
  DrawingElement,
  RectangleElement,
  CircleElement,
  LineElement,
  ArrowElement,
  TextElement,
  PathElement,
} from "@/types/drawing";


function seedFromId(id: string): number {
  let hash = 0;

  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) % 2147483647;
  }

  return hash || 1;
}



export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  render(document: DrawingDocument) {
    const ctx = this.ctx;

    // Clear previous drawing
    ctx.clearRect(
      0,
      0,
      document.canvas.width,
      document.canvas.height
    );

    // Background
    ctx.fillStyle = document.canvas.background;
    ctx.fillRect(
      0,
      0,
      document.canvas.width,
      document.canvas.height
    );

    ctx.strokeStyle = document.style.pen_color;
    ctx.fillStyle = document.style.pen_color;
    ctx.lineWidth = document.style.pen_width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw elements in stroke order
    const elements = [...document.elements].sort(
      (a, b) => a.stroke_order - b.stroke_order
    );

    for (const element of elements) {
      this.drawElement(element, document);
    }
  }

  
private drawElement(
  element: DrawingElement,
  document: DrawingDocument
) {
  const roughness = document.style.roughness;

  switch (element.type) {
    case "rectangle":
      this.drawRectangle(element, roughness);
      break;

    case "circle":
      this.drawCircle(element, roughness);
      break;

    case "line":
      this.drawLine(element, roughness);
      break;

    case "arrow":
      this.drawArrow(element, document.elements, roughness);
      break;

    case "text":
      this.drawText(element);
      break;

    case "path":
      this.drawPath(element, roughness);
      break;
  }
}



private drawRectangle(
  element: RectangleElement,
  roughness: number
) {
  const { x, y, width, height } = element.geometry;

  const points = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];

  drawHandDrawnPath(this.ctx, points, {
    roughness,
    seed: seedFromId(element.id),
    closed: true,
  });

  // Keep text clean and readable
  if (element.text) {
    this.ctx.font = "18px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillText(
      element.text,
      x + width / 2,
      y + height / 2
    );
  }
}

 
private drawCircle(
  element: CircleElement,
  roughness: number
) {
  const { cx, cy, radius } = element.geometry;

  const points = Array.from({ length: 64 }, (_, i) => {
    const angle = (i / 64) * Math.PI * 2;

    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  drawHandDrawnPath(this.ctx, points, {
    roughness,
    seed: seedFromId(element.id),
    closed: true,
  });

  if (element.text) {
    this.ctx.font = "16px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(element.text, cx, cy);
  }
}


  
private drawLine(
  element: LineElement,
  roughness: number
) {
  const { start, end } = element.geometry;

  drawHandDrawnPath(
    this.ctx,
    [start, end],
    {
      roughness,
      seed: seedFromId(element.id),
    }
  );
}


 private getCenter(element: DrawingElement) {
  switch (element.type) {
    case "rectangle":
      return {
        x: element.geometry.x + element.geometry.width / 2,
        y: element.geometry.y + element.geometry.height / 2,
      };

    case "circle":
      return {
        x: element.geometry.cx,
        y: element.geometry.cy,
      };

    default:
      return null;
  }
}

private getBoundaryPoint(
  element: DrawingElement,
  toward: { x: number; y: number }
) {
  const center = this.getCenter(element);

  if (!center) return null;

  const dx = toward.x - center.x;
  const dy = toward.y - center.y;

  if (dx === 0 && dy === 0) return null;

  if (element.type === "circle") {
    const distance = Math.hypot(dx, dy);
    const radius = element.geometry.radius;

    return {
      x: center.x + (dx / distance) * radius,
      y: center.y + (dy / distance) * radius,
    };
  }

  if (element.type === "rectangle") {
    const halfWidth = element.geometry.width / 2;
    const halfHeight = element.geometry.height / 2;

    const scale = Math.min(
      dx === 0 ? Infinity : halfWidth / Math.abs(dx),
      dy === 0 ? Infinity : halfHeight / Math.abs(dy)
    );

    return {
      x: center.x + dx * scale,
      y: center.y + dy * scale,
    };
  }

  return null;
}

private drawArrow(
  element: ArrowElement,
  elements: DrawingElement[],
  roughness: number
) {
  const source = elements.find(
    (item) => item.id === element.geometry.from_id
  );

  const target = elements.find(
    (item) => item.id === element.geometry.to_id
  );

  if (!source || !target) return;

  const sourceCenter = this.getCenter(source);
  const targetCenter = this.getCenter(target);

  if (!sourceCenter || !targetCenter) return;

  const start = this.getBoundaryPoint(source, targetCenter);
  const end = this.getBoundaryPoint(target, sourceCenter);

  if (!start || !end) return;

  const angle = Math.atan2(
    end.y - start.y,
    end.x - start.x
  );

  const arrowLength = 14;
  const arrowAngle = Math.PI / 6;

  const upperHead = {
    x: end.x - arrowLength * Math.cos(angle - arrowAngle),
    y: end.y - arrowLength * Math.sin(angle - arrowAngle),
  };

  const lowerHead = {
    x: end.x - arrowLength * Math.cos(angle + arrowAngle),
    y: end.y - arrowLength * Math.sin(angle + arrowAngle),
  };

  // Main shaft
  drawHandDrawnPath(
    this.ctx,
    [start, end],
    {
      roughness,
      seed: seedFromId(element.id + "-shaft"),
    }
  );

  // Upper arrowhead
  drawHandDrawnPath(
    this.ctx,
    [upperHead, end],
    {
      roughness,
      seed: seedFromId(element.id + "-upper"),
    }
  );

  // Lower arrowhead
  drawHandDrawnPath(
    this.ctx,
    [lowerHead, end],
    {
      roughness,
      seed: seedFromId(element.id + "-lower"),
    }
  );
}


  private drawText(element: TextElement) {
    const { x, y, content } = element.geometry;

    this.ctx.font = "18px Arial";
    this.ctx.fillText(content, x, y);
  }

  
private drawPath(
  element: PathElement,
  roughness: number
) {
  drawHandDrawnPath(
    this.ctx,
    element.geometry.points,
    {
      roughness,
      seed: seedFromId(element.id),
    }
  );
}

}
