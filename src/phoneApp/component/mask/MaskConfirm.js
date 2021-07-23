const MaskConfirm = (
  {
    setMask,
    title = 'Confirm',
    message = 'Are you sure?',
    accept = 'OK',
    acceptFn = () => {
    },
    decline = 'Cancel'
  }) => {
  return (
    <div className="PhoneAppMaskPane">
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
    </div>
  );
};

export default MaskConfirm;
