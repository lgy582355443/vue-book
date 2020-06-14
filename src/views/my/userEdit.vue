<template>
  <div class="user-edit-main">
    <title-view :class="`${isShadow?'isShadow':''}`" :showBack="true" :label="$t('my.userData')"></title-view>
    <scroll :top="48" @onScroll="onScroll">
      <div class="edit-wrapper">
        <div class="user-avatar">
          <div
            class="avatar-img"
            :style="`background-image:url(${isChangeAvatar?changeAvatar:user.avatar});`"
          ></div>
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
import { getUserInfo, saveUserInfo } from "@/utils/localStorage";
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
      user: null,
      isChangeAvatar: false,
      changeAvatar: "", //临时保存头像地址
      EditForm: new FormData()
    };
  },
  watch: {},
  computed: {},
  methods: {
    onScroll(offsetY) {
      if (offsetY > 20) {
        this.isShadow = true;
      } else {
        this.isShadow = false;
      }
    },

    //修改头像
    getFile(event) {
      console.log(event);
      const userId = getUserInfo().id;
      const file = event.target.files[0]; //获取上传元素信息

      const fileExt = file.name.substring(file.name.lastIndexOf("."));
      //判断文件类型是否允许上传
      if (".jpg.jpeg.png.gif".indexOf(fileExt.toLowerCase()) === -1) {
        this.simpleToast(this.$t("my.updataExt"));
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        this.simpleToast(this.$t("my.updataFile"));
        return;
      }
      this.isChangeAvatar = true;
      //本地图片路径
      this.changeAvatar = window.URL.createObjectURL(file);
      event.preventDefault();
      this.EditForm.append("file", file);
    },

    //性别选择popup
    EditSex() {
      this.popupShow({ title: this.$t("my.popupSex"), btn: this.sexPopup() });
    },
    //性别选择popup构建数组
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
    },

    submit() {
      this.isChangeAvatar = true;
      //只保留文件名
      this.user.avatar = this.user.avatar.substring(
        this.user.avatar.lastIndexOf("/") + 1
      );
      this.EditForm.append("user", JSON.stringify(this.user));
      userUpdataApi(this.EditForm).then(res => {
        if (res.data.code == 0) {
          console.log(res);
          let user = res.data.data;
          this.user = user;
          saveUserInfo(user);
          this.isChangeAvatar = false;
          this.simpleToast(this.$t("my.isEdit"));
        } else {
          this.simpleToast(this.$t("my.EditFailed"));
        }
      });
    }
  },

  created() {
    this.user = getUserInfo();
    this.changeAvatar = this.user.avatar;
    console.log(this.user);
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
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