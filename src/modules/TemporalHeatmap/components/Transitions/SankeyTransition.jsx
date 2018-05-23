import React from 'react';
import * as d3 from 'd3';
import {observer} from 'mobx-react';
/*
implements a Sankey Transition (GroupTimepoint to GroupTimepoint)
 */
const SankeyTransition = observer(class SankeyTransition extends React.Component {
    /**
     * draws a single SankeyTransition
     * @param x0: start point on source partition
     * @param x1: start point on target partition
     * @param width: of transition
     * @param rectWidth
     * @param source
     * @param target
     * @param count
     * @returns transition path
     */
    drawTransition(x0, x1, width, rectWidth,source,target,count) {
        const curvature = .5;
        const y0 = 0 - this.props.visMap.gap * 3 + rectWidth,
            y1 = this.props.visMap.transitionSpace - this.props.visMap.gap * 2 - rectWidth;
        const yi = d3.interpolateNumber(y0, y1),
            y2 = yi(curvature),
            y3 = yi(1 - curvature);

        let path = "M" + x0 + "," + y0
            + "C" + x0 + "," + y2
            + " " + x1 + "," + y3
            + " " + x1 + "," + y1
            + "L" + (x1 + width) + "," + y1
            + "C" + (x1 + width) + "," + y3
            + " " + (x0 + width) + "," + y2
            + " " + (x0 + width) + "," + y0
            + "L" + x0 + "," + y0;
        return (<path onMouseEnter={(e)=>this.props.showTooltip(e,source,target,count)} onMouseLeave={this.props.hideTooltip} key={source+"->"+target} d={path} stroke={"lightgray"} fill={"lightgray"} opacity={0.5}/>)
    }

    /**
     * draws a small rectangle to repeat the color of a partition with the primary Variable
     * @param x position
     * @param y position
     * @param width of rect
     * @param height of rect
     * @param color color of rect
     * @param key (unique)
     * @returns rectangle
     */
    static drawHelperRect(x, y, width, height, color,key) {
        return (<rect key={key} x={x} y={y} width={width} height={height} fill={color}/>)
    }

    /**
     * draws transitions between all partitions of the first and the second timepoint
     * @returns []: transitions
     */
    drawTransitions() {
        const _self = this;
        const rectWidth = 5;

        let transitions = [];
        let rects = [];
        let currXtarget = {};
        let sourcePartitionPos = 0;
        this.props.firstTimepoint.grouped.forEach(function (d,i) {
            const firstParLength = _self.getPartitionLength(d, _self.props.firstPrimary.variable);
            let currXsource = sourcePartitionPos;
            rects.push(SankeyTransition.drawHelperRect(sourcePartitionPos, _self.props.visMap.gap, _self.props.groupScale(firstParLength), 5, _self.props.visMap.getColorScale(_self.props.firstPrimary.variable,_self.props.firstPrimary.type)(d.partition),d.partition+"source"));

            let targetPartitionPos = 0;
            _self.props.secondTimepoint.grouped.forEach(function (f) {
                if(i===0) {
                    rects.push(SankeyTransition.drawHelperRect(targetPartitionPos, _self.props.visMap.transitionSpace - 5 - _self.props.visMap.gap * 2, _self.props.groupScale(_self.getPartitionLength(f, _self.props.secondPrimary.variable)), 5, _self.props.visMap.getColorScale(_self.props.secondPrimary.variable,_self.props.secondPrimary.type)(f.partition), f.partition + "target"));
                }
                let transition = _self.getTransition(d.partition, f.partition);
                if (!(f.partition in currXtarget)) {
                    currXtarget[f.partition] = targetPartitionPos
                }
                if (transition.value !== 0) {
                    const transitionWidth = transition.value * (_self.props.groupScale(firstParLength) / firstParLength);
                    transitions.push(_self.drawTransition(currXsource, currXtarget[f.partition], transitionWidth, rectWidth,d.partition,f.partition,transition.value));
                    currXsource += transitionWidth;
                    currXtarget[f.partition] += transitionWidth;
                }
                targetPartitionPos += _self.props.groupScale(_self.getPartitionLength(f, _self.props.secondPrimary.variable)) + 10;
            });
            sourcePartitionPos += _self.props.groupScale(firstParLength) + 10;
        });
        return [transitions, rects];
    }

    /**
     * gets the length of a partition
     * @param partition
     * @param primaryVariable
     */
    getPartitionLength(partition, primaryVariable) {
        return partition.rows.filter(function (e) {
            return e.variable === primaryVariable;
        })[0].counts[0].value;
    }

    /**
     * gets counts for transition from source partition to target partition
     * @param source
     * @param target
     */
    getTransition(source, target) {
        return this.props.transition.data.filter(function (d) {
            return d.from === source && d.to === target
        })[0]
    }


    render() {
        return (
            this.drawTransitions()
        )
    }
});
export default SankeyTransition;