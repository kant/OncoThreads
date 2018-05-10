import React from 'react';
import {observer} from 'mobx-react';
import Timepoint from "./Timepoint"
/*
creates the timepoints (either sampleTimepoints or betweenTimepoints)
 */
const Timepoints = observer(class Timepoints extends React.Component {

    getTimepoints() {
        const _self = this;
        let timepoints = [];



        
        const max = _self.props.allYPositions
            .map(yPositions => yPositions.reduce((next, max) => next>max? next: max, 0))
            .reduce((next, max) => next>max? next: max, 0);


        this.props.timepoints.forEach(function (d, i) {
            let rectWidth;
            //check the type of the timepoint to get the correct list of currentVariables and the correct width of the heatmap rectangles
            if (_self.props.timepoints[i].type === "between") {
                rectWidth = _self.props.visMap.betweenRectWidth;
            }
            else {
                rectWidth = _self.props.visMap.sampleRectWidth;
            }
            const transform = "translate(0," + _self.props.yPositions[i] + ")";
            if (d.heatmap.length > 0) {
                timepoints.push(<g key={i + "timepoint"} transform={transform}><Timepoint timepoint={d} index={i}
                                                                                          currentVariables={_self.props.store.currentVariables[d.type]}
                                                                                          rectWidth={rectWidth}
                                                                                          width={_self.props.heatmapWidth}
                                                                                          store={_self.props.store}
                                                                                          visMap={_self.props.visMap}
                                                                                          groupScale={_self.props.groupScale}
                                                                                          heatmapScale={_self.props.heatmapScales[i]}
                                                                                          onDrag={_self.props.onDrag}
                                                                                          selectedPatients={_self.props.selectedPatients}/>
                </g>);
            }



        });
        return timepoints;
    }




    getGlobalTimepoints() {
        const _self = this;
        let timepoints = [];



        
        const max = _self.props.allYPositions
            .map(yPositions => yPositions.reduce((next, max) => next>max? next: max, 0))
            .reduce((next, max) => next>max? next: max, 0);


        this.props.timepoints.forEach(function (d, i) {
            let rectWidth;
            //check the type of the timepoint to get the correct list of currentVariables and the correct width of the heatmap rectangles
            if (_self.props.timepoints[i].type === "between") {
                rectWidth = _self.props.visMap.betweenRectWidth;
            }
            else {
                rectWidth = _self.props.visMap.sampleRectWidth;
            }
           


            var yp=_self.props.allYPositions[i].map(y => y*700.0/max); //.map(x=>x.timeGapBetweenSample);
            

            if (d.heatmap.length > 0) {

                var heatmapd=d;
                var heatmapi=i;
          
                timepoints.push(<g key={heatmapi + "timepoint" + i} ><Timepoint timepoint={heatmapd} index={heatmapi}
                                                                                          ypi={yp}  
                                                                                          currentVariables={_self.props.store.currentVariables[heatmapd.type]}
                                                                                          rectWidth={rectWidth}
                                                                                          width={_self.props.heatmapWidth}
                                                                                          store={_self.props.store}
                                                                                          visMap={_self.props.visMap}
                                                                                          groupScale={_self.props.groupScale}
                                                                                          heatmapScale={_self.props.heatmapScales[heatmapi]}
                                                                                          onDrag={_self.props.onDrag}
                                                                                          selectedPatients={_self.props.selectedPatients}/>
                </g>);
            }


        });
        return timepoints;
    }


    getTreatmentTimepoints() {
        const _self = this;
        let timepoints = [];


        let a=_self.props.store.rootStore.eventDetails;

        let b=a.filter(d=>d.eventDate);
        let c=b.map(d=>d.eventDate);
        
        /*const max = //_self.props.allYPositions
            c.map(yPositions => yPositions.reduce((next, max) => next>max? next: max, 0))
            .reduce((next, max) => next>max? next: max, 0);*/

        const max=Math.max(...c);    


        this.props.timepoints.forEach(function (d, i) {
            let rectWidth;
            //check the type of the timepoint to get the correct list of currentVariables and the correct width of the heatmap rectangles
            if (_self.props.timepoints[i].type === "between") {
                rectWidth = _self.props.visMap.betweenRectWidth;
            }
            else {
                rectWidth = _self.props.visMap.sampleRectWidth;
            }
           


            //var yp=_self.props.allYPositions[i].map(y => y*700.0/max); //.map(x=>x.timeGapBetweenSample);
            
            let k=a.filter(d=>d.time==i);
            var yp=k.map(d=>d.eventDate *500.0 / max);

            if (d.heatmap.length > 0) {

                var heatmapd=d;
                var heatmapi=i;
          
                timepoints.push(<g key={heatmapi + "timepoint" + i} ><Timepoint timepoint={heatmapd} index={heatmapi}
                                                                                          ypi={yp}  
                                                                                          currentVariables={_self.props.store.currentVariables[heatmapd.type]}
                                                                                          rectWidth={rectWidth}
                                                                                          width={_self.props.heatmapWidth}
                                                                                          store={_self.props.store}
                                                                                          visMap={_self.props.visMap}
                                                                                          groupScale={_self.props.groupScale}
                                                                                          heatmapScale={_self.props.heatmapScales[heatmapi]}
                                                                                          onDrag={_self.props.onDrag}
                                                                                          selectedPatients={_self.props.selectedPatients}/>
                </g>);
            }


        });
        return timepoints;
    }




    render() {

        if(this.props.store.rootStore.globalTime) {
            return (
                this.getGlobalTimepoints()
            )
        } else {
            /*if(this.props.store.rootStore.transitionOn){
                return (
                    this.getTreatmentTimepoints()
                    //this.getTimepoints()
                )
            }
            else{
                return (
                    this.getTimepoints()
                )
            }*/


            return (
                this.getTimepoints()
            )
        }

            

    }
});
export default Timepoints;