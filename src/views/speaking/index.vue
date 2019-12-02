<!-- 听书组件 -->
<template>
  <div class="book-speaking">
    <detail-title @back="back" ref="title"></detail-title>
    <scroll
      class="content-wrapper"
      :top="42"
      :bottom="scrollBottom"
      :ifNoScroll="disableScroll"
      @onScroll="onScroll"
      ref="scroll"
    >
      <book-info :cover="cover" :title="title" :author="author" :desc="desc"></book-info>

      <div class="book-speak-title-wrapper">
        <div class="icon-speak-wrapper">
          <span class="icon-speak"></span>
        </div>
        <div class="speak-title-wrapper">
          <span class="speak-title">{{$t('speak.voice')}}</span>
        </div>
        <div class="icon-down-wrapper" @click="toggleContent">
          <span :class="{'icon-down2': !ifShowContent, 'icon-up': ifShowContent}"></span>
        </div>
      </div>

      <div class="book-detail-content-wrapper" v-show="ifShowContent">
        <div class="book-detail-content-list-wrapper">
          <div class="loading-text-wrapper" v-if="!this.navigation">
            <span class="loading-text">{{$t('detail.loading')}}</span>
          </div>
          <div class="book-detail-content-item-wrapper">
            <div
              class="book-detail-content-item"
              v-for="(item, index) in flatNavigation"
              :key="index"
              @click="speak(item, index)"
            >
              <speak-playing v-if="playingIndex === index" :number="5" ref="speakPlaying"></speak-playing>
              <div
                class="book-detail-content-navigation-text"
                :class="{'is-playing': playingIndex === index}"
                v-if="item.label"
              >{{item.label}}</div>
            </div>
          </div>
        </div>
      </div>

      <audio @canplay="onCanPlay" @timeupdate="onTimeUpdate" @ended="onAudioEnded" ref="audio"></audio>
    </scroll>
    <bottom
      :chapter="chapter"
      :currentSectionIndex="currentSectionIndex"
      :currentSectionTotal="currentSectionTotal"
      :showPlay="showPlay"
      :isPlaying.sync="isPlaying"
      :playInfo="playInfo"
      @onPlayingCardClick="onPlayingCardClick"
    ></bottom>
    <div class="book-wrapper">
      <div id="read"></div>
    </div>
    <speak-window
      :title="this.chapter ? this.chapter.label : ''"
      :book="book"
      :section="section"
      :currentSectionIndex.sync="currentSectionIndex"
      :currentSectionTotal="currentSectionTotal"
      :isPlaying.sync="isPlaying"
      :playInfo="playInfo"
      @updateText="updateText"
      ref="speakWindow"
    ></speak-window>
  </div>
</template>

<script>
import DetailTitle from "../../components/detail/detaiTitle";
import BookInfo from "../../components/detail/bookInfo";
import Scroll from "../../components/common/Scroll";
import SpeakPlaying from "../../components/speak/SpeakPlaying";
import Bottom from "../../components/speak/SpeakBottom";
import SpeakWindow from "../../components/speak/SpeakMask";
import { findBook, getCategoryName } from "../../utils/home";
import { flatListApi } from "../../api/home";
import { getLocalForage } from "../../utils/localForage";
import { realPx } from "../../utils/utils";
import Epub from "epubjs";

global.ePub = Epub;

