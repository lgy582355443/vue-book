<template>
  <dialog-box :title="title" ref="dialog">
    <!-- 修改分组 -->
    <div class="dialog-list-wrapper" v-if="!ifNewGroup">
      <div v-for="(item, index) in categoryList" :key="index" @click="onGroupClick(item)">
        <div
          :class="[{'is-add': item.edit === 1},'dialog-list-item']"
          v-if="(item.edit === 2 && isInGroup) || item.edit !== 2 || !item.edit"
        >
          <div class="dialog-list-item-text">{{item.title}}</div>
          <div
            class="dialog-list-icon-wrapper"
            v-if="isInGroup && shelfCategory.shelf_id === item.shelf_id"
          >
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
    <!-- 新建分组 -->
    <div class="dialog-new-group-wrapper" v-else>
      <div class="dialog-input-title-wrapper">
        <span class="dialog-input-title">{{$t('shelf.groupName')}}</span>
      </div>
      <div class="dialog-input-wrapper">
        <div class="dialog-input-inner-wrapper">
          <input type="text" class="dialog-input" ref="dialogInput" v-model="newGroupName" />
          <div
            class="dialog-input-clear-wrapper"
            @click="clear"
            v-show="newGroupName && newGroupName.length > 0"
          >
            <span class="icon-close-circle-fill"></span>
          </div>
        </div>
      </div>
    </div>
    <div slot="btn" class="group-dialog-btn-wrapper">
      <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
      <div
        class="dialog-btn"
        @click="createNewGroup"
        :class="{'is-empty': newGroupName && newGroupName.length === 0}"
        v-if="ifNewGroup"
      >{{$t('shelf.confirm')}}</div>
    </div>
  </dialog-box>
</template>

<script>
import DialogBox from "../common/Dialog";
import { shelfMixin } from "@/mixins/shelf";
import { saveBookShelf } from "../../utils/localStorage";

export default {
  name: "ShelfDialog",
  mixins: [shelfMixin],
  components: {
    DialogBox
  },
  props: {
    showNewGroup: {
      type: Boolean,
      default: false
    },
    isEditGroup: {
      type: Boolean,
      default: false
    },
    groupName: String
  },
  data() {
    return {
      ifNewGroup: false,
      newGroupName: ""
    };
  },
  computed: {
    //是否在分组列表里
    isInGroup() {
      return this.currentType === 2;
    },
    defaultCategory() {
      return [
        {
          title: this.$t("shelf.newGroup"),
          edit: 1
        },
        {
          title: this.$t("shelf.groupOut"),
          edit: 2
        }
      ];
    },
    category() {
      return this.shelfList.filter(item => item.type === 2);
    },
    //组成group弹窗里显示的列表
    categoryList() {
      return [...this.defaultCategory, ...this.category];
    },

    title() {
      if (!this.ifNewGroup) {
        return this.$t("shelf.moveBook");
      } else {
        if (this.isEditGroup) {
          return this.$t("shelf.editGroupName");
        } else {
          return this.$t("shelf.newGroup");
        }
      }
    }
  },
  methods: {
    show() {
      this.ifNewGroup = this.showNewGroup;
      this.newGroupName = this.groupName;
      this.$refs.dialog.show();
    },

    hide() {
      this.$refs.dialog.hide();
      setTimeout(() => {
        this.ifNewGroup = false;
      }, 200);
    },

    onGroupClick(item) {
      if (item.edit && item.edit === 1) {
        //新建分组
        this.ifNewGroup = true;
      } else if (item.edit && item.edit === 2) {
        //移出分组
        this.moveOutFromGroup(item);
      } else {
        //移动到
        this.moveToGroup(item);
      }
    },

    clear() {
      this.newGroupName = "";
    },

    //移入分组，参数：分组对象
    moveToGroup(group) {
      this.setSelectedMoveToGroup(group).then(() => {
        this.onComplete();
        this.updataShelf();
        this.simpleToast(
          this.$t("shelf.moveBookInSuccess").replace("$1", group.title)
        );
      });
    },

    //移出分组
    moveOutFromGroup() {
      this.setSelectRemoveFromGroup().then(() => {
        this.onComplete();
        this.updataShelf();
        this.simpleToast(this.$t("shelf.moveBookOutSuccess"));
      });
    },

    //新建分组
    createNewGroup() {
      if (!this.newGroupName || this.newGroupName.length === 0) {
        return;
      }
      if (this.showNewGroup) {
        this.setChangeGroupName(this.newGroupName).then(() => {
          this.updataShelf();
          this.onComplete();
        });
      } else {
        if (this.shelfList.some(item => item.title == this.newGroupName)) {
          this.simpleToast(this.$t("shelf.sameName"));
          return;
        }
        const group = {
          shelf_id: this.shelfList[this.shelfList.length - 1].shelf_id + 1,
          itemList: [],
          selected: false,
          title: this.newGroupName,
          type: 2
        };
        this.setSelectedMoveToNewGroup(group).then(() => {
          this.updataShelf();
          this.onComplete();
        });
      }
    },

    onComplete() {
      this.hide();
      this.setIsEditMode(false);
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-list-wrapper {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 14px;
  @include scroll;
  .dialog-list-item {
    display: flex;
    padding: 15px 0;
    box-sizing: border-box;
    color: #666;
    &.is-add {
      color: $color-blue;
      &:active {
        color: $color-blue-transparent;
      }
    }
    &:active {
      color: rgba(102, 102, 102, 0.5);
    }
    .dialog-list-item-text {
      flex: 1;
    }
    .dialog-list-icon-wrapper {
      flex: 0 0 30px;
      color: $color-blue;
      @include right;
    }
  }
}

.dialog-new-group-wrapper {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  .dialog-input-title-wrapper {
    font-size: 10px;
    margin-top: 20px;
  }
  .dialog-input-wrapper {
    width: 100%;
    padding: 0 0 30px 0;
    box-sizing: border-box;
    .dialog-input-inner-wrapper {
      display: flex;
      width: 100%;
      padding: 10px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      color: #666;
      .dialog-input {
        flex: 1;
        border: none;
        &:focus {
          outline: none;
        }
      }
      .dialog-input-clear-wrapper {
        flex: 0 0 30px;
        color: #ccc;
        @include center;
        &:active {
          color: #999;
        }
      }
    }
  }
}

.group-dialog-btn-wrapper {
  width: 100%;
  @include center;
}

.dialog-btn {
  flex: 1;
  &.is-empty {
    color: rgba(255, 255, 255, 0.5);
  }
  &:active {
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
