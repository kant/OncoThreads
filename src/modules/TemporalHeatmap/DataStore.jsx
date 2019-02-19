import {extendObservable, reaction} from "mobx";
import VariableStore from "./VariableStore";

/*
stores information about timepoints. Combines betweenTimepoints and sampleTimepoints
 */
class DataStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
        this.numberOfPatients = 300;
        this.variableStores = {
            sample: null,
            between: null
        };
        //this.timepoints = [];
        //this.timelineStore=null;
        extendObservable(this, {
            timepoints:[],
            selectedPatients: [],
            continuousRepresentation: 'gradient',
            globalPrimary: '',
            realTime: false,
            globalTime: false,
            transitionOn: false,
            advancedSelection: true,
            showUndefined: true,
            maxPartitions:0,

        });
        reaction(() => this.transitionOn, isOn =>
            this.combineTimepoints(isOn));
        this.regroupTimepoints = this.regroupTimepoints.bind(this);

    }
    setMaxPartitions(numPartitions){
        if(numPartitions>this.maxPartitions){
           this.maxPartitions=numPartitions
        }
    }
    setGlobalPrimary(varId) {
        this.globalPrimary = varId;
    }

    toggleRealtime() {
        this.realTime = !this.realTime;
    }

    setGlobalTime(boolean) {
        this.globalTime = boolean;
    }

    setNumberOfPatients(numP) {
        this.numberOfPatients = numP;
    }

    /**
     * handles currently selected patients
     * @param patient
     */
    handlePatientSelection(patient) {
        if (this.selectedPatients.includes(patient)) {
            this.removePatientFromSelection(patient)
        }
        else {
            this.addPatientToSelection(patient);
        }
    }


    /**
     * handles the selection of patients in a partition
     * @param patients
     */
    handlePartitionSelection(patients) {
        const _self = this;
        //isContained: true if all patients are contained
        let isContained = true;
        patients.forEach(function (d) {
            if (!_self.selectedPatients.includes(d)) {
                isContained = false
            }
        });
        //If not all patients are contained, add the patients that are not contained to the selected patients
        if (!isContained) {
            patients.forEach(function (d) {
                if (!_self.selectedPatients.includes(d)) {
                    _self.addPatientToSelection(d);
                }
            });
        }
        //If all the patients are already contained, remove them from selected patients
        else {
            patients.forEach(function (d) {
                _self.removePatientFromSelection(d);
            });
        }
    }

    addPatientToSelection(patient) {
        let selected = this.selectedPatients.slice();
        selected.push(patient);
        this.selectedPatients = selected;
    }

    removePatientFromSelection(patient) {
        let selected = this.selectedPatients.slice();
        selected.splice(this.selectedPatients.indexOf(patient), 1);
        this.selectedPatients = selected;
    }

    /**
     * initializes the datastructures
     */
    initialize(numPatients) {
        this.numberOfPatients = numPatients;
        this.variableStores = {
            sample: new VariableStore(this.rootStore, this.rootStore.timepointStructure, "sample"),
            between: new VariableStore(this.rootStore, this.rootStore.transitionStructure, "between")
        };
        //this.timelineStore=new TimelineStore(this.rootStore,this.rootStore.sampleStructure,this.rootStore.sampleTimelineMap,this.rootStore.survivalData);
        this.combineTimepoints(false);
    }

    reset() {
        this.globalTime = false;
        this.realTime = false;
        this.selectedPatients = [];
        this.transitionOn = false;
    }

    update(order) {
        this.variableStores.sample.update(this.rootStore.timepointStructure, order);
        this.variableStores.between.update(this.rootStore.transitionStructure, order);
        this.combineTimepoints(this.transitionOn);

    }

    /*
    updateTimeline(type){
        if(type==="sample"){
            this.timelineStore.changeSampleTimelineData(this.globalPrimary)
        }
        else{
            this.timelineStore.changeEventTimelineData(this.variableStores.between.currentVariables)
        }
    }
    */

    combineTimepoints(isOn) {
        let betweenTimepoints = this.variableStores.between.childStore.timepoints.slice();
        let sampleTimepoints = this.variableStores.sample.childStore.timepoints.slice();
        let timepoints = [];
        if (!isOn) {
            timepoints = sampleTimepoints;
        }
        else {
            for (let i = 0; i < sampleTimepoints.length; i++) {
                timepoints.push(betweenTimepoints[i]);
                betweenTimepoints[i].heatmapOrder = sampleTimepoints[i].heatmapOrder;
                timepoints.push(sampleTimepoints[i]);
            }
            betweenTimepoints[betweenTimepoints.length - 1].heatmapOrder = sampleTimepoints[sampleTimepoints.length - 1].heatmapOrder;
            timepoints.push(betweenTimepoints[betweenTimepoints.length - 1]);

        }
        timepoints.forEach((d, i) => d.globalIndex = i);
        this.timepoints = timepoints;
        this.rootStore.transitionStore.initializeTransitions(timepoints.length - 1);

    }

    /**
     * gets all values of a variable, indepently of their timepoint
     * @param mapper
     * @param type
     * @returns {Array}
     */
    getAllValues(mapper, type) {
        let allValues = [];
        let structure = type === "sample" ? this.rootStore.timepointStructure : this.rootStore.transitionStructure;
        structure.forEach(d => d.forEach(f => allValues.push(mapper[f.sample])));
        return allValues;
    }

    /**
     * applies the patient order of the current timepoint to all the other timepoints
     * @param timepointIndex
     * @param saveRealign
     */
    applyPatientOrderToAll(timepointIndex, saveRealign) {
        let sorting = this.timepoints[timepointIndex].heatmapOrder;
        this.timepoints.forEach(function (d) {
            d.heatmapOrder = sorting;
        });
        if (saveRealign) {
            this.rootStore.undoRedoStore.saveRealignToHistory(this.timepoints[timepointIndex].type, this.timepoints[timepointIndex].localIndex)
        }
        //this.rootStore.visStore.resetTransitionSpace();
    }


    /**
     * regroups the timepoints. Used after something is changed (variable is removed/added/declared primary)
     */
    regroupTimepoints() {
        const _self = this;
        this.timepoints.forEach(function (d, i) {
            if (d.isGrouped) {
                d.group(d.primaryVariableId);
                d.sortGroup(d.primaryVariableId, d.groupOrder);
            }
            _self.rootStore.transitionStore.adaptTransitions(i);
        })
    }
}


export default DataStore;