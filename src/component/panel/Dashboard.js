import PanelAddDrink from "./AddDrink";
import History from "./History";

import './Dashboard.css';
import {Component} from 'react';

export default class PanelDashboard extends Component {
    static getPropsFromState(baseProps, state) {
        return {
            goToComponent: baseProps.goToComponent,
            startSession: baseProps.startSession,
            stopSession: baseProps.stopSession,
            session: state.session
        };
    }

    render() {
        const {goToComponent, startSession, stopSession, session} = this.props;

        const currentSession = session.length > 0
            && !session[session.length - 1].complete
            ? session[session.length - 1]
            : null;

        return <div className="PhoneAppPanel">
            <div className="PhoneAppPanelNavBar PhoneAppCtrlRow">
                <div className="PhoneAppCtrlRowLeft">
                    <div className="PhoneAppButton PhoneAppTextButton"
                         onClick={() => goToComponent(History, 'left')}
                    >History</div>
                </div>
                <div className="PhoneAppCtrlRowCenter bold">Dashboard</div>
                <div className="PhoneAppCtrlRowRight" />
            </div>
            <div className="PhoneAppPanelBody PanelDashboard">
                {currentSession
                    ? <div>
                        <div className="PanelDashboardDrinks bold">{currentSession.drinks}</div>
                        <div className="PanelDashboardStats">
                            <div>Shots: <span className="bold">{currentSession.shots}</span></div>
                            <div>Beers: <span className="bold">{currentSession.beers}</span></div>
                            <div>Alcohol: <span className="bold">{currentSession.ounces.toFixed(2)}</span> fl oz</div>
                        </div>
                        <div className="PhoneAppButton PhoneAppTextButton"
                             onClick={() => goToComponent(PanelAddDrink, 'right')}
                        >Add Drink</div>
                    </div>
                    : <div className="PhoneAppButton PhoneAppTextButton"
                           onClick={startSession}
                    >Start Drinking!</div>
                }
            </div>
            {currentSession && <div className="PhoneAppPanelFooter PhoneAppCtrlRow">
                <div className="PhoneAppCtrlRowCenter">
                    <div className="PhoneAppButton PhoneAppTextButton"
                         onClick={stopSession}
                    >Stop Drinking</div>
                </div>
            </div>}
        </div>;
    }
}
