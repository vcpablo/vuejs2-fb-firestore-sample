import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faCheck, faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
library.add(faEdit)
library.add(faCheck)
library.add(faTimes)
library.add(faSearch)

import { shallowMount } from '@vue/test-utils'
import DataTable from '@/components/DataTable'
import store from '@/store'

describe('DataTable.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(DataTable, {
      store,
      mocks: {
        $style: {},
      },
      stubs: {
        FontAwesomeIcon
      },
      propsData: {
        data: [],
        options: {},
        columns: [],
        loading: false,
        pageSize: 10
      }
    })
  })

  it('should receive correct value from prop', () => {
    expect(wrapper.vm.pageSize).toEqual(10)
    expect(wrapper.vm.data).toEqual([])
  })
  
  it('should render correctly', () => {
    expect(wrapper.vm.$el.querySelector('table')).toBeTruthy()
  })
})

