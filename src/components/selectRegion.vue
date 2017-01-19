<!-- selectRegion.vue -->
<template>
    <div>
        <div class="col-lg-1" style="width:110px;">
            <select class="form-control input-sm" v-model="province" number @change="changeProvince">
                <option value="0">选择省</option>
                <template v-for="option of provinces">
                    <option v-bind:value="option.region_id">{{option.name}}</option>
                </template>
            </select>
        </div>
        <div class="col-lg-1" style="width:110px;">
            <select class="form-control input-sm" v-model="city" number @change="changeCity">
                <option value="0">选择市</option>
                <template v-for="option of cities">
                    <option v-bind:value="option.region_id">{{option.name}}</option>
                </template>
            </select>
        </div>
        <div class="col-lg-1" style="width:110px;">
            <select class="form-control input-sm" v-if="counties.length>0" v-model="county" number @change="changeCounty">
                <option value="0">选择区</option>
                <template v-for="option of counties">
                    <option v-bind:value="option.region_id">{{option.name}}</option>
                </template>
            </select>
        </div>
    </div>
</template>

<script>
import { callback } from '../store'
import { Promise } from 'es6-promise'
export default {
    name: 'SelectRegionView',
    ready() {
        if (this.regions && this.regions instanceof Array && this.regions.length > 0) {
            this.setAllRegions();
        } else {
            this.getProvinceRegions();
        }
    },
    props: ['regions'],
    data() {
        return {
            province: 0,
            city: 0,
            county: 0,
            provinces: [],
            cities: [],
            counties: [],
        }
    },
    watch: {
        regions(val, oldVal) {
            this.setAllRegions();
        },
    },
    methods: {
        regionFilter(regionId) {
            return function(x) {
                return x.region_id === regionId;
            };
        },
        changeProvince(event) {
            this.city = 0;
            this.county = 0;
            this.cities = [];
            this.counties = [];
            this.getCityRegions(this.province).then(value => {
                this.dispatchResultRegion();
            });
        },
        changeCity(event) {
            this.county = 0;
            this.counties = [];
            this.getCountyRegions(this.city).then(value => {
                this.dispatchResultRegion();
            });
        },
        changeCounty(event) {
            this.dispatchResultRegion();
        },
        dispatchResultRegion() {
            var result = {};
            if (this.province === 0 || this.city === 0) {
                result.region = 0;
            } else if (this.counties.length > 0 && this.county === 0) {
                result.region = 0;
            } else {
                let provinceRegion = this.provinces.filter(this.regionFilter(this.province))[0];
                let cityRegion = this.cities.filter(this.regionFilter(this.city))[0];
                if (this.counties.length === 0) {
                    result.region = this.city;
                    result.all_regions = [{id: this.province, name: (provinceRegion ? provinceRegion.name : '')}, {id: this.city, name: (cityRegion ? cityRegion.name : '')}];
                } else {
                    let countyRegion = this.counties.filter(this.regionFilter(this.county))[0];
                    result.region = this.county;
                    result.all_regions = [{id: this.province, name: (provinceRegion ? provinceRegion.name : '')}, {id: this.city, name: (cityRegion ? cityRegion.name : '')}, {id: this.county, name: (countyRegion ? countyRegion.name : '')}];
                }
            }
            this.$dispatch('select-region', result);
        },
        setAllRegions() {
            this.province = 0;
            this.city = 0;
            this.county = 0;
            this.provinces = [];
            this.cities = [];
            this.counties = [];
            Promise.all([
                this.getProvinceRegions(),
                this.getCityRegions(this.regions[0]), 
                this.getCountyRegions(this.regions[1])])
            .then(values => {
                this.province = this.regions[0] || 0;
                this.city = this.regions[1] || 0;
                this.county = this.regions[2] || 0;
                this.dispatchResultRegion();
            })
        },
        getProvinceRegions() {
            return new Promise((resolve, reject) => {
                var url = '/api/v2/web/locations/full-provinces'
                this.$http.get(url)
                .then((response) => {
                    if(response.data.provinces) {
                        this.provinces = response.data.provinces
                        resolve();
                    } else {
                        callback.success(response.data)
                        reject(response.data);
                    }
                },(response) => {
                    callback.error(response)
                    reject(response);
                })
            })
        },
        getCityRegions(provinceId) {
            if (provinceId) {
                return new Promise((resolve, reject) => {
                    var url = '/api/v2/web/locations/province-cities?province_id='+provinceId
                    this.$http.get(url)
                    .then((response) => {
                        if(response.data.cities) {
                            this.cities = response.data.cities
                            resolve();
                        } else {
                            callback.success(response.data)
                            reject(response.data);
                        }
                    },(response) => {
                        callback.error(response)
                        reject(response);
                    })
                })
            } else {
                return new Promise((resolve, reject) => {
                    this.cities = [];
                    resolve();
                })
            }
        },
        getCountyRegions(cityId) {
            if (cityId) {
                return new Promise((resolve, reject) => {
                    var url = '/api/v2/web/locations/city-counties?city_id='+cityId
                    this.$http.get(url)
                    .then((response) => {
                        if(response.data.counties) {
                            this.counties = response.data.counties
                            resolve();
                        } else if (response.data.result === 0) {
                            this.counties = [];
                            resolve();
                        } else {
                            callback.success(response.data)
                            reject(response.data);
                        }
                    },(response) => {
                        callback.error(response)
                        reject(response);
                    })
                })
            } else {
                return new Promise((resolve, reject) => {
                    this.counties = [];
                    resolve();
                })
            }
        },
    }
}
</script>