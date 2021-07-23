import MaskConfirm from "../../phoneApp/component/mask/MaskConfirm";
import {Component} from 'react';

export default class PanelSettings extends Component {
    static getPropsFromState(baseProps, state) {
        return {
            clearHistory: baseProps.clearHistory,
            setMask: baseProps.setMask,
            session: state.session
        };
    }

    render() {
        const {clearHistory, setMask, session} = this.props;
        const canClearHistory = session.length > 1 || (session.length === 1 && session[0].complete);

        return <div className="PhoneAppPanel">
            <div className="PhoneAppPanelNavBar PhoneAppCtrlRow">
                <div className="PhoneAppCtrlRowLeft" />
                <div className="PhoneAppCtrlRowCenter bold">Settings</div>
                <div className="PhoneAppCtrlRowRight" />
            </div>
            <div className="PhoneAppPanelBody PanelSettings">
                <div>
                    <div className={'PhoneAppButton PhoneAppTextButton' + (canClearHistory ? '' : ' Disabled')}
                         // onClick={canClearHistory ? () => clearHistory() : null}
                         onClick={canClearHistory
                             ? () => setMask(
                                 <MaskConfirm title="Clear History!"
                                              message="Are you sure you want to delete all history?"
                                              accept="Delete"
                                              acceptFn={() => clearHistory()}
                                              setMask={setMask}
                                 />
                             )
                             : null
                         }
                    >Clear History</div>
                </div>
            </div>
        </div>;
    }
}
