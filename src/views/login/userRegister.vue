<template>
  <div class="register-main">
    <div class="title">{{$t('login.register')}}</div>
    <div class="input-list">
      <div class="form-item user-name-box">
        <input
          class="login-input userId"
          type="text"
          v-model="register.username"
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
          v-model="register.password"
          :placeholder="$t('login.picturePassword')"
        />
        <div class="icon-wrapper">
          <span class="icon icon-suo"></span>
        </div>
        <div class="eye" @click="openPassword">
          <span :class="`${isShow?' icon-eye':' icon-biyan'}`"></span>
        </div>
      </div>
      <!-- <input
        class="email-input input-item"
        v-model="register.email"
        type="text"
        placeholder="请输入邮箱"
      />
      <div class="phoneNumber">
        <div class="prefix">
          +86
          <div class="line"></div>
        </div>
        <input
          class="phone-input input-item"
          v-model="register.tel"
          type="text"
          placeholder="请输入手机号/邮箱"
        />
      </div>-->
    </div>

    <div class="submit" @click="doRegister">{{$t('login.doRegister')}}</div>
    <div class="userText">
      {{$t('login.registerMsg')}}
      <span class="blue">{{$t('login.protocol')}}</span>和
      <span class="blue">{{$t('login.privacy')}}</span>
    </div>
    <router-link class="goLogin" :to="{name:'login'}" tag="div">
      {{$t('login.goLogin')}}
      <span class="icon icon-you"></span>
    </router-link>
  </div>
</template>

<script>
import { userMixin } from "@/utils/mixin";
export default {
  name: "Register",
  mixins: [userMixin],
  components: {},
  props: {},
  data() {
    return {
      register: {
        username: "",
        password: "",
        userInfo: {
          nickname: "AuroraReader",
          avatar:require('../../assets/images/user/avatar.png'),
          signature: "Welcome to AuroraReader"
        }
      },
      isShow: false
    };
  },
  watch: {},
  created() {},
  mounted() {},
  computed: {},
  methods: {
    //显示密码
    openPassword() {
      this.isShow = !this.isShow;
    },
    //注册
    doRegister() {
      let userList = this.userList;
      const isExist = userList.find(
        item => item.username === this.register.username
      );
      if (!isExist) {
        userList.push(this.register);
        this.simpleToast(this.$t("login.registerSuccessfuly"));
        this.register = this.$options.data().register;
        setTimeout(() => {
          this.$router.push({
            name: "login"
          });
        }, 500);
      } else {
        this.simpleToast(this.$t("login.usernameEsist"));
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.register-main {
  height: 100%;
  width: 100%;
  overflow: hidden;
  .title {
    width: 270px;
    margin: 50px auto 40px;
    font-size: 30px;
    font-weight: bold;
    color: #409eff;
    text-align: left;
  }
  .input-list {
    position: relative;
    width: 100%;
    overflow: hidden;
    .form-item {
      position: relative;
      width: 260px;
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

    .phoneNumber {
      width: 100%;
      position: relative;
      //   .phone-input {
      //     display: block;
      //     width: 100%;
      //     height: 40px;
      //     text-indent: 60px;
      //     border: none;
      //     outline: none;
      //     border-radius: 7px;
      //     background-color: #e3dfda;
      //   }
      //   .prefix {
      //     position: absolute;
      //     left: 0;
      //     top: 1px;
      //     width: 50px;
      //     height: 40px;
      //     text-align: left;
      //     text-indent: 10px;
      //     line-height: 40px;
      //     border-radius: 7px 0 0 7px;
      //     // background: #e3dfda url(../../../assets/imgs/icons/xsjx.png) no-repeat
      //     //   35px center / 10px 10px;
      //     .line {
      //       float: right;
      //       width: 2.5px;
      //       height: 14px;
      //       margin-top: 13px;
      //       background-color: rgb(175, 175, 175);
      //     }
      //   }
    }
  }
  .submit {
    width: 70%;
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
  .userText {
    font-size: 13px;
    color: #a5a5a5;
    text-align: center;
    .blue {
      color: #409eff;
    }
  }
  .goLogin {
    margin-top: 30px;
    font-size: 18px;
    font-weight: bolder;
    text-align: center;
    color: #409eff;
    .icon-you {
      font-size: 18px;
      color: #409eff;
      vertical-align: bottom;
    }
  }
}
</style>