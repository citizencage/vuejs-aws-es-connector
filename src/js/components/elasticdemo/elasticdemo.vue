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

    </div>
</template>

<script>

    import { ElasticSearchConnector }  from '../../ElasticSearchConnector';
    const host = process.env.AWS_HOST;
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const esConnector = new ElasticSearchConnector(host, region, accessKeyId, secretAccessKey);

    const mixin = {
        methods: {
            getSearchResults(searchIndex, searchFields, searchQuery, searchType) {
                esConnector.queryFields = searchFields;
                return esConnector.esGetSearchResults(searchIndex, searchQuery, searchType);
            }

        }
    };

    export default {
        name: 'ElasticDemo',
        mixins: [mixin],
        data() {
            return {
                resultsTotal: 0,
                results: [],
                searchIndex: 'esdemo',
                selectedFields: 'title',
                searchFields: [],
                searchQuery: '',
                searchType: '',
            }
        },
        methods: {
            updateKeywords() {
                this.invokeGetSearchResults();
            },
            invokeGetSearchResults() {
                this.resultsTotal = 0;
                this.results = [];
                if(this.selectedFields === 'all') {
                    this.searchFields = ['title', 'director', 'genre', 'actor', 'description'];
                    this.searchType = 'multi_match';
                } else if(this.selectedFields === 'phrase') {
                    this.searchFields = ['title', 'director', 'genre^3', 'actor', 'description^2'];
                    this.searchType = 'simple_query_string';
                } else {
                    this.searchFields = [this.selectedFields];
                    this.searchType = 'multi_match';
                }
                this.getSearchResults(this.searchIndex, this.searchFields, this.searchQuery, this.searchType)
                    .then((response) => {
                        console.log(response);
                        if(response.hits.hits.length > 0) {
                            this.resultsTotal = response.hits.hits.length;
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
                            this.resultsTotal = 0;
                            this.results = [];
                        }
                    })
                    .catch(error => {
                        console.log(error.response);
                    });

            },
        },
    }

</script>
