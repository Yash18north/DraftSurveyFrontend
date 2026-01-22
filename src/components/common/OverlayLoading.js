import React from "react";

const Loading = ({fullScreen}) => {
  return (
    <div className={"overlayLoaderBG " + (fullScreen && "fullScreen_overlayLoaderBG") }>
      <div className="overlayLoader"></div>
    </div>
  );
};

export default Loading;