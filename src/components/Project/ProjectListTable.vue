<template>
  <div>
    <datatable-heading :title="$t('menu.default')" :selectAll="selectAll" :isSelectedAll="isSelectedAll"
      :isAnyItemSelected="isAnyItemSelected" :keymap="keymap" :changePageSize="changePageSize"
      :searchChange="searchChange" :from="from" :to="to" :total="total" :perPage="perPage">
    </datatable-heading>
    <b-row>
      <b-colxx xxs="12">
        <b-card>
          <vuetable ref="vuetable" :api-mode="false" :data="datas" :per-page="perPage" :fields="fields" pagination-path
            :row-class="onRowClass" @vuetable:pagination-data="onPaginationData" @vuetable:row-clicked="rowClicked"
            @vuetable:cell-rightclicked="rightClicked">
            <template slot="actions" slot-scope="props">
              <router-link :to="`/app/projects/${props.rowData.id}/rab`" class="rab-icon-bt mx-1">
                <i class="simple-icon-trash" />
              </router-link>
              <router-link :to="`/app/projects/${props.rowData.id}/rab`" class="rab-icon-bt mx-1">
                <i class="simple-icon-drawer" />
              </router-link>
              <router-link :to="`/app/projects/${props.rowData.id}/rab`" class="rab-icon-bt mx-1">
                <i class="iconsminds-book"></i>
              </router-link>
            </template>
          </vuetable>
        </b-card>
        <vuetable-pagination-bootstrap class="mt-4" ref="pagination" @vuetable-pagination:change-page="onChangePage" />
      </b-colxx>
    </b-row>

    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="onContextMenuAction('move-to-archive')">
        <i class="simple-icon-drawer" />
        <span>Move to archive</span>
      </v-contextmenu-item>
      <v-contextmenu-item @click="onContextMenuAction('delete')">
        <i class="simple-icon-trash" />
        <span>Delete</span>
      </v-contextmenu-item>
    </v-contextmenu>
  </div>
</template>
<script>
import Vuetable from 'vuetable-2/src/components/Vuetable';
import VuetablePaginationBootstrap from '@/components/Common/VuetablePaginationBootstrap.vue';
import { apiUrl } from '@/constants/config';
import DatatableHeading from '@/containers/datatable/Projects/IndexDatatableHeading.vue';

export default {
  props: ['title'],
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
  },
  data() {
    return {
      isLoad: false,
      apiBase: apiUrl + '/cakes/fordatatable',
      sort: '',
      page: 1,
      perPage: 12,
      search: '',
      from: 0,
      to: 0,
      total: 0,
      lastPage: 0,
      items: [],
      datas: [
        {
          id: 1,
          title: 'Project Jembatan ABC',
          created_at: '20 August 2021 18:20',
          last_opened: '20 August 2021 19:35',
        },
      ],
      selectedItems: [],
      fields: [
        {
          name: 'title',
          sortField: 'title',
          title: this.$t('pages.projects.table-project-title'),
          titleClass: '',
          dataClass: 'list-item-heading',
          width: '35%',
        },
        {
          name: 'last_opened',
          sortField: 'last_opened',
          title: this.$t('pages.projects.table-project-last-opened'),
          titleClass: '',
          dataClass: 'list-item-heading',
          width: '10%',
        },
        {
          name: 'created_at',
          sortField: 'created_at',
          title: this.$t('pages.projects.table-created-at'),
          titleClass: '',
          dataClass: 'list-item-heading',
          width: '10%',
        },
        {
          name: '__slot:actions',
          title: 'Aksi',
          titleClass: 'center aligned text-right',
          dataClass: 'center aligned text-right',
          width: '5%',
        },
      ],
    };
  },
  methods: {
    makeQueryParams(sortOrder, currentPage, perPage) {
      this.selectedItems = [];
      return sortOrder[0]
        ? {
          sort: sortOrder[0]
            ? sortOrder[0].field + '|' + sortOrder[0].direction
            : '',
          page: currentPage,
          per_page: this.perPage,
          search: this.search,
        }
        : {
          page: currentPage,
          per_page: this.perPage,
          search: this.search,
        };
    },
    onRowClass(dataItem, index) {
      if (this.selectedItems.includes(dataItem.id)) {
        return 'selected';
      }
      return '';
    },

    rowClicked(dataItem, event) {
      const itemId = dataItem.id;
      if (event.shiftKey && this.selectedItems.length > 0) {
        let itemsForToggle = this.items;
        var start = this.getIndex(itemId, itemsForToggle, 'id');
        var end = this.getIndex(
          this.selectedItems[this.selectedItems.length - 1],
          itemsForToggle,
          'id'
        );
        itemsForToggle = itemsForToggle.slice(
          Math.min(start, end),
          Math.max(start, end) + 1
        );
        this.selectedItems.push(
          ...itemsForToggle.map(item => {
            return item.id;
          })
        );
        this.selectedItems = [...new Set(this.selectedItems)];
      } else {
        if (this.selectedItems.includes(itemId)) {
          this.selectedItems = this.selectedItems.filter(x => x !== itemId);
        } else this.selectedItems.push(itemId);
      }
    },
    rightClicked(dataItem, field, event) {
      event.preventDefault();
      if (!this.selectedItems.includes(dataItem.id)) {
        this.selectedItems = [dataItem.id];
      }
      this.$refs.contextmenu.show({ top: event.pageY, left: event.pageX });
    },
    onPaginationData(paginationData) {
      this.from = paginationData.from;
      this.to = paginationData.to;
      this.total = paginationData.total;
      this.lastPage = paginationData.last_page;
      this.items = paginationData.data;
      this.$refs.pagination.setPaginationData(paginationData);
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page);
    },

    changePageSize(perPage) {
      this.perPage = perPage;
      this.$refs.vuetable.refresh();
    },

    searchChange(val) {
      this.search = val;
      this.$refs.vuetable.refresh();
    },

    selectAll(isToggle) {
      if (this.selectedItems.length >= this.items.length) {
        if (isToggle) this.selectedItems = [];
      } else {
        this.selectedItems = this.items.map(x => x.id);
      }
    },
    keymap(event) {
      switch (event.srcKey) {
        case 'select':
          this.selectAll(false);
          break;
        case 'undo':
          this.selectedItems = [];
          break;
      }
    },
    getIndex(value, arr, prop) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i][prop] === value) {
          return i;
        }
      }
      return -1;
    },

    onContextMenuAction(action) {
      console.log(
        'context menu item clicked - ' + action + ': ',
        this.selectedItems
      );
    },
  },
  computed: {
    isSelectedAll() {
      return this.selectedItems.length >= this.items.length;
    },
    isAnyItemSelected() {
      return (
        this.selectedItems.length > 0 &&
        this.selectedItems.length < this.items.length
      );
    },
  },
};
</script>

<style scoped>
.rab-icon-bt {
  font-size: 17px;
}
</style>
