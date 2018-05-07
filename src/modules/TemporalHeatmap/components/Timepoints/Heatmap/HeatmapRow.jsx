import React from 'react';
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
        return (
            this.getRow()
        )
    }
});
export default HeatmapRow;