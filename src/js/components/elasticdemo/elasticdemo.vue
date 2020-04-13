<template>
    <div>

        <div class="form-search">
            <div class="form-label-group">
                <input type="text" id="inputSearch" class="form-control" placeholder="Enter your search term" required autofocus v-model="searchQuery" v-on:keyup.enter="updateKeywords">
                <label for="inputSearch">Enter your search term</label>
            </div>

            <div class="form-label-group">
                <small id="searchTypeHelpBlock" class="form-text text-muted text-center">Specify search type</small>
            </div>

            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioSearchTitle" name="searchType" class="custom-control-input" value="title" v-model="selectedFields">
                <label class="custom-control-label" for="customRadioSearchTitle">Title</label>
            </div>

            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioSearchDirector" name="searchType" class="custom-control-input" value="director" v-model="selectedFields">
                <label class="custom-control-label" for="customRadioSearchDirector">Director</label>
            </div>

            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioSearchGenre" name="searchType" class="custom-control-input" value="genre" v-model="selectedFields">
                <label class="custom-control-label" for="customRadioSearchGenre">Genre</label>
            </div>

            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioSearchActor" name="searchType" class="custom-control-input" value="actor" v-model="selectedFields">
                <label class="custom-control-label" for="customRadioSearchActor">Actor</label>
            </div>

            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioSearchAll" name="searchType" class="custom-control-input" value="all" v-model="selectedFields">
                <label class="custom-control-label" for="customRadioSearchAll">All</label>
            </div>

            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioSearchPhrase" name="searchType" class="custom-control-input" value="phrase" v-model="selectedFields">
                <label class="custom-control-label" for="customRadioSearchPhrase">Phrase</label>
            </div>

            <div class="custom-control custom-radio custom-control-inline">
                <input type="radio" id="customRadioSearchFilter" name="searchType" class="custom-control-input" value="filter" v-model="selectedFields">
                <label class="custom-control-label" for="customRadioSearchFilter">Filter</label>
            </div>

            <div class="form-label-group" :class="[ selectedFields === 'filter' ? '' : 'hide']">
                <label for="filterYear" class="sr-only">Filter by year (greater than or equal)</label>
                <select id="filterYear" class="form-control" v-model="searchFilterValue">
                    <option value="">Filter by year (greater than or equal)</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                    <option value="2011">2011</option>
                    <option value="2010">2010</option>
                    <option value="2009">2009</option>
                    <option value="2008">2008</option>
                    <option value="2007">2007</option>
                    <option value="2006">2006</option>
                    <option value="2005">2005</option>
                    <option value="2004">2004</option>
                    <option value="2003">2003</option>
                    <option value="2002">2002</option>
                    <option value="2001">2001</option>
                    <option value="2000">2000</option>
                    <option value="1999">1999</option>
                    <option value="1998">1998</option>
                    <option value="1997">1997</option>
                    <option value="1996">1996</option>
                    <option value="1995">1995</option>
                    <option value="1994">1994</option>
                    <option value="1993">1993</option>
                    <option value="1992">1992</option>
                    <option value="1991">1991</option>
                    <option value="1990">1990</option>
                    <option value="1989">1989</option>
                    <option value="1988">1988</option>
                    <option value="1987">1987</option>
                    <option value="1986">1986</option>
                    <option value="1985">1985</option>
                    <option value="1984">1984</option>
                    <option value="1983">1983</option>
                    <option value="1982">1982</option>
                    <option value="1981">1981</option>
                    <option value="1980">1980</option>
                    <option value="1979">1979</option>
                    <option value="1978">1978</option>
                    <option value="1977">1977</option>
                    <option value="1976">1976</option>
                    <option value="1975">1975</option>
                </select>
            </div>

            <button class="btn btn-lg btn-primary btn-block" type="button" v-on:click="updateKeywords">Search</button>
        </div>

        <div class="row">
            <div class="col-md-8 results-list">
                <transition name="fade">
                    <ul class="list-group" v-if="results.length > 0">
                        <li class="list-group-item" v-for="(item, index) in results" :id="item.item_id" v-bind:key="item.item_id">
                            {{item.title}}, <em>directed by: {{item.director}}</em><br>
                            <strong>{{item.year}}</strong><br>
                            <em>genre: {{item.genre}}</em><br>
                            <em>actors: {{item.actor}}</em><br><br>
                            <em>{{item.description}}</em>
                        </li>
                    </ul>
                </transition>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <Pagination :alignment="paginationAlignment" :number-of-links="numberOfLinks" :per-page="perPage" v-on:updatePage="updatePage"></Pagination>
            </div>
        </div>

    </div>
