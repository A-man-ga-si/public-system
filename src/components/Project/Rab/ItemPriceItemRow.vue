<template>
  <tr>
    <td>{{ index + 1 }}</td>
    <td>
      <input
        v-if="item.is_default == '0'"
        type="text"
        class="rab-inline-editor"
        style="width: 100%"
        v-model="form.name"
        placeholder="Isi nama barang"
        @change="partialUpdate('name')"
      />
      <span v-else>{{ item.name }}</span>
    </td>
    <td>
      <v-select
        v-if="item.is_default == '0'"
        label="name"
        class="rab-inline-editor"
        :reduce="(unit) => unit.hashid"
        v-model="form.unit.hashid"
        :options="units"
        @input="partialUpdate('unit_id')"
      />
      <span v-else>{{ item.unit.name }}</span>
    </td>
    <td>
      <input
        v-if="item.is_default == '0'"
        type="text"
        class="rab-inline-editor"
        v-model="form.code"
        placeholder="Isi kode barang"
        @change="partialUpdate('code')"
      />
      <span v-else>{{ item.code }}</span>
    </td>
    <td>
      <!-- <input
        type="number"
        class="rab-inline-editor"
        :class="{
          'text-primary font-weight-bold': !defaultPrice,
        }"
        v-model="form.price"
        @change="partialUpdate('price')"
      /> -->
      <NumericInput
        class="inline-edit"
        v-model="form.price"
        :isSeparatorEnabled="false"
        :onChangeValue="() => partialUpdate('price')"
      />
    </td>
    <td>
      <div class="action-bt" v-if="item.is_default == '0'">
        <DeleteButton @click.prevent="destroyCustomItemPrice" />
      </div>
    </td>
  </tr>
</template>

<script>
  import EditButton from '@/components/DataTable/Actions/EditButton.vue';
  import DeleteButton from '@/components/DataTable/Actions/DeleteButton.vue';
  import { mapActions } from 'vuex';
  import { Notify } from 'notiflix';
  import { showConfirmAlert } from '@/utils';
  import { NumericInput } from '@/components/Common';

  export default {
    props: {
      item: {
        type: Object,
        required: true,
      },
      index: {
        type: Number,
        required: true,
      },
      units: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        unitId: this.isCustomItemPrice(this.item) ? this.item.unit.hashid : '',
        form: {
          ...this.item
        },
        defaultPrice: true,
      };
    },
    mounted() {
      this.checkDefaultPrice();
    },
    methods: {
      ...mapActions(['deleteCustomItemPrice', 'customItemPricePartialUpdate']),
      async destroyCustomItemPrice() {
        try {
          if (this.isCustomItemPrice(this.item)) {
            const { isConfirmed } = await showConfirmAlert({
              title: 'Konfirmasi',
              text: 'Hapus harga satuan ? pastikan tidak ada data yang terhubung dengan data harga satuan ini !',
            });
            if (isConfirmed) {
              await this.deleteCustomItemPrice({
                projectId: this.$route.params.id,
                customItemPriceCode: this.item.hashid,
              });

              this.$parent.$emit('custom-item-price-deleted');

              Notify.success('Harga Satuan Berhasil Dihapus !');
            }
          } else {
            console.log(
              "Nothing to do, this is not custom item price so you can't delete it",
            );
          }
        } catch (err) {
          Notify.failure(
            `Gagal menghapus harga satuan ! ${err.response.data.message}`,
          );
        }
      },
      async partialUpdate(updatedKey) {
        const { name, unit, code, price } = this.form;
        const data = await this.customItemPricePartialUpdate({
          projectId: this.$route.params.id,
          customItemPriceId: this.item.hashid,
          form: {
            name,
            unit_id: unit.hashid,
            code,
            price: price ?? 0,
          },
        });
        this.checkDefaultPrice();
      },
      isCustomItemPrice(itemPrice) {
        return !!itemPrice.project_id;
      },
      checkDefaultPrice() {
        this.item.default_price != null &&
        this.item.default_price != this.form.price
          ? (this.defaultPrice = false)
          : (this.defaultPrice = true);
      },
    },
    components: {
      EditButton,
      DeleteButton,
      NumericInput
    },
    watch: {
      item() {
        this.form = { ...this.item };
      },
    },
  };
</script>

<style scoped>
  .rab-inline-editor {
    border-left: none;
    border-right: none;
    border-top: none;
    padding-bottom: 5px !important;
    border-bottom: 0.5px solid gray !important;
  }

  td {
    vertical-align: middle;
  }

  .inline-edit {
    border: none;
  }
</style>
