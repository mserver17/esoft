<template>
    <section class="clients">
        <div class="clients__wrapper p-4 table-responsive small">
            <div class="table-title d-flex justify-content-between mb-3">
                <h3 class="d-inline-flex">Таблица недвижимости</h3>
                <button type="button" @click="showModal = true"
                    class="d-inline-flex align-items-center btn btn-primary px-4 nav-pills" data-bs-toggle="modal"
                    data-bs-target="#exampleModal">
                    Добавить объект
                </button>
                <form class="w-50 me-3" role="search">
                    <input v-model="search" type="search" class="form-control" placeholder="Поиск по объектам недвижимости"
                        aria-label="Search">
                </form>
            </div>
            <div v-if="editId > -1" @submit.prevent="onSubmit" class="modal">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content p-2">
                        <div class="modal-body row d-flex g-2">
                            <div class="modal-header">
                                <h5 class="modal-title fw-bold mb-0 fs-4">
                                Редактировать предложение
                                </h5>
                                <button
                                type="button"
                                class="btn btn-close"
                                @click="cancelChanges"
                                ></button>
                            </div>
                            <form v-if="editId !== -1" @submit.prevent="onSubmit" class="p-2">
                                <div class="modal-body row g-2">
                                    <div class="form-floating mb-3">
                                        <input v-model="content.Address_City" class="form-control rounded-3" id="Address_City">
                                        <label for="Address_City">Город</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input v-model="content.Address_Street" id="Address_Street" class="form-control rounded-3">
                                        <label for="Address_Street">Улица</label>
                                    </div>
                                    <div class="form-floating mb-3 col-md-6">
                                        <input id="Address_House" v-model="content.Address_House" class="form-control rounded-3">
                                        <label for="Address_House">Дом</label>
                                    </div>
                                    <div class="form-floating mb-3 col-md-6">
                                        <input id="Address_Number" v-model="content.Address_Number" class="form-control rounded-3">
                                        <label for="Address_Number">Квартира</label>
                                    </div>
                                    <div class="form-floating mb-3 col-md-6">
                                        <input id="Coordinate_latitude" v-model="content.Coordinate_latitude" class="form-control rounded-3">
                                        <label for="Coordinate_latitude">Широта</label>
                                    </div>
                                    <div class="form-floating mb-3 col-md-6">
                                        <input id="Coordinate_longitude" v-model="content.Coordinate_longitude" class="form-control rounded-3">
                                        <label for="Coordinate_longitude">Долгота</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <select id="type" v-model="content.type" class="form-select" aria-label="Тип объекта недвижимости">
                                            <option value="apartment" selected>Квартира</option>
                                            <option value="house">Дом</option>
                                            <option value="land">Земля</option>
                                        </select>
                                        <label for="type">Тип объекта</label>
                                    </div>
                                    <div v-if="content.type=='apartment'" class="form-floating mb-3 col-md-6">
                                        <input id="Floor" v-model="content.Floor" class="form-control rounded-3">
                                        <label for="Floor">Этаж</label>
                                    </div>
                                    <div v-if="content.type=='apartment'" class="form-floating mb-3 col-md-6">
                                        <input id="Rooms" v-model="content.Rooms" class="form-control rounded-3">
                                        <label for="Rooms">Количество комнат</label>
                                    </div>
                                    <div v-if="content.type=='house'" class="form-floating mb-3 col-md-6">
                                        <input id="TotalFloors" v-model="content.TotalFloors" class="form-control rounded-3">
                                        <label for="TotalFloors">Этажность дома</label>
                                    </div>
                                    <div v-if="content.type=='house'" class="form-floating mb-3 col-md-6">
                                        <input id="Rooms" v-model="content.Rooms" class="form-control rounded-3">
                                        <label for="Rooms">Количество комнат</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input id="TotalArea" v-model="content.TotalArea" class="form-control rounded-3">
                                        <label for="TotalArea">Площадь</label>
                                    </div>
                                </div>
                                <div class="modal-footer form-group">
                                    <button @click="cancelChanges" class="w-40 mb-2 btn btn-secondary rounded-pill">
                                        Отменить изменения
                                    </button>
                                    <button class="w-40 mb-2 btn rounded-pill btn-primary" @click="saveChanges(editId)"
                                        :disabled="!isValidForm">Сохранить изменения
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <form class="row g-2" onsubmit="return false;">
                <div class="form-floating col-md-6">
                    <select id="filterType" v-model="filterType" class="form-control">
                        <option selected value="all">
                            Все типы
                        </option>
                        <option value="apartment">
                            Квартира
                        </option>
                        <option value="house">
                            Дом
                        </option>
                        <option value="land">
                            Земля
                        </option>
                    </select>
                    <label for="filterType">Фильтрация по типу недвижимости</label>
                </div>
                <div class="form-floating col-md-6">
                    <input v-model="district" class="form-control" list="filterDistricts" id="inputDistrict"
                        placeholder="Введите название района">
                    <datalist id="filterDistricts">
                        <option v-for="district in districts" :value="district.name">{{ district.name }}</option>
                    </datalist>
                    <label for="inputDistrict">Фильтрация по району</label>
                </div>
            </form>
            <table class="table table-sm table-striped shadow-sm mt-5">
                <thead>
                    <tr>
                        <th scope="col" class="table__item">id</th>
                        <th scope="col" class="table__item">Город</th>
                        <th scope="col" class="table__item col-2">Улица</th>
                        <th scope="col" class="table__item">Дом</th>
                        <th scope="col" class="table__item">Квартира</th>
                        <th scope="col" class="table__item">Широта</th>
                        <th scope="col" class="table__item">Долгота</th>
                        <th scope="col" class="table__item">Площадь</th>
                        <th scope="col" class="table__item">Комнаты</th>
                        <th scope="col" class="table__item">Этаж</th>
                        <th scope="col" class="table__item">Этажи</th>
                        <th scope="col" class="table__item">Действия</th>
                    </tr>
                </thead>
                <tbody class="table-hover">
                    <tr v-for="object in filteredObjects" :key="object.Id" :class="{ 'table-info': object.Id == editId }">
                        <td class="table__item">
                            <p>{{ object.Id }}</p>
                        </td>
                        <td class="table__item">
                            <p>{{ object.Address_City }}</p>
                        </td>
                        <td class="table__item">
                            <p>{{ object.Address_Street }}</p>
                        </td>
                        <td class="table__item">
                            <p>{{ object.Address_House }}</p>
                        </td>
                        <td class="table__item">
                            <p>{{ object.Address_Number }}</p>
                        </td>
                        <td class="table__item">
                            <p>{{ object.Coordinate_latitude }}</p>
                        </td>
                        <td class="table__item">
                            <p>{{ object.Coordinate_longitude }}</p>
                        </td>
                        <td class="table__item">
                            <p>{{ object.TotalArea }}</p>
                        </td>
                        <td class="table__item">
                            <p v-if="object.Rooms">{{ object.Rooms }}</p>
                        </td>
                        <td class="table__item">
                            <p v-if="object.Floor">{{ object.Floor }}</p>
                        </td>
                        <td class="table__item">
                            <p v-if="object.TotalFloors"> {{ object.TotalFloors }}</p>
                        </td>
                        <td>
                            <div class="btn-group row ">
                                <button style="width:38px; height: 38px;"
                                    class="mx-2 rounded-square p-2 lh-1 btn btn-outline-primary"
                                    @click="editById(object.Id, object)">
                                    <i class="bi-pencil-square"></i>
                                </button>
                                <button style="width:38px; height: 38px;" class="rounded-square p-2 lh-1 btn btn-danger"
                                    @click="deleteModal = object.Id" :disabled="checkId(object.Id, this.supplies)">
                                    <i class="bi-trash"></i>
                                </button>
                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ModalCreateObject v-if="showModal" @close="showModal = false" />
        <ModalProofDelete v-if="deleteModal != -1" @close="deleteModal = -1" @proof="removeById(deleteModal)">выбранный объект #<b>{{ deleteModal }}</b>?</ModalProofDelete>
    </section>
