
from typing import Annotated, Literal, Union
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    model_validator,
)


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


# 1. Basic coordinate
class Point(StrictModel):
    x: float
    y: float


# 2. Canvas configuration
class CanvasConfig(StrictModel):
    width: int = Field(gt=0, le=4096)
    height: int = Field(gt=0, le=4096)
    background: str = "#ffffff"


# 3. Drawing style
class DrawingStyle(StrictModel):
    type: Literal["hand_drawn"] = "hand_drawn"
    pen_color: str = "#000000"
    pen_width: float = Field(default=3, gt=0, le=30)
    roughness: float = Field(default=0.35, ge=0, le=1)


# 4. Geometry models
class RectangleGeometry(StrictModel):
    x: float
    y: float
    width: float = Field(gt=0)
    height: float = Field(gt=0)


class CircleGeometry(StrictModel):
    cx: float
    cy: float
    radius: float = Field(gt=0)


class LineGeometry(StrictModel):
    start: Point
    end: Point


class ArrowGeometry(StrictModel):
    from_id: str
    to_id: str


class TextGeometry(StrictModel):
    x: float
    y: float
    content: str = Field(min_length=1, max_length=2000)


class PathGeometry(StrictModel):
    points: list[Point] = Field(min_length=2, max_length=10000)


# 5. Drawing elements
class RectangleElement(StrictModel):
    id: str
    type: Literal["rectangle"] = "rectangle"
    geometry: RectangleGeometry
    stroke_order: int = Field(ge=0)
    text: str | None = None


class CircleElement(StrictModel):
    id: str
    type: Literal["circle"] = "circle"
    geometry: CircleGeometry
    stroke_order: int = Field(ge=0)
    text: str | None = None


class LineElement(StrictModel):
    id: str
    type: Literal["line"] = "line"
    geometry: LineGeometry
    stroke_order: int = Field(ge=0)


class ArrowElement(StrictModel):
    id: str
    type: Literal["arrow"] = "arrow"
    geometry: ArrowGeometry
    stroke_order: int = Field(ge=0)


class TextElement(StrictModel):
    id: str
    type: Literal["text"] = "text"
    geometry: TextGeometry
    stroke_order: int = Field(ge=0)


class PathElement(StrictModel):
    id: str
    type: Literal["path"] = "path"
    geometry: PathGeometry
    stroke_order: int = Field(ge=0)


# 6. Discriminated union
DrawingElement = Annotated[
    Union[
        RectangleElement,
        CircleElement,
        LineElement,
        ArrowElement,
        TextElement,
        PathElement,
    ],
    Field(discriminator="type"),
]


# 7. Complete drawing document
class DrawingDocument(StrictModel):
    schema_version: Literal["1.0"] = "1.0"
    drawing_id: str
    source: Literal["prompt", "sketch"]
    canvas: CanvasConfig
    style: DrawingStyle
    elements: list[DrawingElement]

    @model_validator(mode="after")
    def validate_drawing(self):
        ids = [element.id for element in self.elements]

        if len(ids) != len(set(ids)):
            raise ValueError("Drawing element IDs must be unique")

        known_ids = set(ids)

        for element in self.elements:
            if element.type == "arrow":
                source = element.geometry.from_id
                target = element.geometry.to_id

                if source not in known_ids:
                    raise ValueError(
                        f"Arrow references unknown source: {source}"
                    )

                if target not in known_ids:
                    raise ValueError(
                        f"Arrow references unknown target: {target}"
                    )

        return self
