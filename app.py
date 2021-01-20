import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc
# Import Flask
# from flask import Flask, jsonify
from flask import Flask, render_template, redirect, url_for, jsonify
# app = Flask(__name__, template_folder="templates")
#################################################
# Database Setup
#################################################
# Source:  https://stackoverflow.com/questions/39407254/how-to-set-the-primary-key-when-writing-a-pandas-dataframe-to-a-sqlite-database
engine = create_engine("sqlite:///meteorites4.db")
# reflect an existing database into a new model
base = automap_base()
# reflect the tables
base.prepare(engine, reflect=True)
print(base.classes.keys())
# Save references to each table
meteorites = base.classes.meteorites
# Create an app
app = Flask(__name__)
# app = Flask(__name__, template_folder='templates')
# app = Flask(__name__, static_folder="static")
# Define static routes
@app.route("/")
def homepage():
    print("Server received request from home page...")
    # return ("10 Biggest Meteorites<br/><br/>")
    return render_template("homepage.html")
@app.route("/index")
def index():
    print("Server received request from home page...")
    # return ("10 Biggest Meteorites<br/><br/>")
    return render_template("index.html")
@app.route("/api/v1.0/bubbles")
def bubbles():
    # Create our session (link) from Python to the DB
    session = Session(engine)
    results = session.query(meteorites.Mass, meteorites.name, meteorites.year, meteorites.reclat, meteorites.reclong, meteorites.GeoLocation, meteorites.id).order_by(meteorites.Mass.desc()).all()
    session.close()
    mtrarray = []
    for Mass, name, year, reclat, reclong, GeoLocation, id in results:
        mtrdict = {}
        mtrdict["mass"] = Mass
        mtrdict["name"] = name
        mtrdict["year"] = year
        mtrdict["reclat"] = reclat
        mtrdict["reclong"] = reclong
        mtrdict["geolocation"] = GeoLocation
        mtrdict["id"] = id
        mtrarray.append(mtrdict)
    return jsonify(mtrarray)
@app.route("/api/v1.1/demo")
def demo(): 
    return render_template("demographics.html")

@app.route("/api/v1.0/map")
def map():
# Create our session (link) from Python to the DB
    session = Session(engine)

    results = session.query(meteorites.Mass,
    meteorites.name,meteorites.year,meteorites.reclat,
    meteorites.reclong,meteorites.GeoLocation, meteorites.id).order_by(meteorites.Mass.desc()).limit(1000)

    session.close()

    mtrarraymap = []

    for Mass, name, year,reclat,reclong,GeoLocation,id in results:
        mtrdictmap = {}
        mtrdictmap["mass"] = Mass
        mtrdictmap["name"] = name
        mtrdictmap["year"] = year
        mtrdictmap["reclat"] = reclat
        mtrdictmap["reclong"] = reclong
        mtrdictmap["id"] = id


        mtrarraymap.append(mtrdictmap)

    return jsonify(mtrarraymap)

@app.route("/map")
def mappage():
    print("Server received request from home page...")
    return render_template("map.html")
#     session = Session(engine)
#     results = session.query(meteorites.Mass, meteorites.name, meteorites.year, meteorites.reclat, meteorites.reclong, meteorites.GeoLocation, meteorites.id).order_by(meteorites.Mass.desc()).all()
#     session.close()
#     mtrarray = []
#     for Mass, name, year, reclat, reclong, GeoLocation, id in results:
#         mtrdict = {}
#         mtrdict["mass"] = Mass
#         mtrdict["name"] = name
#         mtrdict["year"] = year
#         mtrdict["reclat"] = reclat
#         mtrdict["reclong"] = reclong
#         mtrdict["geolocation"] = GeoLocation
#         mtrdict["id"] = id
#         mtrarray.append(mtrdict)
#     return jsonify(mtrarray)
if __name__ == "__main__":
    app.run(debug=True)