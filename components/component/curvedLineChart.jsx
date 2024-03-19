import { ResponsiveBump } from "@nivo/bump";
import React from "react";


export default function CurvedlineChart(props) {
    return (
        <>
            <ResponsiveBump
                data={props.data}
                xScale={{
                    type: "point",
                }}
                yScale={{
                    type: "linear",
                    min: 0,
                    max: "auto",
                }}
                curve="monotoneX"
                colors={["#2563eb"]}
                lineWidth={3}
                activeLineWidth={6}
                inactiveLineWidth={3}
                inactiveOpacity={0.15}
                pointSize={10}
                activePointSize={16}
                inactivePointSize={0}
                pointColor={{ theme: "background" }}
                pointBorderWidth={3}
                activePointBorderWidth={3}
                pointBorderColor={{ from: "serie.color" }}
                axisTop={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: -36,
                    truncateTickAt: 0,
                }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: 32,
                    truncateTickAt: 0,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: "",
                    legendPosition: "middle",
                    legendOffset: -40,
                    truncateTickAt: 0,
                }}
                margin={{ top: 40, right: 25, bottom: 40, left: 30 }}
                axisRight={null}
            />
        </>
    );
}
