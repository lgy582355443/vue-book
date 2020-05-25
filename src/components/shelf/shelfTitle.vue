<template>
  <transition name="fade">
    <div
      :class="[{ 'hide-shadow': ifHideShadow }, 'shelf-title']"
      v-show="shelfTitleVisible"
    >
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{ title }}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{
          selectedText
        }}</span>
      </div>
      <div
        class="shelf-title-btn-wrapper shelf-title-left clear-cache"
        v-if="showClear"
      >
        <span class="shelf-title-btn-text" @click="clearCache">{{
          $t("shelf.clearCache")
        }}</span>
      </div>
      <div
        class="shelf-title-btn-wrapper shelf-title-left back"
        v-if="showBack"
      >
        <span class="icon-back" @click="back"></span>
      </div>
      <div
        class="shelf-title-btn-wrapper shelf-title-right"
        @click="onEditClick"
        v-show="showEdit"
      >
        <span class="shelf-title-btn-text">{{
          isEditMode ? $t("shelf.cancel") : $t("shelf.edit")
        }}</span>
      </div>

      <!-- 当分组里没有书籍 -->
      <div
        :class="[
          { 'shelf-title-left': changeGroupLeft },
          { 'shelf-title-right': changeGroupRight },
          'shelf-title-btn-wrapper',
        ]"
        @click="changeGroup"
        v-if="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{ $t("shelf.editGroup") }}</span>
      </div>
    </div>
  </transition>
</template>

