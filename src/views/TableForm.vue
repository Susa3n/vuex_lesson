<template>
  <el-form :model="form" ref="form" size="small" :rules="rules">
    <el-form-item v-if="!isDetail">
      <el-button type="primary" @click="add">新增</el-button>
    </el-form-item>
    <el-table :data="form.list" border>
      <el-table-column v-for="x in columns" :key="x.prop" :label="x.label" :prop="x.prop" v-bind="x.attr">
        <template slot-scope="{row, $index}">
          <t-text v-if="!x.edit" :row="{x, row}" />
          <template v-else>
            <t-text v-if="isDetail" :row="{x, row}" />
            <template v-else>
              <t-input v-if="x.prop !== 'opt'" v-model="row[`${x.prop}`]" v-bind="componentAttrs(x, row, $index)" class="width100" />
              <template v-else>
                <el-link type="primary" :underline="false" @click="save(row, $index)">保存</el-link>
                <el-link type="primary" :underline="false" v-if="row.isAdd" @click="del($index)">删除</el-link>
                <el-link type="primary" :underline="false" @click="resetField($index)">重置</el-link>
              </template>
            </template>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-form-item v-if="!isDetail">
      <template v-if="isSubmit">
        <el-button type="primary" @click="submit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {config: Object},
  components: {
    TInput: {
      functional: true,
      props: ['prop', 'rules', 'type', 'options', 'row', 'cb'],
      render: (h, {props: { prop, rules, type = 'default', options = [], row, cb = () => {} }, data, listeners: {input = () => {}}}) => {
        const children = {
          checkbox: h => h('el-checkbox-group', {props: {...data.attrs}, on: {input(v) {input(v)}}}, options.map(o => h('el-checkbox', {props: {...o, label: o.value, key: o.value}}, [o.label]))),
          select: h => h('el-select', {class: 'width100', props: {...data.attrs}, on: {change(v){input(v)}}}, options.map(o => h('el-option', {props: {...o, key: o.value}}))),
          date: h => h('el-date-picker', {props: {type: 'date', valueFormat: 'yyyy-MM-dd'}, ...data}),
          switch: h => h('el-switch', {props: {activeColor: '#13ce66'}, ...data}),
          mixInput: h => h('el-input', data, [h('el-button', {slot: 'append', props: {icon: 'el-icon-search'}, on: {click(){cb(row)}}})]),
          opt: () => '-',
          default: h => h('el-input', data),
        }

        return h('el-form-item', {props: {prop, rules}}, [children[type](h)])
      }
    },
    TText: {
      functional: true,
      props: ['row'],
      render: (h, {props: { row: { x, row } }}) => {
        if(!row[`${x.prop}`]) return h('span', '-')
        else if(x.format && typeof x.format == 'function') return h('span', x.format(row))
        else return h('span', row[`${x.prop}`])
      }
    },
  },
  data(){
    const { columns = [], isDetail = false, isSubmit = false } = this.config || {}

    return {
      form: {
        list: [columns.reduce((r, c) => ({...r, [c.prop]: c.type == 'checkbox' ? [] : (c.type == 'switch' ? false : '')}), {isAdd: true})]
      },
      columns,
      rules: columns.reduce((r, c) => ({...r, [c.prop]: c.rules ? c.rules : { required: c.required == false ? false : true, message: c.label + '必填'}}), {}),
      isDetail,
      isSubmit,
    }
  },
  methods: {
    componentAttrs(item, row, idx){
      const {type, label} = item, attrs = Object.fromEntries(Object.entries(item).filter(n => !/^(prop|edit|label|attr|format)/.test(n[0]))),
      placeholder = (/^(select|el-date-picker)/.test(type) ? '请选择' : '请输入') + label
      Object.assign(attrs, {prop: `list.${idx}.${item.prop}`, rules: this.rules[item.prop]})
      return {...attrs, row, placeholder}
    },
    add(){
      const { columns = [] } = this.config || {}, obj = columns.reduce((r, c) => ({...r, [c.prop]: c.type == 'checkbox' ? [] : (c.type == 'switch' ? false : '')}), {isAdd: true})
      this.form.list.push(obj)
    },
    save(row, idx){
      let ret = Object.keys(row).map(r => `list.${idx}.${r}`).filter(r => !/isAdd|opt/g.test(r)), { $refs: { form } } = this, num = 0

      form.validateField(ret, valid => {
        if(valid) {
          num++
        }
      })

      if(num == 0) this.$emit('submit', Object.fromEntries(Object.entries(row).filter(n => !/^(isAdd|opt)/.test(n[0]))))
    },
    del(idx){
      this.form.list.splice(idx, 1)
      this.$refs.form.fields.forEach(n => {
        if(n.prop.split(".")[1] == idx){
          n.clearValidate();
        }
      })
    },
    submit(){
      this.$refs.form.validate(valid => {
        if(valid){
          this.$emit('submit', this.form.list.map(m => Object.fromEntries(Object.entries(m).filter(n => !/^(isAdd|opt)/.test(n[0])))))
        }
      })
    },
    resetField(idx){
      this.$refs.form.fields.forEach(n => {
        if(n.prop.split(".")[1] == idx){
          n.resetField();
        }
      })
    },
    reset(){
      this.$refs.form.resetFields();
    },
    // 回显数据
    setData(form){
      form = (form && form.length > 0) ? form.map(n => this.columns.reduce((r, c) => ({...r, [c.prop]: n[c.prop] == false ? n[c.prop] : (n[c.prop] || (c.type == 'checkbox' ? [] : ''))}), {})) : [columns.reduce((r, c) => ({...r, [c.prop]: c.type == 'checkbox' ? [] : (c.type == 'switch' ? false : '')}), {isAdd: true})]
      Object.assign(this.form, {list: form})
      setTimeout(()=> {this.$refs.form.clearValidate()})
    },
  }
}
</script>
<style scoped>
.width100{width: 100%;}
</style>