import React from 'react';
import * as d3 from 'd3';
import {observer} from 'mobx-react';
/*
creats a row in the heatmap
 */
const HeatmapRow = observer(class HeatmapRow extends React.Component {
    constructor(props) {
        super(props);
        this.state=({
            dragging:false,
        });
        this.handleMouseDown=this.handleMouseDown.bind(this);
        this.handleMouseUp=this.handleMouseUp.bind(this);
    }

    getRow() {
        let rects = [];
        const _self = this;
        this.props.row.data.forEach(function (d) {
            let stroke="none";
            if(_self.props.selectedPatients.includes(d.patient)){
                stroke="black"
            }
            rects.push(<rect stroke={stroke}  onMouseEnter={()=>_self.handleMouseEnter(d.patient)} onMouseDown={()=>_self.handleMouseDown(d.patient)} onMouseUp={_self.handleMouseUp} key={d.patient} height={_self.props.height}
                             width={_self.props.rectWidth}
                             x={_self.props.heatmapScale(d.patient) + _self.props.x}
                             fill={_self.props.color(d.value)} opacity={_self.props.opacity}/>);
        });
        return rects;

    }


    //added for drawing lines

static drawLine(x0, x1, y0, y1, key, mode, strokeColor) {
    const curvature = .5;
    const yi = d3.interpolateNumber(y0, y1),
        y2 = yi(curvature),
        y3 = yi(1 - curvature);

    let path = "M" + x0 + "," + y0
        + "C" + x0 + "," + y2
        + " " + x1 + "," + y3
        + " " + x1 + "," + y1;
    if(mode) {
        return (<path key={key+"-solid"} d={path} stroke={strokeColor} fill="none" strokeWidth= "22" opacity="0.2"/>)
    } else {
        return (<path key={key+"-dashed"} d={path} stroke={strokeColor} strokeDasharray="5, 5" fill="none"/>)
    }
}



//end of drawing lines



    getGlobalRow() {
        let rects = [];
        const _self = this;
        let j=0, ind;
        this.props.row.data.forEach(function (d, i) {
            let stroke="none";
            if(_self.props.selectedPatients.includes(d.patient)){
                stroke="black"
            }
            if(!_self.props.ypi){
                console.log(_self.props);
            }
            /*rects.push(<rect stroke={stroke}  onMouseEnter={()=>_self.handleMouseEnter(d.patient)} onMouseDown={()=>_self.handleMouseDown(d.patient)} onMouseUp={_self.handleMouseUp} key={d.patient} height={_self.props.height}
                             width={_self.props.rectWidth}
                             x={_self.props.heatmapScale(d.patient) + _self.props.x}
                             y={_self.props.ypi[i]}
                             fill={_self.props.color(_self.props.timepoint)} 
                             opacity={_self.props.opacity}/>);*/


            //if(_self.props.color(d.value)!='#f7f7f7')    {  
                
                ind=0;

                var p_num=_self.props.store.rootStore.patientOrderPerTimepoint.indexOf(d.patient);
                //var maxNum=_self.props.numEventsForEachPatient[i];
                var maxNum=_self.props.numEventsForEachPatient[p_num];


                if(maxNum==0){
                    console.log("MaxNum is zero!");
                    console.log(maxNum);
                }

                while(ind<maxNum){

                    var k = _self.props.eventStartEnd;

                    var heightN;

                  
                        
                        
                    //console.log(heightN);
                    /*if((_self.props.timepoint%2==0) && (_self.props.store.rootStore.transitionOn)){
                        //if(heightN==1) {   

                            k.forEach(function(l){
                                if(Object.keys(l)==d.patient+d.eventDate) {
                                    //console.log(Object.values(l)[0].endNumberOfDaysSinceDiagnosis-Object.values(l)[0].startNumberOfDaysSinceDiagnosis);
                                    heightN=_self.props.height+(Object.values(l)[0].endNumberOfDaysSinceDiagnosis-Object.values(l)[0].startNumberOfDaysSinceDiagnosis)*700 / 1000;
                                    console.log(heightN);
                                }
                            })


                            rects.push(<rect stroke={stroke}  onMouseEnter={()=>_self.handleMouseEnter(d.patient)} onMouseDown={()=>_self.handleMouseDown(d.patient)} onMouseUp={_self.handleMouseUp} key={d.patient} 
                                        height={heightN}//{_self.props.height}
                                        width={_self.props.rectWidth}
                                        x={_self.props.heatmapScale(d.patient) + _self.props.x}
                                        y={_self.props.ypi[j]}
                                        fill={_self.props.color(d.value)}
                                        opacity={_self.props.opacity}/>);  

                        //} 
                        /*else{
                            rects.push(<rect stroke={stroke}  onMouseEnter={()=>_self.handleMouseEnter(d.patient)} onMouseDown={()=>_self.handleMouseDown(d.patient)} onMouseUp={_self.handleMouseUp} key={d.patient} 
                                        //height={(_self.props.height + _self.props.height*(heightN/400))}
                                        height={heightN}// {_self.props.height}
                                        width={_self.props.rectWidth}
                                        x={_self.props.heatmapScale(d.patient) + _self.props.x}
                                        y={_self.props.ypi[j]}
                                        fill={_self.props.color(d.value)}
                                        opacity={_self.props.opacity}/>);  

                        } */


                       // j++; 

                        //ind++;
                    //} 

                    //else{
                        //if(heightN==1) {   
                            rects.push(<rect stroke={stroke}  onMouseEnter={()=>_self.handleMouseEnter(d.patient)} onMouseDown={()=>_self.handleMouseDown(d.patient)} onMouseUp={_self.handleMouseUp} key={d.patient} 
                                        height={_self.props.height}
                                        width={_self.props.rectWidth}
                                        x={_self.props.heatmapScale(d.patient) + _self.props.x}
                                        y={_self.props.ypi[j]}
                                        fill={_self.props.color(d.value)}
                                        opacity={_self.props.opacity}/>);  

                       // } 
                        /*else{
                            rects.push(<rect stroke={stroke}  onMouseEnter={()=>_self.handleMouseEnter(d.patient)} onMouseDown={()=>_self.handleMouseDown(d.patient)} onMouseUp={_self.handleMouseUp} key={d.patient} 
                                        //height={(_self.props.height + _self.props.height*(heightN/400))}
                                        height={_self.props.height}
                                        width={_self.props.rectWidth}
                                        x={_self.props.heatmapScale(d.patient) + _self.props.x}
                                        y={_self.props.ypi[j]}
                                        fill={_self.props.color(d.value)}
                                        opacity={_self.props.opacity}/>);  

                        } */


                        j++; 

                        ind++;


                    //}
                    
                    
                                    
                   

                    //if(heightN>1){
                    //_self.props.numEventsForEachPatient[p_num]=_self.props.numEventsForEachPatient[p_num]-1;
                    //}
                
                }

                _self.props.numEventsForEachPatient[p_num]=_self.props.numEventsForEachPatient[p_num]-ind;
                ind=0;

            //}  
            
           

           /* rects.push(<text x={_self.props.heatmapScale(d.patient) + _self.props.x}
            y={_self.props.ypi[i]} >       
                {_self.props.timepoint}
            </text>);   */   
            
            /*let strokeColor="lightgray";

            if(i>0){
                rects.push(HeatmapRow.drawLine(
                    _self.props.heatmapScale(_self.props.row.data[i-1].patient)+_self.props.x + _self.props.rectWidth/2,
                    _self.props.heatmapScale(d.patient) + _self.props.x + _self.props.rectWidth/2,
                    _self.props.ypi[i-1] + _self.props.rectWidth/2,
                    _self.props.ypi[i] + _self.props.rectWidth/2, 
                    d.patient, true, _self.props.color(_self.props.timepoint)
                ));
            }*/
            
            
        });
        j=0;
        return rects;

    }



    handleMouseDown(patient){
        if(!this.state.dragging) {
            this.props.onDrag(patient);
        }
        this.setState({
            dragging:true
        });

    }
    handleMouseUp(){
        this.setState({
            dragging:false
        })
    }
    handleMouseEnter(patient){
        if(this.state.dragging) {
            this.props.onDrag(patient);
        }
    }



    render() {
       // return (
         //   this.getRow()
        //)


        /*if(this.props.store.rootStore.globalTime || this.props.store.rootStore.transitionOn) {
            return (
                this.getGlobalRow()
            )
        } else {
            return (
                this.getRow()
            )
        }*/

        if(this.props.store.rootStore.globalTime) {
            return (
                this.getGlobalRow()
            )
        } else {
            return (
                this.getRow()
            )
        }




    }
});
export default HeatmapRow;