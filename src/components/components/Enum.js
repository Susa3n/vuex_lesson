let mapIdAndKey = list => list.reduce((c, i) => ({...c, [i.key]: i}), {});

let STATUS = {
    order: mapIdAndKey([
        {
            id: 'draft',
            key: 'CREATED',
            val: '未提交',
        },
        {
            id: 'pending',
            key: 'IN_APPROVAL',
            val: '审批中',
        },
        {
            id: 'reject',
            key: 'REJECT',
            val: '审批驳回',
        },
        {
            id: 'refuse',
            key: 'REFUSE',
            val: '审批拒绝',
        },
        {
            id: 'sign',
            key: 'CONTRACT_IN_SIGN',
            val: '合同签署中',
        },
        {
            id: 'signDone',
            key: 'CONTRACT_SIGNED',
            val: '合同签署成功',
        },
        {
            id: 'lendDone',
            key: 'LENDED',
            val: '放款成功',
        },
        {
            id: 'lendReject',
            key: 'LOAN_REJECT',
            val: '放款驳回',
        },
        {
            id: 'cancel',
            key: 'CANCEL',
            val: '取消成功',
        },
        {
            id: 'inLend',
            key: 'IN_LOAN',
            val: '放款审批中',
        },
    ]),
    monitor: mapIdAndKey([
        {
            key: '00',
            val: '未监控',
        },
        {
            key: '01',
            val: '监控中',
        },
    ]),
}

export default {
    functional: true,
    render(h, {props: {value, Enum, empty}, parent}){
        let enums = Object.assign({}, STATUS, parent.$store.getters.dictionary),
            {name = '', getVal = (values, v) => values[v]} = Enum, _value = getVal(enums[name], value);
            
        if( _value === undefined) return h('span',  _value === undefined ? empty : _value);

        let {id, val} = _value;
        return h('span', {staticClass: id}, [h('span', val)]);
    }
}