</template>

<script>

    import { ElasticSearchConnector }  from '../../ElasticSearchConnector';
    const host = process.env.AWS_HOST;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const esConnector = new ElasticSearchConnector(host, region, accessKeyId, secretAccessKey);

    import {EventBus} from '../../common';
    import Pagination from '../pagination/pagination';

    const mixin = {
        methods: {
            getSearchResults(searchIndex, searchFields, searchQuery, searchType, searchFilterVal, currentOffset) {
                esConnector.queryFields = searchFields;
                esConnector.queryExplain = false;
                esConnector.queryFrom = currentOffset;
                esConnector.querySize = 3;
                if(searchType === 'bool' && searchFilterVal !== '') {
                    esConnector.filterCondition = { 'range': {'year': {'gte': searchFilterVal}} };
                }
                return esConnector.esGetSearchResults(searchIndex, searchQuery, searchType);
            }

        }
    };

    export default {
        name: 'ElasticDemo',
        mixins: [mixin],
        components: {
          Pagination
        },
        data() {
            return {
                total: 0,
                paginationAlignment: 'center',
                perPage: 3,
                numberOfLinks: 2,
                currentPage: 1,
                currentOffset: 0,
                results: [],
                searchIndex: 'esdemo',
                selectedFields: 'title',
                searchFields: [],
                searchQuery: '',
                searchType: '',
                searchFilterValue: '',
            }
        },
        methods: {
            updatePage(number, offset) {
                this.currentPage = number;
                this.currentOffset = offset;
                //this.convertPageNumberToOffset();
                this.invokeGetSearchResults();

            },
            // utility method for converting page numbers to offsets (useful when working with history state and user-friendly url params)
            convertPageNumberToOffset() {
              this.currentOffset = (this.currentPage * this.perPage) - this.perPage;
            },
            updateKeywords() {
                this.currentPage = 1;
                this.currentOffset = 0;
                this.invokeGetSearchResults();
            },
            invokeGetSearchResults() {
                this.total = 0;
                this.results = [];
                if(this.selectedFields === 'all') {
                    this.searchFields = ['title', 'director', 'genre', 'actor', 'description'];
                    this.searchType = 'multi_match';
                } else if(this.selectedFields === 'phrase') {
                    this.searchFields = ['title', 'director', 'genre^3', 'actor', 'description^2'];
                    this.searchType = 'simple_query_string';
                } else if(this.selectedFields === 'filter') {
                    this.searchFields = ['title', 'director', 'genre', 'actor', 'description'];
                    this.searchType = 'bool';
                } else {
                    this.searchFields = [this.selectedFields];
                    this.searchType = 'multi_match';
                }
                this.getSearchResults(this.searchIndex, this.searchFields, this.searchQuery, this.searchType, this.searchFilterValue, this.currentOffset)
                    .then((response) => {
                        console.log(response);
                        if(response.hits.hits.length > 0) {
                            this.total = response.hits.total.value;
                            $.each(response.hits.hits, (i, item) => {
                                this.results.push(
                                    {
                                        ['item_id']: item._id,
                                        ['title']: item._source.title,
                                        ['year']: item._source.year,
                                        ['director']: item._source.director,
                                        ['genre']: item._source.genre.join(', '),
                                        ['actor']: item._source.actor.join(', '),
                                        ['description']: item._source.description,
                                    }
                                );
                            });
                        } else {
                            this.total = 0;
                            this.results = [];
                        }
                    })
                    .then( () => {
                        EventBus.$emit('initPagination', this.currentOffset, this.total);
                    })
                    .catch(error => {
                        console.log(error.response);
                    });

            },
        },
    }

</script>
