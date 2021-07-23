import {Component} from "react";

export default class Panel extends Component {
    static getPropsFromState(baseProps, state) {
        return {};
    }

    render() {
        return <div className="AppPanel">panel</div>;
    }
}