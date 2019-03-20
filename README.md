# react-scratch-card
一个基于react的刮刮卡组件。根据这篇博客（https://www.aliyue.net/752.html）的代码来修改的。

## 引用

```javascript
import ScratchCard from "react-scratch-card";
const data = {
  prizeStatus: true,
  prizeName: "三等奖"
};
 <ScratchCard
        prizeStatus={data.prizeStatus}
        prizeName={data.prizeName}
        onTapReceivePrize={this.onClick}
      />
```

## API

| 名称        | 类型    | 默认值 | 是否必填 | 注释                                     |
| ----------- | ------- | ------ | -------- | ---------------------------------------- |
| prizeStatus  | boolean   | false     | 否       | 是否中奖                           |
| prizeName | string   | ""    | 否       | 奖品名称 |
| onTapReceivePrize  | function | ()=>{}   | 否       | 中奖后点击领奖按钮的后续操作                   |


## 注意事项

因为设置了默认不中奖，所以全部的props都不会必填。。。

## ps
写的不好，有什么问题请提issue~~~
