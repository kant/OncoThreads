import React from 'react';
import {observer} from 'mobx-react';
import Modal from "react-modal";
import ReactDOM from 'react-dom'
import ContinuousBinner from "../Binner/ContinuousBinner"
import ContextMenus from "./ContextMenus"

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        height: '450px',
        width: '500px',
        transform: 'translate(-50%, -50%)',
        overlfow: 'scroll'
    }
};
/*
implements the icons and their functionality on the left side of the plot
 */
const RowOperators = observer(class RowOperators extends React.Component {
    constructor() {
        super();
        this.state = {
            modalIsOpen: false,
            timepointIndex: -1,
            followUpFunction: null,
            contextX: 0,
            contextY: 0,
            clickedVariable: "",
            clickedTimepoint: -1
        };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.sortTimepoint = this.sortTimepoint.bind(this);
        this.group = this.group.bind(this);
        this.unGroup = this.unGroup.bind(this);
        this.promote = this.promote.bind(this);
        this.openSortContextMenu = this.openSortContextMenu.bind(this);
        this.openGroupContextMenu = this.openGroupContextMenu.bind(this);
        this.openPromoteContextMenu = this.openPromoteContextMenu.bind(this);
    }

    /**
     * Changes the state to open the sort context menu
     * @param e: event
     * @param timepointIndex
     */
    openSortContextMenu(e, timepointIndex) {
        this.props.openContextMenu("visible", "hidden", "hidden");
        this.setState({
            contextX: e.pageX - 105,
            contextY: e.pageY - 200,
            clickedTimepoint: timepointIndex
        });
        e.preventDefault();
    }

    /**
     * Changes the state to open the group context menu
     * @param e: event
     * @param timepointIndex
     * @param variable
     */
    openGroupContextMenu(e, timepointIndex, variable) {
        this.props.openContextMenu("hidden", "visible", "hidden");
        this.setState({
            contextX: e.pageX - 100,
            contextY: e.pageY - 200,
            clickedTimepoint: timepointIndex,
            clickedVariable: variable
        });
        e.preventDefault();
    }
    /**
     * Changes the state to open the promote context menu
     * @param e: event
     * @param timepointIndex
     * @param variable
     */
    openPromoteContextMenu(e, timepointIndex, variable) {
        this.props.openContextMenu("hidden", "hidden", "visible");
        this.setState({
            contextX: e.pageX - 100,
            contextY: e.pageY - 190,
            clickedTimepoint: timepointIndex,
            clickedVariable: variable
        });
        e.preventDefault();
    }


    /**
     * Opens the modal window and sets the state parameters which are passed to the ContinousBinner
     * @param timepointIndex: index of timepoint
     * @param variable: future primary variable
     * @param fun: Function which should be executed after the binning was applied: either group or promote
     */
    openModal(timepointIndex, variable, fun) {
        this.setState({
            modalIsOpen: true,
            timepointIndex: timepointIndex,
            clickedVariable: variable,
            followUpFunction: fun
        });
    }

    closeModal() {
        this.setState({modalIsOpen: false, variable: "", timepointIndex: -1, followUpFunction: null});
    }

    componentDidMount() {
        Modal.setAppElement(ReactDOM.findDOMNode(this));
    }

    /**
     * calls the store function to group a timepoint
     * @param timepointIndex: Index of the timepoint to be grouped
     * @param variable: Variable with which the timepoint will be grouped
     */
    group(timepointIndex, variable) {
        if (this.props.store.isContinuous(variable, this.props.store.timepoints[timepointIndex].type)) {
            this.openModal(timepointIndex, variable, this.props.store.groupBinnedTimepoint);
        }
        else {
            this.props.store.timepoints[timepointIndex].group(variable);
        }
    }

    /**
     * sorts a timepoint
     * the variable has to be declared a primary variable, then the timepoint is sorted
     * @param timepointIndex: Index of the timepoint to be sorted
     * @param variable: Variable with which the timepoint should be sorted
     */
    sortTimepoint(timepointIndex, variable) {
        this.props.store.timepoints[timepointIndex].sort(variable);
    }


    /**
     * ungoups a grouped timepoint
     * @param timepointIndex: Index of the timepoint to be regrouped
     * @param variable: variable which will be the future primary variable
     */
    unGroup(timepointIndex, variable) {
        this.props.store.timepoints[timepointIndex].unGroup(variable);
    }

    /**
     * promotes a variable at a timepoint to a primary variable
     * @param timepointIndex: index of the timepoint where the primary variable is changes
     * @param variable: variable to be the primary variable
     */
    promote(timepointIndex, variable) {
        if (this.props.store.timepoints[timepointIndex].isGrouped && this.props.store.isContinuous(variable, this.props.store.timepoints[timepointIndex].type)) {
            this.openModal(timepointIndex, variable, this.props.store.promoteBinnedTimepoint);
        }
        else {

            this.props.store.timepoints[timepointIndex].promote(variable);
        }


    }

    /**
     * Creates the Row operator for a timepoint
     * @param timepointIndex
     * @param icon1: first Icon
     * @param icon2: second Icon
     * @param function1: function for first Icon
     * @param function2: function for second Icon
     * @returns Row Operator
     */
    getRowOperator(timepointIndex, icon1, icon2, function1, function2) {
        const _self = this;
        let pos = 0;
        return this.props.store.currentVariables[this.props.timepoints[timepointIndex].type].map(function (d, i) {
            let lineHeight;
            let fontWeight;
            if (d.variable === _self.props.timepoints[timepointIndex].primaryVariable) {
                lineHeight = _self.props.visMap.primaryHeight;
                fontWeight = "bold";
            }
            else {
                lineHeight = _self.props.visMap.secondaryHeight;
                fontWeight = "normal";
            }
            const transform = "translate(0," + pos + ")";
            const iconScale = (_self.props.visMap.secondaryHeight - _self.props.visMap.gap) / 20;
            const fontSize = 10;
            pos = pos + lineHeight + _self.props.visMap.gap;
            const yIcons = -(iconScale * 24 - lineHeight) / 2;
            return <g key={d.variable} className={"clickable"} transform={transform}>
                <text key={"promote" + d.variable} style={{fontWeight: fontWeight}}
                      transform={"translate(0," + (lineHeight / 2 + 0.5 * fontSize) + ")"}
                      fontSize={fontSize}
                      onContextMenu={(e) => _self.openPromoteContextMenu(e, timepointIndex, d.variable)}
                      onClick={(e) => _self.promote(timepointIndex, d.variable, e)}>{d.variable}</text>
                <path key={"path1" + d.variable}
                      transform={"translate(" + (_self.props.svgWidth - iconScale * 24) + "," + yIcons + ")scale(" + iconScale + ")"}
                      fill="gray"
                      d={icon1}/>
                <rect key={"rect1" + d.variable} onClick={() => function1(timepointIndex, d.variable)}
                      onContextMenu={(e) => _self.openSortContextMenu(e, timepointIndex)}
                      transform={"translate(" + (_self.props.svgWidth - iconScale * 24) + "," + yIcons + ")scale(" + iconScale + ")"}
                      width={iconScale * 24} height={24}
                      fill="none"
                      pointerEvents="visible"/>
                <path key={"path2" + d.variable}
                      transform={"translate(" + (_self.props.svgWidth - iconScale * 48) + "," + yIcons + ")scale(" + iconScale + ")"}
                      fill="gray"
                      d={icon2}/>
                <rect key={"rect2" + d.variable} onClick={() => function2(timepointIndex, d.variable)}
                      transform={"translate(" + (_self.props.svgWidth - iconScale * 48) + "," + yIcons + ")scale(" + iconScale + ")"}
                      onContextMenu={(e) => _self.openGroupContextMenu(e, timepointIndex, d.variable)}
                      width={24} height={24}
                      fill="none" pointerEvents="visible"/>
            </g>
        });

    }

    render() {
        let headers = [];
        const _self = this;
        //Paths for Icons
        const sort = "M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z";
        const group = "M12.5,19.5V3.47H14.53V19.5H12.5M9.5,19.5V3.47H11.53V19.5H9.5M4.5,7.5L8.53,11.5L4.5,15.47V12.47H1.5V10.5H4.5V7.5M19.5,15.47L15.5,11.5L19.5,7.5V10.5H22.5V12.47H19.5V15.47Z";
        const ungroup = "M9,11H15V8L19,12L15,16V13H9V16L5,12L9,8V11M2,20V4H4V20H2M20,20V4H22V20H20Z";

        this.props.timepoints.forEach(function (d, i) {
            let transform = "translate(0," + _self.props.posY[i] + ")";
            //Different icons and functions for grouped and ungrouped timepoints
            if (!d.isGrouped) {
                headers.push(<g key={"Operator" + i}
                                transform={transform}>{_self.getRowOperator(i, sort, group, _self.sortTimepoint, _self.group)}</g>)
            }
            else {
                headers.push(<g key={"Operator" + i}
                                transform={transform}>{_self.getRowOperator(i, sort, ungroup, _self.sortTimepoint, _self.unGroup)}</g>)
            }
        });
        let transform = "translate(0," + 20 + ")";
        return (
            <div className="rowOperators">
                <svg width={200} height={this.props.svgHeight}>
                    <g transform={transform}>
                        {headers}
                    </g>
                </svg>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Bin data"
                >
                    <ContinuousBinner variable={this.state.clickedVariable} timepointIndex={this.state.timepointIndex}
                                      followUpFunction={this.state.followUpFunction}
                                      close={this.closeModal} store={this.props.store} visMap={this.props.visMap}/>
                </Modal>
                <ContextMenus showSortContextMenu={this.props.showSortContextMenu}
                              showGroupContextMenu={this.props.showGroupContextMenu}
                              showPromoteContextMenu={this.props.showPromoteContextMenu} contextX={this.state.contextX}
                              contextY={this.state.contextY} clickedTimepoint={this.state.clickedTimepoint}
                              clickedVariable={this.state.clickedVariable}
                              store={this.props.store}/>
            </div>
        )
    }
});
export default RowOperators;
