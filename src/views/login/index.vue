<template>
  <div class="login-main">
    <div class="container">
      <div class="title">{{$t('login.login')}}</div>
      <div class="login-form">
        <div class="form-item user-name-box">
          <input
            class="login-input userId"
            type="text"
            v-model="login.userName"
            :placeholder="$t('login.pictureUsername')"
          />
          <div class="icon-wrapper">
            <span class="icon icon-zhanghao"></span>
          </div>
        </div>
        <div class="form-item password-box">
          <input
            class="login-input userPassword"
            :type="`${isShow?'text':'password'}`"
            v-model="login.password"
            :placeholder="$t('login.picturePassword')"
          />
          <div class="icon-wrapper">
            <span class="icon icon-suo"></span>
          </div>
          <div class="eye" @click="openPassword">
            <span :class="`${isShow?' icon-eye':' icon-biyan'}`"></span>
          </div>
        </div>
        <div class="login-btn" @click="doLogin">{{$t('login.login')}}</div>
        <div class="guide">
          <div class="guide-item">{{$t('login.forgetPassword')}}</div>
        </div>
      </div>
      <router-link class="register" :to="{name:'register'}" tag="div">{{$t('login.goRegister')}}</router-link>
      <router-link class="gobick" :to="{name:'home'}" tag="div">
        <span class="icon-back"></span>
        {{$t('login.goHome')}}
      </router-link>
      <div class="third">
        <div class="line"></div>
        {{$t('login.ThirdPartyLogin')}}
        <div class="line"></div>
      </div>
      <div class="icon-list">
        <div class="icon-item qq">
          <span class="icon icon-qqq"></span>
        </div>
        <div class="icon-item wb">
          <span class="icon icon-wb"></span>
        </div>
        <div class="icon-item wx">
          <span class="icon icon-wxx"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveUserInfo } from "../../utils/localStorage";
import { loginApi } from "@/api/user";
export default {
  name: "Login",
  components: {},
  props: {},
  data() {
    return {
      login: {
        userName: "admin",
        password: "123"
      },
      message: "",
      messageShow: false,
      isShow: false
    };
  },
  watch: {},
  computed: {},
  methods: {
    //登录
    doLogin() {
      loginApi(this.login).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          let user = res.data.data;
          saveUserInfo(user);
          this.login = this.$options.data().login;
          this.$router.go(-1);
        } else {
          this.simpleToast(this.$t("login.loginError"));
        }
      });
    },
    //显示密码
    openPassword() {
      this.isShow = !this.isShow;
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
.login-main {
  height: 100%;
  .container {
    width: 100%;
    .title {
      width: 270px;
      margin: 50px auto 40px;
      font-size: 30px;
      font-weight: bold;
      color: #409eff;
      text-align: left;
      font-family: PingFangSC-Semibold;
    }
    .gobick {
      text-align: center;
      margin: 20px 0;
      font-size: 20px;
      color: #9f9f9f;
      .icon-back {
        vertical-align: bottom;
      }
    }
    .head-photo {
      display: block;
      width: 100px;
      height: 100px;
      margin: 50px auto 70px;
      border-radius: 50%;
    }
    .login-form {
      position: relative;
      width: 100%;
      overflow: hidden;
      .form-item {
        position: relative;
        width: 70%;
        height: 40px;
        margin: 20px auto;
        .icon-wrapper {
          position: absolute;
          left: 5px;
          top: 10px;
          font-size: 20px;
        }
      }
      .login-input {
        display: block;
        width: 100%;
        height: 100%;
        text-indent: 30px;
        background: #f5f3f0;
        border: none;
        outline: none;
        border-radius: 7px;
        &::placeholder {
          font-size: 12px;
          color: #9f9f9f;
        }
      }
      .password-box {
        .eye {
          position: absolute;
          right: 10px;
          top: 10px;
          font-size: 20px;
        }
      }
      .login-btn {
        width: 70%;
        height: 40px;
        margin: 0 auto;
        font-size: 18px;
        line-height: 40px;
        text-align: center;
        letter-spacing: 5px;
        background: #409eff;
        border-radius: 7px;
        color: white;
      }
      .guide {
        display: flex;
        width: 260px;
        margin: 10px auto;
        justify-content: space-between;
        align-items: center;
        .guide-item {
          font-size: 12px;
          color: #a5a5a5;
        }
      }
    }
    .register {
      margin-top: 80px;
      font-size: 20px;
      text-align: center;
      font-weight: bold;
      color: #409eff;
    }
    .third {
      display: flex;
      margin: 20px 0;
      height: 20px;
      font-size: 12px;
      color: #a5a5a5;

      justify-content: center;
      align-items: center;
      .line {
        width: 50px;
        height: 1px;
        margin: 30px;
        background-color: #dddddd;
      }
    }
    .icon-list {
      display: flex;
      justify-content: center;
      align-items: center;
      .icon-item {
        width: 30px;
        height: 30px;
        margin: 0 15px;
        font-size: 30px;
        &.qq {
          color: #8a8a8a;
        }
        &.wb {
          color: #8a8a8a;
        }
        &.wx {
          color: #8a8a8a;
        }
      }
    }
  }
}
</style>