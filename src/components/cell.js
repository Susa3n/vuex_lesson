import * as Components from './components/index';
let empty = '-'
export default {
  props: {
    config: Object,
    data: Object,
  },
  functional: true,
  render: (h, c) => {
    let { props: { config = {}, data = {} } } = c;
    let { prop, type = 'Default' } = config;
    let value = data[prop] || config.value;
    let isEmpty = value === '' || value === undefined;
    return isEmpty ? 
    h(Components.Default, { props: { value: empty } }) 
    : h(Components[type], { props: { value, empty, data, ...config } });
  }
}