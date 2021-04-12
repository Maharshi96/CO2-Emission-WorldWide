
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { csv } from "d3-fetch";
import { makeStyles } from "@material-ui/core";
import Slider from "@material-ui/core/Slider";
import ColourScale from "../ColourScale";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

// Necessary CSS
const useStyles = makeStyles(( theme) => ({
    containerDiv: {
        width: "75%"
    },
    slider: {
        top: "1.8em"
    }
}));

const MapChart = ( props ) => {

    const [ cvsData, setCsvData ] = useState([]);
    const [ yearWiseCountries, setYearWiseCountries ] = useState([]);

    const classes = useStyles();

    // Reading the CO2 emission data from CSV and storing data in State after filter.
    useEffect(() => {
        csv("/owid-co2-data.csv").then( counties => {
            let arr = counties.filter( country => ( country.iso_code !== "" && !( country.iso_code === "OWID_WRL" )));
            let yearSpecificCountries = arr.filter( country => Number(country.year) === 2000);
            setCsvData( arr );
            setYearWiseCountries( yearSpecificCountries );
        });
    }, []);

    // Event Handler: Handles the changes in year done through slider
    const handleChangeYear = ( event, year ) => {

        event.preventDefault();
        let yearSpecificCountries = cvsData.filter( country => Number(country.year) === year );
        setYearWiseCountries( yearSpecificCountries );
    };

    // Event Handler: Used for hovering and displaying data in ToolTip for each country
    const mouseEnter = ( event, currentCountry ) => {
        event.preventDefault();
        if(currentCountry){
            props.setTooltipContent({
                name: currentCountry.country,
                co2: currentCountry.co2
            });
        }
    };

    return (
        <div className = { classes.containerDiv }>
            {/* Slider component for changing the year*/}
            <Slider
                valueLabelDisplay = "on"
                defaultValue = { 2000 }
                className = { classes.slider }
                min = { 1900 }
                max = { 2019 }
                onChange = { handleChangeYear }
                step = { 1 }
            />
            {/* Map component and its children for displaying the world map*/}
            <ComposableMap data-tip = "">
                <ZoomableGroup zoom = { 1 }>
                    <Geographies geography = { geoUrl }>
                        {({ geographies }) =>
                            // Taking the geo location of each country from "geographies" and mapping it
                            // against the countries from CSV file.
                            geographies.map( (geo) => {
                                const currentCountry = yearWiseCountries.find( country =>
                                    country.iso_code === geo.properties.ISO_A3
                                );
                                const toolTipContent={
                                    country: geo.properties.NAME,
                                    co2: currentCountry ? currentCountry.co2 : "Data Unavailable"
                                };
                                return (
                                    <Geography
                                        key = { geo.rsmKey }
                                        geography = { geo }
                                        fill = { currentCountry ? ColourScale(currentCountry.co2) : "blue" }
                                        stroke = "#94B2D1"
                                        onMouseEnter = { (event) => mouseEnter( event, toolTipContent ) }
                                        onMouseLeave = { () => {
                                            props.setTooltipContent("");
                                        }}
                                        style = {{
                                            hover: {
                                                fill: "green",
                                                outline: "none"
                                            }
                                        }}
                                    />
                                )
                            })
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>
        </div>
    );
};

export default MapChart;
