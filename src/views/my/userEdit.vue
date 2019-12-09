<template>
  <div class="user-edit-main">
    <title-view :class="`${isShadow?'isShadow':''}`" :showBack="true" :label="$t('my.userData')"></title-view>
    <scroll :top="48" @onScroll="onScroll">
      <div class="edit-wrapper">
        <div class="user-avatar">
          <div class="avatar-img" :style="`background-image:url(${user.userInfo.avatar});`"></div>
          <div class="btn" @click="editAvatar" v-show="!isChangeAvatar">{{$t('my.changeAvatar')}}</div>
          <div class="input-wrapper avatar-wrapper" v-show="isChangeAvatar">
            <div class="edit-tite">{{$t('my.imgUrl')}}</div>
            <div class="right">
              <input
                class="edit-input avatar"
                type="text"
                v-model="user.userInfo.avatar"
                :placeholder="$t('my.pictureImageAddress')"
              />
              <div class="btn" @click="editAvatar">{{$t('my.confirm')}}</div>
            </div>
          </div>
        </div>
        <div class="input-wrapper nickname-wrapper">
          <div class="edit-tite">{{$t('my.nickname')}}</div>
          <input
            class="edit-input nickname"
            type="text"
            v-model="user.userInfo.nickname"
            :placeholder="$t('my.pictureNickname')"
          />
        </div>
        <div class="input-wrapper signature-wrapper">
          <div class="edit-tite">{{$t('my.signature')}}</div>
          <input
            class="edit-input signature"
            type="text"
            v-model="user.userInfo.signature"
            :placeholder="$t('my.pictureSignature')"
          />
        </div>
        <div class="submit" @click="submit">{{$t('my.submit')}}</div>
      </div>
    </scroll>
  </div>
</template>

<script>
import TitleView from "@/components/home/title";
import scroll from "@/components/common/Scroll";
import { getToken, setToken } from "../../utils/login";
import { userMixin } from "@/utils/mixin";
export default {
  name: "UserEdit",
  components: {
    TitleView,
    scroll
  },
  mixins: [userMixin],
  props: {},
  data() {
    return {
      isShadow: false,
      isChangeAvatar: false,
      user: {}
    };
  },
  watch: {},
  computed: {},
  methods: {
    onScroll(offsetY) {
      if (offsetY > 20) {
        this.showShadow();
      } else {
        this.hideShadow();
      }
    },

    showShadow() {
      this.isShadow = true;
    },

    hideShadow() {
      this.isShadow = false;
    },

    editAvatar() {
      this.isChangeAvatar = !this.isChangeAvatar;
    },

    submit() {
      setToken(this.user);
      let userList = this.userList.filter(
        item => item.username !== this.user.username
      );
      userList.push(this.user);
      this.setUserList(userList);
      this.simpleToast(this.$t("my.isEdit"));
    }
  },
  created() {
    this.user = getToken();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.user-edit-main {
  width: 100%;
  height: 100%;
  overflow: hidden;
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
        font-size: 16px;
        padding: 17px 0;
        color: rgb(245, 182, 81);
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
      }
      .right {
        flex: 0 0 70%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
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
::v-deep .label {
  flex: 0 0 60%;
}
</style>