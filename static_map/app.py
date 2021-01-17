import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, desc

# Import Flask
from flask import Flask, jsonify

from flask import Flask, render_template, redirect, url_for

#################################################
# Database Setup
#################################################

# Source:  https://stackoverflow.com/questions/39407254/how-to-set-the-primary-key-when-writing-a-pandas-dataframe-to-a-sqlite-database
# engine = create_engine("sqlite:///../meteorites4.db")
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

# Define static routes
@app.route("/")
def index():
    print("Server received request from home page...")
    # return ("10 Biggest Meteorites<br/><br/>")
    return render_template("homepage.html")

@app.route("/api/v1.0/bubbles")
def bubbles():
# Create our session (link) from Python to the DB
    session = Session(engine)


# @app.route("/api/v1.0/homepage_image.jpg")
# def image():
#     return ("templates/homepage_image.jpg")
# Create our session (link) from Python to the DB
    # session = Session(engine)
    # Query meteorite size

    results = session.query(meteorites.Mass,meteorites.name,meteorites.year,meteorites.reclat,meteorites.reclong,meteorites.GeoLocation, meteorites.id).all()
    # mtrmass = session.query(meteorites.Mass).limit(10).all()
    # mtrid = session.query(meteorites.id).all()
    # stationname = session.query(meteorites.name).all()
    # mtryears = session.query(meteorites.year).all()
    # mtrreclat = session.query(meteorites.reclat).all()
    # mtrreclong = session.query(meteorites.reclong).all()
    # glocation = session.query(meteorites.GeoLocation).all()

    session.close()

    # print(results)
    # # Convert list of tuples into normal list
    # ravelresults= list(np.ravel(results))
    # print(ravelresults)

    mtrarray = []

    for Mass, name, year,reclat,reclong,GeoLocation,id in results:
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


    # mass = []
    # for Mass in mtrmass:
    #     mass.append(Mass)
    #     print (mtrmass)
    # return jsonify(mtrmass)

    #     # mass.append(mass)
    # # return jsonify(mass)
    
    # mtrid = []
    # for meteorites.id in mtrid:
    #     mtrid.append(meteorites.id)

    # station = []
    # for name in stationname:
    #     station.append(name)

    # mtryears = []
    # for year in mtryears:
    #     mtryears.append(year)

    # latitude=[]
    # for reclat in mtrreclat:
    #     latitude.append(reclat)

    # longitude=[]
    # for reclong in mtrreclong:
    #     longitude.append(reclong)

    # geolocation=[]
    # for GeoLocation in glocation:
    #     geolocation.append(GeoLocation)

    # mtrdict = {'id':mtrid,'mass':mass,'station':station,'year':mtryears,'reclat':latitude,'reclong':longitude,'geolocation':geolocation}
    # mtrdict={}
    # mtrdict['mass'] = mass
    # mtrdict['station']=station
    # mtrdict['year']=mtryears
    # return jsonify(mtrdict)

    # return jsonify(mass_dict)
    # return jsonify(f"mass:{mass}")
    # return jsonify(metrid)
    # return jsonify(station)
    # return jsonify(mtryears)
    # return jsonify(latitude)

if __name__=="__main__":
    app.run(debug=True)