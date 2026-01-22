import React from "react";

const Loading = ({ LoadingText }) => {
  return (
    <div className="loaderBG">
      <div>
        <div className="loader"></div>
        <p className="LoadingText">{LoadingText}</p>
      </div>
    </div>
  );
};

export default Loading;
