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
        this.props.row.data.forEach(function (d, i) {
            let stroke="none";
            if(_self.props.selectedPatients.includes(d.patient)){
                stroke="black"
            }
            if(!_self.props.ypi){
                console.log(_self.props);
            }
            rects.push(<rect stroke={stroke}  onMouseEnter={()=>_self.handleMouseEnter(d.patient)} onMouseDown={()=>_self.handleMouseDown(d.patient)} onMouseUp={_self.handleMouseUp} key={d.patient} height={_self.props.height}
                             width={_self.props.rectWidth}
                             x={_self.props.heatmapScale(d.patient) + _self.props.x}
                             y={_self.props.ypi[i]}
                             fill={_self.props.color(_self.props.timepoint)} opacity={_self.props.opacity}/>);
           /* rects.push(<text x={_self.props.heatmapScale(d.patient) + _self.props.x}
            y={_self.props.ypi[i]} >       
                {_self.props.timepoint}
            </text>);   */   
            
            let strokeColor="lightgray";

            if(i>0){
                rects.push(HeatmapRow.drawLine(
                    _self.props.heatmapScale(_self.props.row.data[i-1].patient)+_self.props.x + _self.props.rectWidth/2,
                    _self.props.heatmapScale(d.patient) + _self.props.x + _self.props.rectWidth/2,
                    _self.props.ypi[i-1] + _self.props.rectWidth/2,
                    _self.props.ypi[i] + _self.props.rectWidth/2, 
                    d.patient, true, _self.props.color(_self.props.timepoint)
                ));
            }
            
            
        });
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