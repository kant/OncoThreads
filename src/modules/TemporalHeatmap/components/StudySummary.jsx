import React from 'react';
import {inject, observer} from 'mobx-react';


/**
 * Component for showing study information
 */
const StudySummary = inject('rootStore')(observer(class StudySummary extends React.Component {
    render() {
        let numberOfTimepoints;
        const minTP = Math.min(...Object.keys(this.props.rootStore.sampleStructure).map(key => this.props.rootStore.sampleStructure[key].length));
        const maxTP = Math.max(...Object.keys(this.props.rootStore.sampleStructure).map(key => this.props.rootStore.sampleStructure[key].length));

        if (minTP === maxTP) {
            numberOfTimepoints = minTP;
        }
        else {
            numberOfTimepoints = minTP + "-" + maxTP;
        }
        if (!this.props.rootStore.isOwnData) {
            return (
                <div>
                    <b>Study:</b> {this.props.rootStore.study.name}
                    <br/>
                    <b>Description:</b> {this.props.rootStore.study.description}
                    <br/>
                    <b>Citation:</b> {this.props.rootStore.study.citation}
                    <br/>
                    <b>Number of patients:</b> {this.props.rootStore.patients.length}
                    <br/>
                    <b>Number of timepoints</b> {numberOfTimepoints}

                </div>
            )
        }
        else {
            return (
                <div>
                    <b>Number of patients:</b> {this.props.rootStore.patients.length}
                    <br/>
                    <b>Number of timepoints</b> {numberOfTimepoints}
                </div>
            )
        }

    }
}));
export default StudySummary;