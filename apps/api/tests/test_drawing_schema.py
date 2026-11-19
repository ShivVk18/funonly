
import json
from pathlib import Path

from app.schemas.drawing import DrawingDocument


def test_valid_drawing():
    sample_path = (
        Path(__file__).resolve().parents[3]
        / "examples"
        / "sample-drawing.json"
    )

    data = json.loads(sample_path.read_text())

    drawing = DrawingDocument.model_validate(data)

    assert drawing.drawing_id == "demo-001"
    assert len(drawing.elements) == 3
    assert drawing.elements[0].type == "rectangle"


def test_invalid_arrow_reference():
    data = {
        "drawing_id": "test-002",
        "source": "prompt",
        "canvas": {
            "width": 1200,
            "height": 800
        },
        "style": {},
        "elements": [
            {
                "id": "arrow-1",
                "type": "arrow",
                "geometry": {
                    "from_id": "missing",
                    "to_id": "also-missing"
                },
                "stroke_order": 1
            }
        ]
    }

    try:
        DrawingDocument.model_validate(data)
        assert False, "Expected validation error"
    except ValueError:
        pass
