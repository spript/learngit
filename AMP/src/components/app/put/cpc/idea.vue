<template>
  <div>
    <m-breadcrumb :config="breadcrumbConfig"></m-breadcrumb>
    <m-idea-list ref='data'></m-idea-list>
  </div>
</template>
<script>
import Breadcrumb from '../../../common/breadcrumb.vue';
import unitList from "./idea-list";
export default {
  name: 'app-put-plan-idea-overview',
  data() {
    return {
      id: ''
    };
  },
  components: {
    'm-breadcrumb': Breadcrumb,
    'm-idea-list': unitList
  },
  computed: {
		breadcrumbConfig() {
			let breadcrumbConfig = {
				msg: '创意',
        link: '/#/app/put/unit/' + this.id,
        showBack: true
			};
			return breadcrumbConfig;
		}
	},
	mounted() {
		this.id = this.$refs.data.campaignId;
	}
};
</script>
