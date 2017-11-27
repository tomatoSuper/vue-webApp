import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/components/Login'
import index from '@/components/index'
import unAuth from '@/components/unAuth'
// 房产云的示例组件
import searchDealByHouse from '@/components/demos/deal/searchDealByHouse'
import searchDealByVillage from '@/components/demos/deal/searchDealByVillage'
import dealSearchCache from '@/components/demos/deal/searchCache'
import searchListing from '@/components/demos/listing/searchListing'
import listingResult from '@/components/demos/listing/searchListingResult'
import listingList from '@/components/demos/listing/listingList'
import listingDetail from '@/components/demos/listing/listingDetail'
// 登录路由标题
import renterLogin from '@/components/login/renter'
import landlordLogin from '@/components/login/landlord'
// 房东端
import landlord from '@/components/landlord/index'
import landlordHouseList from '@/components/landlord/landlordHouseList'
import landlordLeasesList from '@/components/landlord/landlordLeasesList'
import landlordHouseDetail from '@/components/landlord/landlordHouseDetail'
// 租客端
import renter from '@/components/renter/index'
import renterHouseList from '@/components/renter/renterHouseList'
import renterHouseDetail from '@/components/renter/renterHouseDetail'
import renterLeasesList from '@/components/renter/renterLeasesList'
import houseListForRent from '@/components/renter/houseListForRent'
import rentSearchCache from '@/components/renter/rentSearchCache'
// 签约合同
import addContract from '@/components/contract/addContract'
// import addContract from '@/components/contract/addContract'
import contractToRenter from '@/components/contract/contractToRenter'
import contractInfo from '@/components/contract/contractInfo'
import contractRenter from '@/components/contract/contractRenter'
// 核身流程
import identityVerification from '@/components/verification/identityVerification'
import uploadIDCard from '@/components/verification/uploadIDCard'
// 子组件测试
import dblRange from '@/components/bricksSon/doubleRange'
import cascade from '@/components/bricksSon/zoneLink'
import uploadFile from '@/components/bricksSon/uploadFile'
import layout from '@/components/demos/nesting/layout'
import father from '@/components/demos/nesting/father'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/layout',
      name: 'layout',
      component: layout
    },
    {
      path: '/father',
      name: 'father',
      component: father
    },
    {
      path: '/login/:id',
      name: 'login',
      children: [
        {path: '/login/TENANT', name: 'renterLogin', component: renterLogin},
        {path: '/login/LANDLORD', name: 'landlordLogin', component: landlordLogin}
      ],
      component: Login
    },
    {
      path: '/unAuth',
      name: 'unAuth',
      component: unAuth
    },
    {
      path: '/landlord/:id',
      name: 'landlord',
      children: [
        {path: '/landlord/leaseList', name: 'leaseList', component: landlordLeasesList},
        {path: '/landlord', name: 'houseList', component: landlordHouseList}
      ],
      component: landlord
    },
    {
      path: '/renter/:id',
      name: 'renter',
      children: [
        {path: '/renter/leaseList', component: renterLeasesList},
        {path: '/renter', component: renterHouseList}
      ],
      component: renter
    },
    {
      path: '/landlordHouseDetail',
      name: 'landlordHouseDetail',
      component: landlordHouseDetail
    },
    {
      path: '/houseListForRent',
      name: 'houseListForRent',
      component: houseListForRent
    },
    {
      path: '/renterHouseDetail',
      name: 'renterHouseDetail',
      component: renterHouseDetail
    },
    {
      path: '/rentSearchCache',
      name: 'rentSearchCache',
      component: rentSearchCache
    },
    {
      path: '/addContract',
      name: 'addContract',
      component: addContract
    },
    {
      path: '/contractToRenter',
      name: 'contractToRenter',
      component: contractToRenter
    },
    {
      path: '/contractInfo',
      name: 'contractInfo',
      component: contractInfo
    },
    {
      path: '/contractRenter',
      name: 'contractRenter',
      component: contractRenter
    },
    {
      path: '/identityVerification',
      name: 'identityVerification',
      component: identityVerification
    },
    {
      path: '/uploadIDCard',
      name: 'uploadIDCard',
      component: uploadIDCard
    },
    {
      path: '/uploadFile',
      name: 'uploadFile',
      component: uploadFile
    },
    {
      path: '/cascade',
      name: 'cascade',
      component: cascade
    },
    {
      path: '/dblRange',
      name: 'name',
      component: dblRange
    },
    {
      path: '/deal',
      name: 'searchDealByHouse',
      component: searchDealByHouse
    },
    {
      path: '/dealByVillage',
      name: 'searchDealByVillage',
      component: searchDealByVillage
    },
    {
      path: '/dealSearchCache',
      name: 'dealSearchCache',
      component: dealSearchCache
    },
    {
      path: '/listing',
      name: 'searchListing',
      component: searchListing
    },
    {
      path: '/searchListingResult',
      name: 'searchListingResult',
      component: listingResult
    },
    {
      path: '/listingList',
      name: 'listingList',
      component: listingList
    },
    {
      path: '/listingDetail',
      name: 'listingDetail',
      component: listingDetail
    }
  ]
})
