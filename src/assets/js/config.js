// export const globalHost = 'http://dev-esheyi.yingjiashenghuo.com'
// 运行环境参数配置相关
export const globalHost = process.env.API_ROOT
// 租客账号信息相关
export const TENANT_TOKEN = 'XA_TENANT_TOKEN'
export const TENANT_ACCOUNT = 'XA_TENANT_ACCOUNT'
export const TENANT_INFO = 'XA_TENANT_INFO'
// 房东账号信息相关
export const LANDLORD_TOKEN = 'XA_LANDLORD_TOKEN'
export const LANDLORD_ACCOUNT = 'XA_LANDLORD_ACCOUNT'
export const LANDLORD_INFO = 'XA_LANDLORD_INFO'
// 示例代码的枚举库
export const houseTypeList = ['商铺', '公寓', '新工房', '工厂', '别墅洋房', '办公楼', '里弄房', '其他']
// 浏览器环境相关
export const deviceWidth = screen.width
export const deviceHeight = screen.height
export const userAgent = navigator.userAgent
export const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1
// 登录页面获取验证码和登录接口
export const loginPath = globalHost + '/admin/login/login'
export const getSmsPath = globalHost + '/admin/login/sns'
// 房东房源相关
export const landlordHouseListPath = globalHost + '/admin/app/house/housesOfLandlord'
// 租客房源相关
export const renterHouseListPath = globalHost + '/admin/app/house/list'

export const houseDetailPath = globalHost + '/admin/app/house'
// 租约合同相关
export const contractStatusList = {0: '待签约', 1: '已签约', 2: '已作废'}
export const createContractPath = globalHost + '/admin/app/contract/create'
export const renterLeaseListPath = globalHost + '/admin/contractinfo/searchAppList'
export const renterLeaseDetailPath = globalHost + '/admin/contractinfo/info'

// 示例页面的缓存键设置
export const DEAL_SEARCH_HISTORY_CACHE_LIST_KEY = 'DEAL_SEARCH_HISTORY_CACHE_List'
export const LISTING_SEARCH_HISTORY_CACHE_LIST_KEY = 'LISTING_SEARCH_HISTORY_CACHE_LIST'

// 示例路由的相关接口
export const zoneListPath = 'http://dev-esheyi.yingjiashenghuo.com' + '/agent-service/api/zone/getZoneListByLevel.do'
export const dealHouseListPath = globalHost + '/agent-service/api/dealHouseInfo/getHouseList.do'
export const dealVillageListPath = globalHost + '/agent-service/api/dealHouseInfo/getVillageList.do'
export const ListingVillageListPath = globalHost + '/agent-service/api/listingHouseInfo/getVillageList.do'
export const ListingHouseListPath = globalHost + '/agent-service/api/listingHouseInfo/getHouseList.do'
export const ListingDetailPath = globalHost + '/agent-service/api/listingHouseInfo/getDetail.do'
export const getRandom = function () {
  let differentMarker = String(Math.random())
  differentMarker = differentMarker.substr(2, differentMarker.length - 1)
  return differentMarker
}
