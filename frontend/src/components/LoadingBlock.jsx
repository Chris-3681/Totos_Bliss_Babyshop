import "./LoadingBlock.css";

function LoadingBlock({ text = "Loading..." }) {
  return (
    <div className="loading-block">
      <div className="spinner"></div>
      <p>{text}</p>
    </div>
  );
}

export default LoadingBlock;