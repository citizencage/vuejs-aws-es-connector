import ElasticDemo from './elasticdemo';

export default el =>
    new Vue({
        el,
        render: h => h(ElasticDemo),
    });
