import Home from '../../components/common/Home.vue'
const _import=file => require('@/components/' + file + '.vue')
import handle from './handle'
import work from './work'
const routeMeta = handle.concat(work)

export default routeMeta
