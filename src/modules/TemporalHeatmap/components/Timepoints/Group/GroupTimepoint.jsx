import React from 'react';
import {observer} from 'mobx-react';

import GroupPartition from './GroupPartition'
/*
creates a grouped timepoint
 */
const GroupTimepoint = observer(class GroupTimepoint extends React.Component {
    /**
     * gets the different partitions in the grouped timepoint
     * @returns partitions
     */
    getPartitions() {
        let partitions = [];
        const _self = this;
        let previousXPosition = 0;
        this.props.timepoint.forEach(function (d, i) {
            const transform = "translate(" + previousXPosition + ",0)";
            let stroke="none";
            if(_self.isSelected(d.patients)){
                stroke="black";
            }
            partitions.push(<g style={{backgroundColor: "darkgray"}}
                               onClick={() => _self.props.selectPartition(d.patients)} key={d.partition}
                               transform={transform}><GroupPartition key={d.partition} {..._self.props} partition={d}
                                                                     partitionIndex={i} stroke={stroke}/></g>);
            for (let j = 0; j < d.rows.length; j++) {
                if (d.rows[j].variable === _self.props.primaryVariable) {
                    previousXPosition += _self.props.groupScale(d.rows[j].counts[0].value) + 10;
                }
            }
        });
        return partitions;
    }

    /**
     * checks if the patients in the partition are selected
     * @param patients
     * @returns {boolean}
     */
    isSelected(patients) {
        let isSelected = true;
        for(let i=0;i<patients.length;i++){
            if(!this.props.selectedPatients.includes(patients[i])){
                isSelected=false;
                break;
            }
        }
        return isSelected;
    }

    render() {
        return (
            this.getPartitions()
        )
    }
});
export default GroupTimepoint;