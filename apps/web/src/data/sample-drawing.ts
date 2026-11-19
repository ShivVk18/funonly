
import type { DrawingDocument } from "@/types/drawing";

export const sampleDrawing: DrawingDocument = {
  schema_version: "1.0",
  drawing_id: "demo-001",
  source: "prompt",

  canvas: {
    width: 1200,
    height: 800,
    background: "#ffffff",
  },

  style: {
    type: "hand_drawn",
    pen_color: "#000000",
    pen_width: 3,
    roughness: 0.35,
  },

  elements: [
    {
      id: "frontend",
      type: "rectangle",
      geometry: {
        x: 100,
        y: 200,
        width: 200,
        height: 100,
      },
      stroke_order: 1,
      text: "Frontend",
    },
    {
      id: "backend",
      type: "rectangle",
      geometry: {
        x: 500,
        y: 200,
        width: 200,
        height: 100,
      },
      stroke_order: 2,
      text: "Backend",
    },
    {
      id: "connection-1",
      type: "arrow",
      geometry: {
        from_id: "frontend",
        to_id: "backend",
      },
      stroke_order: 3,
    },



{
  id: "database",
  type: "circle",
  geometry: {
    cx: 850,
    cy: 250,
    radius: 65
  },
  stroke_order: 4,
  text: "DB"
},
{
  id: "divider",
  type: "line",
  geometry: {
    start: { x: 100, y: 450 },
    end: { x: 500, y: 450 }
  },
  stroke_order: 5
},


{
  id: "connection-2",
  type: "arrow",
  geometry: {
    from_id: "backend",
    to_id: "database"
  },
  stroke_order: 6
}



  ],


};
