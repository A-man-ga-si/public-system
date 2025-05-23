<template>
  <tr>
    <td>{{ idx + 1 }}.</td>
    <td>
      <input
        type="text"
        class="inline-edit"
        v-model="name"
        @change="submitUpdateAhsItem"
        :disabled="ahsItemableType == 'ItemPrice'"
      />
    </td>
    <td>
      <v-select
        :reduce="
          ahsItemable => `${ahsItemable.ahs_itemable_type}~${ahsItemable.id}`
        "
        :options="getAhsItemableList" 
        :value="translateAhsItemId"
        @input="ahsItemIdChange"
      />
    </td>
    <td>
      <v-select
        label="name"
        :reduce="unit => unit.hashid"
        @input="submitUpdateAhsItem"
        v-model="unitId"
        :options="unitsList"
        :disabled="ahsItemableType === 'ItemPrice'"
      />
    </td>
    <td>
      <input
        type="number"
        :value="ahsItem.coefficient"
        @change="updateCoefficient($event)"
        class="inline-edit"
      />
    </td>
    <td>{{ getItemPrice }}</td>
    <td>{{ getSubtotalPrice }}</td>
    <td>
      <DeleteButton @click.prevent="submitDeleteAhsItem" />
    </td>
  </tr>
</template>

<script>
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton';
  import { mapActions } from 'vuex';
  import { isItemPrice, ahsItemable, formatCurrency } from './../../../utils';
  import { Notify } from 'notiflix';
  import { showConfirmAlert } from './../../../utils';

  export default {
    props: ['ahsItem', 'idx', 'codesList', 'unitsList', 'ahsItemableList'],
    data() {
      return {
        name:
          ahsItemable(this.ahsItem.ahs_itemable_type) === 'ItemPrice'
            ? this.ahsItem.ahs_itemable.name
            : this.ahsItem.name,
        ahsItemableId: `${ahsItemable(this.ahsItem.ahs_itemable_type)}~${
          this.ahsItem.ahs_itemable_id
        }`,
        unitId:
          ahsItemable(this.ahsItem.ahs_itemable_type) === 'ItemPrice'
            ? this.ahsItem.ahs_itemable.unit.hashid
            : this.ahsItem.unit?.hashid,
        coefficient: this.ahsItem.coefficient,
      };
    },
    methods: {
      ...mapActions(['updateAhsItem', 'deleteAhsItem']),
      updateCoefficient(val) {
        this.coefficient = val.target.value
        this.submitUpdateAhsItem()
      },
      ahsItemIdChange(val) {
        this.ahsItemableId = val
        this.submitUpdateAhsItem()
      },
      async submitUpdateAhsItem() {
        try {
          const ahsType = ahsItemable(this.ahsItem.ahs_itemable_type);
          const ahsItemableIdType = this.ahsItemableId.split('~');
          const dataToUpdate = {};

          if (ahsType === 'Ahs' || ahsType == 'Ahp') {
            dataToUpdate.name = this.name;
            dataToUpdate.unit_id = this.unitId;
          }

          dataToUpdate.ahs_itemable_id = ahsItemableIdType[1];
          dataToUpdate.ahs_itemable_type = ahsItemableIdType[0];
          dataToUpdate.coefficient = this.coefficient;

          const data = await this.updateAhsItem({
            ahsItemId: this.ahsItem.id,
            form: dataToUpdate,
          });

          this.$emit('ahs-item-updated');
        } catch (err) {
          this.ahsItemableId = `${ahsItemable(
            this.ahsItem.ahs_itemable_type
          )}~${this.ahsItem.ahs_itemable_id}`;
          Notify.failure(
            err?.response?.data?.message || 'Gagal mengupdate item AHS'
          );
        }
      },
      async submitDeleteAhsItem() {
        const { isConfirmed } = await showConfirmAlert({
          title: 'Hapus Item AHS',
          text: 'Aksi ini tidak dapat dibatalkan',
        });
        if (isConfirmed) {
          await this.deleteAhsItem(this.ahsItem.id);
          Notify.success('Berhasil menghapus item ahs');
          this.$emit('ahs-item-deleted');
        }
      },
    },
    computed: {
      translateAhsItemId() {
        return `${ahsItemable(this.ahsItem.ahs_itemable_type)}~${this.ahsItem.ahs_itemable_id}`
      },
      ahsItemableType() {
        const ahsItemableData = this.ahsItem.ahs_itemable_type;
        return ahsItemable(ahsItemableData);
      },
      ahsItemName() {
        return this.ahsItemableType == 'ItemPrice'
          ? this.ahsItem.ahs_itemable.name
          : this.ahsItem.name;
      },
      getAhsItemableList() {
        const ctx = this;
        return this.ahsItemableList
          .filter(ahsItemableItem => {
            return ahsItemableItem.id != ctx.ahsItem.ahs_id;
          })
          .map(ahsItemableItem => {
            ahsItemableItem.label = `${ahsItemableItem.id} - ${ahsItemableItem.name}`;
            ahsItemableItem.ahs_itemable_type = ahsItemable(
              ahsItemableItem.ahs_itemable_type
            );
            return ahsItemableItem;
          });
      },
      getItemPrice() {
        return `Rp. ${formatCurrency(this.ahsItem.ahs_itemable.subtotal)}`;
      },
      getSubtotalPrice() {
        return `Rp. ${formatCurrency(this.ahsItem.subtotal)}`;
      },
    },
    components: {
      DeleteButton,
    },
    watch: {
      ahsItem(e) {
        this.name = isItemPrice(e.ahs_itemable_type)
          ? e.ahs_itemable.name
          : e.name;
        this.unitId = isItemPrice(this.ahsItem.ahs_itemable_type)
          ? this.ahsItem.ahs_itemable.unit.hashid
          : this.ahsItem.unit?.hashid;
      },
    },
  };
</script>

<style scoped>
  .inline-edit:disabled {
    background-color: transparent;
  }

  .inline-edit {
    border: none;
  }

  td {
    vertical-align: middle;
  }
</style>
