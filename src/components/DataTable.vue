<template>
  <div>
    <div v-if="!loading">
      <!-- Total of pages -->
      <div
        :class="$style.pageNumberInfo">
        {{ currentPage + 1 }} of {{ totalPages }} pages
      </div>
      <!-- Search input -->
      <div
        v-if="options.allowSearch"
        :class="$style.search">
          <input
            ref="search"
            v-model="search"
            :class="$style.input"
            type="text"
            placeholder="Type to search..."
            @keypress="forceFocus"
          />
      </div>
      <table :class="$style.table">
        <!-- Table Header -->
        <thead>
          <tr>
            <th
              :class="$style.header"
              v-for="(column, indexColumn) in internalColumns"
              :key="indexColumn">
              <div :class="$style.headerCell">
                <div
                  :class="$style.title">
                  {{ column.title }}
                </div>

                <span
                  v-if="column.sortable"
                  :class="[$style.arrow, isSortedUp(column) && $style.up, isSortedDown(column) && $style.down]"
                  @click="sort(column)"/>
              </div>
            </th>
          </tr>
        </thead>
        <!-- Table Body -->
        <tbody>
          <tr
            v-for="(item, index) in paginatedData"
            :key="index">
            <td
              :class="$style.cell"
              v-for="(column, indexColumn) in internalColumns"
              :key="indexColumn">
              <div :class="$style.cellContent">
                <div
                  v-if="column.name !== '__datatable_options'"
                  :class="$style.value">
                  <span v-show="!(item._editting && column.editable)">
                    {{ item[column.name] | format(column.type) }}
                  </span>
                  <input
                    v-if="item._editting && column.editable"
                    type="text"
                    v-model="model[index][column.name]"
                    :class="$style.input" />
                </div>
                <div
                  v-else
                  :class="$style.actions">
                  <font-awesome-icon
                    icon="edit"
                    v-if="!item._editting"
                    :class="[$style.icon, $style.blue]"
                    @click="toggleEdit(index, item, column.name)"/>

                    <font-awesome-icon
                      v-if="item._editting"
                      icon="check"
                      :class="[$style.icon, $style.green]"
                      @click="saveEdit(index, item, column.name)"/>

                    <font-awesome-icon
                      v-if="item._editting"
                      icon="times"
                      :class="[$style.icon, $style.red]"
                      @click="cancelEdit(index, item, column.name)"/>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Pagination -->
      <div
        :class="$style.pagination">
        <div :class="$style.buttons">
          <button
            type="button"
            :class="[disablePreviousPage && $style.disabled]"
            @click="firstPage()"> &lt;&lt; First</button>
          <button
            type="button"
            :class="[disablePreviousPage && $style.disabled]"
            @click="previousPage()"> &lt; Previous</button>
          <button
            type="button"
            :class="[disableNextPage && $style.disabled]"
            @click="nextPage()">Next &gt; </button>
          <button
            type="button"
            :class="[disableNextPage && $style.disabled]"
            @click="lastPage()">Last &gt;&gt; </button>
        </div>
        <div :class="$style.info">
          <select
            v-model="internalPageSize"
            :class="$style.pageSizes">
            <option :value="10">10</option>
            <option :value="30">30</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
        </div>
      </div>
    </div>
    <!-- Loading -->
    <div
      v-else
      :class="$style.loading">
        Loading ...
      </div>
  </div>
</template>

<script>
import Format from './FormatFilter.js'

