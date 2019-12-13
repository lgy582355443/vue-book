<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div
      class="flap-card-bg"
      :class="{'animation': runFlapCardAnimation}"
      v-show="runFlapCardAnimation"
    >
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
      <div class="point-wrapper">
        <div
          class="point"
          :class="{'animation': runPointAnimation}"
          v-for="(item, index) in pointList"
          :key="index"
        ></div>
      </div>
    </div>
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
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="goBookDetail(randomBook)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { StoreHomeMixin } from "@/mixins/home";
import { flapCardList, categoryText } from "../../utils/home";
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
      runBookCardAnimation: false
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
    for (let i = 0; i < 18; i++) {
      this.pointList.push("point" + i);
    }
  },
  mounted() {
  },
  methods: {
    categoryText() {
      if (this.data) {
        return categoryText(this.data.category, this);
      } else {
        return "";
      }
    },
    close() {
      this.setFlapCardVisible(false);
      this.stopFlapCardAnimation();
    },
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

    //判断左半边还是右半边
    rotate(index, type) {
      const item = this.flapCardList[index];
      let dom;
      //判断翻转方向,front 右半边,back, 左半边
      if (type == "front") {
        dom = this.$refs.right[index];
      } else {
        dom = this.$refs.left[index];
      }
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`;
      dom.style.backgroundColor = `rgb(${item.r},${item._g},${item.b})`;
    },

    //初始化,旋转之前左半圆与右半圆重叠
    prepare() {
      const backFlapCard = this.flapCardList[this.back];
      backFlapCard.rotateDegree = 180;
      backFlapCard._g = backFlapCard.g - 5 * 9;
      this.rotate(this.back, "back");
    },

    //翻转过程
    flapCardRotate() {
      const frontFlapCard = this.flapCardList[this.front];
      const backFlapCard = this.flapCardList[this.back];
      //正面每次旋转增加10度,反面每次减少10度
      frontFlapCard.rotateDegree += 10;
      frontFlapCard._g -= 5;
      backFlapCard.rotateDegree -= 10;

      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5;
      }
      //当正面翻转到90度时,增加下一张左半边的z-index值,使下一张位于上一张上面显示;
      if (frontFlapCard.rotateDegree == 90 && backFlapCard.rotateDegree == 90) {
        backFlapCard.zIndex += 2;
      }
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      if (frontFlapCard.rotateDegree == 180 && backFlapCard.rotateDegree == 0) {
        this.next();
      }
    },

    //当翻转一次完成后,上一次翻转的又回到原位,除了z-index不变
    next() {
      const frontFlapCard = this.flapCardList[this.front];
      const backFlapCard = this.flapCardList[this.back];
      frontFlapCard.rotateDegree = 0;
      backFlapCard.rotateDegree = 0;
      frontFlapCard._g = frontFlapCard.g;
      backFlapCard._g = backFlapCard.g;
      this.rotate(this.front, "front");
      this.rotate(this.back, "back");
      this.front++;
      this.back++;
      const length = this.flapCardList.length;
      if (this.front >= length) {
        this.front = 0;
      }
      if (this.back >= length) {
        this.back = 0;
      }
      //动态设置zIndex
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

    //设定时器翻转动画
    startFlapCardAnimation() {
      this.prepare();
      this.task = setInterval(() => {
        this.flapCardRotate();
      }, this.intervalTime);
    },

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
      this.reset();
    },

    //重置翻转卡片
    reset() {
      this.front = 0;
      this.back = 1;
      this.flapCardList.map((item, index) => {
        item.zIndex = 100 - index;
        item._g = item.g;
        item.rotateDegree = 0;
        this.rotate(index, "front");
        this.rotate(index, "back");
      });
      this.runBookCardAnimation = false;
      this.runFlapCardAnimation = false;
      this.runPointAnimation = false;
    },

    startPointAnimation() {
      this.runPointAnimation = true;
    },

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
@import "../../assets/styles/global.scss";
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
    // height: 70%;
    box-sizing: border-box;
    border-radius: px2rem(15);
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
      width: 100%;
      height: 100%;
      margin-bottom: px2rem(30);
      @include columnTop;
      .img-wrapper {
        width: 100%;
        margin-top: px2rem(20);
        @include center;
        .img {
          width: px2rem(90);
          height: px2rem(130);
        }
      }
      .content-wrapper {
        padding: 0 px2rem(20);
        margin-top: px2rem(20);
        .title {
          color: #333;
          font-weight: bold;
          font-size: px2rem(18);
          line-height: px2rem(20);
          max-height: px2rem(40);
          text-align: center;
          @include ellipsis2(2);
        }
        .author {
          margin-top: px2rem(10);
          text-align: center;
        }
        .category {
          color: #999;
          font-size: px2rem(14);
          margin-top: px2rem(10);
          text-align: center;
        }
      }
      .read-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1100;
        width: 100%;
        border-radius: 0 0 px2rem(15) px2rem(15);
        padding: px2rem(15) 0;
        text-align: center;
        color: white;
        font-size: px2rem(14);
        background: $color-blue;
      }
    }
  }
}
</style>