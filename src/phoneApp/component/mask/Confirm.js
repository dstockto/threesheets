export default function MaskConfirm(props) {
    const {setMask} = props;

    const title = props.title || 'Confirm';
    const message = props.message || 'Are you sure?';
    const accept = props.accept || 'OK';
    const acceptFn = props.acceptFn || (() => {});
    const decline = props.decline || 'Cancel';

    return <div className="PhoneAppMaskPane">
        <div className="PhoneAppMaskPaneTitle">{title}</div>
        <div className="PhoneAppMaskPaneBody">{message}</div>
        <div className="PhoneAppMaskPaneFooter">
            <div className="PhoneAppCtrlRow">
                <div className="PhoneAppCtrlRowLeft">
                    <div className="PhoneAppButton PhoneAppTextButton"
                         onClick={() => setMask()}
                    >{decline}</div>
                </div>
                <div className="PhoneAppCtrlRowRight">
                    <div className="PhoneAppButton PhoneAppTextButton"
                         onClick={() => {
                             acceptFn();
                             setMask();
                         }}
                    >{accept}</div>
                </div>
            </div>
        </div>
    </div>;
}