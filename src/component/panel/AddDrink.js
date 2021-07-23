import PanelDashboard from "./Dashboard";

import './AddDrink.css';
import {Component} from 'react';

export default class PanelAddDrink extends Component {
    static getPropsFromState(baseProps, state) {
        return {
            goToComponent: baseProps.goToComponent,
            addShot: baseProps.addShot,
            addBeer: baseProps.addBeer
        };
    }

    render() {
        const {goToComponent, addShot, addBeer} = this.props;

        return <div className="PhoneAppPanel">
            <div className="PhoneAppPanelNavBar PhoneAppCtrlRow">
                <div className="PhoneAppCtrlRowLeft">
                    <div className="PhoneAppButton PhoneAppIconButton IconBack"
                         onClick={() => goToComponent(PanelDashboard, 'left')}
                    />
                </div>
                <div className="PhoneAppCtrlRowCenter bold">Add Drink</div>
                <div className="PhoneAppCtrlRowRight" />
            </div>
            <div className="PhoneAppPanelBody PanelAddDrink">
                <div>
                    <div className="PanelAddDrinkCtrl">
                        <div className="PhoneAppButton PhoneAppTextButton"
                             onClick={() => addShot()}
                        >Add A Shot</div>
                    </div>
                    <div className="PanelAddDrinkCtrl">
                        <div className="PhoneAppButton PhoneAppTextButton"
                             onClick={() => addBeer()}
                        >Add A Beer</div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
