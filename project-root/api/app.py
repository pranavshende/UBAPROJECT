# api/app.py

import os
import json
import shutil
import uuid
import io
import numpy as np
import tensorflow as tf

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from tempfile import NamedTemporaryFile
from PIL import Image

from src.config import IMG_SIZE
from src.model import build_base_model, build_classification_model
from src.disease_guide_hi import get_disease_guide_hindi
from src.report_generator import generate_disease_report_pdf

# --------------------------------------------------
# FastAPI App Initialization
# --------------------------------------------------

app = FastAPI(
    title="Cotton Plant Disease Detection API",
    description="Deep Learning based Cotton Plant Disease Classification using MobileNetV2",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------
# Paths
# --------------------------------------------------

MODEL_WEIGHTS_PATH = "artifacts/cotton_disease_finetuned.weights.h5"
CLASS_NAMES_PATH = "artifacts/class_names.json"
TEMP_REPORT_DIR = "temp_reports"

os.makedirs(TEMP_REPORT_DIR, exist_ok=True)

# --------------------------------------------------
# Load class names
# --------------------------------------------------

with open(CLASS_NAMES_PATH, "r", encoding="utf-8") as f:
    class_names = json.load(f)

NUM_CLASSES = len(class_names)

# --------------------------------------------------
# Build & load model
# --------------------------------------------------

base_model = build_base_model(IMG_SIZE)

model = build_classification_model(
    img_size=IMG_SIZE,
    num_classes=NUM_CLASSES,
    base_model=base_model,
    data_augmentation=None
)

model.load_weights(MODEL_WEIGHTS_PATH)

# --------------------------------------------------
# Image preprocessing (UPDATED)
# --------------------------------------------------

def preprocess_image(image_bytes: bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))
    img_array = np.array(image).astype("float32")

    # Same normalization used in training
    img_array = img_array / 127.5 - 1.0

    return np.expand_dims(img_array, axis=0)

# --------------------------------------------------
# Core prediction logic (shared)
# --------------------------------------------------

def predict_from_bytes(image_bytes: bytes):
    img = preprocess_image(image_bytes)

    preds = model.predict(img, verbose=0)[0]
    top_idx = int(np.argmax(preds))

    confidence = float(preds[top_idx])
    predicted_class = class_names[top_idx]

    guide_hi = get_disease_guide_hindi(predicted_class)

    return {
        "disease": predicted_class,
        "confidence": round(confidence * 100, 2),
        "disease_info_hi": {
            "नाम": guide_hi["disease_name_hi"],
            "विवरण": guide_hi["description_hi"],
            "उपचार_कदम": guide_hi["treatment_steps_hi"],
            "अनुशंसित_कीटनाशक": guide_hi["recommended_pesticides_hi"]
        }
    }

# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def health_check():
    return {
        "status": "API is running",
        "num_classes": NUM_CLASSES,
        "classes": class_names
    }

# --------------------------------------------------
# 🔥 MAIN ENDPOINT FOR MOBILE APP
# --------------------------------------------------

@app.post("/detect")
async def detect_disease(image: UploadFile = File(...)):

    if image.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid image type. JPG या PNG छवि अपलोड करें।"}
        )

    try:
        image_bytes = await image.read()
        result = predict_from_bytes(image_bytes)

        if result["confidence"] < 60:
            result["warning"] = "कम विश्वसनीयता: कृपया कृषि विशेषज्ञ से सलाह लें।"
        else:
            result["warning"] = None

        return result

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "छवि को संसाधित करने में समस्या आई।",
                "debug_message": str(e)
            }
        )

# --------------------------------------------------
# Prediction (legacy / web)
# --------------------------------------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    return await detect_disease(file)

# --------------------------------------------------
# PDF Export endpoint
# --------------------------------------------------

@app.post("/export/pdf")
async def export_pdf(file: UploadFile = File(...)):

    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        return JSONResponse(
            status_code=400,
            content={"error": "Invalid image type. JPG या PNG छवि अपलोड करें।"}
        )

    try:
        image_bytes = await file.read()
        result = predict_from_bytes(image_bytes)

        pdf_path = os.path.join(
            TEMP_REPORT_DIR,
            f"cotton_disease_report_{uuid.uuid4().hex}.pdf"
        )

        generate_disease_report_pdf(
            file_path=pdf_path,
            predicted_class=result["disease"],
            confidence=result["confidence"],
            disease_info_hi=result["disease_info_hi"]
        )

        return FileResponse(
            path=pdf_path,
            media_type="application/pdf",
            filename="cotton_disease_report.pdf"
        )

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={
                "error": "PDF बनाने में समस्या आई।",
                "debug_message": str(e)
            }
        )

