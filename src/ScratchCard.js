import React from "react";
import PropTypes from "prop-types";

import "./ScratchCard.scss";

function eventJudge(event) {
  if (event.cancelable) {
    // 判断默认行为是否已经被禁用
    if (!event.defaultPrevented) {
      event.preventDefault();
    }
  }
}

class ScratchCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userMouseDown: false,
      isHalf: 0,
      scratchCard: null,
      ctx: null,
      fontem: null
    };
  }
  componentDidMount() {
    let scratchCard = this.canvas; //画布
    scratchCard.width = scratchCard.clientWidth;
    scratchCard.height = scratchCard.clientHeight;
    let ctx = scratchCard.getContext("2d"); //画笔

    let fontem = parseInt(
      window.getComputedStyle(document.documentElement, null)["font-size"]
    ); //这是为了不同分辨率上配合@media自动调节刮的宽度

    this.setState(
      {
        scratchCard: scratchCard,
        ctx,
        fontem
      },
      () => {
        this.initCanvas();
      }
    );
  }
  initCanvas = () => {
    const { ctx, scratchCard } = this.state;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#aaa";
    ctx.fillRect(0, 0, scratchCard.clientWidth, scratchCard.clientHeight);
    ctx.fill();
    ctx.font = "Bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "#999999";
    ctx.fillText("刮开有奖哦~", scratchCard.width / 2, 80);
    //有些老的手机自带浏览器不支持destination-out,下面的代码中有修复的方法
    ctx.globalCompositeOperation = "destination-out";
  };
  //鼠标按下
  onMouseDown = event => {
    eventJudge(event);
    this.setState({
      userMouseDown: true
    });
  };
  //鼠标抬起
  onMouseUp = event => {
    eventJudge(event);
    const { ctx, scratchCard } = this.state;
    //获取canvas数据
    let canvasData = ctx.getImageData(
      0,
      0,
      scratchCard.width,
      scratchCard.height
    );
    let half = 0;
    for (let i = 3; i < canvasData.data.length; i += 4) {
      if (canvasData.data[i] === 0) {
        half++;
      }
    }
    //刮开区域大于一半时，开始处理结果
    if (half >= canvasData.data.length / 8) {
      this.setState({
        isHalf: 1
      });
    }
    this.setState({
      userMouseDown: false
    });
  };

  onMouseMove = event => {
    eventJudge(event);
    const { userMouseDown, scratchCard, ctx, fontem, isHalf } = this.state;
    if (userMouseDown) {
      if (event.changedTouches) {
        event = event.changedTouches[event.changedTouches.length - 1];
      }
      let topY = document.getElementById("top").offsetTop;
      let oX = scratchCard.offsetLeft,
        oY = scratchCard.offsetTop + topY;
      let x =
          (event.clientX + document.body.scrollLeft || event.pageX) - oX || 0,
        y = (event.clientY + document.body.scrollTop || event.pageY) - oY || 0;
      //画360度的弧线，就是一个圆，因为设置了ctx.globalCompositeOperation = 'destination-out';
      //画出来是透明的
      ctx.beginPath();
      ctx.arc(x, y, fontem * 1.2, 0, Math.PI * 2, true);

      //下面3行代码是为了修复部分手机浏览器不支持destination-out
      scratchCard.style.display = "none";
      scratchCard.offsetHeight;
      scratchCard.style.display = "inherit";
      ctx.fill();
    }
    if (isHalf) {
      const prize = this.prize;
      prize.style.zIndex = "3";
    }
  };
  //再来一次
  onTapOnceMore = prizeStatus => {
    if (!prizeStatus) {
      this.prize.style.zIndex = "0";
      this.setState({
        isHalf: 0
      });
      this.initCanvas();
    } else {
      this.props.onTapReceivePrize && this.props.onTapReceivePrize();
    }
  };
  render() {
    const { prizeStatus, prizeName } = this.props;
    return (
      <div className="scratch-card" id="top">
        <div className="scratch-card_info">
          <p className="prompt">
            {prizeName && prizeStatus ? (
              <span>
                恭喜获得<em>{prizeName}</em>!
              </span>
            ) : (
              "未中奖"
            )}
          </p>
          <a
            role="button"
            className="btn"
            ref={prize => (this.prize = prize)}
            onClick={() => {
              this.onTapOnceMore(prizeStatus);
            }}
          >
            {prizeStatus ? "领取奖品" : "再来一次"}
          </a>
        </div>
        <canvas
          id="scratchCard"
          className="canvas"
          ref={canvas => (this.canvas = canvas)}
          onTouchEnd={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onTouchStart={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onTouchMove={this.onMouseMove}
          onMouseMove={this.onMouseMove}
        />
      </div>
    );
  }
}
/**
 * @param {boolean} prizeStatus - 中奖状态.
 * @param {string} prizeName - 奖品名称
 * @param {function} onTapReceivePrize - 中奖后要执行的操作
 */
ScratchCard.prototypes = {
  prizeStatus: PropTypes.bool,
  prizeName: PropTypes.string,
  onTapReceivePrize: PropTypes.func
};
ScratchCard.defaultProps = {
  prizeStatus: false,
  prizeName: "",
  onTapReceivePrize: () => {}
};
export default ScratchCard;
