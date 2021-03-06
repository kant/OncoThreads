import React from 'react';
import {inject, observer} from 'mobx-react';
import {
    Button,
    DropdownButton,
    Form,
    FormGroup,
    Glyphicon,
    Label,
    MenuItem,
    OverlayTrigger,
    Table,
    Tooltip
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import ModifyCategorical from "./ModifySingleVariable/ModifyCategorical";
import ModifyContinuous from "./ModifySingleVariable/ModifyContinuous";
import ModifyBinary from "./ModifySingleVariable/ModifyBinary";
import SaveVariableDialog from "../Modals/SaveVariableDialog";
import CombineModal from "./CombineVariables/CombineModal";
import {extendObservable} from "mobx";

/**
 * Component for displaying and modifying current variables in a table
 */
const VariableTable = inject("variableManagerStore", "rootStore")(observer(class VariableTable extends React.Component {

    constructor(props) {
        super(props);
        extendObservable(this, {
            // current state of data and data parsing
            modifyCategoricalIsOpen: false,
            modifyContinuousIsOpen: false,
            modifyBinaryIsOpen: false,
            saveVariableIsOpen: false,
            combineVariablesIsOpen: false,
            currentVariable: '', // non-modified variable selected for modification
            derivedVariable: '', // modified variable selected for modification
            combineVariables: [], // variables selected for combination
            callback: '', // callback for saving a variable
            sortVarAsc: true,
            sortSourceAsc: true,
            sortTypeAsc: true
        });

        this.handleCogWheelClick = this.handleCogWheelClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.combineSelected = this.combineSelected.bind(this);
    }


    /**
     * closes all modals
     */
    closeModal() {
        this.modifyCategoricalIsOpen = false;
        this.modifyContinuousIsOpen = false;
        this.modifyBinaryIsOpen = false;
        this.saveVariableIsOpen = false;
        this.combineVariablesIsOpen = false;
    }

    /**
     * opens modal to modify variable
     * @param {OriginalVariable} originalVariable
     * @param {DerivedVariable} derivedVariable
     * @param {string} datatype
     */
    openModifyModal(originalVariable, derivedVariable, datatype) {
        this.modifyContinuousIsOpen = datatype === "NUMBER";
        this.modifyCategoricalIsOpen = datatype === "STRING" || datatype === "ORDINAL";
        this.modifyBinaryIsOpen = datatype === "BINARY";
        this.derivedVariable = derivedVariable;
        this.currentVariable = originalVariable;
    }

    /**
     * opens modal to combine variables
     * @param {OriginalVariable[]} variables
     * @param {DerivedVariable} derivedVariable
     */
    openCombineModal(variables, derivedVariable) {
        this.combineVariables = variables;
        this.derivedVariable = derivedVariable;
        this.combineVariablesIsOpen = true;
    }

    /**
     * opens modal to save variable
     * @param {DerivedVariable} variable
     * @param callback
     */
    openSaveVariableModal(variable, callback) {
        this.currentVariable = variable;
        this.saveVariableIsOpen = true;
        this.callback = callback;
    }


    /**
     * handles a cogwheelClick
     * @param {event} event
     * @param {string} id
     */
    handleCogWheelClick(event, id) {
        let variable = this.props.variableManagerStore.getById(id);
        if (variable.originalIds.length === 1) {
            let originalVariable;
            let derivedVariable = null;
            if (variable.derived) {
                originalVariable = this.props.variableManagerStore.getById(variable.originalIds[0]);
                derivedVariable = variable;
            }
            else {
                originalVariable = variable;
            }
            this.openModifyModal(originalVariable, derivedVariable, originalVariable.datatype);
        }
        else {
            this.openCombineModal(variable.originalIds.map(d => this.props.variableManagerStore.getById(d)), variable);
        }
    }

    /**
     * removes a variable
     * @param {(OriginalVariable|DerivedVariable)} variable
     */
    removeVariable(variable) {
        if (variable.derived) {
            this.openSaveVariableModal(variable, save => {
                this.props.variableManagerStore.updateSavedVariables(variable.id, save);
                this.props.variableManagerStore.removeVariable(variable.id);
            });
        }
        else {
            this.props.variableManagerStore.removeVariable(variable.id);
        }
    }

    /**
     * displays the currently selected variables
     * @returns {Table}
     */
    showCurrentVariables() {
        let elements = [];
        this.props.variableManagerStore.currentVariables.forEach((d, i) => {
            let fullVariable = this.props.variableManagerStore.getById(d.id);
            const tooltip = <Tooltip id="tooltip">
                {fullVariable.description}
            </Tooltip>;
            let label = null;
            if (fullVariable.derived) {
                label = <Label bsStyle="info">
                    Modified
                </Label>
            }
            let newLabel = null;
            if (d.isNew) {
                newLabel = <Label bsStyle="info">New</Label>
            }
            let bgColor = null;
            if (d.isSelected) {
                bgColor = "lightgray"
            }
            elements.push(
                <tr key={d.id} style={{backgroundColor: bgColor}}
                    onClick={(e) => {
                        if (e.target.nodeName === "TD") {
                            this.props.variableManagerStore.toggleSelected(d.id)
                        }
                    }}>
                    <td>
                        {i + 1}
                        <Button bsSize="xsmall" onClick={() => this.moveSingle(true, false, i)}><Glyphicon
                            glyph="chevron-up"/></Button>
                        <Button bsSize="xsmall" onClick={() => this.moveSingle(false, false, i)}><Glyphicon
                            glyph="chevron-down"/></Button>
                    </td>
                    <OverlayTrigger placement="top" overlay={tooltip}>
                        <td>
                            {fullVariable.name}
                        </td>
                    </OverlayTrigger>
                    <td>
                        {newLabel} {label}
                    </td>
                    <td>
                        {fullVariable.datatype}
                    </td>
                    <td>{!fullVariable.derived ? this.props.availableCategories.filter(d => d.id === fullVariable.profile)[0].name : "Derived"}</td>
                    <td>
                        <FontAwesome onClick={(e) => this.handleCogWheelClick(e, d.id)}
                                     name="cog"/>
                        {"\t"}
                        <FontAwesome onClick={() => {
                            this.removeVariable(fullVariable);
                        }} name="times"/>
                    </td>
                </tr>);
        });
        return <Table condensed hover>
            <thead>
            <tr>
                <th>Position</th>
                <th>Variable {this.sortVarAsc ? <Glyphicon onClick={() => this.handleSort("alphabet")}
                                                           glyph="chevron-down"/> :
                    <Glyphicon onClick={() => this.handleSort("alphabet")}
                               glyph="chevron-up"/>}</th>
                <th/>
                <th>Datatype {this.sortTypeAsc ? <Glyphicon onClick={() => this.handleSort("datatype")}
                                                            glyph="chevron-down"/> :
                    <Glyphicon onClick={() => this.handleSort("datatype")}
                               glyph="chevron-up"/>}</th>
                <th>Source {this.sortSourceAsc ? <Glyphicon onClick={() => this.handleSort("source")}
                                                            glyph="chevron-down"/> :
                    <Glyphicon onClick={() => this.handleSort("source")}
                               glyph="chevron-up"/>}</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {elements}</tbody>
        </Table>;
    }


    /**
     * creates the modal for modification
     * @returns {(ModifyBinary|ModifyContinuous|ModifyBinary|SaveVariableDialog|CombineModal)}
     */
    getModal() {
        let modal = null;
        if (this.modifyContinuousIsOpen) {
            modal = <ModifyContinuous modalIsOpen={this.modifyContinuousIsOpen}
                                      variable={this.currentVariable}
                                      derivedVariable={this.derivedVariable}
                                      setColorRange={this.setColorRange}
                                      closeModal={this.closeModal}/>
        }
        else if (this.modifyCategoricalIsOpen) {
            modal = <ModifyCategorical modalIsOpen={this.modifyCategoricalIsOpen}
                                       variable={this.currentVariable}
                                       derivedVariable={this.derivedVariable}
                                       closeModal={this.closeModal}/>
        }
        else if (this.modifyBinaryIsOpen) {
            modal = <ModifyBinary modalIsOpen={this.modifyBinaryIsOpen}
                                  variable={this.currentVariable}
                                  derivedVariable={this.derivedVariable}
                                  closeModal={this.closeModal}/>
        }
        else if (this.saveVariableIsOpen) {
            modal = <SaveVariableDialog modalIsOpen={this.saveVariableIsOpen}
                                        variable={this.currentVariable}
                                        callback={this.callback}
                                        closeModal={this.closeModal}/>
        }
        else if (this.combineVariablesIsOpen) {
            modal = <CombineModal modalIsOpen={this.combineVariablesIsOpen}
                                  variables={this.combineVariables}
                                  derivedVariable={this.derivedVariable}
                                  closeModal={this.closeModal}/>
        }
        return (
            modal
        )
    }


    /**
     * sorts current variables
     * @param {string} category
     */
    handleSort(category) {
        if (category === "source") {
            this.props.variableManagerStore.sortBySource(this.props.availableCategories.map(d => d.id), this.sortSourceAsc);
            this.sortSourceAsc = !this.sortSourceAsc;
        }
        else if (category === "alphabet") {
            this.props.variableManagerStore.sortAlphabetically(this.sortVarAsc);
            this.sortVarAsc = !this.sortVarAsc;

        }
        else {
            this.props.variableManagerStore.sortByDatatype(this.sortTypeAsc);
            this.sortTypeAsc = !this.sortTypeAsc;
        }
    }

    /**
     * Opens modal for combining selected variables
     */
    combineSelected() {
        let selectedVar = this.props.variableManagerStore.getSelectedVariables();
        if (selectedVar.length > 1) {
            this.openCombineModal(this.props.variableManagerStore.getSelectedVariables(), null);
        }
        else {
            alert("Please select at least two variables");
        }
    }

    /**
     * moves selected variables
     * @param {boolean} isUp
     * @param {boolean} toExtreme
     */
    moveSelected(isUp, toExtreme) {
        let indices = this.props.variableManagerStore.getSelectedIndices();
        this.props.variableManagerStore.move(isUp, toExtreme, indices);
    }

    /**
     * moves single variable
     * @param {boolean} isUp
     * @param {boolean} toExtreme
     * @param {number} index
     */
    moveSingle(isUp, toExtreme, index) {
        this.props.variableManagerStore.move(isUp, toExtreme, [index]);
    }

    /**
     * check if variable has changed
     * @param {(OriginalVariable|DerivedVariable)} oldVariable
     * @param {DerivedVariable} newVariable
     * @returns {boolean}
     */
    static variableChanged(oldVariable, newVariable) {
        //case: datatype changed?
        if (oldVariable.datatype !== newVariable.datatype) {
            return true;
        }
        else {
            //case: domain changed?
            if (!oldVariable.domain.every((d, i) => d === newVariable.domain[i])) {
                return true
            }
            else if (!oldVariable.range.every((d, i) => d === newVariable.range[i])) {
                return true
            }
            //case: mapper changed?
            else {
                for (let sample in oldVariable.mapper) {
                    if (oldVariable.mapper[sample] !== newVariable.mapper[sample]) {
                        return true;
                    }
                }
            }
        }
    }


    render() {
        return (
            <div>
                <h4>Current Variables</h4>
                <Form inline>
                    <FormGroup>

                    </FormGroup>
                </Form>
                <div style={{maxHeight: 400, overflowY: "scroll"}}>
                    {this.showCurrentVariables()}
                </div>
                <DropdownButton
                    title={"Move selected..."}
                    id={"MoveSelected"}>
                    <MenuItem onClick={() => this.moveSelected(true, false)} eventKey="1">Up</MenuItem>
                    <MenuItem onClick={() => this.moveSelected(false, false)} eventKey="2">Down</MenuItem>
                    <MenuItem divider/>
                    <MenuItem onClick={() => this.moveSelected(true, true)} eventKey="3">to top</MenuItem>
                    <MenuItem onClick={() => this.moveSelected(false, true)} eventKey="4">to bottom</MenuItem>
                </DropdownButton>
                <Button onClick={this.combineSelected}>Combine Selected</Button>
                {this.getModal()}
            </div>

        )
    }
}));
export default VariableTable;
