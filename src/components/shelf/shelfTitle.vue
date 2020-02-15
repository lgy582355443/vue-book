<template>
  <transition name="fade">
    <div class="shelf-title" :class="{'hide-shadow':ifHideShadow}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left clear-cache" v-if="showClear">
        <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-left back" v-if="showBack">
        <span class="icon-back" @click="back"></span>
      </div>
      <div class="shelf-title-btn-wrapper shelf-title-right" @click="onEditClick" v-show="showEdit">
        <span class="shelf-title-btn-text">{{isEditMode?$t('shelf.cancel'):$t('shelf.edit')}}</span>
      </div>
      <div
        class="shelf-title-btn-wrapper"
        :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}"
        @click="changeGroup"
        v-if="showChangeGroup"
      >
        <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
      </div>
    </div>
  </transition>
</template>

<script>
import { shelfMixin } from "@/mixins/shelf";
import { removeLocalStorage, saveBookShelf } from "../../utils/localStorage";
import { clearLocalForage } from "../../utils/localForage";
export default {
  name: "ShelfTitle",
  mixins: [shelfMixin],
  components: {},
  props: {
    title: String
  },
  data() {
    return {
      ifHideShadow: true
    };
  },
  watch: {
    offsetY(offsetY) {
      if (offsetY > 0) {
        this.ifHideShadow = false;
      } else {
        this.ifHideShadow = true;
      }
    }
  },
  computed: {
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
    selectedText() {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0;
      if (selectedNumber == 0) {
        return this.$t("shelf.selectBook");
      } else {
        if (selectedNumber == 1) {
          return this.$t("shelf.haveSelectedBooks").replace(
            "$1",
            selectedNumber
          );
        } else {
          return this.$t("shelf.haveSelectedBooks").replace(
            "$1",
            selectedNumber
          );
        }
      }
    },

    popupCancelBtn() {
      return this.createPopupBtn(this.$t("shelf.cancel"), () => {
        this.hidePopup();
      });
    }
  },
  methods: {
    onEditClick() {
      if (!this.isEditMode) {
        this.setShelfSelected([]);
        this.shelfList.forEach(item => {
          item.selected = false;
          if (item.itemList) {
            item.itemList.forEach(subItem => {
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

    //创建-修改分组popup
    changeGroup() {
      this.popupMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t("shelf.editGroupName"), () => {
            this.changeGroupName();
          }),
          this.createPopupBtn(
            this.$t("shelf.deleteGroup"),
            () => {
              this.showDeleteGroup();
            },
            "danger"
          ),
          this.popupCancelBtn
        ]
      }).show();
    },

    //删除分组
    deleteGroup() {
      this.setDeleteGroup(this.shelfCategory).then(() => {
        this.setIsEditMode(false);
        this.updataShelf();
        this.$router.go(-1);
      });
    },

    //更改分组名弹窗
    changeGroupName() {
      this.hidePopup();
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title,
        isEditGroup: true
      }).show();
    },

    //删除分组时的popup警示，是否确认删除
    showDeleteGroup() {
      this.hidePopup();
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t("shelf.deleteGroupTitle"),
          btn: [
            this.createPopupBtn(
              this.$t("shelf.confirm"),
              () => {
                this.deleteGroup();
              },
              "danger"
            ),
            this.popupCancelBtn
          ]
        }).show();
      }, 200);
    },

    hidePopup() {
      this.popupMenu.hide();
    },

    //用于创建popup里单个按钮需要的参数和事件
    createPopupBtn(text, onClick, type = "normal") {
      return {
        text: text,
        click: onClick,
        type: type
      };
    },

    back() {
      this.$router.go(-1);
      this.setIsEditMode(false);
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/styles/global.scss";
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