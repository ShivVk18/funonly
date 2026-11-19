
export interface Point {
  x: number;
  y: number;
}

export interface CanvasConfig {
  width: number;
  height: number;
  background: string;
}

export interface DrawingStyle {
  type: "hand_drawn";
  pen_color: string;
  pen_width: number;
  roughness: number;
}

export interface RectangleElement {
  id: string;
  type: "rectangle";
  geometry: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  stroke_order: number;
  text?: string | null;
}

export interface CircleElement {
  id: string;
  type: "circle";
  geometry: {
    cx: number;
    cy: number;
    radius: number;
  };
  stroke_order: number;
  text?: string | null;
}

export interface LineElement {
  id: string;
  type: "line";
  geometry: {
    start: Point;
    end: Point;
  };
  stroke_order: number;
}

export interface ArrowElement {
  id: string;
  type: "arrow";
  geometry: {
    from_id: string;
    to_id: string;
  };
  stroke_order: number;
}

export interface TextElement {
  id: string;
  type: "text";
  geometry: {
    x: number;
    y: number;
    content: string;
  };
  stroke_order: number;
}

export interface PathElement {
  id: string;
  type: "path";
  geometry: {
    points: Point[];
  };
  stroke_order: number;
}

export type DrawingElement =
  | RectangleElement
  | CircleElement
  | LineElement
  | ArrowElement
  | TextElement
  | PathElement;

export interface DrawingDocument {
  schema_version: "1.0";
  drawing_id: string;
  source: "prompt" | "sketch";
  canvas: CanvasConfig;
  style: DrawingStyle;
  elements: DrawingElement[];
}