export default {
  components: {
    DetailTitle,
    BookInfo,
    Scroll,
    SpeakPlaying,
    Bottom,
    SpeakWindow
  },
  computed: {
    // 音频当前播放的分钟数
    currentMinute() {
      const m = Math.floor(this.currentPlayingTime / 60);
      return m < 10 ? "0" + m : m;
    },
    // 音频当前播放的秒数
    currentSecond() {
      const s = Math.floor(
        this.currentPlayingTime - parseInt(this.currentMinute) * 60
      );
      return s < 10 ? "0" + s : s;
    },
    // 音频的总时长
    totalMinute() {
      const m = Math.floor(this.totalPlayingTime / 60);
      return m < 10 ? "0" + m : m;
    },
    // 音频的总秒数
    totalSecond() {
      const s = Math.floor(
        this.totalPlayingTime - parseInt(this.totalMinute) * 60
      );
      return s < 10 ? "0" + s : s;
    },
    // 音频的剩余分钟数
    leftMinute() {
      const m = Math.floor(
        (this.totalPlayingTime - this.currentPlayingTime) / 60
      );
      return m < 10 ? "0" + m : m;
    },
    // 音频的剩余秒数
    leftSecond() {
      const s = Math.floor(
        this.totalPlayingTime -
          this.currentPlayingTime -
          parseInt(this.leftMinute) * 60
      );
      return s < 10 ? "0" + s : s;
    },
    // 播放信息对象
    playInfo() {
      if (this.audioCanPlay) {
        return {
          currentMinute: this.currentMinute,
          currentSecond: this.currentSecond,
          totalMinute: this.totalMinute,
          totalSecond: this.totalSecond,
          leftMinute: this.leftMinute,
          leftSecond: this.leftSecond
        };
      } else {
        return null;
      }
    },
    // 电子书的语种
    lang() {
      return this.metadata ? this.metadata.language : "";
    },
    // 当播放面板显示时，禁用滚动条（解决事件穿透问题）
    disableScroll() {
      if (this.$refs.speakWindow) {
        return this.$refs.speakWindow.visible;
      } else {
        return false;
      }
    },
    // 是否底部的播放面板
    showPlay() {
      return this.playingIndex >= 0;
    },
    // 滚动条距底部距离，当显示播放面板时为116像素，不显示时为52像素
    scrollBottom() {
      return this.showPlay ? 70 : 10;
    },

    // 当前章节信息
    chapter() {
      return this.flatNavigation[this.playingIndex];
    },

    // 电子书摘要信息
    desc() {
      if (this.description) {
        return this.description.substring(0, 100);
      } else {
        return "";
      }
    },
    // 一维数组的目录
    flatNavigation() {
      if (this.navigation) {
        return Array.prototype.concat.apply(
          [],
          Array.prototype.concat.apply(
            [],
            this.doFlatNavigation(this.navigation.toc)
          )
        );
      } else {
        return [];
      }
    },
    // 电子书分类
    category() {
      return this.bookItem ? getCategoryName(this.bookItem.category) : "";
    },
    // 电子书书名
    title() {
      return this.metadata ? this.metadata.title : "";
    },
    // 电子书作者
    author() {
      return this.metadata ? this.metadata.creator : "";
    }
  },
  data() {
    return {
      bookItem: null,
      book: null,
      rendition: null,
      metadata: null,
      cover: null,
      navigation: null,
      description: null,
      ifShowContent: true,
      playingIndex: -1,
      paragraph: null,
      currentSectionIndex: null,
      currentSectionTotal: null,
      section: null,
      isPlaying: false,
      audio: null,
      audioCanPlay: false,
      currentPlayingTime: 0,
      totalPlayingTime: 0,
      playStatus: 0, // 0 - 未播放，1 - 播放中，2 - 暂停中
      toastText: "",
      isOnline: false
    };
  },
  methods: {
    // 在线语音合成
    createVoice(text) {
      const xmlhttp = new XMLHttpRequest();
      // 创建HTTP请求，同步接收结果
      xmlhttp.open(
        "GET",
        `${
          process.env.VUE_APP_VOICE_URL
        }/voice?text=${text}&lang=${this.lang.toLowerCase()}`,
        false
      );
      // 发送请求
      xmlhttp.send();
      // 获取响应内容
      const xmlDoc = xmlhttp.responseText;
      if (xmlDoc) {
        // 解析响应内容
        const json = JSON.parse(xmlDoc);
        if (json.path) {
          // path为语音合成生成的MP3文件下载路径，将该路径赋值audio.src
          // audio控件会自动加载音频文件
          this.$refs.audio.src = json.path;
          // 自动播放MP3
          this.continuePlay();
        } else {
          this.showToast("播放失败，未生成链接");
        }
      } else {
        this.showToast("播放失败");
      }
      /*
        axios.create({
          baseURL: process.env.VUE_APP_VOICE_URL + '/voice'
        })({
          method: 'get',
          params: {
            text: text,
            lang: this.lang.toLowerCase()
          }
        }).then(response => {
          if (response.status === 200) {
            if (response.data.error === 0) {
              const downloadUrl = response.data.path
              console.log('开始下载...%s', downloadUrl)
              downloadMp3(downloadUrl, blob => {
                const url = window.URL.createObjectURL(blob)
                console.log(blob, url)
                this.$refs.audio.src = url
                this.continuePlay()
              })
            } else {
              this.showToast(response.data.msg)
            }
          } else {
            this.showToast('请求失败')
          }
        }).catch(err => {
          console.log(err)
          this.showToast('播放失败')
        })
        */
    },
    // 切换播放状态，如果处于播放状态则暂停，如果处于暂停状态，则播放
    // 注意状态0和状态2是不通的
    // 状态0 表示还未播放，所以需要先进行语音合成
    // 状态2 表示已经合成，所以直接进行播放即可
    togglePlay() {
      if (!this.isPlaying) {
        if (this.playStatus === 0) {
          this.play();
        } else if (this.playStatus === 2) {
          this.continuePlay();
        }
      } else {
        this.pausePlay();
      }
    },

    // 生成语音合成的文本信息
    speak(item, index) {
      // 重置播放状态，停止一切播放
      this.resetPlay();
      //目录的索引
      this.playingIndex = index;
      this.$nextTick(() => {
        this.$refs.scroll.refresh();
        if (this.chapter) {
          // 获取当前点击的章节信息
          this.section = this.book.spine.get(this.chapter.href);
          // 渲染章节
          this.rendition.display(this.section.href).then(section => {
            // 获取当前位置对象
            const currentPage = this.rendition.currentLocation();
            const cfibase = section.cfiBase;
            const cfistart = currentPage.start.cfi
              .replace(/.*!/, "")
              .replace(/\)/, "");
            const cfiend = currentPage.end.cfi
              .replace(/.*!/, "")
              .replace(/\)/, "");
            this.currentSectionIndex = currentPage.start.displayed.page;
            this.currentSectionTotal = currentPage.start.displayed.total;
            // 合成cfi信息
            const cfi = `epubcfi(${cfibase}!,${cfistart},${cfiend})`;
            // console.log(currentPage, cfi, cfibase, cfistart, cfiend)
            // 通过Book.getRange(cfi)方法获取指定片段的cfi对应的文本
            this.book.getRange(cfi).then(range => {
              // 获取章节片段的文本信息
              let text = range.toLocaleString();
              // 对文本信息进行过滤，去除其中的空格（注意是2个空格，1个空格是合理的）、换行符等特殊字符
              text = text.replace(/\s(2,)/g, "");
              text = text.replace(/\r/g, "");
              text = text.replace(/\n/g, "");
              text = text.replace(/\t/g, "");
              text = text.replace(/\f/g, "");
              // 更新语音合成的文本信息
              this.updateText(text);
            });
          });
        }
      });
    },

    updateText(text) {
      this.paragraph = text;
    },

    // 从头开始语音合成并播放
    play() {
      this.createVoice(this.paragraph);
    },

    // 重置播放状态
    resetPlay() {
      if (this.playStatus === 1) {
        //暂停
        this.pausePlay();
      }
      this.isPlaying = false;
      this.playStatus = 0;
    },

    // 继续播放
    continuePlay() {
      this.$refs.audio.play().then(() => {
        // 显示播放动画
        this.$refs.speakPlaying[0].startAnimation();
        this.isPlaying = true;
        this.playStatus = 1;
      });
    },

    // 暂停播放
    pausePlay() {
      this.$refs.audio.pause();
      // 暂停播放动画
      this.$refs.speakPlaying[0].stopAnimation();
      this.isPlaying = false;
      this.playStatus = 2;
    },
    // 当播放结束时，刷新播放信息
    onAudioEnded() {
      this.resetPlay();
      this.currentPlayingTime = this.$refs.audio.currentTime;
      const percent = Math.floor(
        (this.currentPlayingTime / this.totalPlayingTime) * 100
      );
      this.$refs.speakWindow.refreshProgress(percent);
    },

    // 当播放进行时，刷新播放信息
    onTimeUpdate() {
      this.currentPlayingTime = this.$refs.audio.currentTime;
      const percent = Math.floor(
        (this.currentPlayingTime / this.totalPlayingTime) * 100
      );
      this.$refs.speakWindow.refreshProgress(percent);
    },

    // 调用audio.src时，audio控件会调用canplay事件
    // 此时可以获取总播放时长和当前播放时长
    onCanPlay() {
      this.audioCanPlay = true;
      this.currentPlayingTime = this.$refs.audio.currentTime;
      this.totalPlayingTime = this.$refs.audio.duration;
    },

    // 通过API找到当前电子书的详情数据
    findBookFromList(fileName) {
      flatListApi().then(response => {
        if (response.status === 200) {
          const bookList = response.data.data.filter(
            item => item.fileName === fileName
          );
          if (bookList && bookList.length > 0) {
            this.bookItem = bookList[0];
            console.log(this.bookItem, "详细信息");
            this.init();
          }
        }
      });
    },

    // 初始化参数信息
    init() {
      const fileName = this.$route.query.fileName;
      if (!this.bookItem) {
        this.bookItem = findBook(fileName);
      }
      if (this.bookItem) {
        // 如果电子书已经缓存，则直接从IndexedDB数据库中获取
        getLocalForage(fileName, (err, blob) => {
          if (err || !blob) {
            // 如果获取缓存失败，则拼接opf文件来获取电子书
            this.isOnline = true;
            const opf = this.$route.query.opf;
            if (opf) {
              this.parseBook(opf);
            }
          } else {
            this.isOnline = false;
            // 解析电子书
            this.parseBook(blob);
          }
        });
      } else {
        this.findBookFromList(fileName);
      }
    },
    // 解析电子书
    parseBook(blob) {
      // 解析电子书
      this.book = new Epub(blob);
      // 获取电子书的metadata
      this.book.loaded.metadata.then(metadata => {
        this.metadata = metadata;
      });
      // 如果是在线获取的电子书，则通过Book.coverUrl()方法获取封面链接
      if (this.isOnline) {
        this.book.coverUrl().then(url => {
          this.cover = url;
        });
      } else {
        // 如果是本地获取的电子书，通过Book.loaded.cover方法获取封面链接（加快封面获取速度）
        this.book.loaded.cover.then(cover => {
          this.book.archive.createUrl(cover).then(url => {
            this.cover = url;
          });
        });
      }
      // 获取电子书的目录信息
      this.book.loaded.navigation.then(nav => {
        this.navigation = nav;
      });
      // 渲染电子书
      this.display();
    },
    back() {
      this.$router.go(-1);
    },
    // 处理滚动条的事件，决定标题阴影是否展示
    onScroll(offsetY) {
      if (offsetY > realPx(42)) {
        this.$refs.title.showShadow();
      } else {
        this.$refs.title.hideShadow();
      }
    },

    //折叠播放目录
    toggleContent() {
      this.ifShowContent = !this.ifShowContent;
    },

    // 渲染电子书
    display() {
      const height =
        window.innerHeight * 0.9 -
        realPx(40) -
        realPx(54) -
        realPx(46) -
        realPx(48) -
        realPx(60) -
        realPx(44);
      this.rendition = this.book.renderTo("read", {
        width: window.innerWidth,
        height: height,
        method: "default"
      });
      this.rendition.display();
    },
    doFlatNavigation(content, deep = 1) {
      const arr = [];
      content.forEach(item => {
        item.deep = deep;
        arr.push(item);
        if (item.subitems && item.subitems.length > 0) {
          arr.push(this.doFlatNavigation(item.subitems, deep + 1));
        }
      });
      return arr;
    },
    showToast(text) {
      this.simpleToast(text);
    },
    onPlayingCardClick() {
      this.$refs.speakWindow.show();
    }
  },
  mounted() {
    this.init();
  }
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";

