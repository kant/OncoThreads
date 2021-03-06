import React from 'react';
import {inject, observer} from 'mobx-react';
import Band from './Band'
import Proxies from "../Proxies";


/**
 * Component for a transition between grouped timepoints ("Sankey Transition")
 */
const SankeyTransition = inject("dataStore", "visStore", "uiStore")(observer(class SankeyTransition extends React.Component {
    /**
     * draws transitions between all partitions of the first and the second timepoint
     * @returns {*[]}
     */
    drawTransitions() {
        let transitions = [];
        let currXtarget = {};
        let initialSourcePosition = 0;
        let sourceProxyPositions = [];
        let targetProxyPositions = [];
        let sourceCounter = 0;
        // iterate through source partitions
        this.props.firstGrouped.forEach(sourcePartition => {
            const sharedSourcePatients = sourcePartition.patients.filter(patient => [].concat(...this.props.secondGrouped.map(partition => partition.patients)).includes(patient));
            if (sharedSourcePatients.length > 0) {
                sourceProxyPositions.push({
                    key: sourcePartition.partition,
                    x0: initialSourcePosition,
                    sharedWidth: this.props.visStore.groupScale(sharedSourcePatients.length),
                    width: this.props.visStore.groupScale(sourcePartition.patients.length),
                    selected: []
                });
                let currXsource = initialSourcePosition;
                let initialTargetPosition = 0;
                let targetCounter = 0;
                // iterate through target partitions
                this.props.secondGrouped.forEach(targetPartition => {
                    const sharedTargetPatients = targetPartition.patients.filter(patient => [].concat(...this.props.firstGrouped.map(partition => partition.patients)).includes(patient));
                    if (sharedTargetPatients.length > 0) {
                        if (sourceCounter === 0) {
                            targetProxyPositions.push({
                                key: targetPartition.partition,
                                x0: initialTargetPosition,
                                sharedWidth: this.props.visStore.groupScale(sharedTargetPatients.length),
                                width: this.props.visStore.groupScale(targetPartition.patients.length),
                                selected: []
                            });
                        }
                        const patientIntersection = sourcePartition.patients.filter(patient => targetPartition.patients.includes(patient));
                        if (!(targetPartition.partition in currXtarget)) {
                            currXtarget[targetPartition.partition] = initialTargetPosition
                        }
                        if (patientIntersection.length > 0) {
                            const transitionWidth = patientIntersection.length * (this.props.visStore.groupScale(sourcePartition.patients.length) / sourcePartition.patients.length);
                            transitions.push(
                                <Band key={sourcePartition.partition + "->" + targetPartition.partition}
                                      x0={currXsource} x1={currXtarget[targetPartition.partition]}
                                      width={transitionWidth}
                                      firstPartition={sourcePartition.partition}
                                      secondPartition={targetPartition.partition}
                                      patients={patientIntersection} firstPrimary={this.props.firstPrimary}
                                      secondPrimary={this.props.secondPrimary}
                                      {...this.props.tooltipFunctions}
                                />);
                            const selectedIntersection = patientIntersection.filter(patient => this.props.dataStore.selectedPatients.includes(patient));
                            if (selectedIntersection.length > 0) {
                                const selectedWidth = selectedIntersection.length * (this.props.visStore.groupScale(sourcePartition.patients.length) / sourcePartition.patients.length);
                                sourceProxyPositions[sourceCounter].selected.push([currXsource, currXsource + selectedWidth]);
                                targetProxyPositions[targetCounter].selected.push([currXtarget[targetPartition.partition], currXtarget[targetPartition.partition] + selectedWidth]);
                            }
                            currXsource += transitionWidth;
                            currXtarget[targetPartition.partition] += transitionWidth;
                        }
                        targetCounter++;
                    }
                    initialTargetPosition += this.props.visStore.groupScale(targetPartition.patients.length) + this.props.visStore.partitionGap;
                });
                sourceCounter++;
            }
            initialSourcePosition += this.props.visStore.groupScale(sourcePartition.patients.length) + this.props.visStore.partitionGap;
        });
        return [transitions, <Proxies key={"source"} proxyPositions={sourceProxyPositions}
                                      bandRectY={this.props.visStore.gap + this.props.visStore.colorRectHeight}
                                      colorRectY={this.props.visStore.gap}
                                      colorScale={this.props.firstPrimary.colorScale}
                                      inverse={false}/>,
            <Proxies key={"target"} proxyPositions={targetProxyPositions}
                     bandRectY={this.props.visStore.transitionSpace - this.props.visStore.colorRectHeight -
                     this.props.visStore.gap - this.props.visStore.bandRectHeight}
                     colorRectY={this.props.visStore.transitionSpace - this.props.visStore.colorRectHeight - this.props.visStore.gap}
                     colorScale={this.props.secondPrimary.colorScale}
                     inverse={true}/>];
    }


    render() {
        return (
            this.drawTransitions()
        )
    }
}));
export default SankeyTransition;