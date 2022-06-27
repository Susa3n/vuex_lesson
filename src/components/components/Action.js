const getAcitons = (h, value, data) => {
  let result = value.filter(n => {
    let {filter = () => true} = n;
    return filter.call(n, data);
  });

  return result.map(a => h('span', {class: 'btn', on: {click: () => a.click(data)}, key: a.prop}, a.label))
}

export default {
  functional: true,
  render: (h, {props: {value, data}}) => {
    return h('div', {class: 'action'}, getAcitons(h, value, data))
  },
}