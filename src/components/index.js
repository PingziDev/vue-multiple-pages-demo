import ComponentSfc from './component-sfc'
import ComponentJsx from './component-jsx'
import './component-jsx/index.css'

const components = [ComponentSfc, ComponentJsx]

components.forEach(component => {

  component.install = function (Vue) {
    Vue.component(component.name, component)
  }
})

export { ComponentSfc, ComponentJsx }