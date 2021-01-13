import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify


#engine = create_engine("sqlite:///Resources/hawaii.sqlite")
Base = automap_base()
Base.prepare(engine,reflect=True)
#Measurement = Base.classes.measurement
#Station = Base.classes.station

app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    return (
        f"LETS GET OUTTA THIS WORLD<br/>"
        f"<h3>Available Routes:</h3>"
        f"<ul><li>/api/v1.0/meteorite_dashboard</li>"

    )


@app.route("/api/v1.0/add route")
def dashboard():
 # convert query results to a dictionary using date as the key and prcp as the value
    session = Session(engine)
    results = session.query(#sql query).order_by(Measurement.date).all()
    session.close()
    return jsonify(dict(results))
 #return JSON representation of dictionary


if __name__ == "__main__":
    app.run(debug=True)