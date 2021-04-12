
import ReactTooltip from "react-tooltip";
import React from "react";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    toolTipContainerDiv: {
        display: "flex",
        flexDirection: "column",
    },
    span: {
        fontSize: "8px",
    },
}));

const MapToolTip = ( props ) => {

    const classes = useStyles();

    return (
        <>
            <ReactTooltip>
                <div className = { classes.toolTipContainerDiv }>
                    <span className = { classes.span }>{ `Name: ${ props.tooltipContent.name }` }</span>
                    <span className = { classes.span }>{ `CO2 emission: ${ props.tooltipContent.co2 }` }</span>
                </div>
            </ReactTooltip>
        </>
    );
};

export default MapToolTip;