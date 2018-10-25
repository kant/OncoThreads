import React from 'react';
import {observer} from 'mobx-react';
import GlobalRowOperator from './GlobalRowOperator'

/*
implements the icons and their functionality on the left side of the plot
 */
const GlobalRowOperators = observer(class GlobalRowOperators extends React.Component {
        constructor() {
            super();
            this.state = {width: 100};
            this.updateDimensions = this.updateDimensions.bind(this);
        }


        /**
         * Add event listener
         */
        componentDidMount() {
            this.updateDimensions();
            window.addEventListener("resize", this.updateDimensions);
        }

        /**
         * Remove event listener
         */
        componentWillUnmount() {
            window.removeEventListener("resize", this.updateDimensions);
        }

        updateDimensions() {
            this.setState({
                width: this.refs.rowOperators.parentNode.clientWidth
            });
        }

        getSampleRowHeader() {
            let i;
            if (this.props.store.transitionOn) {
                i = 1;
            }
            else {
                i = 0;
            }
            const d = this.props.timepoints[i];
            return <GlobalRowOperator timepoint={d} width={this.state.width}
                                      height={this.props.store.variableStores.sample.currentVariables.length*20}
                               visMap={this.props.visMap} store={this.props.store}
                               showTooltip={this.props.showTooltip}
                               hideTooltip={this.props.hideTooltip}/>
        }

        getEventRowHeader() {
            let i;
            if (this.props.store.transitionOn) {
                i = 0;
                const d = this.props.timepoints[i];
                return <GlobalRowOperator timepoint={d} width={this.state.width}
                                          height={this.props.store.variableStores.between.getRelatedVariables("event").length*20}
                                          visMap={this.props.visMap} store={this.props.store}
                                          showTooltip={this.props.showTooltip}
                                          hideTooltip={this.props.hideTooltip}/>
            }
            else {
                return "-"
            }
        }

        render() {
            return (
                <div ref={"rowOperators"}>
                    <h5>Current timepoint variables</h5>
                    {this.getSampleRowHeader()}
                    <h5>Current events</h5>
                    {this.getEventRowHeader()}
                </div>
            )
        }
    }
    )
;
export default GlobalRowOperators;
