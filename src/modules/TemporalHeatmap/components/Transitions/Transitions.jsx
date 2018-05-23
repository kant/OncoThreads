import React from 'react';
import {observer} from 'mobx-react';
import Transition from './Transition'
/*
creates the transitions between timepoints
 */
const Transitions = observer(class Transitions extends React.Component {
    getPrimaryWithType(timepointIndex){
        const _self=this;
        let primary;
            this.props.store.currentVariables[this.props.timepoints[timepointIndex].type].forEach(function (d) {
                if(d.variable===_self.props.timepoints[timepointIndex].primaryVariable){
                    primary=d
                }
            });
        return primary;
    }
    //TODO: find better solution to get the type of the primary variables
    getTransitions() {
        const _self = this;
        var globalInd=0;
        return (_self.props.transitionData.map(function (d, i) {
            const firstPrimary=_self.getPrimaryWithType(i);
            const secondPrimary=_self.getPrimaryWithType(i+1);
            const transform = "translate(0," + _self.props.yPositions[i] + ")";
            globalInd++;

            return (<g key={i + "transition"+globalInd} transform={transform}><Transition transition={d}
                                                                                index={i}
                                                                                realTime={_self.props.realTime}
                                                                                firstTimepoint={_self.props.timepoints[i]}
                                                                                secondTimepoint={_self.props.timepoints[i + 1]}
                                                                                firstPrimary={firstPrimary}
                                                                                secondPrimary={secondPrimary}
                                                                                groupScale={_self.props.groupScale}
                                                                                firstHeatmapScale={_self.props.heatmapScales[i]}
                                                                                secondHeatmapScale={_self.props.heatmapScales[i + 1]}
                                                                                selectedPatients={_self.props.selectedPatients}
                                                                                showTooltip={_self.props.showTooltip}
                                                                                hideTooltip={_self.props.hideTooltip}
                                                                                visMap={_self.props.visMap}/>
            </g>);
            
        }))
    }


    getGlobalTransitions() {
        const _self = this;
        var globalInd=0;

        var trans_ind=-1;

        var flagSample=false;

        _self.props.timepoints.forEach(function(d){if(d.type==="sample") flagSample=true;})

        return (_self.props.transitionData.map(function (d, i) {
            const firstPrimary=_self.getPrimaryWithType(i);
            const secondPrimary=_self.getPrimaryWithType(i+1);
            //let transform = "translate(0," + _self.props.yPositions[i] + ")";
            /*if(_self.props.globalTime){
                transform = "translate(0," + _self.props.allYPositions[i] + ")";
            }*/

            if(!_self.props.store.rootStore.transitionOn){
                globalInd++;
                return (<g key={i + "transition"+globalInd} ><Transition transition={d}
                                                                                    index={i}
                                                                                    realTime={_self.props.realTime}
                                                                                    transitionOn={_self.props.transitionOn}
                                                                                    globalTime={_self.props.globalTime}
                                                                                    firstTimepoint={_self.props.timepoints[i]}
                                                                                    secondTimepoint={_self.props.timepoints[i + 1]}
                                                                                    firstPrimary={firstPrimary}
                                                                                    secondPrimary={secondPrimary}
                                                                                    groupScale={_self.props.groupScale}
                                                                                    firstHeatmapScale={_self.props.heatmapScales[i]}
                                                                                    secondHeatmapScale={_self.props.heatmapScales[i + 1]}
                                                                                    allYPositionsy1={_self.props.allYPositions[i]}
                                                                                    allYPositionsy2={_self.props.allYPositions[i+1]}
                                                                                    max={_self.props.max}
                                                                                    selectedPatients={_self.props.selectedPatients}
                                                                                    showTooltip={_self.props.showTooltip}
                                                                                    hideTooltip={_self.props.hideTooltip}
                                                                                    visMap={_self.props.visMap}/>
                </g>);
                
            }
            else {

                

                if(flagSample){
                    if(i%2==1){
                        globalInd++;
                        trans_ind++;
                        return (<g key={i + "transition"+globalInd} ><Transition transition={d}
                                                                                        index={i}
                                                                                        realTime={_self.props.realTime}
                                                                                        transitionOn={_self.props.transitionOn}
                                                                                        globalTime={_self.props.globalTime}
                                                                                        firstTimepoint={_self.props.timepoints[i-1]}
                                                                                        secondTimepoint={_self.props.timepoints[i ]}
                                                                                        firstPrimary={firstPrimary}
                                                                                        secondPrimary={secondPrimary}
                                                                                        groupScale={_self.props.groupScale}
                                                                                        firstHeatmapScale={_self.props.heatmapScales[i-1]}
                                                                                        secondHeatmapScale={_self.props.heatmapScales[i ]}
                                                                                        allYPositionsy1={_self.props.allYPositions[trans_ind]}
                                                                                        allYPositionsy2={_self.props.allYPositions[trans_ind+1]}
                                                                                        max={_self.props.max}
                                                                                        selectedPatients={_self.props.selectedPatients}
                                                                                        showTooltip={_self.props.showTooltip}
                                                                                        hideTooltip={_self.props.hideTooltip}
                                                                                        visMap={_self.props.visMap}/>
                    </g>);
                    }
                } 
                else{
                        globalInd++;
                        trans_ind++;
                        return (<g key={i + "transition"+globalInd} ><Transition transition={d}
                                                                                        index={i}
                                                                                        realTime={_self.props.realTime}
                                                                                        transitionOn={_self.props.transitionOn}
                                                                                        globalTime={_self.props.globalTime}
                                                                                        firstTimepoint={_self.props.timepoints[i]}
                                                                                        secondTimepoint={_self.props.timepoints[i+1 ]}
                                                                                        firstPrimary={firstPrimary}
                                                                                        secondPrimary={secondPrimary}
                                                                                        groupScale={_self.props.groupScale}
                                                                                        firstHeatmapScale={_self.props.heatmapScales[i]}
                                                                                        secondHeatmapScale={_self.props.heatmapScales[i+1 ]}
                                                                                        allYPositionsy1={_self.props.allYPositions[trans_ind]}
                                                                                        allYPositionsy2={_self.props.allYPositions[trans_ind+1]}
                                                                                        max={_self.props.max}
                                                                                        selectedPatients={_self.props.selectedPatients}
                                                                                        showTooltip={_self.props.showTooltip}
                                                                                        hideTooltip={_self.props.hideTooltip}
                                                                                        visMap={_self.props.visMap}/>
                    </g>);
                }  

            }
        }))
    }



    render() {
    
        if(this.props.store.rootStore.globalTime) {
            return (
                this.getGlobalTransitions()
            )
        } else {

            return (
                this.getTransitions()
            )
        }



    }
});
export default Transitions;