<script>
// import ShelfMixin from "@/mixins/shelf";
import { removeLocalStorage, saveBookShelf,getUserInfo } from "../../utils/localStorage";
import { clearLocalForage } from "../../utils/localForage";
import { mapGetters, mapActions } from "vuex";
import { getShelfApi, updataShelfApi } from "@/api/shelf";
export default {
  name: "ShelfTitle",
  // mixins: [ShelfMixin],
  props: {
    title: String,
  },
  data() {
    return {
      ifHideShadow: true,
    };
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false;
      } else {
        this.ifHideShadow = true;
      }
    },
  },
  computed: {
    ...mapGetters([
      "isEditMode",
      "shelfList",
      "shelfSelected",
      "shelfTitleVisible",
      "offsetY",
      "shelfCategory",
      "currentType",
    ]),
    //分组里的书籍列表(itemList)是否为空,空为true
    emptyCategory() {
      return (
        !this.shelfCategory ||
        !this.shelfCategory.itemList ||
        this.shelfCategory.itemList.length === 0
      );
    },
    showEdit() {
      return this.currentType === 1 || !this.emptyCategory;
    },
    showClear() {
      return this.currentType === 1;
    },
    showBack() {
      return this.currentType === 2 && !this.isEditMode;
    },
    showChangeGroup() {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory);
    },
    //分组里不为空时,修改分组在左边
    changeGroupLeft() {
      return !this.emptyCategory;
    },
    //分组里为空时,修改分组在右边
    changeGroupRight() {
      return this.emptyCategory;
    },

    //选择书籍时标题栏，提示选中书籍数量
    selectedText() {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0;
      if (selectedNumber == 0) {
        return this.$t("shelf.selectBook");
      } else {
        return this.$t("shelf.haveSelectedBooks").replace("$1", selectedNumber);
      }
    },

    // popup取消按钮
    popupCancelBtn() {
      return {
        text: this.$t("shelf.cancel"),
        click: this.popupHide,
      };
    },
  },
  methods: {
    ...mapActions([
      "setIsEditMode",
      "setShelfList",
      "setShelfSelected",
      "setDeleteGroup",
    ]),
    //点击编辑
    onEditClick() {
      if (!this.isEditMode) {
        this.setShelfSelected([]);
        this.shelfList.forEach((item) => {
          item.selected = false;
          if (item.itemList) {
            item.itemList.forEach((subItem) => {
              subItem.selected = false;
            });
          }
        });
      }
      this.setIsEditMode(!this.isEditMode);
    },

    //清空缓存
    clearCache() {
      removeLocalStorage("shelf");
      clearLocalForage();
      this.setShelfSelected([]);
      this.setShelfList([]);
      this.getShelfList();
      this.simpleToast(this.$t("shelf.clearCacheSuccess"));
    },

    //修改分组popup
    changeGroup() {
      // utils文件夹里，create-api插件，自动生成组件
      this.popupShow({
        btn: [
          {
            text: this.$t("shelf.editGroupName"),
            click: this._changeGroupName,
          },
          {
            text: this.$t("shelf.deleteGroup"),
            type: "danger",
            click: this._showDeleteGroup,
          },
          this.popupCancelBtn,
        ],
      });
    },

    //更改分组名弹窗
    _changeGroupName() {
      this.popupHide();
      this.shelfDialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title,
        isEditGroup: true,
      }).show();
    },

    //删除分组操作
    _deleteGroup() {
      this.setDeleteGroup(this.shelfCategory).then(() => {
        this.setIsEditMode(false);
        this.updataShelf();
        this.$router.go(-1);
      });
    },

    //删除分组时的popup警示，是否确认删除
    _showDeleteGroup() {
      this.popupHide();
      setTimeout(() => {
        this.popupShow({
          title: this.$t("shelf.deleteGroupTitle"),
          btn: [
            {
              text: this.$t("shelf.confirm"),
              type: "danger",
              click: this._deleteGroup,
            },
            this.popupCancelBtn,
          ],
        });
      }, 200);
    },

    //返回
    back() {
      this.$router.go(-1);
      this.setIsEditMode(false);
    },
    getShelfIdList(arr) {
      let updataArr = [];
      arr.forEach((item, index) => {
        if (item.type == 1) {
          updataArr.push({
            id: item.id,
            shelf_id: item.shelf_id,
            private: item.private,
            haveRead: item.haveRead,
            type: item.type,
          });
        } else if (item.type == 2) {
          updataArr.push({
            shelf_id: item.shelf_id,
            type: item.type,
            title: item.title,
          });
          updataArr[index].itemList = [];
          item.itemList.forEach((itemc) => {
            updataArr[index].itemList.push({
              id: itemc.id,
              shelf_id: itemc.shelf_id,
              private: itemc.private,
              haveRead: itemc.haveRead,
              type: itemc.type,
            });
          });
        } else {
          return;
        }
      });
      return updataArr;
    },

    //更新数据库书架信息
    updataShelf() {
      const user = getUserInfo();
      if (user && user !== {}) {
        const params = {
          userId: user.id,
          shelfList: JSON.stringify(this.getShelfIdList(this.shelfList)),
        };
        updataShelfApi(params);
        saveBookShelf(this.shelfList);
      } else {
        this.$router.push({
          name: "login",
        });
      }
    },

    //获取书架列表
    getShelfList(cb) {
      const user = getUserInfo();
      if (user && user !== {}) {
        getShelfApi({
          userId: user.id,
        }).then((res) => {
          if (res.status === 200 && res.data && res.data.shelfList) {
            console.log("shelfList", res.data.shelfList);
            saveBookShelf(res.data.shelfList);
            this.setShelfList(res.data.shelfList);
            if (cb) {
              cb();
            }
            return res.data.shelfList;
          }
        });
      } else {
        this.$router.push({
          name: "login",
        });
      }
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="scss" scoped>
.shelf-title {
  position: relative;
  z-index: 130;
  width: 100%;
  height: 42px;
  background: #fff;
  box-shadow: 0 0px 5px #cccc;
  &.hide-shadow {
    box-shadow: none;
  }
  .shelf-title-text-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 42px;
    @include columnCenter;
    .shelf-title-text {
      font-style: 16px;
      line-height: 20px;
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text {
      font-size: 10px;
      color: #333;
    }
  }
  .shelf-title-btn-wrapper {
    position: absolute;
    top: 0;
    z-index: 115;
    padding-right: 16.5px;
    box-sizing: border-box;
    height: 100%;
    @include center;
    &.shelf-title-left {
      left: 15px;
      &.clear-cache {
        left: 15px;
      }
      &.back {
        left: 5px;
        padding: 0;
        .icon-back {
          font-size: 20px;
          color: #666;
        }
      }
    }
    &.shelf-title-right {
      right: 15px;
    }
    .shelf-title-btn-text {
      font-size: 14px;
      color: #666;
    }
  }
}
</style>
