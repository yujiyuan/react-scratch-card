import React, { Component } from "react";
import { render } from "react-dom";
import ScratchCard from "../../src";

//这里偷懒一下就不去弄接口的数据了。。。

const data = {
  prizeStatus: true,
  prizeName: "三等奖"
};
class App extends Component {
  onClick = () => {
    alert("中奖啦，好开心~~~");
  };
  render() {
    return (
      <ScratchCard
        prizeStatus={data.prizeStatus}
        prizeName={data.prizeName}
        onTapReceivePrize={this.onClick}
      />
    );
  }
}

render(<App />, document.getElementById("root"));
