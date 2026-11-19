
"use client";

import { useEffect, useRef } from "react";
import { CanvasRenderer } from "@/lib/canvas/renderer";
import type { DrawingDocument } from "@/types/drawing";

interface Props {
  drawing: DrawingDocument;
}

export default function DrawingCanvas({ drawing }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const renderer = new CanvasRenderer(ctx);
    renderer.render(drawing);
  }, [drawing]);

  return (
    <div className="w-full overflow-auto rounded-xl border bg-white p-4">
      <canvas
        ref={canvasRef}
        width={drawing.canvas.width}
        height={drawing.canvas.height}
        className="block h-auto max-w-full"
      />
    </div>
  );
}