export default {
  name: 'DataTable',
  filters: {
    Format
  },
  props: {
    // Columns definitions
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    // Array of data to populate the table
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    // Misc options
    options: {
      type: Object,
      default: () => {}
    },
    // Number of items shown per page
    pageSize: {
      type: Number,
      default: 10
    },
    // Shows loading
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      internalColumns: [],
      sorting: {
        column: '',
        order: ''
      },
      search: '',
      model: [],
      currentPage: 0,
      internalPageSize: 0,
      filteredData: [],
      isSearching: false
    }
  },
  mounted () {
    // Creates a special column for options
    const actionsColumn = {
      title: 'Options',
      name: '__datatable_options',
      edit: this.options.allowEdit,
      remove: this.options.allowRemove
    }

    this.internalColumns = this.columns.concat(actionsColumn)
    this.internalPageSize = this.pageSize
  },
  computed: {
    // Returns searched, sorted and paginated data
    processedData () {
      const isSearching = !!this.search.trim()
      const isSorting = this.sorting.column && this.sorting.order

      let slicedData = this.data.slice()

      // If the data are sorted by some column
      if (isSorting) {
        slicedData = slicedData.sort((a, b) => {
          if (a[this.sorting.column] < b[this.sorting.column]) {
            return (this.sorting.order === 'down') ? 1 : -1
          } else if (a[this.sorting.column] > b[this.sorting.column]) {
            return (this.sorting.order === 'down') ? -1 : 1
          }
          return 0
        })
      }

      if (isSearching) {
        // Searches the term in every column
        slicedData = slicedData.filter(item => {
          return this.columns.some(column => {
            return new RegExp(this.search.trim(), 'i').test(item[column.name] || '')
          })
        })
      }

      return slicedData
    },
    paginatedData () {
      const start = this.currentPage * this.internalPageSize
      const end = start + this.internalPageSize

      return this.processedData.slice(start, end)
    },
    // Returns the key defined as primary
    getKey () {
      return this.columns.filter(column => column.key).map(column => column.name)[0]
    },
    pageCount () {
      const l = this.data.length
      const s = this.internalPageSize
      return Math.ceil(l / s)
    },
    disableNextPage () {
      return (this.currentPage + 1) === this.totalPages
    },
    disablePreviousPage () {
      return this.currentPage === 0
    },
    totalPages () {
      const length = (this.search.trim()) ? this.processedData.length : this.data.length
      return Math.ceil(length / this.internalPageSize)
    }
  },
  methods: {
    isSortedUp (column) {
      return this.sorting.column === column.name && this.sorting.order === 'up'
    },
    isSortedDown (column) {
      return this.sorting.column === column.name && this.sorting.order === 'down'
    },
    // Sorts data according to selected column
    sort (column) {
      const isSortedUp = this.isSortedUp(column)
      this.sorting.column = column.name
      this.sorting.order = (isSortedUp) ? 'down' : 'up'
    },
    // Defines model control for edition
    setModel (index, item) {
      this.model[index] = Object.assign({}, item)
    },
    // Enables item edition
    toggleEdit (index, processedItem, columnName) {
      this.setModel(index, processedItem)

      let item = this.data.find(item => item.uuid === processedItem.uuid)

      if (item) {
        item._editting = true
        this.sorting.column = ''
        this.sorting.order = ''

        this.$forceUpdate()
      }
    },
    // Saves the item edition
    saveEdit (index, processedItem, columnName) {
      this.data[index]._editting = false
      let payment = {
        uuid: processedItem.uuid
      }

      this.columns.forEach(column => {
        payment[column.name] = this.model[index][column.name]
      })

      this.$forceUpdate()
      this.$emit('save', payment)
    },
    // Aborts the item edition
    cancelEdit (index, processedItem, columnName) {
      let item = this.data.find(item => item.uuid === processedItem.uuid)

      if (item) {
        item._editting = false
        this.setModel(index, processedItem)
        this.$forceUpdate()
      }
    },
    // Goes to next page
    nextPage () {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    },
    // Goest to previous page
    previousPage () {
      if (this.currentPage > 0) {
        this.currentPage--
      }
    },
    // Goes to first page
    firstPage () {
      if (this.currentPage > 0) {
        this.currentPage = 0
      }
    },
    // Goes to last page
    lastPage () {
      if (this.currentPage < this.totalPages) {
        this.currentPage = this.totalPages - 1
      }
    },
    // Workaround to avoid losing focus after first character is set in search field
    forceFocus () {
      setTimeout(() => {
        this.$refs.search.focus()
      }, 0)
    }
  }
}
</script>

<style module>

.table {
  width: 100%;
}

.header {
  border: 1px solid #ededed;
  padding: 10px;
  background: #ededed;
}

.headerCell {
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.title {
  flex: 2;
}

.body {
  display: flex;
  justify-content: space-around;
}

.cell {
  border: 1px solid #ededed;
  padding: 10px;
}

.cellContent {
  display: flex;
  justify-content: space-evenly;
}

.value {
  width: 100%;
}

.arrow {
  border: solid #767676;
  border-width: 0 3px 3px 0;
  display: inline-table;
  padding: 3px;
  margin-left: 10px;
  cursor: pointer;
}

.arrow:hover {
  opacity: 0.7;
}

.arrow.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
}

.arrow.down {
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
}

.input {
  height: 30px;
  font-size: 15px;
  font-family: Avenir;
  width: 80%;
}

.actions {
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

.actions .icon {
  cursor: pointer;
}

.actions .icon:hover {
  opacity: 0.7;
}

.red {
  color: #f00;
}

.green {
  color: #0f0;
}

.blue {
  color: #00f;
}

.pagination {
  justify-content: center;
  display: flex;
  padding: 10px;
}

.pagination .buttons {
  flex: 2;
  text-align: center;
}

.pagination button {
  font-family: Avenir;
  font-size: 14px;
  height: 40px;
  border-radius: 0;
  background-color: #fff;
  border: 1px solid #ededed;
  min-width: 100px;
  cursor: pointer;
}

.pagination button:focus {
  outline: none;
}

.pagination button:hover {
  opacity: 0.7;
}

.pagination .disabled {
  cursor: no-drop;
  background: #efefef;
  color: #ababab;
}

.pagination .pageSizes {
  height: 40px;
  border: 1px solid #ededed;
  background-color: #fff;
  border-radius: 0;
  font-family: Avenir;
  font-size: 14px;
}

.pageNumberInfo {
  text-align: right;
}

.loading {
  font-size: 50px;
  margin-top: 30%;
}

.search {
  display: flex;
}

.search .icon {

}

.search .input {
  flex: 2;
  width: 99%;
  height: 40px;
}
</style>
