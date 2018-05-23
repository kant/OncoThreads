import React from 'react';
import * as d3 from 'd3';
import {observer} from 'mobx-react';
/*
implements a LineTransition
 */
const LineTransition = observer(class LineTransition extends React.Component {
    /**
     * Draws a line for the Line transition
     * @param x0: x pos on first timepoint
     * @param x1: x pos on second timepoint
     * @param y0: y pos
     * @param y1: y pos + height
     * @param key (unique)
     * @param strokeColor
     * @returns Line
     */

     
    static drawLine(x0, x1, y0, y1, key, mode, strokeColor) {
        const curvature = .5;
        const yi = d3.interpolateNumber(y0, y1),
            y2 = yi(curvature),
            y3 = yi(1 - curvature);

        

        //console.log(key);
            
        let path = "M" + x0 + "," + y0
            + "C" + x0 + "," + y2
            + " " + x1 + "," + y3
            + " " + x1 + "," + y1;
        if(mode) {
            return (<path key={key+"-solid"} d={path} stroke={strokeColor} fill="none"/>)
        } else {
            return (<path key={key+"-dashed"} d={path} stroke={strokeColor} strokeDasharray="5, 5" fill="none"/>)
        }
    }
    drawLines() {
        let lines = [];
        const _self = this;
        /*
        console.log(this.props.transition.timeGapStructure);
        console.log(this.props.transition.data.from);
        */
        var globalInd=1;

        this.props.transition.data.from.forEach(function (d, i) {
            /*
            console.log(d);

            console.log( _self.props.firstHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2);

            console.log(_self.props.secondHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2);

            console.log(0 - _self.props.visMap.gap);

            console.log(_self.props.visMap.transitionSpace);
            */
            if (_self.props.transition.data.to.includes(d)) {
                let strokeColor="lightgray";
                if(_self.props.selectedPatients.includes(d)){
                    strokeColor="black"
                }
                lines.push(LineTransition.drawLine(_self.props.firstHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2, 
                    _self.props.secondHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2, 
                    0 - _self.props.visMap.gap, _self.props.visMap.transitionSpace, 
                    d+globalInd+i, true, strokeColor));
                globalInd++;   
            }
        });
        return lines;
    }

    drawLinesGlobalWithTransition(){
        let lines = [];
        const _self = this;
       
        
        //const max = /*_self.props.allYPositionsi
            //.map(yPositions => yPositions.reduce((next, max) => next>max? next: max, 0))
            //.reduce((next, max) => next>max? next: max, 0);*/
           // Math.max(..._self.props.allYPositionsi);


        let j=0;

        let y1=_self.props.allYPositionsy1; //.map(y=>y*700.00/_self.props.max);


        let y2=_self.props.allYPositionsy2; //.map(y=>y*700.00/_self.props.max);

        if(y1 && y2){

            y1=y1.map(y=>y*700.00/_self.props.max);

            y2=y2.map(y=>y*700.00/_self.props.max);

            var globalInd=2;

            var flag=false;

            this.props.transition.data.from.forEach(function (d, i) {
                
                //var yp=_self.props.allYPositionsi.map(y => y*700.0/max);
                /*
                console.log(d);

                console.log( _self.props.firstHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2);

                console.log(_self.props.secondHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2);

                console.log(0 - _self.props.visMap.gap);

                console.log(_self.props.visMap.transitionSpace);

                
                */

                //_self.props.transition.timeGapStructure.forEach(function(k){if (k.patient===d) {flag=true; }})

                //if(i%2===1){
                if (_self.props.transition.data.to.includes(d)) {
                //if(flag){    
                    let strokeColor="lightgray";
                    if(_self.props.selectedPatients.includes(d)){
                        strokeColor="black"
                    }
                    lines.push(LineTransition.drawLine(_self.props.firstHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2, 
                        _self.props.secondHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2, 
                        //0 - _self.props.visMap.gap, 
                        y1[j] + _self.props.visMap.sampleRectWidth,
                        //_self.props.visMap.transitionSpace, 
                        y2[j], // + _self.props.visMap.sampleRectWidth / 2,
                        d+globalInd+i, true, strokeColor));
                    j++;   
                    globalInd=globalInd+2; 
                }

                //flag=false;
                //}
            });

            j=0;

        }
        return lines;
    }

    drawLinesGlobal() {
        let lines = [];
        const _self = this;
       
        
        //const max = /*_self.props.allYPositionsi
            //.map(yPositions => yPositions.reduce((next, max) => next>max? next: max, 0))
            //.reduce((next, max) => next>max? next: max, 0);*/
           // Math.max(..._self.props.allYPositionsi);


        let j=0;

        let y1=_self.props.allYPositionsy1.map(y=>y*700.00/_self.props.max);


        let y2=_self.props.allYPositionsy2.map(y=>y*700.00/_self.props.max);


        var globalInd=2;

        _self.props.transition.data.from.forEach(function (d, i) {
            
            //var yp=_self.props.allYPositionsi.map(y => y*700.0/max);
            /*
            console.log(d);

            console.log( _self.props.firstHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2);

            console.log(_self.props.secondHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2);

            console.log(0 - _self.props.visMap.gap);

            console.log(_self.props.visMap.transitionSpace);
            */
            if (_self.props.transition.data.to.includes(d)) {
                let strokeColor="lightgray";
                if(_self.props.selectedPatients.includes(d)){
                    strokeColor="black"
                }
                lines.push(LineTransition.drawLine(_self.props.firstHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2, 
                    _self.props.secondHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2, 
                    //0 - _self.props.visMap.gap, 
                    y1[i] + _self.props.visMap.sampleRectWidth,
                    //_self.props.visMap.transitionSpace, 
                    y2[j], // + _self.props.visMap.sampleRectWidth / 2,
                    d+globalInd+i, true, strokeColor));
                j++;   
                globalInd=globalInd+2; 
            }
        });

        j=0;

        return lines;
    }



    drawLines3() {
        let lines = [];
        const _self = this;

        var timeGapBetweenMap = {};

        var globalInd=3;

        var max = this.props.transition.timeGapStructure.map(t=> {
            timeGapBetweenMap[t.patient] = t.timeGapBetweenSample;
            return t.timeGapBetweenSample;
        }).reduce((m, cur) => m>cur? m: cur, 0);


        const getColor = _self.props.visMap.getColorScale(_self.props.secondPrimary.variable, _self.props.secondPrimary.type);
        const currentRow=_self.props.secondTimepoint.heatmap.filter(function (d,i) {
            return d.variable===_self.props.secondPrimary.variable
        })[0].data;
        var ind = -1;

        this.props.transition.data.from.forEach(function (d, i) {

            if (_self.props.transition.data.to.includes(d)) {
                let strokeColor="lightgray";
                if(_self.props.selectedPatients.includes(d)){
                    strokeColor="black"
                }
                const frac = timeGapBetweenMap[d]/max;
//                _self.props.firstHeatmapScale(d)*frac + _self.props.secondHeatmapScale(d)*(1-frac)
                ind++;
                lines.push(LineTransition.drawLine(
                    (_self.props.firstHeatmapScale(d)) + _self.props.visMap.sampleRectWidth / 2, 
                    _self.props.firstHeatmapScale(d)*(1-frac) +_self.props.secondHeatmapScale(d)*(frac) + _self.props.visMap.sampleRectWidth / 2, 
                    0 - _self.props.visMap.gap,
                    _self.props.visMap.transitionSpace*timeGapBetweenMap[d]/max, d+globalInd+i, true, strokeColor
                ));

                globalInd++;

                if(timeGapBetweenMap[d]<max) {
                    lines.push(LineTransition.drawLine(
                        _self.props.firstHeatmapScale(d)*(1-frac) +_self.props.secondHeatmapScale(d)*(frac) + _self.props.visMap.sampleRectWidth / 2, 
                        _self.props.secondHeatmapScale(d) + _self.props.visMap.sampleRectWidth / 2, 
                        _self.props.visMap.transitionSpace*frac,
                        _self.props.visMap.transitionSpace, d+globalInd+i, false, strokeColor
                    ));

                    globalInd=globalInd+3;

                    const color = getColor(currentRow[ind].value);
                    lines.push(
                        <rect
                            x={_self.props.firstHeatmapScale(d)*(1-frac) +_self.props.secondHeatmapScale(d)*(frac) + _self.props.visMap.sampleRectWidth/2-5}
                            y={_self.props.visMap.transitionSpace*timeGapBetweenMap[d]/max-5}
                           // width={10}
                           width={_self.props.visMap.sampleRectWidth/3}
                           height={_self.props.visMap.sampleRectWidth/3}
                            //height={10}
                            fill={color}
                        />);
                }
            }
        });
        return lines;
    }

    getMax(max, num) {
        return max>num? max: num;
    }




    render() {

        if(this.props.realTime) {
            return (
                this.drawLines3()
            )
        } 
        else if(this.props.globalTime && !this.props.transitionOn){
            return (
                this.drawLinesGlobal()
            )
        }
        else if(this.props.globalTime && this.props.transitionOn){
            return (
                this.drawLinesGlobal()  //or, drawLinesGlobalWithTransition()
            )
        }
        else {
            return (
                this.drawLines()
            )
        }
    }
});
export default LineTransition;