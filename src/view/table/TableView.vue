<template>
  <a-form ref="queryRef" class="ant-advanced-search-form" :model="queryParam"
      @finish="onQueryFinish">
      <a-row :gutter="24">
        <a-col :span="6">
          <a-form-item :name="`projectKey`" :label="`产品线`" :rules="[{ required: false, message: '请选择产品线' }]">
            <a-select :disabled="loading" mode="multiple" :filterOption="filterOption" :max-tag-count="2"
              v-model:value="queryParam.projectKey" placeholder="选择产品线" :allowClear="true">
              <a-select-option value="LA">里阿(LA)</a-select-option>
              <a-select-option value="XT">讯腾(XT)</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item :name="`dateRange`" :label="`时间`" :rules="[{ type: 'array',required: false, message: '请选择时间' }]">
            <DateRange :showQuick="true" :disabled="loading" v-model:value="dateRange"
              @closeChange="onQueryFinish"></DateRange>
          </a-form-item>
        </a-col>
        <a-col :span="7">
        </a-col>
        <a-col :span="5" style="text-align: right">
          <a-button type="primary" html-type="submit" :disabled="loading">搜索</a-button>
          <a-button style="margin: 0 8px" @click="() => queryRef.resetFields()" :disabled="loading">重置</a-button>
        </a-col>
      </a-row>
    </a-form>
  <CommonTable
    :columns="columns"
    :row-key="record => record.login.uuid"
    :data-source="dataSource"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    exportOpen
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
      <template v-if="column.key === 'option'">
        <a>view</a>
        <a-divider type="vertical" />
        <a>edit</a>
        </template>
    </template>
  </CommonTable>
</template>
<script>
import { usePagination } from 'vue-request';
import { filterOption } from '../../util/tools'
import { quickDates } from '../../util/date'
import { computed, defineComponent,ref } from 'vue';
import axios from 'axios';
import CommonTable from '@/components/table/CommonTable.vue';
import DateRange from '@/components/date/DateRange.vue';
const columns = [{
  title: 'Name',
  dataIndex: 'name',
  sorter: true,
  width: '20%',
}, {
  title: 'Gender',
  dataIndex: 'gender',
  analys: true, // pie
  filters: [{
    text: 'Male',
    value: 'male',
  }, {
    text: 'Female',
    value: 'female',
  }],
  width: '20%',
}, {
  title: 'Email',
  dataIndex: 'email',
}, {
  title: 'Option',
  key: 'option',
}]

const queryData = params => {
  return axios.get('https://randomuser.me/api?noinfo', {
    params,
  });
};

export default defineComponent({
    setup() {
        const { data: dataSource, run, loading, current, pageSize, } = usePagination(queryData, {
            formatResult: res => res.data.results,
            pagination: {
                currentKey: "page",
                pageSizeKey: "results",
            },
        });

        const queryParam = ref({
            page: 1,
            pageSize: 10
        })
        const dateRange = ref(quickDates.currMonth())
        const onQueryFinish = (values) => {
            loading.value = true
            console.log('Received values of form: ', values)
            console.log('queryParam: ', queryParam)
            setTimeout(() => {
                loading.value = false
            }, 500)
        }
        const pagination = computed(() => ({
            total: 200,
            current: current.value,
            pageSize: pageSize.value,
        }));
        const handleTableChange = (pag, filters, sorter) => {
            console.log(pag, filters, sorter)
            run({
                results: pag.pageSize,
                page: pag?.current,
                sortField: sorter.field,
                sortOrder: sorter.order,
                ...filters,
            });
        };
        return {
            dataSource,
            pagination,
            loading,
            columns,
            queryParam,
            dateRange,
            onQueryFinish,
            handleTableChange,
            filterOption
        };
    },
    components: { CommonTable, DateRange }
});
</script>