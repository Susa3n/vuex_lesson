<template>
  <div style="margin: 20px">
    <el-button type="primary" v-if="excelExport" @click="download"
      >获取勾选的表格数据</el-button
    >
    <Table :config="config" ref="table" />
  </div>
</template>
<script>
import Table from "@/components/Table";
export default {
  components: {
    Table,
  },
  data() {
    return {
      config: {
        headers: [
          {
            prop: "contractCode",
            label: "业务编号",
            attrs: { width: 200, align: "center" },
          },
          // {
          //   prop: "payeeAcctName",
          //   label: "收款账户名",
          //   type: "Link",
          //   query: (row) => this.query(row),
          //   attrs: { width: 260, align: "right" },
          // },
          { prop: "tradeAmt", label: "付款金额", type: "Currency" },
          {
            prop: "status",
            label: "操作状态",
            type: "Enum",
            Enum: { name: "order" },
          },
          {
            prop: "statistic",
            label: "预警统计",
            type: "Format",
            format: (val) => this.format(val),
          }, //自定义展示自己想要的数据格式
          { prop: "reason", label: "原因", type: "Popover" },
          {
            prop: "payTime",
            label: "付款时间",
            type: "Date",
            format: "yyyy-MM-dd hh:mm:ss",
          }, //不设置format的话，日期格式默认为yyyy/MM/dd
          {
            prop: "monitorStatus",
            label: "当前监控状态",
            type: "Enum",
            Enum: { name: "monitor" },
          },
        ].concat(this.getActions()),
        //通过接口获取列表数据 - 这里的参数p就是子组件传过来的包含分页的参数
        loadData: () =>
          Promise.resolve({
            data: [
              {
                id: 1,
                contractCode: "",
                payeeAcctName: "中国银行上海分行",
                tradeAmt: "503869.265",
                status: "00",
                payTime: 1593585652530,
                statistic: [
                  { level: 3, total: 5 },
                  { level: 2, total: 7 },
                  { level: 1, total: 20 },
                  { level: 0, total: 0 },
                ],
                customize: ["中国", "上海", "浦东新区"],
                detail:
                  "上海电气一般指上海电气集团股份有限公司。上海电气集团股份有限公司（Shanghai Electric Group Company Limited），简称上海电气，是中国机械工业销售排名第一位的装备制造集团。",
              },
              {
                id: 2,
                contractCode: "GLP-YG-B3-1111",
                payeeAcctName: "中国邮政上海分行",
                tradeAmt: "78956.85",
                status: "CREATED",
                payTime: 1593416718317,
                reason:
                  "Popover的属性与Tooltip很类似，它们都是基于Vue-popper开发的，因此对于重复属性，请参考Tooltip的文档，在此文档中不做详尽解释。",
                detail:
                  "上海电气集团股份有限公司（Shanghai Electric Group Company Limited），简称上海电气，是中国机械工业销售排名第一位的装备制造集团。",
              },
              {
                id: 3,
                contractCode: "HT1592985730310",
                payeeAcctName: "招商银行上海支行",
                tradeAmt: "963587123",
                status: "PASS",
                payTime: 1593420950772,
                monitorStatus: "01",
              },
              {
                id: 4,
                contractCode: "pi239",
                payeeAcctName: "广州物流有限公司",
                tradeAmt: "875123966",
                status: "REJECT",
                payTime: 1593496609363,
              },
              {
                id: 5,
                contractCode: "0701001",
                payeeAcctName: "建设银行上海分账",
                tradeAmt: "125879125",
                status: "REFUSE",
                payTime: 1593585489177,
              },
            ],
            total: 5
          }),
        hasCheckbox: true,
        selectable: this.selectable,
        reserveSelection: false,
        rowKey: (row) => row.id,
      },
      status: "01",
      permission: ["handle", "pass", "refuse", "reApply", "export"],
    };
  },
  computed: {
    handle() {
      return this.permission.some((n) => n == "handle");
    },
    pass() {
      return this.permission.some((n) => n == "pass");
    },
    reject() {
      return this.permission.some((n) => n == "reject");
    },
    refuse() {
      return this.permission.some((n) => n == "refuse");
    },
    excelExport() {
      return (
        this.permission.some((n) => n == "handle") &&
        this.permission.some((n) => n == "export")
      );
    },
  },
  methods: {
    getActions() {
      return {
        prop: "action",
        name: "操作",
        type: "Action",
        value: [
          {
            label: "查看",
            click: (data) => {
              console.log(data);
            },
          },
          {
            label: "办理",
            click: (data) => {},
            filter: ({ status }) => status == "CREATED" && this.handle,
          },
          {
            label: "通过",
            click: (data) => {},
            filter: ({ status }) => status == "PASS" && this.pass,
          },
          {
            label: "驳回",
            click: (data) => {},
            filter: ({ status }) => status == "REJECT" && this.reject,
          },
          {
            label: "拒绝",
            click: (data) => {},
            filter: ({ status }) => status == "CREATED" && this.refuse,
          },
        ],
      };
    },
    setParams() {
      return {
        name: "测试",
        status: "01",
        type: "CREATED",
      };
    },
    query(row) {
      return {
        path: "/otherElTable", // 路由path
        payload: {
          id: row.id,
          type: "link",
        },
      };
    },
    format(val) {
      let str = "";
      val.forEach((t) => {
        str += '<span style="margin-right:5px;">' + t.total + "</span>";
      });
      return str;
    },
    selectable({ status }) {
      return status == "REFUSE" ? false : true;
    },
    download() {
      console.log(this.$refs.table.getChecked());
    },
  },
};
</script>
<style>
.action span {
  margin-right: 10px;
  color: #359c67;
  cursor: pointer;
}
</style>
