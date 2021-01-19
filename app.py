import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc
from flask import Flask, render_template, redirect, url_for
from flask_pymongo import PyMongo


# Import Flask
from flask import Flask, jsonify
#################################################
# Database Setup
#################################################
# Source:  https://stackoverflow.com/questions/39407254/how-to-set-the-primary-key-when-writing-a-pandas-dataframe-to-a-sqlite-database
engine = create_engine("sqlite:///../meteorites4.db")
# reflect an existing database into a new model
base = automap_base()
# reflect the tables
base.prepare(engine, reflect=True)
print(base.classes.keys())
# Save references to each table
meteorites = base.classes.meteorites
# Create an app
app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template("homepage.html")

@app.route("/")
def index():
    print("Server received request from home page...")
    return ("10 Biggest Meteorites<br/><br/>")

@app.route("/api/v1.0/bubbles")
def bubbles():
# Create our session (link) from Python to the DB
    session = Session(engine)
    # Query meteorite size
    meteorSize = session.query(meteorites.Mass).limit(10).all()
    session.close()
    meteors = []
    for Mass in meteorSize:
        meteors.append(Mass)
    return jsonify(meteors)
if __name__=="__main__":
    app.run(debug=True)