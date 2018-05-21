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
                                                                                          eventStartEnd={d.rootStore.betweenTimepointStore.sampleEventList}
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



        
        /*const max = _self.props.allYPositions
            .map(yPositions => yPositions.reduce((next, max) => next>max? next: max, 0))
            .reduce((next, max) => next>max? next: max, 0);*/

            let a=_self.props.store.rootStore.eventDetails;

            let b=a.filter(d=>d.eventDate);
            let c=b.map(d=>d.eventDate);
            
    
            let max1=Math.max(...c);
    
    
            let max2 = _self.props.allYPositions
                .map(yPositions => yPositions.reduce((next, max) => next>max? next: max, 0))
                .reduce((next, max) => next>max? next: max, 0);
    
            const max=Math.max(max1, max2);    


        this.props.timepoints.forEach(function (d, i) {
            let rectWidth;
            //check the type of the timepoint to get the correct list of currentVariables and the correct width of the heatmap rectangles
            if (_self.props.timepoints[i].type === "between") {
                rectWidth = _self.props.visMap.betweenRectWidth;
            }
            else {
                rectWidth = _self.props.visMap.sampleRectWidth;
            }
           

            var numEventsForEachPatient=[], count;
            var p =_self.props.store.rootStore.patientOrderPerTimepoint;

            p.forEach(function(d,i){
                count=1;
                
                numEventsForEachPatient.push(count);
                
                //count=0;
            
            });



            var yp=_self.props.allYPositions[i].map(y => y*700.0/max); //.map(x=>x.timeGapBetweenSample);
            

            if (d.heatmap.length > 0) {

                var heatmapd=d;
                var heatmapi=i;
          
                timepoints.push(<g key={heatmapi + "timepoint" + i} ><Timepoint timepoint={heatmapd} index={heatmapi}
                                                                                          ypi={yp}  
                                                                                          numEventsForEachPatient={numEventsForEachPatient}
                                                                                          eventStartEnd={d.rootStore.betweenTimepointStore.sampleEventList}
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

    comparePatientOrder(order, p, q) {
        return order.indexOf(p.patientId)<order.indexOf(q.patientId)? -1: 1;
    }

    getTreatmentTimepoints() {
        const _self = this;
        let timepoints = [];


        let a=_self.props.store.rootStore.eventDetails;

        //let b=a.filter(d=>d.eventDate);
        //let c=b.map(d=>d.eventDate);
        
        let b=a.filter(d=>d.eventEndDate);
        let c=b.map(d=>d.eventEndDate);


        let max1=Math.max(...c);


        let max2 = _self.props.allYPositions
            .map(yPositions => yPositions.reduce((next, max) => next>max? next: max, 0))
            .reduce((next, max) => next>max? next: max, 0);

        const max=Math.max(max1, max2);


        this.props.timepoints.forEach(function (d, i) {
            let rectWidth;
            var yp, count;

            var transform;

            var numEventsForEachPatient=[];

            var sampleEventLengthForThisTimeLine=[];

            var p =_self.props.store.rootStore.patientOrderPerTimepoint;

            //check the type of the timepoint to get the correct list of currentVariables and the correct width of the heatmap rectangles
            if(_self.props.timepoints[i].type === "between") {
                rectWidth = _self.props.visMap.betweenRectWidth;
                let k=a.filter(d=>d.time===Math.floor(i/2));
                k.sort((p1, p2) => _self.comparePatientOrder(p, p1, p2));
                yp=k.map(d=>d.eventDate *700.0 / max);
                transform= "translate(0, 0)";


               

                count=0, i=0;
                k=Object.values(k);

                p.forEach(function(d,i){
                    k.forEach(function(l){
                        //console.log(p);
                        
                        if(l.patientId===p[i]){
                        count++;
                        }
                    })
                    
                    numEventsForEachPatient.push(count);
                    
                    count=0;
                
                });

                //arr;


    
            }
            else {
                rectWidth = _self.props.visMap.sampleRectWidth;
                yp=_self.props.allYPositions[Math.floor(i/2)].map(y => y*700.0/max);

                //transform= "translate(0, 350)";
                transform= "translate(0, 0)";



                //p=_self.props.store.rootStore.patientOrderPerTimepoint;
                p.forEach(function(d,i){
                    count=1;
                    
                    numEventsForEachPatient.push(count);
                    
                    //count=0;
                
                });


            }
           

            

            //var yp=_self.props.allYPositions[i].map(y => y*700.0/max); //.map(x=>x.timeGapBetweenSample);
            

            if (d.heatmap.length > 0) {

                var heatmapd=d;
                var heatmapi=i;
          
                timepoints.push(<g key={heatmapi + "timepoint" + i} transform={transform}><Timepoint timepoint={heatmapd} index={heatmapi}
                                                                                          ypi={yp} 
                                                                                          numEventsForEachPatient={numEventsForEachPatient} 
                                                                                          eventStartEnd={d.rootStore.betweenTimepointStore.sampleEventList}
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

        if(this.props.store.rootStore.transitionOn && this.props.store.rootStore.globalTime){
            return (
                this.getTreatmentTimepoints()
                //this.getTimepoints()
            )
        }

        else if(this.props.store.rootStore.globalTime) {
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