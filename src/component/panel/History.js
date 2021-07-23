import React from "react";
import Panel from "../../phoneApp/component/Panel";
import PanelDashboard from "./Dashboard";
import SessionGraph from "../SessionGraph";
import Storage from "../../phoneApp/service/storage";

import './History.css';

export default class PanelHistory extends Panel {
    static getPropsFromState(baseProps, state) {
        return {
            goToComponent: baseProps.goToComponent,
            session: state.session,
            history: state.history
        };
    }

    render() {
        const {goToComponent, session, history} = this.props;
        const sessionDisplay = session.slice().reverse();
        const hasHistory = session.length > 1
            || (session.length === 1 && history.length > 0);

        return <div className="PhoneAppPanel">
            <div className="PhoneAppPanelNavBar PhoneAppCtrlRow">
                <div className="PhoneAppCtrlRowLeft" />
                <div className="PhoneAppCtrlRowCenter bold">History</div>
                <div className="PhoneAppCtrlRowRight">
                    <div className="PhoneAppButton PhoneAppIconButton IconForward"
                         onClick={() => goToComponent(PanelDashboard, 'right')}
                    />
                </div>
            </div>
            <div className={'PhoneAppPanelBody' + (hasHistory ? ' PanelHistory' : '')}>
                <div>
                    {!hasHistory &&
                        <span>No Data Available</span>
                    }
                    {hasHistory &&
                        sessionDisplay.map((s, ix) => {
                            const historyDisplay = ix === 0 && !s.complete
                                ? history
                                : Storage.getItem('s' + s.start, 'json', '[]');

                            return historyDisplay.length === 0
                                ? null
                                : <SessionGraph key={'s' + s.start}
                                                session={s}
                                                history={historyDisplay}
                                />;
                        })
                    }
                </div>
            </div>
        </div>;
    }
}