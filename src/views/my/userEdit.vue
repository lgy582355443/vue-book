<template>
  <div class="user-edit-main">
    <title-view :class="`${isShadow?'isShadow':''}`" :showBack="true" :label="$t('my.userData')"></title-view>
    <scroll :top="48" @onScroll="onScroll">
      <div class="edit-wrapper">
        <div class="user-avatar">
          <div class="avatar-img" :style="`background-image:url(${user.avatar});`"></div>
          <div class="btn">
            <div class="btn-text">{{$t('my.changeAvatar')}}</div>
            <input class="updata-btn" type="file" accept="image/*" @change="getFile($event)" />
          </div>
        </div>
        <div class="input-wrapper nickname-wrapper">
          <div class="edit-tite">{{$t('my.nickname')}}</div>
          <input
            class="edit-input nickname"
            type="text"
            v-model="user.nickname"
            :placeholder="$t('my.pictureNickname')"
          />
        </div>
        <div class="input-wrapper nickname-wrapper">
          <div class="edit-tite">{{$t('my.sex')}}</div>
          <div class="edit-input sex" @click="EditSex">{{user.sex}}</div>
        </div>
        <div class="input-wrapper signature-wrapper">
          <div class="edit-tite">{{$t('my.signature')}}</div>
          <input
            class="edit-input signature"
            type="text"
            v-model="user.slogan"
            :placeholder="$t('my.pictureSignature')"
          />
        </div>
        <div class="submit" @click="submit">{{$t('my.submit')}}</div>
      </div>
    </scroll>
  </div>
</template>

<script>
import axios from "axios";
import TitleView from "@/components/home/title";
import scroll from "@/components/common/Scroll";
import {
  getUserInfo,
  saveUserInfo,
} from "@/utils/localStorage";
import { userUpdataApi, changeAvatarApi } from "@/api/user";
export default {
  name: "UserEdit",
  components: {
    TitleView,
    scroll
  },
  props: {},
  data() {
    return {
      isShadow: false,
      user: {
        avatar: require("../../assets/images/user/avatar.png")
      }
    };
  },
  watch: {},
  computed: {
    sexPopup() {
      return [
        {
          text: "男",
          click: () => {
            this.user.sex = "男";
            this.popupHide();
          }
        },
        {
          text: "女",
          click: () => {
            this.user.sex = "女";
            this.popupHide();
          }
        }
      ];
    }
  },
  methods: {
    onScroll(offsetY) {
      if (offsetY > 20) {
        this.isShadow = true;
      } else {
        this.isShadow = false;
      }
    },

    changeAvatar() {
      this.getFile(event);
    },

    //修改头像
    getFile(event) {
      console.log(event);
      const userId = getUserInfo().id;
      this.file = event.target.files[0]; //获取上传元素信息
      // avatar = window.URL.createObjectURL(this.file);
      event.preventDefault();
      // 只能通过formData方式来传输文件;
      let formData = new FormData();
      formData.append("file", this.file);

      changeAvatarApi(userId, formData).then(res => {
        if (res.data.code == 0) {
          console.log(res);
          this.user.avatar = res.data.fileUrl;
          saveUserInfo(this.user);
        }
      });
    },

    EditSex() {
      this.popupShow(this.$t("my.popupSex"), this.sexPopup);
    },

    submit() {
      delete this.user.loginTime;
      //只保留文件名
      this.user.avatar = this.user.avatar.substring(
        this.user.avatar.lastIndexOf("/") + 1
      );
      userUpdataApi(this.user).then(res => {
        if (res.data.code == 0) {
          console.log(res);
          let user = res.data.data;
          this.user = user;
          saveUserInfo(user);
          this.simpleToast(this.$t("my.isEdit"));
        } else {
          this.simpleToast(this.$t("my.EditFailed"));
        }
      });
    }
  },
  created() {
    this.user = getUserInfo();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.user-edit-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  ::v-deep .label {
    flex: 0 0 60%;
  }
  .edit-wrapper {
    box-sizing: border-box;
    padding: 10px 20px;
    width: 100%;
    .user-avatar {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
      //   background: linear-gradient(35deg, #64b6e6, #9198e5);
      width: 100%;
      .avatar-img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        border: 3px solid #fff;
      }
      .btn {
        position: relative;
        width: 70px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        overflow: hidden;
        font-size: 16px;
        color: rgb(245, 182, 81);
        .btn-text {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 20;
        }
        .updata-btn {
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          z-index: 30;
        }
      }
    }
    .input-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      width: 100%;
      margin: 10px 0;
      .edit-tite {
        font-size: 16px;
      }
      .edit-input {
        flex: 0 0 70%;
        display: block;
        height: 100%;
        text-indent: 10px;
        background: #f5f3f0;
        border: none;
        outline: none;
        border-radius: 7px;
        &::placeholder {
          font-size: 12px;
          color: #9f9f9f;
        }
        &.sex {
          display: flex;
          align-items: center;
        }
      }
    }
    .submit {
      width: 80%;
      height: 40px;
      margin: 30px auto 10px;
      font-size: 16px;
      text-align: center;
      line-height: 40px;
      color: #ffffff;
      background: #409eff;
      border-radius: 7px;
      letter-spacing: 3px;
    }
  }
}
</style>