<template>
  <TableForm :config="config" @submit="submit" ref="form" style="margin:20px;" />
</template>

<script>
import TableForm from "./TableForm";

const repayTypeList = {
   averageCapital: '等额本金',
   averageInterest: '等额本息'
},
columns = [
  { prop: 'repaymentMethod', label: '还款方式', attr: {width: '180'}, format: ({ repaymentMethod }) => repayTypeList[repaymentMethod]},
  { prop: 'productPer', label: '期数', attr: {width: '180'}, format: ({ productPer }) => `${+ productPer + 1}期(${productPer}个月)` },
  { prop: 'costRate', label: '成本利率', attr: {minWidth: '110'}, edit: true, type: 'select', options: [{label: '5%', value: '5'}, {label: '10%', value: '10'}] },
  { prop: 'price', label: '单价', attr: {minWidth: '140'}, edit: true, rules: [{required: true, message: '请输入单价'}, {pattern: /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,})?$/, message: '单价须大于0，若有小数，则小数点后至少1位'}] },
  { prop: 'company', label: '所属公司', attr: {minWidth: '110'}, edit: true },
  { prop: 'product', label: '产品', attr: {minWidth: '110'}, edit: true, type: 'checkbox', options: [{label: '橘子', value: 'orange'}, {label: '苹果', value: 'apple'}] },
  { prop: 'date', label: '日期', attr: {minWidth: '110'}, edit: true, type: 'date', required: false },
  { prop: 'lock', label: '锁定', attr: {minWidth: '110'}, edit: true, type: 'switch' },
  { prop: 'search', label: '搜索', attr: {minWidth: '110'}, edit: true, type: 'mixInput', cb: row => {console.log(row)}},
  { prop: 'opt', label: '操作', attr: {minWidth: '110'}, edit: true },
]

export default {
  components: {
    TableForm,
  },
  data(){
    return {
      config: {
        columns,
        data: [],
      },
    }
  },
  mounted(){
    const form = [
      {repaymentMethod: '201602', productPer: '1', price: '5', company: '谷歌上海', date: '2021-01-03', lock: false},
      {repaymentMethod: '201601', productPer: '3', costRate: '10', price: '', company: '雅虎北京', lock: true}
    ]
    // 模拟调接口回显数据
    setTimeout(() => {
      this.$refs.form.setData(form)
    }, 2000)
  },
  methods: {
    submit(res){
      console.log(res)
    }
  }
}
</script>