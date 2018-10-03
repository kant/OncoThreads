import React from 'react';
import {observer} from 'mobx-react';
import Timepoints from "./Timepoints/Timepoints"
import Transitions from "./Transitions/Transitions"
import * as d3 from "d3";
//import ReactMixins from './../../../utils/ReactMixins';

/*
creates the plot with timepoints and transitions
 */
const Plot = observer(class Plot extends React.Component {
    constructor() {
        super();
        this.state = {width: 100};
    }

    componentDidMount() {
        this.setState({
            width: this.refs.plot.parentNode.clientWidth
        });
        this.props.visMap.setPlotY(this.refs.plot.parentNode.getBoundingClientRect().top+50);
    }

    /**
     * Creates scales ecoding the positions for the different patients in the heatmap (one scale per timepoint)
     * @param w: width of the plot
     * @param rectWidth: width of a heatmap cell
     * @returns any[] scales
     */
    createSampleHeatMapScales(w,rectWidth) {
        return this.props.timepoints.map(function (d) {
            return d3.scalePoint()
                .domain(d.heatmapOrder)
                .range([0, w - rectWidth]);
        })
    }


    /**
     * creates scales for computing the length of the partitions in grouped timepoints
     * @param w: width of the plot
     */
    createGroupScale(w) {
        return (d3.scaleLinear().domain([0, this.props.store.numberOfPatients]).range([0, w]));

    }

    static createTimeScale(height, min, max) {
        return (d3.scaleLinear().domain([min, max]).rangeRound([0, height]));
    }

    render() {
        this.props.visMap.setSampleRectWidth((this.state.width / this.props.horizontalZoom)-this.props.visMap.gap);
        const heatmapWidth = this.props.store.numberOfPatients * (this.props.visMap.sampleRectWidth + this.props.visMap.gap) -this.props.visMap.gap;
        const svgWidth = heatmapWidth > this.state.width ? heatmapWidth + (this.props.store.maxPartitions) * this.props.visMap.partitionGap + this.props.visMap.sampleRectWidth : this.state.width;
        const sampleHeatmapScales = this.createSampleHeatMapScales(heatmapWidth,this.props.visMap.sampleRectWidth);
        const groupScale = this.createGroupScale(this.state.width - this.props.visMap.partitionGap * (this.props.store.maxPartitions - 1));
        let transform = "translate(0," + 20 + ")";

        const max = this.props.store.rootStore.actualTimeLine
            .map(yPositions => yPositions.reduce((next, max) => next > max ? next : max, 0))
            .reduce((next, max) => next > max ? next : max, 0);
        const timeScale = Plot.createTimeScale(this.props.height - this.props.visMap.primaryHeight * 2, 0, max);

        return (
            <div ref="plot" className="scrollableX">
                <svg width={svgWidth} height={this.props.height}>
                    <g transform={transform}>
                        <Transitions {...this.props} transitionData={this.props.transitionStore.transitionData}
                                     timepointData={this.props.store.timepoints}
                                     realTime={this.props.store.realTime}
                                     globalTime={this.props.store.globalTime}
                                     transitionOn={this.props.store.transitionOn}
                                     yPositions={this.props.transY}
                                     allYPositions={this.props.store.rootStore.actualTimeLine}
                                     groupScale={groupScale}
                                     heatmapScales={sampleHeatmapScales}
                                     timeScale={timeScale}
                                     height={this.props.transitionSpace}/>
                        <Timepoints {...this.props}
                                    allYPositions={this.props.store.rootStore.actualTimeLine}
                                    yPositions={this.props.timepointY}
                                    groupScale={groupScale}
                                    timeScale={timeScale}
                                    heatmapScales={sampleHeatmapScales}/>

                    </g>
                </svg>
            </div>
        )
    }

});
export default Plot;