.book-speaking {
  font-size: 16px;
  width: 100%;
  background: white;
  .content-wrapper {
    width: 100%;
    .book-speak-title-wrapper {
      display: flex;
      padding: 15px;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      .icon-speak-wrapper {
        flex: 0 0 40px;
        @include left;
        .icon-speak {
          font-size: 24px;
          color: #999;
        }
      }
      .speak-title-wrapper {
        flex: 1;
        @include left;
        .speak-title {
          font-size: 16px;
          font-weight: bold;
          color: #666;
        }
      }
      .icon-down-wrapper {
        flex: 0 0 40px;
        @include right;
        .icon-up {
          font-size: 12px;
          color: #999;
        }
        .icon-down2 {
          font-size: 12px;
          color: #999;
        }
      }
    }
    .book-detail-content-wrapper {
      width: 100%;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      .book-detail-content-list-wrapper {
        padding: 10px 15px;
        .loading-text-wrapper {
          width: 100%;
          .loading-text {
            font-size: 14px;
            color: #999;
          }
        }
        .book-detail-content-item-wrapper {
          .book-detail-content-item {
            display: flex;
            padding: 15px 0;
            font-size: 14px;
            line-height: 16px;
            color: #333;
            border-bottom: 1px solid #eee;
            &:last-child {
              border-bottom: none;
            }
            .book-detail-content-navigation-text {
              flex: 1;
              width: 100%;
              @include ellipsis;
              &.is-playing {
                color: $color-blue;
                font-weight: bold;
                margin-left: 10px;
              }
            }
          }
        }
      }
    }
  }
  .book-wrapper {
    position: absolute;
    bottom: -100%;
    z-index: 100;
  }
}
</style>
