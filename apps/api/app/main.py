from fastapi import FastAPI 
app = FastAPI(
    title="AI Whiteboard Engine",
    version="0.1.0"
)

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "whiteboard-api"
    }
    
    