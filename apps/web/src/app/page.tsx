
import DrawingCanvas from "@/components/whiteboard/DrawingCanvas";
import { sampleDrawing } from "@/data/sample-drawing";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-100 p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black">
            AI Whiteboard Engine
          </h1>
          <p className="mt-2 text-neutral-500">
            Drawing IR v1 · Canvas Renderer v1
          </p>
        </div>

        <DrawingCanvas drawing={sampleDrawing} />
      </div>
    </main>
  );
}
