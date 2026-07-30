from fastapi import FastAPI
from pydantic import BaseModel

from predict import predict

app = FastAPI(
    title="Flora PCOS AI"
)


class PCOSRequest(BaseModel):

    age: int

    bmi: float

    cycleLength: int

    irregularPeriods: bool

    weightGain: bool

    acne: bool

    hairLoss: bool

    excessiveHairGrowth: bool

    darkSkinPatches: bool

    exercise: bool

    fastFood: bool


@app.get("/")
def home():

    return {
        "message": "Flora PCOS AI Running"
    }


@app.post("/predict")
def prediction(data: PCOSRequest):

    features = {

        "Age (yrs)": data.age,

        "BMI": data.bmi,

        "Cycle length(days)": data.cycleLength,

        "Cycle(R/I)": 1 if data.irregularPeriods else 0,

        "Weight gain(Y/N)": 1 if data.weightGain else 0,

        "Pimples(Y/N)": 1 if data.acne else 0,

        "Hair loss(Y/N)": 1 if data.hairLoss else 0,

        "hair growth(Y/N)": 1 if data.excessiveHairGrowth else 0,

        "Skin darkening (Y/N)": 1 if data.darkSkinPatches else 0,

        "Reg.Exercise(Y/N)": 1 if data.exercise else 0,

        "Fast food (Y/N)": 1 if data.fastFood else 0,

    }

    return predict(features)