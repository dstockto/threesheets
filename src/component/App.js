import PhoneApp from "../phoneApp/component/PhoneApp";
import PanelDashboard from "./panel/Dashboard";
import PanelSettings from "./panel/Settings";
import Storage from "../phoneApp/service/storage";
import logo from "../phoneApp/img/3sheets_logo_small.png";

// import ButtonRender from "./ButtonRender";

export default class App extends PhoneApp {
    constructor(props) {
        super(props);

        const session = Storage.getItem('session', 'json', '[]');
        const currentSession = session.length > 0
            ? session[session.length - 1]
            : null;
        const sessionHistory = currentSession
            ? Storage.getItem('s' + currentSession.start, 'json', '[]')
            : [];

        this.state = {
            ...this.state,
            LayoutCenter: {
                ...this.state.LayoutCenter,
                component: PanelDashboard
            },
            session: session,
            history: sessionHistory
        };
    }

    getBaseProps() {
        const baseProps = super.getBaseProps();

        return {
            ...baseProps,
            startSession: () => this.startSession(),
            stopSession: () => this.stopSession(),
            clearHistory: () => this.clearHistory(),
            addShot: () => this.addShot(),
            addBeer: () => this.addBeer()
        };
    }

    startSession() {
        const {session} = this.state;

        session.push({
            start: new Date().getTime(),
            drinks: 0,
            shots: 0,
            beers: 0,
            ounces: 0,
            complete: false
        });

        Storage.setItem('session', JSON.stringify(session));
        this.setState({
            session:session.slice(),
            history: []
        });
    }

    stopSession() {
        const {session} = this.state;
        const currentSession = session[session.length - 1];

        if (currentSession.drinks === 0) {
            session.pop();
        } else {
            currentSession.complete = true;
        }

        if (session.length === 0) {
            Storage.removeItem('session');
        } else {
            Storage.setItem('session', JSON.stringify(session));
        }

        this.setState({session: session.slice()});
    }

    addShot() {
        const {session} = this.state;
        const currentSession = session[session.length - 1];

        currentSession.drinks ++;
        currentSession.shots ++;
        currentSession.ounces += 1.5 * 0.4;

        Storage.setItem('session', JSON.stringify(session));
        this.setState({session:session.slice()});

        this.addHistory(currentSession.ounces);
        this.goToComponent(PanelDashboard, 'left');
    }

    addBeer() {
        const {session} = this.state;
        const currentSession = session[session.length - 1];

        currentSession.drinks ++;
        currentSession.beers ++;
        currentSession.ounces += 12 * 0.087;

        Storage.setItem('session', JSON.stringify(session));
        this.setState({session:session.slice()});

        this.addHistory(currentSession.ounces);
        this.goToComponent(PanelDashboard, 'left');
    }

    clearHistory() {
        const {session} = this.state;

        let i = 0;
        while (i < session.length) {
            if (session[i].complete) {
                Storage.removeItem('s' + session[i].start);
                session.splice(i, 1);
                continue;
            }
            i ++;
        }

        if (session.length === 0) {
            Storage.removeItem('session');
        } else {
            Storage.setItem('session', JSON.stringify(session));
        }

        this.setState({session:session.slice()});

        if (session.length === 0) {
            this.setState({history:[]});
        }
    }

    addHistory(ounces) {
        const {session, history} = this.state;
        const currentSession = session[session.length - 1];

        history.push({
            date: new Date().getTime(),
            alcohol: ounces
        });

        Storage.setItem('s' + currentSession.start, JSON.stringify(history));
        this.setState({history:history.slice()});
    }

    render() {
        return <div className="PhoneApp">
            <div className="PhoneAppTitle bold">
                <div className="PhoneAppCtrlRow">
                    <div className="PhoneAppCtrlRowLeft">
                        <img src={logo}
                             alt="logo"
                             width="50"
                             height="50"
                             style={{verticalAlign:'middle',marginRight:'10px'}}
                        />
                        <span>3Sheets</span>
                    </div>
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
            {this.renderMask()}
            {/*<ButtonRender />*/}
        </div>;
    }
}