import {Component} from "react";
import PanelSettings from "../../component/panel/Settings";
import {version} from '../../../package.json';

import '../Ui.css';
import './PhoneApp.css';

export default class PhoneApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            layoutId: 0,
            LayoutLeft: {component:null, position:'-100%'},
            LayoutCenter: {component:null, position:0},
            LayoutRight: {component:null, position:'100%'},
            mask: null
        };

        this.transitionDirection = null;
        this.previousComponent = null;
    }

    getBaseProps() {
        return {
            goToComponent: (component, direction) => this.goToComponent(component, direction),
            goToPreviousComponent: direction => this.goToPreviousComponent(direction),
            setMask: mask => this.setMask(mask)
        };
    }

    goToPreviousComponent(direction) {
        if (!this.previousComponent) {
            return;
        }

        this.goToComponent(this.previousComponent, direction);
        this.previousComponent = null;
    }

    goToComponent(component, direction) {
        const {LayoutCenter} = this.state;

        if (component === LayoutCenter.component) {
            return;
        }

        switch (direction) {
            case 'left':
                this.setState({
                    LayoutLeft: {
                        component: component,
                        position: 0
                    },
                    LayoutCenter: {
                        component: this.state.LayoutCenter.component,
                        position: '100%'
                    }
                });
                break;

            case 'right':
                this.setState({
                    LayoutRight: {
                        component: component,
                        position: 0
                    },
                    LayoutCenter: {
                        component: this.state.LayoutCenter.component,
                        position: '-100%'
                    }
                });
                break;

            default:
                return;
        }

        this.transitionDirection = direction;

        if (component === PanelSettings) {
            this.previousComponent = LayoutCenter.component;
        }
    }

    endGoToComponent() {
        switch (this.transitionDirection) {
            case 'left':
                this.setState({
                    layoutId: this.state.layoutId + 1,
                    LayoutLeft: {
                        component: null,
                        position: '-100%'
                    },
                    LayoutCenter: {
                        component: this.state.LayoutLeft.component,
                        position: 0
                    }
                });
                break;

            case 'right':
                this.setState({
                    layoutId: this.state.layoutId + 1,
                    LayoutRight: {
                        component: null,
                        position: '100%'
                    },
                    LayoutCenter: {
                        component: this.state.LayoutRight.component,
                        position: 0
                    }
                });
                break;

            default:
                break;
        }

        this.transitionDirection = null;
    }

    setMask(mask) {
        this.setState({mask:mask || null});
    }

    renderBody() {
        const {
            layoutId,
            LayoutLeft,
            LayoutCenter,
            LayoutRight
        } = this.state;

        const LeftComponent = LayoutLeft.component;
        const CenterComponent = LayoutCenter.component;
        const RightComponent = LayoutRight.component;
        const baseProps = this.getBaseProps();

        return <div className="PhoneAppBody">
            <div key={layoutId + 'L'}
                 className="PhoneAppLayout"
                 style={{left:LayoutLeft.position}}
            >
                {LeftComponent && <LeftComponent {...LeftComponent.getPropsFromState(baseProps, this.state)} />}
            </div>
            <div key={layoutId + 'C'}
                 className="PhoneAppLayout PhoneAppLayoutCenter"
                 style={{left:LayoutCenter.position}}
                 onTransitionEnd={() => this.endGoToComponent()}
            >
                <CenterComponent {...CenterComponent.getPropsFromState(baseProps, this.state)} />
            </div>
            <div key={layoutId + 'R'}
                 className="PhoneAppLayout PhoneAppLayoutRight"
                 style={{left:LayoutRight.position}}
            >
                {RightComponent && <RightComponent {...RightComponent.getPropsFromState(baseProps, this.state)} />}
            </div>
        </div>;
    }

    renderMask() {
        const {mask} = this.state;

        return mask
            ? <div className="PhoneAppMask">{mask}</div>
            : null;
    }

    render() {
        return <div className="PhoneApp">
            <div className="PhoneAppTitle bold">
                <div className="PhoneAppCtrlRow">
                    <div className="PhoneAppCtrlRowLeft">Phone App {version}</div>
                    <div className="PhoneAppCtrlRowRight">
                        <div className="PhoneAppButton PhoneAppIconButton IconHamburger"
                             onClick={() => {
                                 if (this.previousComponent) {
                                     this.goToPreviousComponent('left');
                                 } else {
                                     this.goToComponent(PanelSettings, 'right');
                                 }
                             }}
                        />
                    </div>
                </div>
            </div>
            {this.renderBody()}
            <div className="PhoneAppFooter">Phone App Footer</div>
            {this.renderMask()}
        </div>;
    }
}
