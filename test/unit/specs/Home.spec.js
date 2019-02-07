import { shallowMount } from '@vue/test-utils'

import Home from '@/components/Home'
import store from '@/store'

describe('Home.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(Home, {
      store,
      mocks: {
        payments: []
      }
    })
  })

  it('should have correct data value', () => {
    expect(wrapper.vm.payments).toEqual([])
  })

  it('should render correct contents', () => {
    expect(wrapper.vm.$el.querySelector('h2').textContent)
      .toEqual('VueJS 2 + Firebase Firestore')
  })
})

