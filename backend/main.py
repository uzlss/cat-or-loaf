import os

import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from tempfile import NamedTemporaryFile
from classifier import classify

MODEL_PATH = "backend" + "/static" + "/models" + "/cat_or_loaf.h5"
model = tf.keras.models.load_model(MODEL_PATH)

ALLOWED_TYPES = {"image.jpg", "image/jpeg", "image/png"}
MAX_BYTES = 10 * 1024 * 1024  # 10MB

app = FastAPI(title="Cat or Loaf")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://your-react-domain"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, detail="Unsupported file type")
    raw = await file.read()
    if len(raw) > MAX_BYTES:
        raise HTTPException(413, detail="File too large")

    suffix_map = {
        "image/jpg": ".jpg",
        "image/jpeg": ".jpg",
        "image/png": ".png",
    }
    suffix = suffix_map.get(file.content_type, ".img")

    with NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(raw)
        tmp.flush()
        tmp_path = tmp.name
    try:
        label, prob = classify(model, tmp_path)
    finally:
        os.remove(tmp_path)

    return {"label": label, "confidence": round(prob * 100, 2)}
