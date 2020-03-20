<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <!-- 翻转动画 -->
    <div
      class="flap-card-bg"
      :class="{'animation': runFlapCardAnimation}"
      v-show="runFlapCardAnimation"
    >
      <!-- 动画卡片 -->
      <div
        class="flap-card"
        v-for="(item, index) in flapCardList"
        :key="index"
        :style="{zIndex: item.zIndex}"
      >
        <div class="flap-card-semi-circle">
          <div class="flap-card-semi-circle-left" :style="semiCricelStyle(item, 'left')" ref="left"></div>
          <div
            class="flap-card-semi-circle-right"
            :style="semiCricelStyle(item, 'right')"
            ref="right"
          ></div>
        </div>
      </div>
      <!-- 动画的烟花小圆点 -->
      <div class="point-wrapper">
        <div
          class="point"
          :class="{'animation': runPointAnimation}"
          v-for="(item, index) in pointList"
          :key="index"
        ></div>
      </div>
    </div>

    <!-- 动画结束后弹出书籍 -->
    <div
      class="book-card"
      :class="{'animation': runBookCardAnimation}"
      v-show="runBookCardAnimation"
    >
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="randomBook?randomBook.cover:''" />
        </div>
        <div class="content-wrapper">
          <div class="title">{{randomBook?randomBook.title:''}}</div>
          <div class="author sub-title-medium">{{randomBook?randomBook.author:''}}</div>
        </div>
        <div class="read-btn" @click.stop="goBookDetail(randomBook)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <!-- 关闭按钮 -->
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { StoreHomeMixin } from "@/mixins/home";
import { flapCardList } from "../../utils/home";
export default {
  name: "FlapCard",
  components: {},
  props: {
    randomBook: Object
  },
  mixins: [StoreHomeMixin],
  data() {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 20,
      runFlapCardAnimation: false,
      pointList: [],
      runPointAnimation: false,
      runBookCardAnimation: false,
      task: null,
      time1: null,
      time2: null
    };
  },
  watch: {
    flapCardVisible(v) {
      if (v) {
        this.runAnimation();
      }
    }
  },
  computed: {},
  created() {
    //生成小圆点烟花
    for (let i = 0; i < 18; i++) {
      this.pointList.push("point" + i);
    }
  },
  mounted() {},
  methods: {
    //关闭书籍随机推荐
    close() {
      this.setFlapCardVisible(false);
      this.stopFlapCardAnimation();
    },
    //跳转书籍详情页
    goBookDetail(book) {
      this.showBookDetail(book);
      this.close();
    },
    //半圆样式
    semiCricelStyle(item, direction) {
      return {
        backgroundColor: `rgb(${item.r} ,${item.g} ,${item.b})`,
        backgroundImage: direction === "left" ? item.imgLeft : item.imgRight,
        backgroundSize: item.backgroundSize
      };
    },

    //卡片翻转的方法
    _rotate(index, type) {
      const item = this.flapCardList[index];
      let dom;
      //获取Dom,front右半边,back左半边
      if (type == "front") {
        dom = this.$refs.right[index];
      } else {
        dom = this.$refs.left[index];
      }
      //更改旋转角度和颜色(_g)
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`;
    },

    //动画前的初始化, 旋转之前第二层的左半圆先转到180度，与第一层右半圆重叠
    prepare() {
      const backFlapCard = this.flapCardList[this.back];
      backFlapCard.rotateDegree = 180;
      backFlapCard._g = backFlapCard.g - 5 * 9;
      this._rotate(this.back, "back");
    },

    //翻转过程
    flapCardRotate() {
      const frontFlapCard = this.flapCardList[this.front];
      const backFlapCard = this.flapCardList[this.back];
      //正面每次旋转增加10度,反面每次减少10度
      frontFlapCard.rotateDegree += 10;
      frontFlapCard._g -= 5;
      backFlapCard.rotateDegree += 10;

      if (backFlapCard.rotateDegree > 270) {
        backFlapCard._g += 5;
      }
      //当正面翻转到90度时,增加下一张左半边(背面)的z-index值,使下一张位于上一张上面显示;
      if (
        frontFlapCard.rotateDegree == 90 &&
        backFlapCard.rotateDegree == 270
      ) {
        backFlapCard.zIndex += 2;
      }
      this._rotate(this.front, "front");
      this._rotate(this.back, "back");
      // 当正面翻转180度，背面翻转360度，一轮动画完成
      if (
        frontFlapCard.rotateDegree == 180 &&
        backFlapCard.rotateDegree == 360
      ) {
        this.next();
      }
    },

    //当完成一次翻转动画，又重新归位，除了Z-index，为下一轮动画准备
    next() {
      const frontFlapCard = this.flapCardList[this.front];
      const backFlapCard = this.flapCardList[this.back];
      frontFlapCard.rotateDegree = 0;
      backFlapCard.rotateDegree = 0;
      frontFlapCard._g = frontFlapCard.g;
      backFlapCard._g = backFlapCard.g;
      this._rotate(this.front, "front");
      this._rotate(this.back, "back");
      //进行下一层卡片动画的准备
      this.front++;
      this.back++;
      const length = this.flapCardList.length;
      if (this.front >= length) {
        this.front = 0;
      }
      if (this.back >= length) {
        this.back = 0;
      }
      //动态设置zIndex，形成循环
      //100->96
      //99->100
      //98->99
      //97->98
      //96->97
      this.flapCardList.map((item, index) => {
        item.zIndex = 100 - ((index - this.front + length) % length);
      });
      this.prepare();
    },

    //把卡片以及flapCardList,还原为最初值
    _reset() {
      this.front = 0;
      this.back = 1;
      this.flapCardList.map((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g;
        item.rotateDegree = 0;
        this._rotate(index, "front");
        this._rotate(index, "back");
      });
      this.runBookCardAnimation = false;
      this.runFlapCardAnimation = false;
      this.runPointAnimation = false;
    },

    //设定时器翻转动画
    startFlapCardAnimation() {
      this.prepare();
      this.task = setInterval(() => {
        this.flapCardRotate();
      }, this.intervalTime);
    },

    //停止动画方法
    stopFlapCardAnimation() {
      if (this.task) {
        clearInterval(this.task);
      }
      if (this.time1) {
        clearTimeout(this.time1);
      }
      if (this.time2) {
        clearTimeout(this.time2);
      }
      this._reset();
    },

    //显示烟花效果
    startPointAnimation() {
      this.runPointAnimation = true;
    },

    //执行动画操作
    runAnimation() {
      this.time1 = setTimeout(() => {
        this.runFlapCardAnimation = true;
        this.startFlapCardAnimation();
        this.startPointAnimation();
      }, 300);
      this.time2 = setTimeout(() => {
        this.stopFlapCardAnimation();
        this.runBookCardAnimation = true;
      }, 2500);
    }
  }
};
</script>
<style lang="scss" scoped>
.flap-card-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  @include center;
  .close-btn-wrapper {
    position: absolute;
    left: 0;
    bottom: 30px;
    z-index: 910;
    width: 100%;
    @include center;
    .icon-close {
      width: 45px;
      height: 45px;
      font-size: 25px;
      border-radius: 50%;
      background-color: #333;
      color: #fff;
      @include center;
    }
  }
  .flap-card-bg {
    position: relative;
    width: 64px;
    height: 64px;
    background: white;
    border-radius: 5px;
    transform: scale(0);
    opacity: 0;
    &.animation {
      animation: scale 0.3s ease-in both;
    }
    @keyframes scale {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      70% {
        transform: scale(1.3);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-card {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      z-index: 1500;
      width: 48px;
      height: 48px;
      .flap-card-semi-circle {
        width: 100%;
        height: 100%;
        display: flex;
        .flap-card-semi-circle-left {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-color: #ffc666;
          background-repeat: no-repeat;
          background-position: center right;
          border-radius: 24px 0 0 24px;
          transform-origin: right;
          // 转动到背面时不显示
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-right {
          flex: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          background-position: center left;
          border-radius: 0 24px 24px 0;
          transform-origin: left;
          backface-visibility: hidden;
        }
      }
    }
    .point-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2000;
      @include absCenter;
      .point {
        @include absCenter;
        z-index: 3000;
        border-radius: 50%;
        transform: scale(0);
        &.animation {
          @for $i from 1 to length($moves) + 1 {
            &:nth-child(#{$i}) {
              @include move($i);
            }
          }
        }
      }
    }
  }
  .book-card {
    position: relative;
    width: 65%;
    box-sizing: border-box;
    border-radius: 15px;
    background: white;
    &.animation {
      animation: scale 0.3s ease-in both;
      @keyframes scale {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
    .book-card-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: 20px;
        @include center;
        .img {
          width: 90px;
          height: 130px;
        }
      }
      .content-wrapper {
        padding: 0 20px;
        margin-top: 20px;
        .title {
          color: #333;
          font-weight: bold;
          font-size: 18px;
          line-height: 20px;
          max-height: 40px;
          text-align: center;
          @include ellipsis2(2);
        }
        .author {
          margin-top: 10px;
          text-align: center;
        }
        .category {
          color: #999;
          font-size: 14px;
          margin-top: 10px;
          text-align: center;
        }
      }
      .read-btn {
        width: 100%;
        border-radius: 0 0 15px 15px;
        padding: 15px 0;
        text-align: center;
        color: white;
        font-size: 14px;
        background: $color-blue;
      }
    }
  }
}
</style>