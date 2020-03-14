<template>
    <div>

        <div class="form-search">
            <div class="form-label-group">
                <input type="text" id="inputSearch" class="form-control" placeholder="Enter your search term" required autofocus v-model="searchQuery.query.match.title" v-on:keyup.enter="updateKeywords">
                <label for="inputSearch">Enter your search term</label>
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
                            <em>actors: {{item.actor}}</em>
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
            getSearchResults(searchIndex, searchQuery) {
                return esConnector.esGetSearchResults(searchIndex, searchQuery);
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
                searchQuery: {
                    query: {
                        match: {
                            title: '',
                        }
                    }
                },
            }
        },
        methods: {
            updateKeywords() {
                this.resultsTotal = 0;
                this.results.length = 0;
                this.invokeGetSearchResults();
            },
            invokeGetSearchResults() {
                this.getSearchResults(this.searchIndex, this.searchQuery)
                    .then((response) => {
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
                                    }
                                );
                            });
                        }
                    })
                    .catch(error => {
                        console.log(error.response);
                    });

            },
        },
    }

</script>
