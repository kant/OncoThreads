import React from 'react';
import {inject, observer} from 'mobx-react';
import {
    Button,
    Checkbox,
    ControlLabel,
    FormControl,
    FormGroup,
    Modal,
    OverlayTrigger,
    Popover,
    Radio
} from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import DerivedVariable from "../../../stores/DerivedVariable";
import uuidv4 from 'uuid/v4';
import DerivedMapperFunctions from "../../../UtilityClasses/DeriveMapperFunctions";
import ModifyContinuous from "../ModifySingleVariable/ModifyContinuous";
import ColorScales from "../../../UtilityClasses/ColorScales";
import * as d3 from "d3";
import {extendObservable} from "mobx";
import Histogram from "../ModifySingleVariable/Binner/Histogram";

/**
 * Component for combining variables
 */
const ContinuousCombine = inject("variableManagerStore")(observer(class ContinuousCombine extends React.Component {
    constructor(props) {
        super(props);
        extendObservable(this, this.initializeObservable());
        this.width = 350;
        this.height = 200;
        this.handleApply = this.handleApply.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    /**
     * gets the initial state
     * @return {{name: string, modification: {operator: string, datatype: string}, nameChanged: boolean, variableRange: string[], keep: boolean, isOrdinal: boolean, currentVarCategories: Object[]}}
     */
    initializeObservable() {
        let name, nameChanged, colorRange, operation; // name of combined variable
        if (this.props.derivedVariable === null) {
            nameChanged = false; // has the name been changed
            if (this.props.variables.every(d => d.domain[0] >= 0)) {
                colorRange = ColorScales.defaultContinuousTwoColors;
            }
            else {
                colorRange = ColorScales.defaultContinuousThreeColors;
            }
            operation = "average";
            name = "CONTINUOUS COMBINE: " + this.props.variables.map(d => d.name);
        }
        // if the variable is already combined base parameters on this variable
        else {
            name = this.props.derivedVariable.name;
            nameChanged = true;
            colorRange = this.props.derivedVariable.range;
            operation = this.props.derivedVariable.modification.operation;
        }
        return {
            name: name,
            nameChanged: nameChanged,
            keep: true,
            colorRange: colorRange,
            operation: operation,
            get mapper() {
                return DerivedMapperFunctions.createContinuousCombinedMapper(this.props.variables.map(d => d.mapper), this.operation)
            },
            get allValues() {
                return Object.values(this.mapper).filter(d => d !== undefined);
            }
        };
    }

    /**
     * handles the name change
     * @param {Object} event
     */
    handleNameChange(event) {
        this.name = event.target.value;
        this.nameChanged = true;
    }

    /**
     * applies combination of variables
     */
    handleApply() {
        let range, description;
        description = "Numerical combination of " + this.props.variables.map(d => d.name);
        range = this.colorRange;
        let newVariable = new DerivedVariable(uuidv4(), this.name, "NUMBER", description, this.props.variables.map(d => d.id), {
            type: "continuousCombine",
            operation: this.operation
        }, range, [], this.mapper, uuidv4(), "combined");
        if (this.props.derivedVariable === null) {
            this.props.variableManagerStore.addVariableToBeDisplayed(newVariable, this.keep);
        }
        else {
            this.props.variableManagerStore.replaceDisplayedVariable(this.props.derivedVariable.id, newVariable)
        }
        if (!this.keep) {
            this.props.variables.forEach(d => {
                this.props.variableManagerStore.removeVariable(d.id);
            })
        }
        this.props.closeModal();
    }

    /**
     * gets the popover for the selection of a color scale
     * @returns {form}
     */
    getColorScalePopover() {
        const width = 100;
        const height = 20;
        let linearColorRange = [];
        if (Math.min(...Object.values(this.mapper)) < 0) {
            linearColorRange = ColorScales.continuousThreeColorRanges;
        }
        else {
            linearColorRange = ColorScales.continuousTwoColorRanges;
        }
        return <form>
            <FormGroup>
                {linearColorRange.map((d, i) => <Radio key={i} onChange={() => this.colorRange = d}
                                                       name="ColorScaleGroup">
                    {ModifyContinuous.getGradient(d, width, height)}
                </Radio>)}
            </FormGroup>
        </form>
    }

    /**
     * gets a histogram or a Binner if in binning mode
     * @returns {(Provider|svg)}
     */
    getHistogram() {
        const min = Math.min(...this.allValues);
        const max = Math.max(...this.allValues);
        const xScale = d3.scaleLinear().domain([min, max]).range([0, this.width]);
        const bins = d3.histogram()
            .domain([min, max])
            .thresholds(xScale.ticks(30))(this.allValues);
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(bins, function (d) {
                return d.length;
            })]).range([this.height, 0]);
        const margin = {top: 20, right: 20, bottom: 90, left: 50},
            w = this.width + (margin.left + margin.right),
            h = this.height + (margin.top + margin.bottom);
        const transform = 'translate(' + margin.left + ',' + margin.top + ')';
        return <svg width={w} height={h}>
            <g transform={transform}><Histogram bins={bins} xScale={xScale} yScale={yScale}
                                                h={this.height}
                                                w={this.width} xLabel={this.name}
                                                numValues={this.allValues.length}/></g>
        </svg>
    }

    render() {
        const colorScalePopOver = <Popover id="popover-positioned-right" title="Choose color scale">
            {this.getColorScalePopover()}
        </Popover>;
        return (
            <Modal show={this.props.modalIsOpen}
                   onHide={this.props.closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Combine Variables</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{minHeight: "400px"}}>
                    <form>
                        <ControlLabel>Variable name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.name}
                            onChange={this.handleNameChange}/>
                        <ControlLabel>Color Scale <OverlayTrigger rootClose={true}
                                                                  trigger="click"
                                                                  placement="right"
                                                                  overlay={colorScalePopOver}><FontAwesome
                            name="paint-brush"/></OverlayTrigger></ControlLabel>
                        <p>{ModifyContinuous.getGradient(this.colorRange, 100, 20)}</p>
                        <FormGroup controlId="formControlsSelect">
                            <ControlLabel>Select Operation</ControlLabel>
                            <FormControl onChange={(e) => this.operation = e.target.value} componentClass="select"
                                         defaultValue={this.operation}>
                                <option value="average">Mean</option>
                                <option value="median">Median</option>
                                <option value="sum">Sum</option>
                                <option value="delta">Difference</option>
                                <option value="min">Minimum</option>
                                <option value="max">Maximum</option>
                            </FormControl>
                        </FormGroup>
                    </form>
                    {this.getHistogram()}
                </Modal.Body>
                <Modal.Footer>
                    <Checkbox disabled={this.props.derivedVariable !== null}
                              onChange={() => this.keep = !this.keep} checked={!this.keep}>Discard
                        original variables</Checkbox>
                    <Button onClick={this.props.closeModal}>
                        Cancel
                    </Button>
                    <Button onClick={this.handleApply}>
                        Apply
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}));
export default ContinuousCombine;
