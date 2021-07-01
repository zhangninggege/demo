<template>
  <div class="shopping-container" >
    <ul class="goods-list">
      <li class="goods" v-for="(item, index) in data" :key="index" ref="goods">
        <div class="good-img">
          <img :src="item.list[0].img" alt="" />
        </div>
        <div class="title">
          <h4>{{ item.name }}</h4>
          <div class="color">
            <span
              v-for="(child, cindex) in item.list"
              :key="child.id"
              :class="{ selected: child.selected }"
              @click="changeColor(item, child, index, cindex)"
              >{{ child.color }}</span
            >
          </div>
        </div>
        <div class="price">{{ item.list[0].price }}</div>
        <div class="count">
          <span @click="item.count === 1 ? 0 : item.count--">-</span>
          <span class="number">{{ item.count }}</span>
          <span @click="item.count++">+</span>
        </div>
        <button @click="addShopping(item, index)">加入购物车</button>
      </li>
    </ul>
    <div class="cut">
      <span>已选中商品:</span>
      <span>应付总额：{{shopData=== [] ? 0 : shopData.reduce((a,b)=>{return a+b.total},0)}}</span>
    </div>
    <ul class="shopping-list">
      <li class="shopping" v-for="(item,index) in shopData" :key="item.img">
        <div class="img">
          <img :src="item.img" alt="" />
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="color">{{ item.color }}</div>
        <div class="count">{{ item.count }}</div>
        <div class="total">{{ item.total }}</div>
        <button @click="handleDelete(index)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script>
import ajax from "@/ajax";
export default {
  data() {
    return {
      data: [],
      shopData: JSON.parse(localStorage.getItem('shopcart')),
    };
  },
  created() {
    this.getGoodsList()
    window.addEventListener('storage',this.handleStorage)
  },
  beforeDestroy(){
    window.removeEventListener('storage',this.handleStorage)
  },
  methods: {
    changeColor(item, child, index, cindex) {
      if (child.selected) {
        this.$refs.goods[index].children[0].children[0].src = item.list[0].img;
        this.$refs.goods[index].children[2].innerText = item.list[0].price;
        child.selected = !child.selected;
      } else {
        this.resetData(index, cindex);
        this.$refs.goods[index].children[0].children[0].src = child.img;
        this.$refs.goods[index].children[2].innerText = child.price;
      }
    },
    getGoodsList(){
      const _this = this;
    ajax("shoppingData.json", function (data) {
      _this.data = data.map((item) => {
        return {
          name: item.name,
          count: 1,
          list: item.list.map((i) => {
            return {
              ...i,
              selected: false,
            };
          }),
        };
      });
    });
    },
    resetData(index, cindex) {
      const item = (this.data[index] = {
        name: this.data[index].name,
        count: this.data[index].count,
        list: this.data[index].list.map((i, iIndex) => {
          return {
            ...i,
            selected: cindex === iIndex,
          };
        }),
      });
      this.data.splice(index, 1, item);
    },
    addShopping(item, index) {
      if (
        !this.$refs.goods[index].children[1].children[1].querySelector(
          "span.selected"
        )
      ) {
        alert("请选择颜色");
        return;
      } else {
        const addData = {
          img: this.$refs.goods[index].children[0].children[0].src,
          name: item.name,
          color:
            this.$refs.goods[index].children[1].children[1].querySelector(
              "span.selected"
            ).innerText,
          count: item.count,
          time: new Date().getTime(),
          total: item.count * this.$refs.goods[index].children[2].innerText,
        };
        this.shopData.push(addData);
        localStorage.setItem('shopcart',JSON.stringify(this.shopData.sort((b,a)=>{
          return a.time -b.time;
        })))
        this.getGoodsList()
      }
    },
    handleDelete(index){
       
      this.shopData.splice(index,1)
      localStorage.setItem('shopcart',JSON.stringify(this.shopData))
    },
    handleStorage(){
     this.shopData = JSON.parse(localStorage.getItem('shopcart'))
    }
  },
};
</script>

<style lang='less' scoped>
.shopping-container {
  margin: 100px auto;
  width: 80%;
  height: 100%;
  .goods-list {
    list-style: none;
    width: 100%;
    margin: 0 ;
    padding: 0;
    .goods {
      border: 1px solid #ccc;
      border-right: transparent;
      border-left: transparent;
      list-style: none;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0;
      .good-img {
        width: 80px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .title {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 250px;
        span {
          display: inline-block;
          width: 30px;
          height: 10px;
          border: 1px solid #ccc;
          margin-right: 5px;
          padding: 3px 5px;
          font-size: 6px;
          color: #ccc;
          cursor: pointer;
          line-height: 10px;
          border-radius: 3px;
          &.selected {
            border: 2px solid lightslategray;
            background: url(/images/ico_02.gif) no-repeat right bottom;
          }
        }
      }
      .price {
        color: red;
      }
      .count {
        display: flex;
        width: 80px;
        height: 15px;
        border: 1px solid #ccc;
        justify-content: space-around;
        align-items: center;
        text-align: center;
        border-radius: 3px;
        color: #aaa;
        .number {
          border: 1px solid #ccc;
          height: 100%;
          padding: 0 18px;
          font-weight: bold;
          color: #000;
        }
        span {
          text-align: center;
          cursor: pointer;
        }
      }
      button {
        height: 40px;
        width: 100px;
        background-color: #f40;
        color: #fff;
        border: none;
      }
    }
  }
  .cut{
    margin: 20px auto;
    width: 100%;
    height: 40px;
    background-color: #aaa;
    color: #000;
    line-height: 40px;
    display: flex;
    justify-content: space-around;
  }
  .shopping-list {
    list-style: none;
    width: 100%;
    margin: 0;
    padding: 0;
    .shopping {
      border: 1px solid #ccc;
      list-style: none;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px 0;
      >*{
        align-items: flex-start;
      }
    }
  }
}
</style>