</template>

<script>
import { useObjectsStore } from '../store/objects';
import levenshteinDistance from '../levenshtein.js';
import filterInsideArea from '../districtfilter.js';
import districtsData from '../assets/districts.json';
import { useSuppliesStore } from '../store/supplies';


import ModalCreateObject from "../components/ModalCreateObject.vue";
import ModalProofDelete from './ModalProofDelete.vue';

export default {
    components: {
        ModalCreateObject,
        ModalProofDelete
    },
    data() {
        return {
            editId: -1,
            deleteModal: -1,
            showModal: false,
            search: '',
            id: '',
            filterType: 'all',
            districts: districtsData,
            district: '',
            supplies: useSuppliesStore().supplies,
            content: {
                type: 'apartment',
                Address_City: '',
                Address_Street: '',
                Address_House: '',
                Address_Number: '',
                Coordinate_latitude: '',
                Coordinate_longitude: '',
                TotalArea: '',
                Floor: '',
                Rooms: '',
                TotalFloors: '',
                Id: 0,
            }
        }
    },
    computed: {
        isValidForm() {
            return true
        },
        filteredObjects() {
            let arr = useObjectsStore().objects;
            arr = this.filterByType(arr);
            if (this.district) {
                if (districtsData.findIndex(obj => obj.name == this.district) > 0) {
                    let district = districtsData[districtsData.findIndex(obj => obj.name == this.district)];
                    arr = filterInsideArea(district, arr)
                }
            }
            if (this.search !== '') {
                const searchWords = this.search.split(' ')
                return arr.filter(object => {
                    let address = false, street = false, house = false, number = false;
                    for (let i = 0; i < searchWords.length; i++) {
                        address = address || levenshteinDistance(object.Address_City, searchWords[i]) <= 3;
                        street = street || levenshteinDistance(object.Address_Street, searchWords[i]) <= 3;
                        house = house || levenshteinDistance(`${object.Address_House}`, searchWords[i]) <= 1;
                        number = number || levenshteinDistance(`${object.Address_Number}`, searchWords[i]) <= 1;
                    }
                    switch (searchWords.length) {
                        case 4:
                            return address && street && house && number
                        case 3:
                            return (address && street && house) || (address && street && number) || (number && street && house)
                                || (address && number && house)
                        case 2:
                            return (address && street) || (address && house) || (address && number) || (street && house) || (street && number)
                                || (house && number)
                        default:
                            return address || street || house || number;
                    }
                })
            }
            return arr
        }
    },
    methods: {
        saveChanges(id) {
            this.editId = -1;
            useObjectsStore().changeObject(id, this.content)
            console.log(id, this.content)
        },
        cancelChanges() {
            this.editId = -1;
            this.content = {}
        },
        editById(id, obj) {
            this.editId = id;
            this.content.type = obj.Type;
            this.content.Address_City = obj.Address_City;
            this.content.Address_Street = obj.Address_Street;
            this.content.Address_House = obj.Address_House;
            this.content.Address_Number = obj.Address_Number;
            this.content.Coordinate_latitude = obj.Coordinate_latitude;
            this.content.Coordinate_longitude = obj.Coordinate_longitude;
            this.content.TotalArea = obj.TotalArea;
            this.content.Floor = obj.Floor;
            this.content.Rooms = obj.Rooms;
            this.content.TotalFloors = obj.TotalFloors;
            this.content.Id = obj.Id;
        },
        saveChanges(id) {
            this.editId = -1;
            console.log(id, this.content)
            useObjectsStore().changeObject(id, this.content)
        },
        filterByType(arr) {
            if (this.filterType === 'apartment') {
                console.log(123)
                return arr.filter(item => item.Rooms || item.Floor)
            } else if (this.filterType === 'house') {
                return arr.filter(item => item.TotalFloors && !item.Rooms && !item.Floor)
            } else if (this.filterType === 'land') {
                return arr.filter(item => !item.Rooms && !item.Floor && !item.TotalFloors)
            } else {
                return arr
            }
        },
        checkId(id, array) {
            for (let i = 0; i < array.length; i++) {
                if (array[i].RealEstateId === id) {
                    return true;
                }
            }
            return false;
        },
        removeById(id) {
            useObjectsStore().removeObject(id);
        },
    },
}
</script>

<style lang="scss" scoped>
.clients__wrapper {
    padding: 0 20px;
    max-width: 1440px;
    margin: 0 auto;
}


.table__button {
    cursor: pointer;
    text-transform: uppercase;
    border: none;
    border-radius: 4px;
    padding: 10px 12px;
    width: 124px;
    text-align: center;
    margin-right: 2px;
    background-color: rgb(169, 169, 169);
}</style>
