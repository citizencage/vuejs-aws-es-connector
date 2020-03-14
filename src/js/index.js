require('../scss/index.scss');

import 'bootstrap';
import common from './common';
import utilities from './utilities';

// instantiate VueJS components
import ElasticDemo from 'Components/elasticdemo';

utilities.elementReady('#mainApp').then( () => {
    ElasticDemo('#mainApp');
});
